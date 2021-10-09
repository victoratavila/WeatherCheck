import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.hgbrasil.com/weather?format=json-cors&key=df93cc48',
  });

export default api;