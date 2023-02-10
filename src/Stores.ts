import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { SeriesVersion } from "./lib/model/SeriesVersion";
import type { SaveFile } from "./lib/model/SaveFile";

export const appDataDir = writable("");
export const saveDirPath = writable("");
export const seriesEntry = writable(SeriesVersion.ROGUE_LEGACY_ONE);
export const gameVersion = writable("");

export const unchangedTabs: Writable<{ [key: string]: object }> = writable({});
export const changedTabs: Writable<{ [key: string]: boolean }> = writable({});
export const tabs: Writable<{ [key: string]: object }> = writable({});
export const selectedTab = writable("");

//TODO change this to be of type save file
export const saveFiles: Writable<{ [key: string]: SaveFile }> = writable({});

export const loaderProgress = writable("0%");

export const showLoadBackupModal = writable(false);
export const showConfirmDiscard = writable(false);
export const showConfirmReload = writable(false);

export const discardChangesDisabled = writable(true);
export const saveChangesDisabled = writable(true);
