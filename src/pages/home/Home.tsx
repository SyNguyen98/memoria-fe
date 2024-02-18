import "./Home.scss";
import {Fragment} from "react";
import {Button, Grid, Typography} from "@mui/material";
import {GOOGLE_AUTH_URL} from "../../constants/Url";
import {OpenInNew} from "@mui/icons-material";
import {VERSION} from "../../constants";

export default function Home() {

    const handleLoginWithGoogle = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    const isTableOrPhone = () => {
        return window.innerWidth < 901;
    }

    return (
        <section className="home-container">
            {isTableOrPhone() ? (
                <Fragment>
                    <img className="sorry-img" alt="cry-icon"
                         src="https://i.ibb.co/Dtb9SXV/scaracat-sad.webp"/>
                    <Typography className="sorry-text" variant="body1">
                        Sorry we did not support phone screen yet.<br/>
                        Please try again with desktop screen.
                    </Typography>
                </Fragment>
            ) : (
                <Fragment>
                    <div className="banner">
                        <div className="slogan-button">
                            <h1 className="slogan">
                                Sau cùng thì, tất cả chỉ còn là kỷ niệm
                            </h1>
                            <Button className="login-btn" variant="outlined"
                                    onClick={handleLoginWithGoogle}>
                                <img className="google-icon" alt="Google"
                                     src="https://i.ibb.co/82K2Hhy/google-logo.png"/>
                                <Typography variant="body1">
                                    Đăng Nhập với Google
                                </Typography>
                            </Button>
                        </div>
                    </div>

                    <div className="introduction">
                        <Typography variant="h3">
                            MEMORIA là gì?
                        </Typography>
                        <Grid container className="introduce-content">
                            <Grid item xs={5}>
                                <img alt="introduction" width={350} height={350}
                                     src="https://i.ibb.co/DCpBHrF/introduction.png"/>
                            </Grid>
                            <Grid item xs={7} className="introduce-text">
                                MEMORIA là ứng dụng giúp cho bạn lưu trữ những kỷ niệm đáng nhớ thông qua những bức ảnh
                                về bạn bè, gia đình. Những nơi bạn đã đi qua, những kỷ niệm bạn đã cùng trải qua cùng
                                với những người thân thương, MEMORIA sẽ giúp bạn ghi dấu lại tất cả. MEMORIA vẫn sẽ ở
                                đó, nhắc lại cho bạn những năm tháng mà bạn đã lỡ quên.
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
                            <img alt="man-and-camera" width={350} height={350}
                                 src="https://i.ibb.co/SwtJTRB/man-and-camera.png"/>
                        </Grid>
                        <Grid item xs={6} className="text-wrapper">
                            <Typography variant="h3">
                                Lưu giữ những tấm ảnh thú vị
                            </Typography>
                            <Typography variant="body1">
                                Những tấm hình luôn chứa bên trong nó những câu chuyện. Mỗi bức ảnh của bạn sẽ kể lại
                                những câu chuyện mà bạn đã trải qua. Để rồi khi nhìn lại, bạn sẽ bật cười nhớ về nó.
                                MEMORIA ở đây là để tạo ra những nụ cười đó.
                            </Typography>
                        </Grid>
                        {/* Row 2 */}
                        <Grid item xs={6} className="text-wrapper">
                            <Typography variant="h3">
                                Lưu giữ khoảnh khắc bên<br/>người thân và bạn bè
                            </Typography>
                            <Typography variant="body1">
                                Những khoảnh khắc bên người thân, bạn bè luôn là những giây phút đáng quý nhất. Cùng họ
                                tạo nên những tấm ảnh tràn ngập kỷ niệm thì thật hạnh phúc biết bao. Để mai này nếu
                                chẳng còn sát cánh bên nhau, ta có thể ngắm lại và hồi tưởng về những khoảnh khắc đó.
                            </Typography>
                        </Grid>
                        <Grid item xs={6} className="img-wrapper">
                            <img className="float-right" alt="album" width={400} height={400}
                                 src="https://i.ibb.co/vJrxxSF/album.png"/>
                        </Grid>
                        {/* Row 3 */}
                        <Grid item xs={6}>
                            <img alt="man-with-map" width={450} height={450}
                                 src="https://i.ibb.co/2KVcj2B/man-with-map.png"/>
                        </Grid>
                        <Grid item xs={6} className="text-wrapper">
                            <Typography variant="h3">
                                Định vị những địa điểm<br/>mang lại kỷ niệm
                            </Typography>
                            <Typography variant="body1">
                                MEMORIA không chỉ lưu trữ những tấm ảnh mà còn cho bạn biết những tấm ảnh ấy được tạo ra
                                ở đâu. Với tính năng ghim địa điểm, bạn có thể ngắm lại những lần cùng nhau du lịch cùng
                                bạn bè hoặc người thân. Bất cứ nơi nào bạn đặt chân qua và muốn lưu lại những kỷ niệm,
                                MEMORIA đều sẽ giúp bạn.
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
                            <img alt="App Logo" width={30} height={30}
                                 src="https://i.ibb.co/khS54Vr/app-logo.png"/>
                            <Typography variant="body1">
                                MEMORIA {VERSION}, 2024
                            </Typography>
                        </div>
                        <div className="right-wrapper">
                            <Typography variant="body1">
                                Lưu trữ những khoảnh khắc
                            </Typography>
                            <Typography variant="body2">
                                <a href="https://forms.gle/K9b1Rr3TXEYYfx8p6" rel="noreferrer" target="_blank">
                                    Phản hồi lỗi
                                </a>
                                <OpenInNew/>
                            </Typography>
                        </div>
                    </footer>
                </Fragment>
            )}
        </section>
    )
}
