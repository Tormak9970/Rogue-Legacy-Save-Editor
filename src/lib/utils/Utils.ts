import { os, path } from "@tauri-apps/api";
import { SeriesEntry } from "../model/SeriesEntry";

/**
 *
 * @param func The function to throttle
 * @param wait The amount of time in between each run
 * @returns A function that throttles the provided function
 */
export function throttle(func: any, wait: number) {
  let waiting = false;
  return function () {
    if (waiting) {
      return;
    } else {
      func.apply(this, arguments);
    }

    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, wait);
  };
}

/**
 * Gets the default path to open to when the user selects the save directory picker.
 * @param seriesEntry The entry in the Rogue Legacy series.
 * @returns The default path to use when opening up the saveDir modal.
 */
export async function getDefaultSaveDirectory(seriesEntry:SeriesEntry) {
  const platform = await os.platform();
  if (seriesEntry == SeriesEntry.ROGUE_LEGACY_ONE) {
    if (platform == "win32") {
      return await path.join(await path.documentDir(), "SavedGames/RogueLegacy/RogueLegacyStorageContainer/AllPlayers"); // followed by "/PROFILE"
    } else if (platform == "linux") {
      return await path.join(await path.homeDir(), ".local/share/RogueLegacy/RogueLegacyStorageContainer/AllPlayers"); // followed by "/PROFILE"
    }
  } else {
    if (platform == "win32") {
      return await path.join(await path.homeDir(), "AppData/LocalLow/Cellar Door Games/Rogue Legacy 2/Saves"); // followed by "/PLATFORM/GAME_ID/PROFILE"
    } else if (platform == "linux") {
      return await path.join(await path.homeDir(), ".config/unity3d/Cellar Door Games/Rogue Legacy 2/Saves"); // followed by "/PLATFORM/GAME_ID/PROFILE"
    }
  }
}

export function isSaveFile(fileName: string): boolean {
  return fileName.endsWith(".rcdat") || fileName.endsWith(".rc2dat");
}
