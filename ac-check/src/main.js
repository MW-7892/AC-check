import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Vue from 'vue'

Vue.config.productionTip = false;

let app;


if(!app){
  app = new Vue({
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')
}
