import i18n from "i18next";
import {initReactI18next} from "react-i18next";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: {
                    language: "Language",
                    homepage: "Homepage",
                    about_memoria: "About MEMORIA",
                    about_me: "About Me",
                }
            },
            vn: {
                translation: {
                    language: "Ngôn ngữ",
                    homepage: "Trang Chủ",
                    about_memoria: "Về MEMORIA",
                    about_me: "Về Tôi",
                }
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