import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
// import { BootstrapVue } from 'bootstrap-vue';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Agrégalo a la aplicación Vue
const app = createApp(App);
app.use(router);
// app.use(BootstrapVue);
app.config.globalProperties.$axios = axios;

app.mount('#app');
