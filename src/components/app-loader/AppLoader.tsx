import "./AppLoader.scss";
import {HashLoader} from "react-spinners";

export default function AppLoader() {
    return (
        <div className="app-loader">
            <HashLoader color="#2196F3" size={80}/>
        </div>
    )
}
