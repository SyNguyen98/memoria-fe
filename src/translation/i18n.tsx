import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import EN_TRANSLATION from "./en.json";
import VI_TRANSLATION from "./vi.json";

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: EN_TRANSLATION
            },
            vn: {
                translation: VI_TRANSLATION
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

i18n.languages = ["vn", "en"];

export default i18n;