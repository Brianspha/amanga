import Vue from "vue";
import AppComponent from "./App/App.vue";
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
Vue.component("app-component", AppComponent);
Vue.use(Vuetify)
new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
