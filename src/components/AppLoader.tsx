import {HashLoader} from "react-spinners";
import React from "react";

export default function AppLoader() {
    return (
        <div className="loader" style={{marginTop: '30vh', marginLeft: '45%'}}>
            <HashLoader color="#2196F3" size={80}/>
        </div>
    )
}
