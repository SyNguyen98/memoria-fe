import "./Home.scss";
import {Button, Grid, Typography} from "@mui/material";
import {GOOGLE_AUTH_URL} from "../../constants/Url";
import {OpenInNew} from "@mui/icons-material";
import {VERSION} from "../../constants";
import {useTranslation} from "react-i18next";

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
                        {t('homepage.banner_quote')}
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
                <Grid container className="introduce-content">
                    <Grid item xs={5}>
                        <img alt="introduction" width={350} height={350}
                             src="https://i.ibb.co/DCpBHrF/introduction.png"/>
                    </Grid>
                    <Grid item xs={7} className="introduce-text">
                        {t('homepage.memoria_introduction')}
                    </Grid>
                </Grid>
            </div>

            <div className="quote-wrapper">
                <div className="quote">
                    "{t('homepage.quote_1')}"
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
                    <img alt="App Logo" width={30} height={30}
                         src="https://i.ibb.co/khS54Vr/app-logo.png"/>
                    <Typography variant="body1">
                        MEMORIA {VERSION}, 2024
                    </Typography>
                </div>
                <div className="right-wrapper">
                    <Typography variant="body1">
                        {t('homepage.slogan')}
                    </Typography>
                    <Typography variant="body2">
                        <a href="https://forms.gle/K9b1Rr3TXEYYfx8p6" rel="noreferrer" target="_blank">
                            {t('feedback')}
                        </a>
                        <OpenInNew/>
                    </Typography>
                </div>
            </footer>
        </section>
    )
}
