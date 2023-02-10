import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { Rogue1Save } from "./lib/model/Rogue1Save";
import type { Rogue2Save } from "./lib/model/Rogue2Save";

export const appDataDir = writable("");
export const saveDirPath = writable("");
export const selectedGame = writable(1);

export const unchangedTabs: Writable<{ [key: string]: object }> = writable({});
export const changedTabs: Writable<{ [key: string]: boolean }> = writable({});
export const tabs: Writable<{ [key: string]: object }> = writable({});
export const selectedTab = writable("");

//TODO change this to be of type save file
export const saveFiles: Writable<{ [key: string]: Rogue1Save | Rogue2Save }> = writable({});

export const loaderProgress = writable("0%");

export const showLoadBackupModal = writable(false);
export const showConfirmDiscard = writable(false);
export const showConfirmReload = writable(false);

export const discardChangesDisabled = writable(true);
export const saveChangesDisabled = writable(true);
