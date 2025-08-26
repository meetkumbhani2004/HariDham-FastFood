
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/banner.jpeg"
import "./App.css";

const App = () => {

    const navigate = useNavigate();

    function handleClick(){
        navigate("/Menu");
    }

  return (
    <div>
       
     <div
        className="hero"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          borderRadius:"20px",
        }}
      >
        <div className="main-header">
        <h1 style={{  fontWeight: "bold", marginBottom:20}}>HARIDHAM FASTFOOD</h1>
        <p style={{   fontWeight:"revert-layer",marginBottom:20 }} className="Header-p">Best Food In India</p>
        <button style={{maxWidth:"200px",marginBottom:20}} onClick={handleClick} className="main-order">Order Now</button>
        <h1 style={{  fontWeight: "bold",marginBottom:10  }} className="heade-guj">આપનું હાર્દિક સ્વાગત છે. 🙏🏻</h1>
        </div>
        
      </div>
      </div>
  )
}

export default App;