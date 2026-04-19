import axios from "axios";
import { ServerApi } from "@/Api/ServerApi";

export const getNavbarApi = () => axios.get("/public/theme/zmr/navbar");

export const getNavbarApiServer = async () => {
    const api = await ServerApi();
    return api.get("/public/theme/zmr/navbar");
};

export const getAboutUsApiServer = async () => {
    const api = await ServerApi();
    return api.get("/public/theme/zmr/aboutus");
};
