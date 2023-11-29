import "./style.css";
import Alpine from "alpinejs";
import { render } from "./unit.js/index";
import defineState from "./src/state";
import App from "./src/index.unit";

// console.log(App);

defineState(Alpine);

render(App, "#app");