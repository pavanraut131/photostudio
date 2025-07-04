from langchain_core.tools import tool
import requests
from typing import Annotated, Literal
from langgraph.types import Command
from langchain_core.tools import InjectedToolCallId
from dotenv import load_dotenv
from io import BytesIO
from src.util.enum import Graph_Node
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
import os 


load_dotenv()
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")


STATIC_FOLDER = "./static"  
BASE_URL = "http://localhost:8000/static"


@tool(parse_docstring=True)
def extend_image(
    output_format:Literal["png", "jpeg", "webp"],
    tool_call_id: Annotated[str, InjectedToolCallId],
    input_image_url: Annotated[str, "The image url which will be used to extend the image"],

):
    """
    Extend using image_url in the given directions.

    Args:
        input_image_url (str): The url of the image to be extended.
        output_format (str): The output format of the image.
 
    """
    try:
        image = requests.get(input_image_url)
        if image.status_code != 200:
            return {"error": "Failed to download image from URL"}

        response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/edit/outpaint",
        headers={
            "authorization": f"Bearer {STABILITY_API_KEY}",
            "accept": "image/*"
        },
        files={
           "image": ("input.png", BytesIO(image.content), "image/png")
        },
        data={
        "top": 200,
        "down": 200,
        "output_format": output_format
    },

    )
      
        if response.status_code== 200:
            filename = f"extended_img_{tool_call_id}.{"png"}"
            filepath = os.path.join(STATIC_FOLDER, filename)
            os.makedirs(STATIC_FOLDER, exist_ok=True)

            with open(filepath, "wb") as file:
                file.write(response.content)

            image_url = f"{BASE_URL}/{filename}"
            return Command(
                
                update={
                    "messages": [
                        ToolMessage(
                            content="Image Extended successfully: " + f"extend_image_{tool_call_id}.png",tool_call_id=tool_call_id,name=Graph_Node.EXTEND_IMAGE.value
                        )
                    ],
                    "result_url": image_url,
                    
                
                },
            )
        else:
            print("else")
            return Command(
                update={
                    "messages": [
                        ToolMessage(
                            content="image is not generated : " + response.text,tool_call_id=tool_call_id,name=Graph_Node.EXTEND_IMAGE.value
                        )
                    ],
                    
                },
            )
    
    except requests.exceptions.RequestException as e:
        return f"failed to Extended image {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

        
    