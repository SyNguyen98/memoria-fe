import "./HomeComponent.scss";
import {Fragment} from "react";
import {Button, Grid, Typography} from "@mui/material";
import {GOOGLE_AUTH_URL} from "../../constants/Url";
import {OpenInNew} from "@mui/icons-material";
import {VERSION} from "../../constants";

export default function HomeComponent() {

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
                         src="https://public.DM.files.1drv.com/y4m4do_ND5toF0Zgd835QEkV52d54GCPJvBuwAjoB3YnIJaUxDaDZNddfWt_VEQa58G2AByblMebxCuY2Ok8AMBscVFwcBqfcTIGJRTs2X17U7_MmjsxlrPJELAUaJq9IE2CFXMJp6oDnAW5MSbpvO4svtKW57_pTFafg0oMHjXhWLjhbO0cYvG4HBSHuk_ks2HP3nk8rRExehTv4AT_h0-GjVcedWP8KA_EYYgWRV1rCTtQKMNn8ukyyNWyHPX7uqMOumWC2xISo5SdlMkUvtBSw"/>
                    <Typography className="sorry-text" variant="body1">
                        Sorry we did not support phone screen yet.<br/>
                        Please try again with desktop screen.
                    </Typography>
                </Fragment>
            ) : (
                <Fragment>
                    <div className="banner">
                        <div className="logo-app-name">
                            <img alt="App Logo" width={50} height={50}
                                 src="https://public.DM.files.1drv.com/y4mDt6P_Dobieg1FZpN32-QvCzPmPdJ-ePPZwE72S3BINOhHSNVtaZyG0MSKls0SliOC702kbxVK7ZOCxyT6pCplAxNS1y8Ttmut9ikKMYRS6PksbWlNnPNdIM6jpRJwSymQSHEvf8Gms-x6gd00vgv3CQ7hrJl-l3ZAkYrduhRCH8R4XRXLPqTnTTX8P-KHfeiOrdFQmmiTLIqaFt4kmRI4gUcVc-ELT4jjKZC6hKeuSir97EZRpllpy_SNvfnOfDkpGr96273eeko8G4f90W2eQ"/>
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
                                <img className="google-icon" alt="Google"
                                     src="https://public.DM.files.1drv.com/y4mZh7ygU50_4UDINKHx407F3rfXYABbPr0YKgqP2OrsNhTDkxLA5RqOGYyzcgzOVXFdOXorEoESzmaJ7-dwZB1E1Dli5KuDvzJIneH6nGOEDzdiAk2gUeISJ3iF1f8Ui-JT_jzxf5tOx6MIP_UfGGwh5PGqzGsNwqp_cbRLjqQivyw0Y5rILMtdzKBcrxE_JcKrVNmbyn9a5PNQz1O4DGCCV0t8WyQYQf1x0a5qFelBsf4GrFJzCvNmDhb733cieLO-H3-zRjMw8-DB6xJvotgVg"/>
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
                                     src="https://public.DM.files.1drv.com/y4mtdXgjM4x5WyYN0rp9In8QvJddGb-6UnU3EryI90Qx7Vk0kJOxO8UtHR4YD-QIB2osQ51lo0D-yGxHWeh7cQKZeVPtNbwbtuyTYqxmLFhYQD3msu5Aurrn7n3PJFy7QZnp-xYDbHb4g1J8milGij8o5GUyN6Yk48yENlXdV10jixizZ67qmN18Xv7mA-Wmvv6AjCf97QHoG9tX-ffX8h9IUb0Gn9uTB1W7C6ZnQkPxJWzpsj4KxrViVMaawF94S3kNbiDFerNP8LTuuEac-gvCQ"/>
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
                                 src="https://public.DM.files.1drv.com/y4m6j1V9dZQXydOMlf79Rxo6_-0-Bbn2v1ev7yIsA-Wof3GlxooVIBUOw77WXBQkNs3rE14N9EDw4Wh59HvWQM09o224kW3M08B9ZlRB1flnF5wT9JzCA6jEGr1hg3iJ7yvEMEO1aFgoU3MSRM6Y8chAV_pIrx0CKI6EU4pmWMaFVjt5Hd0P-xGWAATESPK01KN_Qp5gK14jMWt1rMtEqUHqsuimw7G9F8MhOtcHvdsKoxSCsISHwksNkpx9RuSLDPslxpu4sRFFZh_5-TRiiDNOA"/>
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
                                 src="https://public.DM.files.1drv.com/y4mIezNcS6bb3S9egKXC4OofYjj3wHgI2J0ThWk9_IA2o51MT5Yq3LwzlUGy7DrNdLr-XEcnyupyHdztTnz5vfGPtCdFGnBSLHPGTRmjjDmJpsaAxU8QdqzG2zIHOrNQd015nY4KpErL4FBP3rEaR7U55Sm4wrENVWPmFmIKiRo4jakIK9XenIQ3zF1ywNG4VAsnfGFtzfz4VwVpIYdtxV5eNfe3zmUvfzUM09J7dE-FdZfemnVq2tu3a2ykFgKpmebKLji27sAHWsFL2Co7ZLtVg"/>
                        </Grid>
                        {/* Row 3 */}
                        <Grid item xs={6}>
                            <img alt="man-with-map" width={450} height={450}
                                 src="https://public.DM.files.1drv.com/y4m9-C1pUSW-3FYKQGCAjxEVsp8dtNuGkjcj4NzTLugoXx0zfC3PdK9t3h9LTDoBvwdL50db9EWywek8g2x2r1AGoa5Im1M5kjXngfNJAzdVk8aUhoRSoPbEcuh_1CEbMFXzSjUkTLd258oPQ_bw0x8UbpebjRwdt43vaGIsRw-un3Ne61LG67VSVSDpqeW3UWHd6Q2oZH7f00JVv7Z3XAhpo1fUDDscTRNdb0j6qz3AjZl9AfnQVkb2VVj635YJgIfYEvBGFbNzF_Oi8EUuUzQrg"/>
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
                                 src="https://public.DM.files.1drv.com/y4mDt6P_Dobieg1FZpN32-QvCzPmPdJ-ePPZwE72S3BINOhHSNVtaZyG0MSKls0SliOC702kbxVK7ZOCxyT6pCplAxNS1y8Ttmut9ikKMYRS6PksbWlNnPNdIM6jpRJwSymQSHEvf8Gms-x6gd00vgv3CQ7hrJl-l3ZAkYrduhRCH8R4XRXLPqTnTTX8P-KHfeiOrdFQmmiTLIqaFt4kmRI4gUcVc-ELT4jjKZC6hKeuSir97EZRpllpy_SNvfnOfDkpGr96273eeko8G4f90W2eQ"/>
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
                            {/*<Typography variant="body2">*/}
                            {/*    <Link to="">*/}
                            {/*        Về tôi*/}
                            {/*    </Link>*/}
                            {/*</Typography>*/}
                        </div>
                    </footer>
                </Fragment>
            )}
        </section>
    )
}
