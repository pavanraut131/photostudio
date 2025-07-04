import React from 'react'

const Analyzeimagesidebar = ({handleanalyzeimage}) => {
  return <div className="main-sidebar">
    <h3>
        Regenrate your Image
    </h3>
    <p>Use this image as your starting point to get exactly what you’re looking for. AI will analyze the image and create a prompt you can edit.</p>
    <button
    className="analyzebutton" 
    onClick={handleanalyzeimage}>
        Analyze Image
    </button>
  </div>;
}

export default Analyzeimagesidebar