import Vue from "vue";
import App from "./App.vue";
import filters from "./utils/filters";

Vue.config.productionTip = false;

function onHashChange() {
  let visibility = window.location.hash.replace(/#\/?/, "");
  if (filters[visibility]) {
    app.visibility = visibility;
  } else {
    window.location.hash = "";
    app.visibility = "all";
  }
}

const app = new Vue({
  render: h => h(App, { props: { visibility: app.visibility } }),
  data: () => ({ visibility: "all" })
});

onHashChange();
window.addEventListener("hashchange", onHashChange);

app.$mount("#app");
