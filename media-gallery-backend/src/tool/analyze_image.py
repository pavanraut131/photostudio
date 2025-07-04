from langchain_core.tools import tool
import requests
from typing import Annotated
from langgraph.types import Command
from langchain_core.tools import InjectedToolCallId
from dotenv import load_dotenv
from src.util.enum import Graph_Node
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
from openai import OpenAI
import os 

load_dotenv()


open_api_key = os.getenv("OPENAI_API_KEY")
@tool(parse_docstring=True)
def analyze_image(
    tool_call_id: Annotated[str, InjectedToolCallId],
    # config: RunnableConfig,
    input_image_url: Annotated[str, "The image url which will be used to analyze the image"],
    

):
    """
    Analyze the image based on the given url and describe the image in 20 words.

    Args:

      input_image_url (str): The url of the image to be analyzed.
 
    """
    try:
        # configurations = config.get("configurable", {})
        # image_url = configurations.get("image_url", "")
        print(f" this is the iameg url ==========={input_image_url}")

        # original_image = requests.get(input_image_url)
        # if original_image.status_code != 200:
        #     return {"error": "Failed to download image from URL"}

        client = OpenAI(api_key=open_api_key)
  
        response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image in 3 lines"},
                {"type": "image_url", "image_url": {"url": input_image_url}},
            ],
            }
        ],
        max_tokens=40,
        )

        print(response.choices[0].message.content)

        if response:
        
      
        
            return Command(
                
                update={
                    "messages": [
                        ToolMessage(
                            content="Image Analyzed successfully:" +f"analyzed_image{tool_call_id}.png" ,tool_call_id=tool_call_id,name=Graph_Node.ANALYZE_IMAGE.value
                        )
                    ],
                    "analyze_result": response.choices[0].message.content,
                },
                # goto=Graph_Node.MANAGER.value
            )
        else:
            print("else")
            return Command(
                # graph=Command.PARENT,
                update={
                    "messages": [
                        ToolMessage(
                            content="image is not analyyzed : " + response.text,tool_call_id=tool_call_id,name=Graph_Node.ANALYZE_IMAGE.value
                        )
                    ],
                    
                },
                # goto=Graph_Node.MANAGER.value,
            )
    
    except requests.exceptions.RequestException as e:
        return f"failed to Analyze image {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

        
    