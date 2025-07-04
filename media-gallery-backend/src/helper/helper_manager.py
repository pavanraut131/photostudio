from pydantic import BaseModel
from typing import Dict, Literal, TypedDict,Optional
from langchain_core.language_models.chat_models import BaseChatModel
from src.states.states import Imagestate,RootState
from langgraph.types import Command
from langgraph.graph import END
from langchain_core.messages import HumanMessage
from src.states.states import HandoffNodeSpec
from src.util.enum import Graph_Node
from langchain_core.messages import HumanMessage
from langgraph.graph.state import CompiledStateGraph



def create_manager_node(llm :BaseChatModel, handoff_nodes: Dict[str, HandoffNodeSpec]):
    options = ["FINISH"]+list(handoff_nodes.keys())
    system_prompt = "You are a supervisor tasked with managing a tasks between the following workers:\n"  #  
    for node_name, node_spec in handoff_nodes.items():
        system_prompt += f"- {node_name}: {node_spec.description}\n"

    system_prompt += (
        "Given the following user request and prior messages, decide which worker should act next with their parameters.If task is completed successfully and returns `FINISH`"
        " Each worker will perform a task and respond with their results by using the config to get the url from the tool"
        " , respond with FINISH and provide the final result_url or text for the user."
    )

    
    class ManagerNodeOutput(TypedDict):
        """If more work is needed, 'next' should be a worker name.
        If finished, set 'next' to FINISH and provide final output for the user."""

        next: Literal[*options]  # generate, upscale, edit, erase, regenerate
        output: str  # image url or text
        
    def manager_node(
        state: RootState,
    ) -> Command[Literal[*list(handoff_nodes.keys()), "__end__"]]:
     
        
       
        messages = [{"role": "system", "content": system_prompt}] + state["messages"] 
       
        

        # response = llm.with_structured_output(ManagerNodeOutput).invoke(messages)
        try:
            response = llm.with_structured_output(ManagerNodeOutput).invoke(messages)
            print(f'response _---- {response}')
        except Exception as e:
            print("❌ Exception during LLM invoke:", e)
            import traceback
            traceback.print_exc()
        print(f'resposne _---- {response}')
        goto = response["next"]
        output = response["output"]

        print("Response from LLM:", response)
        print("goto", goto)

        print("output", output)
        if goto in handoff_nodes:
            handoff_node = handoff_nodes[goto]
            handoff_instructions = handoff_node.description 
            output = f"Handoff to `{goto}`: {handoff_instructions}. Output: {output} "

        if goto == "FINISH":
            goto = END
        
        return Command(
            goto=goto,
            update={
                "next_node": goto,
                "messages": [
                    HumanMessage(content=output, name=Graph_Node.MANAGER.value)
                ],
            },
        )

    return manager_node



def compiled_state_graph_node_runner(
    node_name: str, compiled_state_graph: CompiledStateGraph
):
    def node_fn(state: Imagestate) -> Command:
        print("no0de_name", node_name)
        print("state===in node runnner", state)
        result = compiled_state_graph.invoke(state)
        
        print("result====================", result)
    
        return Command(
            update={
                "messages": [
                    HumanMessage(content=result["messages"][-1].content, name=node_name)
                ],
                "result_url": result.get("result_url"),
                "analyze_result":result.get('analyze_result')
                
            },
            goto=Graph_Node.MANAGER.value,
        )

    return node_fn

