from enum import Enum


class Graph_Node(Enum):
    MANAGER = "manager"
    GENERATE_IMAGE = "generate_image"
    UPSCALE_IMAGE = "upscale_image"
    ERASE_IMAGE = "erase_image"
    EDIT_IMAGE = "edit_image"
    EXTEND_IMAGE = "extend_image"
    ANALYZE_IMAGE = "analyze_image"
    BACKGROUND_REMOVE = "background_remove"

class MODEL_NAME(str, Enum):
    GPT_4o_MINI = "gpt-4o-mini"
