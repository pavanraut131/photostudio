from langchain_core.tools import tool
import requests
from typing import Annotated, Literal
from langgraph.types import Command
from langchain_core.tools import InjectedToolCallId
from dotenv import load_dotenv 
from src.util.enum import Graph_Node
from langchain_core.messages import HumanMessage,ToolMessage
from io import BytesIO
import os 
import base64
import mimetypes
from google import genai
from google.genai import types
from src.util.upload_to_cloudinary import upload_to_cloudinary


load_dotenv()
# API_KEY = "sk-v7NImK4lSd7CjxkLRbubdHKfrYJvM7YWTWivH1b2sg2d2m6D"
API_KEY = "sk-qhJ9B9UIHzzuZRGPbHESgPBrVBjErxXVlwPOZiiMHGqJ1oAr"
STATIC_FOLDER = "./static"  
BASE_URL = "http://localhost:8000/static"


@tool(parse_docstring=True)
def edit_image(
   
    tool_call_id: Annotated[str, InjectedToolCallId],
    input_image_url: Annotated[str, "The image url which will be used to edit the image"],
    brushmark_url: Annotated[str, "The image url which will be used to edit the image"],
    edit_prompt: Annotated[str, "The image url which will be used to edit the image"],
):
    """
      Edit using image_url and brush_mark_url based on the edit prompt from the config.

    Args:
        input_image_url (str): The url of the image to be edited.
        brushmark_url (str): The url of the image to be edited.
        edit_prompt (str): The prompt for editing the image.


    """
    try:
       
        print(input_image_url)
        print(brushmark_url)
        print(edit_prompt)

        original_image = requests.get(input_image_url)
        if original_image.status_code != 200:
            return {"error": "Failed to download image from URL"}
        
        mask_image = requests.get(brushmark_url)
        if mask_image.status_code != 200:
            return {"error": "Failed to download image from URL"}

        response = requests.post(
        f"https://api.stability.ai/v2beta/stable-image/edit/inpaint",
        headers={
        "authorization": f"Bearer {API_KEY}",
        "accept": "image/*"
        },
        files={
        "image": ("original.png", BytesIO(original_image.content), "image/png"),
        "mask": ("mask.png", BytesIO(mask_image.content), "image/png"),
        },
        data={
        "prompt": edit_prompt,
        "output_format": "png",
        "cfg_scale": 7,
        "steps": 30,
       
            },
        )
      
        if response.status_code== 200:
            filename = f"edited_image_{tool_call_id}.{"png"}"
            filepath = os.path.join(STATIC_FOLDER, filename)
            os.makedirs(STATIC_FOLDER, exist_ok=True)

            with open(filepath, "wb") as file:
                file.write(response.content)

            image_url = f"{BASE_URL}/{filename}"


            return Command(
                
                update={
                    "messages": [
                        ToolMessage(
                            content="Image edited successfully: " + f"edited_image_{tool_call_id}.png",tool_call_id=tool_call_id,name=Graph_Node.EDIT_IMAGE.value
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
                            content="Not able to edit the image : " ,tool_call_id=tool_call_id,name=Graph_Node.EDIT_IMAGE.value
                        )
                    ],
                },
            )
    except requests.exceptions.RequestException as e:
        return f"failed to Edit image {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

        
    





    









        # def save_binary_file(file_name, data):
        #     with open(file_name, "wb") as f:
        #         f.write(data)
        #     print(f"File saved to: {file_name}")
        

        # original_image = requests.get(input_image_url)
        # if original_image.status_code != 200:
        #     return {"error": "Failed to download image from URL"}
        
        # mask_image = requests.get(brushmark_url)
        # if mask_image.status_code != 200:
        #     return {"error": "Failed to download image from URL"}
        # client = genai.Client(api_key="AIzaSyC1mX5BiPFouGo2mn5gFGUiRh1TWdBdgL4")
        # model = "gemini-2.0-flash-preview-image-generation"

        

    

        # contents = [
        #     types.Content(
        #         role="user",
        #         parts=[
        #             types.Part.from_text(text=edit_prompt),
        #             types.Part(
        #                 inline_data=types.Blob(
        #                     mime_type="image/png",
        #                     data=original_image,
        #                 )
        #             ),
        #             types.Part(
        #                 inline_data=types.Blob(
        #                     mime_type="image/png",
        #                     data=mask_image,
        #                 )
        #             )
        #         ],
        #     ),
        # ]

        # generate_content_config = types.GenerateContentConfig(
        #     response_modalities=["IMAGE", "TEXT"],
        #     response_mime_type="text/plain",
        # )

        # file_index = 0
        # for chunk in client.models.generate_content_stream(
        #     model=model,
        #     contents=contents,
        #     config=generate_content_config,
        # ):
        #     if (
        #         chunk.candidates is None
        #         or chunk.candidates[0].content is None
        #         or chunk.candidates[0].content.parts is None
        #     ):
        #         continue

        #     part = chunk.candidates[0].content.parts[0]
        #     if part.inline_data and part.inline_data.data:
        #         file_name = f"edited_image_{file_index}"
        #         file_index += 1
        #         inline_data = part.inline_data
        #         file_extension = mimetypes.guess_extension(inline_data.mime_type)
        #         full_file_path = f"{file_name}{file_extension}"
        #         save_binary_file(f"{file_name}{file_extension}", inline_data.data)
        #         image_url = upload_to_cloudinary(full_file_path)

        #     elif hasattr(part, "text"):
        #         print(part.text)