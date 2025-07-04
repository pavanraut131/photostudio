from langchain_core.tools import tool
import requests
from typing import Annotated, Literal
from langgraph.types import Command
from langchain_core.tools import InjectedToolCallId
from dotenv import load_dotenv
from io import BytesIO
from src.util.enum import Graph_Node
from langchain_core.messages import ToolMessage
import vertexai
from vertexai.preview.vision_models import  ImageGenerationModel
from google.oauth2 import service_account
import cloudinary
import cloudinary.uploader  
from src.config.config import cloundinary_config




load_dotenv()





@tool(parse_docstring=True)
def generate_image(
    prompt:Annotated[str, "The prompt which will be used to generate the image"],
    tool_call_id: Annotated[str, InjectedToolCallId],
   
):
    """
    Generate an image based on the given prompt and style if given.

    Args:
        prompt (str): The prompt to generate the image.
        
 
    """
    try:
        credentials = service_account.Credentials.from_service_account_file(
            "/home/dev/Desktop/photostudio/media-gallery-backend/credentials.json"
        )
      
        vertexai.init(project=credentials.project_id, location="us-central1", credentials=credentials)
        model = ImageGenerationModel.from_pretrained("imagen-4.0-generate-preview-05-20")
        try:
            images = model.generate_images(
            prompt=prompt,
            number_of_images=1,
            language="en",
            aspect_ratio="1:1",
        )
          
        except requests.exceptions.RequestException as e:
            return f"Failed to generate image: {str(e)}"

 
        if images:
            image_bytes = images[0]._image_bytes
           
            cloundinary_config()

            upload_result = cloudinary.uploader.upload(
                BytesIO(image_bytes),
                resource_type="image",
                public_id=f"generated_image_{tool_call_id}",
                folder="Image_genrated", 
                overwrite=True
            )
            
            
            cloudinary_url = upload_result.get("secure_url")
            
            return Command(  
                update={
                        "messages": [
                            ToolMessage(
                                content="Image generated successfully: " + f"generated_image_{tool_call_id}.png",tool_call_id=tool_call_id,name=Graph_Node.GENERATE_IMAGE.value
                            )
                        ],
                        "result_url": cloudinary_url,
                    },
                )
        else:
            return Command(
                update={
                    "messages": [
                        ToolMessage(
                            content="image is not generated : " ,tool_call_id=tool_call_id,name=Graph_Node.GENERATE_IMAGE.value
                        )
                    ],
                },
            )
    except requests.exceptions.RequestException as e:
        return f"Failed to generate image: {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

        
    





















    # response = requests.post(
        # f"https://api.stability.ai/v2beta/stable-image/generate/core",

        # headers={
        #     "Authorization": f"Bearer {API_KEY}",  #stability api key
        #     "Accept": "image/*"  # Accept any image format (API will respond with the image)
        # },

        # data={
        # "prompt": prompt,
        # "output_format": "png",
        # "steps": "30",
        # "cfg_scale": "7",
        # "width": "512",       # These must be valid for upscaler
        # "height": "512"
        # },
        # files={"none": ''},
        # )
        # if response.status_code== 200:
        #    # Save image to static folder
        #     filename = f"generated_image_{tool_call_id}.{"png"}"
        #     filepath = os.path.join(STATIC_FOLDER, filename)
        #     os.makedirs(STATIC_FOLDER, exist_ok=True)

        #     with open(filepath, "wb") as file:
        #         file.write(response.content)

        #     image_url = f"{BASE_URL}/{filename}"
