import "../../style.css";
import Backup from "./Backup.svelte";

const backup = new Backup({
  target: document.getElementById("backup"),
});

export default backup;
