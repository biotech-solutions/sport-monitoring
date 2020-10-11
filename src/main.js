import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import es from 'vuetify/es5/locale/es';
import axios from 'axios';
import VueSession from 'vue-session';

Vue.use(VueSession, { persist: true });


Vue.config.productionTip = false;

vuetify.framework.lang.current = "es";
vuetify.framework.lang.locales = { es };

axios.defaults.baseURL = 'http://192.168.100.20:8081/';
//axios.defaults.validateStatus=status =>

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');


