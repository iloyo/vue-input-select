import Vue from "vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";
import antd from "ant-design-vue";

Vue.config.productionTip = false;

Vue.use(antd);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
