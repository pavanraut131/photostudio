from PIL import Image
from io import BytesIO

MIN_WIDTH = 32
MIN_HEIGHT = 32
MAX_WIDTH = 1536
MAX_HEIGHT = 1536
MIN_PIXELS = 1024
MAX_PIXELS = 1048576

def resize_if_needed(image_bytes: bytes) -> BytesIO:
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    width, height = img.size
    total_pixels = width * height

    if (MIN_WIDTH <= width <= MAX_WIDTH and
        MIN_HEIGHT <= height <= MAX_HEIGHT and
        MIN_PIXELS <= total_pixels <= MAX_PIXELS):
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer

    # Resize proportionally to fit within limits
    scale = min(MAX_WIDTH / width, MAX_HEIGHT / height, 1)
    new_width = max(MIN_WIDTH, int(width * scale))
    new_height = max(MIN_HEIGHT, int(height * scale))
    resized = img.resize((new_width, new_height), Image.LANCZOS)

    buffer = BytesIO()
    resized.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


import base64
from io import BytesIO
from PIL import Image

def decode_base64_image(data_url: str) -> BytesIO:
    header, encoded = data_url.split(",", 1)
    return BytesIO(base64.b64decode(encoded))
