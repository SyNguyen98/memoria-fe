import "./HomeComponent.scss";
import React from "react";
import {Button, Grid} from "@mui/material";
import {GOOGLE_AUTH_URL, Url} from "../../constants/Url";

export default function HomeComponent() {

    const handleLoginWithGoogle = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    return (
        <section className="home-container">
            <div className="banner">
                <div className="logo-app-name">
                    <img src={`${Url.IMAGE}/app-logo.svg`} alt="App Logo" width={50} height={50}/>
                    <div className="app-name">
                        ME<span>MO</span>RIA
                    </div>
                </div>
                <div className="slogan-button">
                    <h1 className="slogan">
                        Sau cùng thì,<br/>
                        tất cả chỉ còn là kỷ niệm
                    </h1>
                    <Button className="login-btn" variant="outlined"
                            onClick={handleLoginWithGoogle}>
                        <img className="google-icon" src={`${Url.IMAGE}/google-logo.png`} alt="Google"/>
                        Đăng Nhập với Google
                    </Button>
                </div>
            </div>

            <div className="introduction">
                <h2 className="introduce-title">
                    MEMORIA là gì?
                </h2>
                <Grid container spacing={2} className="introduce-content">
                    <Grid item xs={5}>
                        <img src={`${Url.IMAGE}/introduction.svg`} alt="introduction" width={350} height={350}/>
                    </Grid>
                    <Grid item xs={7} className="introduce-text">
                        MEMORIA là ứng dụng giúp cho bạn lưu trữ những kỷ niệm đáng nhớ thông qua những bức ảnh về bạn
                        bè, gia đình. Những nơi bạn đã đi qua, những kỷ niệm bạn đã cùng trải qua cùng với những người
                        thân thương, MEMORIA sẽ giúp bạn ghi dấu lại tất cả. MEMORIA vẫn sẽ ở đó, nhắc lại cho bạn những
                        năm tháng mà bạn đã lỡ quên.
                    </Grid>
                </Grid>
            </div>

            <div className="quote-wrapper">
                <div className="quote">
                    “Khi một câu chuyện sắp kết thúc, chúng ta luôn nhớ tới khi nó bắt đầu.”
                </div>
            </div>
        </section>
    )
}
