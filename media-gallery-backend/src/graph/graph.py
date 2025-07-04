
from src.states.states import HandoffNodeSpec, Imagestate, RootState
from src.config.config import LLM_openai
from src.helper.helper_manager import create_manager_node
from langgraph.graph import StateGraph,START
from src.util.enum import Graph_Node
from src.node.node import (
    generate_image_node,
    upscale_image_node,
    erase_image_node,
    edit_image_node,
    analyze_image_node,
    extend_image_node,
    background_remove_node
)

handoff_nodes = {
    Graph_Node.GENERATE_IMAGE.value: HandoffNodeSpec(
        description="Handles all the tasks for the image generation process based on user prompts."
    ),
    Graph_Node.UPSCALE_IMAGE.value: HandoffNodeSpec(
        description="Handles all tasks related to image upscaling, including enhancing image resolution and quality."
    ),
    Graph_Node.ERASE_IMAGE.value: HandoffNodeSpec(
        description="Handles all tasks related to erase uses the brush_mark_url and image_url to erase."
    ),
    Graph_Node.EDIT_IMAGE.value: HandoffNodeSpec(
        description="Handles all tasks related to image editing, use the brush_mark_url and image_url and edit_prompt."
    ),
    Graph_Node.EXTEND_IMAGE.value: HandoffNodeSpec(
        description="Handles all tasks related to image extension, including outpainting and expanding the images."
    ),
    Graph_Node.ANALYZE_IMAGE.value: HandoffNodeSpec(
        description="handles all tasks related to image analyzing, it analyzes the image and generate description."
    ),
    Graph_Node.BACKGROUND_REMOVE.value:HandoffNodeSpec(
        description = "handles all the task related to remove background from the image."
    )
}

manager_node = create_manager_node(LLM_openai, handoff_nodes)

media_graph = StateGraph(RootState)
media_graph.add_node(Graph_Node.MANAGER.value, manager_node)
media_graph.add_node(Graph_Node.GENERATE_IMAGE.value, generate_image_node) 
media_graph.add_node(Graph_Node.UPSCALE_IMAGE.value, upscale_image_node)
media_graph.add_node(Graph_Node.ERASE_IMAGE.value, erase_image_node)
media_graph.add_node(Graph_Node.EDIT_IMAGE.value, edit_image_node)
media_graph.add_node(Graph_Node.EXTEND_IMAGE.value, extend_image_node)
media_graph.add_node(Graph_Node.ANALYZE_IMAGE.value, analyze_image_node)    
media_graph.add_node(Graph_Node.BACKGROUND_REMOVE.value, background_remove_node)
media_graph.add_edge(START, Graph_Node.MANAGER.value)


media_gallery_graph = media_graph.compile(debug=True)

