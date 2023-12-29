import "./HomeComponent.scss";
import React from "react";
import {Button, Grid, Typography} from "@mui/material";
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
                <Typography variant="h3">
                    MEMORIA là gì?
                </Typography>
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

            <Grid className="feature-list" container rowSpacing={10}>
                {/* Row 1 */}
                <Grid item xs={6}>
                    <img src={`${Url.IMAGE}/man-and-camera.svg`} alt="man-and-camera" width={350} height={350}/>
                </Grid>
                <Grid item xs={6} className="text-wrapper">
                    <Typography variant="h3">
                        Lưu giữ những tấm ảnh thú vị
                    </Typography>
                    <Typography variant="body1">
                        Những tấm hình luôn chứa bên trong nó những câu chuyện. Mỗi bức ảnh của bạn sẽ kể lại những câu
                        chuyện mà bạn đã trải qua. Để rồi khi nhìn lại, bạn sẽ bật cười nhớ về nó. MEMORIA ở đây là để
                        tạo ra những nụ cười đó.
                    </Typography>
                </Grid>
                {/* Row 2 */}
                <Grid item xs={6} className="text-wrapper">
                    <Typography variant="h3">
                        Lưu giữ khoảnh khắc bên<br/>người thân và bạn bè
                    </Typography>
                    <Typography variant="body1">
                        Những khoảnh khắc bên người thân, bạn bè luôn là những giây phút đáng quý nhất. Cùng họ tạo
                        nênnhững tấm ảnh tràn ngập kỷ niệm thì thật hạnh phúc biết bao. Để mai này nếu chẳng còn sát
                        cánhbên nhau, ta có thể ngắm lại và hồi tưởng về những khoảnh khắc đó.
                    </Typography>
                </Grid>
                <Grid item xs={6} className="img-wrapper">
                    <img className="float-right" src={`${Url.IMAGE}/album.svg`} alt="album" width={400} height={400}/>
                </Grid>
                {/* Row 3 */}
                <Grid item xs={6}>
                    <img src={`${Url.IMAGE}/man-with-map.svg`} alt="man-and-camera" width={450} height={450}/>
                </Grid>
                <Grid item xs={6} className="text-wrapper">
                    <Typography variant="h3">
                        Định vị những địa điểm<br/>mang lại kỷ niệm
                    </Typography>
                    <Typography variant="body1">
                        MEMORIA không chỉ lưu trữ những tấm ảnh mà còn cho bạn biết những tấm ảnh ấy được tạo ra ở
                        đâu. Với tính năng ghim địa điểm, bạn có thể ngắm lại những lần cùng nhau du lịch cùng bạn bè
                        hoặcngười thân. Bất cứ nơi nào bạn đặt chân qua và muốn lưu lại những kỷ niệm, MEMORIA đều sẽ
                        giúp bạn.
                    </Typography>
                </Grid>
            </Grid>

            <div className="quote-wrapper-2">
                <div className="quote">
                    “Chúng ta chẳng thể biết được khi nào là lần cuối cùng gặp một ai đó.”
                </div>
            </div>

            <div className="contact">
                <Typography variant="h3">
                    Liên Hệ
                </Typography>
                <Typography variant="body1">
                    nguyen.nguyenhongsy@outlook.com.vn
                </Typography>
            </div>

            <footer className="app-footer">
                <div className="left-wrapper">
                    <img src={`${Url.IMAGE}/app-logo.svg`} alt="App Logo" width={30} height={30}/>
                    <Typography variant="body1">
                        MEMORIA, 2024
                    </Typography>
                </div>
                <div className="right-wrapper">
                    <Typography variant="body1">
                        Lưu trữ những khoảnh khắc
                    </Typography>
                </div>
            </footer>
        </section>
    )
}
