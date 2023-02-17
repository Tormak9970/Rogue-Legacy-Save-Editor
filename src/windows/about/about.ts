import "../../style.css";
import About from "./About.svelte";

const about = new About({
  target: document.getElementById("about"),
});

export default about;
