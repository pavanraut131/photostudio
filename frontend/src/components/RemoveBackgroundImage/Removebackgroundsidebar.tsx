import React from "react";
import "./removebackgroudn.css"

const Removebackgroundsidebar = ({
  
  imageUrl,
  handleremovebackground,
  setbgcolor,
isautocut
}) => {
  const colors = [
    "#ffffff",
    "#f28b82",
    "#d7aefb",
    "#aecbfa",
    "transparent",
  ];
  return (
    <div className="main-sidebar">
      <h3>Cut Out</h3>
      <div className="thumnail-removebackground">
        <img
          className="image-backgroundremove"
          src={imageUrl}
          alt="Cut out preview"
        />
      </div>
      {!isautocut ? (
        <div>
          <button onClick={handleremovebackground} className="analyzebutton">
            Auto Cut Out
          </button>
        </div>
      ) : (
        <div>
          <h4>Background Color</h4>
          <div className="color-picker">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-swatch ${
                  color === "transparent" ? "transparent" : ""
                }`}
                style={
                  color !== "transparent" ? { backgroundColor: color } : {}
                }
                onClick={() => setbgcolor(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Removebackgroundsidebar;
