import axios from "axios";
import { ServerApi } from "@/Api/ServerApi";

export const getLogoAndNameApi = () => 
    axios.get(`/public/theme/zmr/logo-and-name?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getLogoAndNameApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/logo-and-name?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getAboutUsApiServer = async () => {
    const api = await ServerApi();
    return api.get("/public/theme/zmr/aboutus");
};

export const getSliderApi = () => 
    axios.get(`/public/theme/zmr/slider?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getSliderApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/slider?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getSiteIconsApi = () => 
    axios.get(`/public/theme/zmr/siteIcons?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getSiteIconsApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/siteIcons?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getWhyUsApi = () => 
    axios.get(`/public/theme/zmr/why-us?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getWhyUsApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/why-us?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getContactApi = () => 
    axios.get(`/public/theme/zmr/contact?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getContactApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/contact?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getSignUpBannerApi = () => 
    axios.get(`/public/theme/zmr/signUpBanner?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getSignUpBannerApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/signUpBanner?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getFooterApi = () => 
    axios.get(`/public/theme/zmr/footer?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getFooterApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/footer?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getColorTemplateApi = () => 
    axios.get(`/public/theme/zmr/colorTemplate?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getColorTemplateApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/colorTemplate?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getContractsApi = () => 
    axios.get(`/public/theme/zmr/contracts?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getContractsApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/contracts?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getWhatsappIconApi = () => 
    axios.get(`/public/theme/zmr/whatsappIcon?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
export const getWhatsappIconApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/whatsappIcon?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getHamePageTitleAndMateTagApi = () => 
    axios.get(`/public/theme/zmr/hamePageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getHamePageTitleAndMateTagApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/hamePageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getProductsPageTitleAndMateTagApi = () => 
    axios.get(`/public/theme/zmr/productsPageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getProductsPageTitleAndMateTagApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/productsPageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getAboutUsTitleAndMateTagApi = () => 
    axios.get(`/public/theme/zmr/aboutUsTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getAboutUsTitleAndMateTagApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/aboutUsTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getContactPageTitleAndMateTagApi = () => 
    axios.get(`/public/theme/zmr/contactPageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getContactPageTitleAndMateTagApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/contactPageTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};

export const getGeneralTitleAndMateTagApi = () => 
    axios.get(`/public/theme/zmr/generalTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });

export const getGeneralTitleAndMateTagApiServer = async () => {
    const api = await ServerApi();
    return api.get(`/public/theme/zmr/generalTitleAndMateTag?t=${Date.now()}`, {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    });
};



