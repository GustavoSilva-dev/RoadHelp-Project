import axios from 'axios';

const api = axios.create({
    baseURL: "https://roadhelp-backend.onrender.com"
})

export default api 