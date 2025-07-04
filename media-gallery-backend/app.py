from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from src.graph.graph import media_gallery_graph
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import base64
import os
from io import BytesIO
from PIL import Image
from uuid import uuid4
import cloudinary
import cloudinary.uploader
from src.config.config import cloundinary_config
STATIC_FOLDER = "./static"  
BASE_URL = "http://localhost:8000/static"  



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


class Media(BaseModel):
    prompt:Optional[str]
    input_image_url:Optional[str]
    brushmark_url:Optional[str]    
    edit_prompt:Optional[str]

cloundinary_config()

@app.post('/media_gallery')
def media_gallery(body:Media):
    try:
        prompt = body.prompt
        input_image_url = body.input_image_url
        edit_prompt = body.edit_prompt
        brushmark_url = body.brushmark_url

        combined_prompt = f"{prompt}\n\nImage URL: {input_image_url}\n Edit Prompt: {edit_prompt} \n\n Brushmark_url: {brushmark_url}"
        response = media_gallery_graph.invoke(
            {
                "messages": [{"role": "user", "content": combined_prompt}],
                # "image_url": image_url,
                # "brush_mark_url": brush_mark_url,
                # "image_id": image_id,
                # "edit_prompt": edit_prompt,   
            }, 
            # config=config,
        )

        print("Response from graph:----============----", response)
        if not isinstance(response, dict):
            raise ValueError("Graph response is not a dictionary")

        result_url = response.get("result_url")
        analyze_result = response.get("analyze_result")
        output = {}
        if result_url:
            output["result_url"] = result_url
        if analyze_result:
            output["analyze_result"] = analyze_result

        return JSONResponse(
            status_code=200,
            content=output
            

        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"error getting  the image from the graph : {str(e)}"
        )
    

class MaskUpload(BaseModel):
    image_base64: str

# @app.post("/upload-mask/")
# async def upload_mask(data: MaskUpload):
#     try:
#         base64_data = data.image_base64.split(",")[1] if "," in data.image_base64 else data.image_base64
#         image_data = base64.b64decode(base64_data)
#         image = Image.open(BytesIO(image_data))

#         os.makedirs(STATIC_FOLDER, exist_ok=True)
#         filename = f"mask_{uuid4().hex}.png"
#         filepath = os.path.join(STATIC_FOLDER, filename)
#         image.save(filepath, format="PNG")

#         return {"mask_url": f"{BASE_URL}/{filename}"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")

from PIL import ImageOps

@app.post("/upload-mask/")
async def upload_mask(data: MaskUpload):
    try:
        base64_data = data.image_base64.split(",")[1] if "," in data.image_base64 else data.image_base64
        image_data = base64.b64decode(base64_data)
        image = Image.open(BytesIO(image_data))

        # Convert to grayscale (white=editable, black=preserve)
        image = image.convert("L")  # L = 8-bit pixels, black and white

        # Optional: Threshold to binary image (ensure only black and white pixels)
        image = ImageOps.autocontrast(image)
        image = image.point(lambda p: 255 if p > 128 else 0)

        temp_buffer = BytesIO()
        image.save(temp_buffer, format="PNG")
        temp_buffer.seek(0)

        result = cloudinary.uploader.upload(temp_buffer, public_id=f"mask_{uuid4().hex}", folder="masks")
        print( "the result is under")
        return {"mask_url": result['secure_url']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")
