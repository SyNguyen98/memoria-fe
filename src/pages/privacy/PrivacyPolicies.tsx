import "./PrivacyPolicies.scss";
import {useTranslation} from "react-i18next";
import {Typography} from "@mui/material";
import {VERSION} from "../../constants";

function PrivacyPolicies() {
    const {t} = useTranslation();

    return (
        <section className="privacy-container">
            <h1 className="title">
                {t('privacy.title')}
            </h1>

            {/* Interpretation and Definitions */}
            <Typography variant="h2">
                {t('privacy.interpretation_definitions')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.interpretation')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.definitions')}
            </Typography>
            <ul>
                <li>
                    <b>{t('privacy.definitions_list.item_1b')}</b>{t('privacy.definitions_list.item_1')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_2b')}</b>{t('privacy.definitions_list.item_2')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_3b')}</b>{t('privacy.definitions_list.item_3')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_4b')}</b>{t('privacy.definitions_list.item_4')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_5b')}</b>{t('privacy.definitions_list.item_5')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_6b')}</b>{t('privacy.definitions_list.item_6')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_7b')}</b>{t('privacy.definitions_list.item_7')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_8b')}</b>{t('privacy.definitions_list.item_8')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_9b')}</b>{t('privacy.definitions_list.item_9')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_10b')}</b>{t('privacy.definitions_list.item_10')}
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_11b')}</b>{t('privacy.definitions_list.item_11')}
                    <a href="https://www.memoria.com.vn/" rel="noreferrer"
                       target="_blank">https://www.memoria.com.vn/</a>
                </li>
                <li>
                    <b>{t('privacy.definitions_list.item_12b')}</b>{t('privacy.definitions_list.item_12')}
                </li>
            </ul>

            {/* Collecting and Using Personal Data */}
            <Typography variant="h2">
                {t('privacy.collect_personal_data')}
            </Typography>
            <Typography variant="h3">
                {t('privacy.type_data')}
            </Typography>
            <Typography variant="h4">
                {t('privacy.personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.personal_data_body')}
            </Typography>
            <ul>
                <li>
                    {t('privacy.personal_data_list.item_1')}
                </li>
                <li>
                    {t('privacy.personal_data_list.item_2')}
                </li>
                <li>
                    {t('privacy.personal_data_list.item_3')}
                </li>
            </ul>

            <Typography variant="h4">
                {t('privacy.usage_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.usage_data_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.usage_data_body_2')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.usage_data_body_3')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.usage_data_body_4')}
            </Typography>

            <Typography variant="h4">
                {t('privacy.tech_cookies')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.tech_cookies_body_1')}
            </Typography>
            <ul>
                <li>
                    <b>{t('privacy.tech_cookies_body_1_list.item_1b')}</b>{t('privacy.tech_cookies_body_1_list.item_1')}
                </li>
                <li>
                    <b>{t('privacy.tech_cookies_body_1_list.item_2b')}</b>{t('privacy.tech_cookies_body_1_list.item_2')}
                </li>
            </ul>

            <Typography variant="body1">
                {t('privacy.tech_cookies_body_2')}
            </Typography>
            <ul>
                <li>
                    <p><b>{t('privacy.tech_cookies_body_2_list.item_1b')}</b></p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_type_session')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_administered')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_1_purpose')}</p>
                </li>
                <li>
                    <p><b>{t('privacy.tech_cookies_body_2_list.item_2b')}</b></p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_type_persistent')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_administered')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_2_purpose')}</p>
                </li>
                <li>
                    <p><b>{t('privacy.tech_cookies_body_2_list.item_3b')}</b></p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_type_persistent')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_administered')}</p>
                    <p>{t('privacy.tech_cookies_body_2_list.item_3_purpose')}</p>
                </li>
            </ul>

            <Typography variant="h3">
                {t('privacy.use_personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.use_personal_data_body_1')}
            </Typography>
            <ul>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_1b')}</b>{t('privacy.use_personal_data_body_1_list.item_1')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_2b')}</b>{t('privacy.use_personal_data_body_1_list.item_2')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_3b')}</b>{t('privacy.use_personal_data_body_1_list.item_3')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_4b')}</b>{t('privacy.use_personal_data_body_1_list.item_4')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_5b')}</b>{t('privacy.use_personal_data_body_1_list.item_5')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_6b')}</b>{t('privacy.use_personal_data_body_1_list.item_6')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_1_list.item_7b')}</b>{t('privacy.use_personal_data_body_1_list.item_7')}
                </li>
            </ul>
            <Typography variant="body1">
                {t('privacy.use_personal_data_body_2')}
            </Typography>
            <ul>
                <li>
                    <b>{t('privacy.use_personal_data_body_2_list.item_1b')}</b>{t('privacy.use_personal_data_body_2_list.item_1')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_2_list.item_2b')}</b>{t('privacy.use_personal_data_body_2_list.item_2')}
                </li>
                <li>
                    <b>{t('privacy.use_personal_data_body_2_list.item_3b')}</b>{t('privacy.use_personal_data_body_2_list.item_3')}
                </li>
            </ul>

            <Typography variant="h3">
                {t('privacy.retention_personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.retention_personal_data_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.retention_personal_data_body_2')}
            </Typography>

            <Typography variant="h3">
                {t('privacy.transfer_personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.transfer_personal_data_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.transfer_personal_data_body_2')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.transfer_personal_data_body_3')}
            </Typography>

            <Typography variant="h3">
                {t('privacy.delete_personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.delete_personal_data_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.delete_personal_data_body_2')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.delete_personal_data_body_3')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.delete_personal_data_body_4')}
            </Typography>

            <Typography variant="h3">
                {t('privacy.disclosure_personal_data')}
            </Typography>
            <Typography variant="h4">
                {t('privacy.business_transactions')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.business_transactions_body')}
            </Typography>

            <Typography variant="h4">
                {t('privacy.law_enforcement')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.law_enforcement_body')}
            </Typography>

            <Typography variant="h4">
                {t('privacy.other_legal_requirements')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.other_legal_requirements_body')}
            </Typography>
            <ul>
                <li>{t('privacy.other_legal_requirements_list.item_1')}</li>
                <li>{t('privacy.other_legal_requirements_list.item_2')}</li>
                <li>{t('privacy.other_legal_requirements_list.item_3')}</li>
                <li>{t('privacy.other_legal_requirements_list.item_4')}</li>
                <li>{t('privacy.other_legal_requirements_list.item_5')}</li>
            </ul>

            <Typography variant="h3">
                {t('privacy.security_personal_data')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.security_personal_data_body')}
            </Typography>

            {/* Children's Privacy */}
            <Typography variant="h2">
                {t('privacy.children_privacy')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.children_privacy_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.children_privacy_body_2')}
            </Typography>

            {/* Links to Other Websites */}
            <Typography variant="h2">
                {t('privacy.link_other_websites')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.link_other_websites_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.link_other_websites_body_2')}
            </Typography>

            {/* Changes to this Privacy Policy */}
            <Typography variant="h2">
                {t('privacy.change_privacy_policy')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.change_privacy_policy_body_1')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.change_privacy_policy_body_2')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.change_privacy_policy_body_3')}
            </Typography>

            {/* Contact Us */}
            <Typography variant="h2">
                {t('privacy.contact_us')}
            </Typography>
            <Typography variant="body1">
                {t('privacy.contact_us_body')} nguyen.nguyenhongsy@outlook.com.vn
            </Typography>

            <footer className="app-footer">
                <div className="left-wrapper">
                    <img alt="App Logo"
                         src="https://github.com/SyNguyen98/image-storage/blob/main/app-logo.png?raw=true"/>
                    <Typography variant="body1">
                        MEMORIA {VERSION}, 2024
                    </Typography>
                </div>
                <div className="right-wrapper">
                    <Typography variant="body1">
                        {t('homepage.slogan')}
                    </Typography>
                </div>
            </footer>
        </section>
    )
}

export default PrivacyPolicies;