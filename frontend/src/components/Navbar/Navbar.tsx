import React from "react";
import "./navbar.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { redo, reverttoorginal, undo } from "@/redux/Imageslice";
import { Undo2, Redo2 } from "lucide-react";



const Navbar = ({history, future}) => {
    const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="navbar">
      <div>
        <h3>Photostudio</h3>
      </div>
      <div className="navbar-buttons">
        <div>
          <button onClick={()=>dispatch(reverttoorginal())}>Revert-to-original</button>
        </div>
        <div>
          <button disabled={history.length==0}  onClick={()=>{
            console.log("button clicked")
            dispatch(undo())}}><Undo2 size={15}/></button>
        </div>
        <div>
          <button disabled={future.length==0} onClick={()=>dispatch(redo())}><Redo2 size={15}/></button>
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
