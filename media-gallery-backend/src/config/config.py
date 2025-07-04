from langchain_openai import ChatOpenAI
import os 
from dotenv import load_dotenv
from src.util.enum import MODEL_NAME
import cloudinary

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

LLM_openai = ChatOpenAI(model=MODEL_NAME.GPT_4o_MINI.value, api_key=openai_api_key)





def cloundinary_config():
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_NAME"),
        api_key=os.getenv("CLOUDINARY_KEY"),
        api_secret=os.getenv("CLOUDINARY_SECRET"),
        secure=True,
    )
    