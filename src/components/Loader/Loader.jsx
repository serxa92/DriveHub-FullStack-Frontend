import { ClipLoader } from "react-spinners";
import "./Loader.css";

const Loader = ({ text }) => {
  return (
    <div className="loader">
      <ClipLoader color="#e11d48" size={48} />
      <p>{text}</p>
    </div>
  );
};

export default Loader;