import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'


// Importe o Vant e seus estilos
import Vant from 'vant';
import 'vant/lib/index.css'; // Estilos globais do Vant

// Crie a aplicação Vue
const app = createApp(App);

// Use o Vant e o Router
app.use(Vant);
app.use(store)
app.use(router);

// Monte a aplicação
app.mount('#app');