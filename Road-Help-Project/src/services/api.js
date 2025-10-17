import axios from 'axios';

const api = axios.create({
    baseURL: "https://192.168.1.242:3050"
})

export default api 