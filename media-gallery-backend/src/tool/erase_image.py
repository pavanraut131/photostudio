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
from src.util.resize_image import decode_base64_image


load_dotenv()
# API_KEY = "sk-qhJ9B9UIHzzuZRGPbHESgPBrVBjErxXVlwPOZiiMHGqJ1oAr"
# API_KEY = "sk-eKHWDmleUKh7qdlc2NTEroQRrA9cXcyXqYr8pfnw2MYIFyul"
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

STATIC_FOLDER = "./static"  # Save images here
BASE_URL = "http://localhost:8000/static"

@tool(parse_docstring=True)
def erase_image(
    # config: RunnableConfig, 
    input_image_url: Annotated[str, "The URL of the image to erase."],
    brushmark_url: Annotated[str, "The base64 encoded brush mark image."],
    tool_call_id: Annotated[str, InjectedToolCallId]):
    """
    Erase using image_url and brush_mark_url from the config.
    
    Args:
        input_image_url (str): The URL of the image to erase.
        brushmark_url (str): The base64 encoded brush mark image.
        tool_call_id (str): The ID of the tool call for tracking.
    """
    
    try:
        
        # config_data = config.get("configurable", {})
        # input_image_url = config_data.get("image_url")
        # brushmark_url = config_data.get("brushmark_url")

        print("Image URL:", input_image_url)
        print("Brushmark URL (base64):", brushmark_url)
        original_image = requests.get(input_image_url)
        if original_image.status_code != 200:
            return {"error": "Failed to download image from URL"}
        
        mask_image = requests.get(brushmark_url)
        if mask_image.status_code != 200:
            return {"error": "Failed to download image from URL"}


       
        print("started erasing ")
        response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/edit/erase",
        headers={
            "authorization": f"Bearer {STABILITY_API_KEY}",
            "accept": "image/*"
        },
        files={
            "image": ("original.png", BytesIO(original_image.content), "image/png"),
            "mask":("mask.png", BytesIO(mask_image.content), "image/png"),
        },
        data={
            "output_format": "webp",
        },
    )
        print("got the resposnse=============", response)
        if response.status_code==200:
            filename = f"erased_image_{tool_call_id}.{"png"}"
            filepath = os.path.join(STATIC_FOLDER, filename)
            os.makedirs(STATIC_FOLDER, exist_ok=True)

            with open(filepath, "wb") as f:
                f.write(response.content)

            image_url = f"{BASE_URL}/{filename}"
            print(image_url, "==============imageurl================")

            return Command(
                update={
                    "messages": [
                        ToolMessage(
                            content="Object erased successfully.",
                            tool_call_id=tool_call_id,
                            name=Graph_Node.ERASE_IMAGE.value,
                        )
                    ],
                    "result_url": image_url
                }
            )
        else:
            return Command(
                update={
                    "messages": [       
                        ToolMessage(
                            content="Image generation failed: " + response.text,
                            tool_call_id=tool_call_id,
                            name=Graph_Node.ERASE_IMAGE.value,
                        )
                    ]
                }
            )

    except requests.exceptions.RequestException as e:
        return Command(
            update={
                "messages": [
                    ToolMessage(
                        content=f"Failed to erase image: {str(e)}",
                        tool_call_id=tool_call_id,
                        name=Graph_Node.ERASE_IMAGE.value,
                    )
                ]
            }
        )
    except Exception as e:
        return Command(
            update={
                "messages": [
                    ToolMessage(
                        content=f"Unexpected error occurred: {str(e)}",
                        tool_call_id=tool_call_id,
                        name=Graph_Node.ERASE_IMAGE.value,
                    )
                ]
            }
        )


        
    