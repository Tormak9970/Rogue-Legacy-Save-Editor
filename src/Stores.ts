import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { SeriesEntry } from "./lib/model/SeriesEntry";
import type { SaveFile } from "./lib/model/SaveFile";
import { sharedStore } from "./lib/utils/SharedStore";

export const saveDirPath = sharedStore("", "saveDirPath");
export const availableProfiles:Writable<string[]> = writable([]);
export const selectedProfile = writable("");
export const seriesEntry = sharedStore(SeriesEntry.ROGUE_LEGACY_ONE, "seriesEntry");
export const gameVersion = sharedStore("", "gameVersion");

export const unchangedTabs: Writable<{ [key: string]: object }> = writable({});
export const changedTabs: Writable<{ [key: string]: boolean }> = writable({});
export const tabs: Writable<{ [key: string]: object }> = writable({});
export const selectedTab = writable("");

//TODO change this to be of type save file
export const saveFiles: Writable<{ [key: string]: SaveFile }> = writable({});

export const loaderProgress = writable("0%");

export const showConfirmDiscard = writable(false);
export const showConfirmReload = writable(false);

export const discardChangesDisabled = writable(true);
export const saveChangesDisabled = writable(true);

export const showingAbout = sharedStore(false, "showingAbout");
export const showingBackup = sharedStore(false, "showingBackup");
