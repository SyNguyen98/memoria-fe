import "./Header.scss";
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <div className="header-container">
            <div className="header-content">
                <div className="logo-app-name">
                    <img alt="App Logo" width={50} height={50}
                         src="https://i.ibb.co/khS54Vr/app-logo.png"/>
                    <div className="app-name">
                        ME<span>MO</span>RIA
                    </div>
                </div>
                <div className="header-menu">
                    <Link to="/">
                        Trang chủ
                    </Link>
                    <Link to="/memoria">
                        MEMORIA là gì?
                    </Link>
                    <Link to="/about-me">
                        Về tôi
                    </Link>
                    <Link to="/faq">
                        FAQ
                    </Link>
                </div>
            </div>
        </div>
    );
}