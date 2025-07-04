from langchain_core.tools import tool
import requests
from typing import Annotated, Literal
from langgraph.types import Command
from langchain_core.tools import InjectedToolCallId
from dotenv import load_dotenv
from io import BytesIO
from src.util.enum import Graph_Node
from langchain_core.messages import HumanMessage,ToolMessage
from langchain_core.runnables import RunnableConfig
import os
from src.util.resize_image import resize_if_needed
import cloudinary
import cloudinary.uploader  
    
load_dotenv()
API_KEY = "sk-qhJ9B9UIHzzuZRGPbHESgPBrVBjErxXVlwPOZiiMHGqJ1oAr"

STATIC_FOLDER = "./static"  # Save images here
BASE_URL = "http://localhost:8000/static"  # Update if hosted elsewhere



@tool(parse_docstring=True)
def background_remove(
    tool_call_id: Annotated[str, InjectedToolCallId],
    # config: RunnableConfig,
    input_image_url: Annotated[str, "The image url which will be used to upscale the image"],

):
    """
    remove the background of the image and return the result url.

    Args:
        input_image_url (str): The url of the image to be upscaled.
    """
    try:
        
        print(input_image_url)


        image = requests.get(input_image_url)
        print("____ image Processiong_____")
        if image.status_code != 200:
            return {"error": "Failed to download image from URL"}
        
       

        response = requests.post(
    f"https://api.stability.ai/v2beta/stable-image/edit/remove-background",
    headers={
        "authorization": f"Bearer {API_KEY}",
        "accept": "image/*"
    },
    files={
        "image": ("input.png", BytesIO(image.content), "image/png")
    },
    data={
        "output_format": "png"
    },
)

        print("____ image Processiong_____")
        
        if response.status_code== 200:
             
            upload_result = cloudinary.uploader.upload(
                BytesIO(response.content),
                resource_type="image",
                public_id=f"generated_image_{tool_call_id}",
                folder="vertexai_generated",  # Optional folder
                overwrite=True
            )
            
            cloudinary_url = upload_result.get("secure_url")



            return Command(
                
                update={
                    "messages": [
                        ToolMessage(
                            content="Background removed successfully: " + f"Background_removed_{tool_call_id}.png",tool_call_id=tool_call_id,name=Graph_Node.UPSCALE_IMAGE.value
                        )
                    ],
                    "result_url": cloudinary_url,  
                },
                
            )
        else:
            print("else")
            return Command(
                update={
                    "messages": [
                        ToolMessage(
                            content="background is not removed  : " + response.text,tool_call_id=tool_call_id,name=Graph_Node.UPSCALE_IMAGE.value
                        )
                    ],
                    
                },  
            )
    
    except requests.exceptions.RequestException as e:
        return f"failed to remove background of image {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

        
    