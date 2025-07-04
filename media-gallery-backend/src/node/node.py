from langgraph.prebuilt import create_react_agent

from src.util.enum import Graph_Node, MODEL_NAME
from src.helper.helper_manager import compiled_state_graph_node_runner
from src.tool.generate_image import generate_image
from src.tool.edit_image import edit_image
from src.tool.upscale_image import upscale_image
from src.tool.extend_image import extend_image
from src.tool.analyze_image import analyze_image 
from src.tool.erase_image import erase_image
from src.tool.background_remove import background_remove
from src.states.states import Imagestate



generate_image_agent = create_react_agent(
    name=Graph_Node.GENERATE_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[generate_image],
    prompt=(
        "You are an assistant responsible for generating images based on user prompts. "
        "You will receive a text prompt from the user and must call the image generation API using that prompt. "
        "If the API call is successful (HTTP status 200), return the resulting image URL. "
        "If the API call fails, retry once using the same prompt. Do not retry more than once. "
        "After the retry, if the request still fails, return a clear error message instead of an image URL and stop."
    ),
    state_schema=Imagestate
    
)
upscale_image_agent = create_react_agent(
    name=Graph_Node.UPSCALE_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[upscale_image],
    prompt = ("You are a helpful assistant that upscale image. "
   "Use the tool upscale_image and upscale it ."
   "upscale the image to a higher resolution and return the new image url."
    ),
    state_schema=Imagestate
)

erase_image_agent = create_react_agent(
    name=Graph_Node.ERASE_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[erase_image],
    prompt = ("You are a helpful assistant that helps users erase parts of the image.\n"
        "Use the tool to get the image url and brush_mark_url.\n"
        "You should erase the selected object in the image using the image_url and brush_mark_url from the tool erase_image and return the new image URL.\n"),
    state_schema=Imagestate
)

edit_image_agent = create_react_agent(
    name=Graph_Node.EDIT_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[edit_image],
    prompt = ("You are a helpful assistant that edit images.\n"
        "get the image_url, brush_mark_url, edit_prompt from tool config and use it to edit images \n"
        "You should edit the selected part in the image using the image_url and brush_mark_url and edit_prompt from the tool and return the new image URL.\n"),
    state_schema=Imagestate
)

extend_image_agent = create_react_agent(
    name=Graph_Node.EXTEND_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[extend_image],
    prompt = ("You are a helpful assistant that extend images ."
         "Use the tool extend_image to get the image_url and return the result_url once done."),
    state_schema=Imagestate
)

analyze_image_agent = create_react_agent(
    name=Graph_Node.ANALYZE_IMAGE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[analyze_image],
    prompt =("You are a helpful assistant that analyze the images ."
         "Use the analyze_image tool to get the image_url and you should analyze the image and return the text once done stop."),
    state_schema=Imagestate
)
background_remove_agent = create_react_agent(
    name=Graph_Node.BACKGROUND_REMOVE.value,
    model = MODEL_NAME.GPT_4o_MINI.value,
    tools=[background_remove],
    prompt =("You are a helpful assistant that removes the background of the image ."
         "Use the background_remove tool to get the image_url and you should remove the background of the image and return the result_url once done stop."),
    state_schema=Imagestate
)


generate_image_node = compiled_state_graph_node_runner(
    Graph_Node.GENERATE_IMAGE.value,
    generate_image_agent,
)

upscale_image_node = compiled_state_graph_node_runner(
  Graph_Node.UPSCALE_IMAGE.value,
    upscale_image_agent,
)

erase_image_node = compiled_state_graph_node_runner(
    Graph_Node.ERASE_IMAGE.value,
    erase_image_agent,
)

edit_image_node = compiled_state_graph_node_runner(
    Graph_Node.EDIT_IMAGE.value,
    edit_image_agent,
)

extend_image_node = compiled_state_graph_node_runner(
    Graph_Node.EXTEND_IMAGE.value,
    extend_image_agent,
)

analyze_image_node = compiled_state_graph_node_runner(
    Graph_Node.ANALYZE_IMAGE.value,
    analyze_image_agent,
)
background_remove_node= compiled_state_graph_node_runner(
    Graph_Node.BACKGROUND_REMOVE.value,
    background_remove_agent
)