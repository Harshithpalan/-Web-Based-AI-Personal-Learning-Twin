import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => {
        const params = new URLSearchParams();
        params.append('username', data.username);
        params.append('password', data.password);
        return api.post('/auth/login', params);
    },
};

export const studyService = {
    createSession: (data) => api.post('/study/sessions', data),
    getSessions: () => api.get('/study/sessions'),
};

export const quizService = {
    saveResult: (data) => api.post('/study/quiz/results', data),
    getResults: () => api.get('/study/quiz/results'),
};

export const mlService = {
    getWeaknessPrediction: (subject) => api.post(`/predict/weakness?subject=${subject}`),
};

export const aiService = {
    generateNotes: (topic) => api.post(`/ai/generate-notes?topic=${topic}`),
    generateQuiz: (topic, difficulty) => api.post(`/ai/generate-quiz?topic=${topic}&difficulty=${difficulty}`),
};

export const focusService = {
    detectFocus: (image) => api.post('/focus/detect', { image }),
};

export default api;
