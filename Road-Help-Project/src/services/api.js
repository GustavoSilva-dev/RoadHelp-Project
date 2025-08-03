import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.1.242:3050"
})

export default api 