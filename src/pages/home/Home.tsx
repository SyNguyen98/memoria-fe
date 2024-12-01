import "./Home.scss";
import {Link} from "react-router";
import {Button, Divider, Grid2, Typography} from "@mui/material";
import {OpenInNew} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {GOOGLE_AUTH_URL} from "../../constants/Url";
import {VERSION} from "../../constants";
import {PathName} from "../../constants/Page.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

export default function Home() {
    const {t} = useTranslation();

    const handleLoginWithGoogle = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    return (
        <section className="home-container">
            <div className="banner">
                <div className="slogan-button">
                    <h1 className="slogan">
                        {t(`homepage.${isTabletOrPhone() ? 'banner_quote_phone' : 'banner_quote'}`)}
                    </h1>
                    <Button className="login-btn" variant="outlined"
                            onClick={handleLoginWithGoogle}>
                        <img className="google-icon" alt="Google"
                             src="https://github.com/SyNguyen98/image-storage/blob/main/google-logo.png?raw=true"/>
                        <Typography variant="body1">
                            {t('homepage.banner_login')}
                        </Typography>
                    </Button>
                </div>
            </div>

            <div className="introduction">
                <Typography variant="h3">
                    {t('homepage.what_is_memoria')}
                </Typography>
                <div className="introduce-content">
                    <img className="introduce-img" alt="introduction"
                         src="https://github.com/SyNguyen98/image-storage/blob/main/introduction.png?raw=true"/>
                    <div className="introduce-text">
                        {t('homepage.memoria_introduction')}
                    </div>
                </div>
            </div>

            <div className="quote-wrapper">
                <div className="quote">
                    &#34;{t(`homepage.${isTabletOrPhone() ? 'quote_1_phone' : 'quote_1'}`)}&#34;
                </div>
            </div>

            {isTabletOrPhone() ? (
                <div className="feature-list">
                    {/* Feature 1 */}
                    <Typography variant="h5">
                        {t('homepage.features.1.title')}
                    </Typography>
                    <img alt="man-and-camera" width={300} height={300}
                         src="https://github.com/SyNguyen98/image-storage/blob/main/man-and-camera.png?raw=true"/>
                    <Typography variant="body1">
                        {t('homepage.features.1.description')}
                    </Typography>
                    <Divider/>
                    {/* Feature 2 */}
                    <Typography variant="h5">
                        {t('homepage.features.2.title')}
                    </Typography>
                    <img alt="album" width={300} height={250}
                         src="https://github.com/SyNguyen98/image-storage/blob/main/album.png?raw=true"/>
                    <Typography variant="body1">
                        {t('homepage.features.2.description')}
                    </Typography>
                    <Divider/>
                    {/* Feature 3 */}
                    <Typography variant="h5">
                        {t('homepage.features.3.title')}
                    </Typography>
                    <img alt="man-with-map" width={300} height={250}
                         src="https://github.com/SyNguyen98/image-storage/blob/main/man-with-map.png?raw=true"/>
                    <Typography variant="body1">
                        {t('homepage.features.3.description')}
                    </Typography>
                </div>
            ) : (
                <Grid2 className="feature-list" container rowSpacing={10}>
                    {/* Row 1 */}
                    <Grid2 size={{ xs: 6 }}>
                        <img alt="man-and-camera" width={350} height={350}
                             src="https://github.com/SyNguyen98/image-storage/blob/main/man-and-camera.png?raw=truev"/>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }} className="text-wrapper">
                        <Typography variant="h3">
                            {t('homepage.features.1.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.1.description')}
                        </Typography>
                    </Grid2>
                    {/* Row 2 */}
                    <Grid2 size={{ xs: 6 }} className="text-wrapper">
                        <Typography variant="h3">
                            {t('homepage.features.2.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.2.description')}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }} className="img-wrapper">
                        <img className="float-right" alt="album" width={400} height={400}
                             src="https://github.com/SyNguyen98/image-storage/blob/main/album.png?raw=true"/>
                    </Grid2>
                    {/* Row 3 */}
                    <Grid2 size={{ xs: 6 }}>
                        <img alt="man-with-map" width={450} height={450}
                             src="https://github.com/SyNguyen98/image-storage/blob/main/man-with-map.png?raw=true"/>
                    </Grid2>
                    <Grid2 size={{ xs: 6 }} className="text-wrapper">
                        <Typography variant="h3">
                            {t('homepage.features.3.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.3.description')}
                        </Typography>
                    </Grid2>
                </Grid2>
            )}

            <div className="quote-wrapper-2">
                <div className="quote">
                    “{t('homepage.quote_2')}”
                </div>
            </div>

            <div className="contact">
                <Typography variant="h3">
                    {t('homepage.contact')}
                </Typography>
                <Typography variant="body1">
                    nguyen.nguyenhongsy@outlook.com.vn
                </Typography>
            </div>

            <footer className="app-footer">
                <div className="left-wrapper">
                    <img alt="App Logo" src="https://github.com/SyNguyen98/image-storage/blob/main/app-logo.png?raw=true"/>
                    <Typography variant="body1">
                        MEMORIA {VERSION}, 2024
                    </Typography>
                </div>
                <div className="right-wrapper">
                    <Typography variant="body1">
                        {t('homepage.slogan')}
                    </Typography>
                    <Typography variant="body2">
                        <Link to={`/${PathName.PRIVACY}`}>
                            {t('header_menu.privacy')}
                        </Link>
                    </Typography>
                </div>
            </footer>
        </section>
    )
}
