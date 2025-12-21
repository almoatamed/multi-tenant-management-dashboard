import { registerPlugins } from "@/plugins";

import { createApp } from "vue";
import App from "./App";

import "unfonts.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
