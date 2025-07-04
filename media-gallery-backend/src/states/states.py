from typing_extensions import TypedDict, Optional
from langgraph.prebuilt.chat_agent_executor import AgentState
from pydantic import BaseModel



class RootState(AgentState):
    prompt:Optional[str]
    input_image_url:Optional[str]
    brushmark_url:Optional[str]
    edit_prompt:Optional[str]
    


    analyze_result:str=" "
    result_url:str=" "
    
    



class Imagestate(AgentState):
    next_node:Optional[str]
    result_url:str
    analyze_result:str


class HandoffNodeSpec(BaseModel):
    description: str




