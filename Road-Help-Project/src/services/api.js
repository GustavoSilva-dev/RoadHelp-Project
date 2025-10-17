import axios from 'axios';

const api = axios.create({
    baseURL: "https://10.180.29.99:3050"
})

export default api 