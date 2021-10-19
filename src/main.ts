import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import alert from './hooks/alert';

import './assets/css/tailwind.css';
import './assets/css/transitions.css';

createApp(App)
    .use(router)
    .use(alert)
    .mount('#app');
