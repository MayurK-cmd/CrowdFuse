import axios from 'axios';

const api = axios.create({
    baseURL: 'https://crowdfuse.onrender.com/',
});

export default api; 