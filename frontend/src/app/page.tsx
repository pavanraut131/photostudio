"use client"
import './dialog.css'
export default function Home() {
  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };
  const loginwithDropbox = () => {
    window.open("http://localhost:5000/auth/dropbox", "_self");
  };
  const loginwithvimeo = () => {
    window.open("http://localhost:5000/auth/vimeo", "_self");
  };
  const loginwithdribble = () => {
    window.open("http://localhost:5000/auth/dribbble", "_self");
  };
  const loginwithdevianart = () => {
    window.open("http://localhost:5000/auth/deviantart", "_self");
  };
 
 
  return (
    <div className='upload-dialog'>
      <h2>Upload Media from</h2>
      <button onClick={loginWithGoogle}>Google Drive</button>
      <button onClick={loginwithDropbox}>DropBox</button>
      <button onClick={loginwithvimeo}> Vimeo</button>
      <button onClick={loginwithdribble}> Dribble</button>
      <button onClick={loginwithdevianart}> Devianart</button>
    </div>
  );
};

