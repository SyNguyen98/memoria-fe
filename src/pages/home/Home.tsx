import "./Home.scss";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {GOOGLE_AUTH_URL} from "../../constants/Url";
import {OpenInNew} from "@mui/icons-material";
import {VERSION} from "../../constants";
import {useTranslation} from "react-i18next";
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
                             src="https://i.ibb.co/82K2Hhy/google-logo.png"/>
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
                         src="https://i.ibb.co/DCpBHrF/introduction.png"/>
                    <div className="introduce-text">
                        {t('homepage.memoria_introduction')}
                    </div>
                </div>
            </div>

            <div className="quote-wrapper">
                <div className="quote">
                    "{t(`homepage.${isTabletOrPhone() ? 'quote_1_phone' : 'quote_1'}`)}"
                </div>
            </div>

            {isTabletOrPhone() ? (
                <div className="feature-list">
                    {/* Feature 1 */}
                    <Typography variant="h5">
                        {t('homepage.features.1.title')}
                    </Typography>
                    <img alt="man-and-camera" width={300} height={300}
                         src="https://i.ibb.co/SwtJTRB/man-and-camera.png"/>
                    <Typography variant="body1">
                        {t('homepage.features.1.description')}
                    </Typography>
                    <Divider/>
                    {/* Feature 2 */}
                    <Typography variant="h5">
                        {t('homepage.features.2.title')}
                    </Typography>
                    <img alt="album" width={300} height={250}
                         src="https://i.ibb.co/vJrxxSF/album.png"/>
                    <Typography variant="body1">
                        {t('homepage.features.2.description')}
                    </Typography>
                    <Divider/>
                    {/* Feature 3 */}
                    <Typography variant="h5">
                        {t('homepage.features.3.title')}
                    </Typography>
                    <img alt="man-with-map" width={300} height={250}
                         src="https://i.ibb.co/2KVcj2B/man-with-map.png"/>
                    <Typography variant="body1">
                        {t('homepage.features.3.description')}
                    </Typography>
                </div>
            ) : (
                <Grid className="feature-list" container rowSpacing={10}>
                    {/* Row 1 */}
                    <Grid item xs={6}>
                        <img alt="man-and-camera" width={350} height={350}
                             src="https://i.ibb.co/SwtJTRB/man-and-camera.png"/>
                    </Grid>
                    <Grid item xs={6} className="text-wrapper">
                        <Typography variant="h3">
                            {t('homepage.features.1.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.1.description')}
                        </Typography>
                    </Grid>
                    {/* Row 2 */}
                    <Grid item xs={6} className="text-wrapper">
                        <Typography variant="h3">
                            {t('homepage.features.2.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.2.description')}
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
                            {t('homepage.features.3.title')}
                        </Typography>
                        <Typography variant="body1">
                            {t('homepage.features.3.description')}
                        </Typography>
                    </Grid>
                </Grid>
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
                    <img alt="App Logo" src="https://i.ibb.co/khS54Vr/app-logo.png"/>
                    <Typography variant="body1">
                        MEMORIA {VERSION}, 2024
                    </Typography>
                </div>
                <div className="right-wrapper">
                    <Typography variant="body1">
                        {t('homepage.slogan')}
                    </Typography>
                    {!isTabletOrPhone() && (
                        <Typography variant="body2">
                            <a href="https://forms.gle/K9b1Rr3TXEYYfx8p6" rel="noreferrer" target="_blank">
                                {t('feedback')}
                            </a>
                            <OpenInNew/>
                        </Typography>
                    )}
                </div>
            </footer>
        </section>
    )
}
