import { AppController } from "../../lib/controllers/AppController";
import "../../style.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

document.addEventListener("DOMContentLoaded", () => {
  AppController.hideSplashscreenWindow();
  AppController.showMainWindow();
});

export default app;
