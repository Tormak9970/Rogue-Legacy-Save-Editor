import { fs, path } from "@tauri-apps/api";
import { get, type Unsubscriber } from "svelte/store";
import {
  changedTabs,
  discardChangesDisabled,
  saveFiles,
  saveChangesDisabled,
  saveDirPath,
  selectedTab,
  tabs,
  unchangedTabs,
  seriesEntry,
  gameVersion,
  selectedProfile,
  availableProfiles
} from "../../Stores";
import { Reader } from "../utils/Reader";
import { BackupsController } from "./BackupsController";
import { ToasterController } from "./ToasterController";
import { isSaveFile } from "../utils/Utils";
import { SettingsManager } from "../utils/SettingsManager";
import { SeriesEntry } from "../model/SeriesEntry";
import { LogController } from "./LogController";
import type { SaveFile } from "../model/SaveFile";
import { RogueOneSaveFileNames } from "../model/SaveFileNames";
import { Rogue1Player } from "../model/rogue-one-formats/RogueLegacyPlayer";
import { Rogue1BP } from "../model/rogue-one-formats/RogueLegacyBP";
import { Rogue1Lineage } from "../model/rogue-one-formats/RogueLegacyLineage";
import { WindowController } from "./WindowController";

/**
 * The main controller for the application
 */
export class AppController {
  private static logFilePath = "";
  static logController = new LogController();
  static backupsController = new BackupsController();
  static windowController = new WindowController();

  private static seriesEntrySub:Unsubscriber;
  private static gameVersionSub:Unsubscriber;
  private static saveDirPathSub:Unsubscriber;
  private static selectedTabSub:Unsubscriber;
  private static selectedProfileSub:Unsubscriber;

  static async setup(): Promise<void> {
    await SettingsManager.setSettingsPath();
    let settings:AppSettings = await SettingsManager.getSettings();

    seriesEntry.set(settings.seriesEntry);
    saveDirPath.set(settings.seriesEntry == SeriesEntry.ROGUE_LEGACY_ONE ? settings.legacy1SaveDir : settings.legacy2SaveDir);
    gameVersion.set(settings.seriesEntry == SeriesEntry.ROGUE_LEGACY_ONE ? settings.legacy1Version : settings.legacy2Version);

    if (!AppController.seriesEntrySub) {
      AppController.seriesEntrySub = seriesEntry.subscribe(async (newVal:number) => {
        await SettingsManager.updateSettings({
          prop: "seriesEntry",
          data: newVal
        });
      });
    }

    if (!AppController.gameVersionSub) {
      AppController.gameVersionSub = gameVersion.subscribe(async (newVal:string) => {
        await SettingsManager.updateSettings({
          prop: get(seriesEntry) === SeriesEntry.ROGUE_LEGACY_ONE ? "legacy1Version": "legacy2Version",
          data: newVal
        });
      });
    }

    if (!AppController.saveDirPathSub) {
      AppController.saveDirPathSub = saveDirPath.subscribe(async (newVal:string) => {
        const saveDirConts = await fs.readDir(newVal);
        const profileFolders = saveDirConts.filter((entry) => entry.name.toLowerCase().includes("profile"));

        if (profileFolders.length > 0) {
          availableProfiles.set(profileFolders.map((entry) => entry.name));
          selectedProfile.set(get(availableProfiles)[0]);
        } else {
          availableProfiles.set([]);
          selectedProfile.set("Invalid Save Dir");
          unchangedTabs.set({});
          changedTabs.set({});
          tabs.set({});
          selectedTab.set("");

          ToasterController.showGenericToast("Select a folder with profiles");
        }

        await SettingsManager.updateSettings({
          prop: get(seriesEntry) === SeriesEntry.ROGUE_LEGACY_ONE ? "legacy1SaveDir": "legacy2SaveDir",
          data: newVal
        });
      });
    }

    if (!AppController.selectedProfileSub) {
      AppController.selectedProfileSub = selectedProfile.subscribe(async (newVal:string) => {
        if (newVal?.toLowerCase().includes("profile")) {
          await AppController.loadSaves();
        }
      });
    }
  }

  /**
   * Sets up the app
   */
  static async init(): Promise<void> {
    const logDir = await path.join(await path.appDataDir(), "logs");

    AppController.logFilePath = await path.join(logDir, "rogue-legacy-editor.log");
    AppController.logController.setFilePath(AppController.logFilePath);
    await AppController.logController.cleanLogFile();

    const backupPath = await path.join(await path.appDataDir(), "backups");
    const rogueOneBackupPath = await path.join(backupPath, "rogueLegacy1");
    const rogueTwoBackupPath = await path.join(backupPath, "rogueLegacy2");

    if (!(await fs.exists(backupPath))) await fs.createDir(backupPath);
    if (!(await fs.exists(rogueOneBackupPath))) await fs.createDir(rogueOneBackupPath);
    if (!(await fs.exists(rogueTwoBackupPath))) await fs.createDir(rogueTwoBackupPath);
    AppController.backupsController.setBackupDir(backupPath);
  }

  /**
   * Switches the game version from 1 to 2 and vise versa.
   */
  static async switchGameVersion(): Promise<void> {
    seriesEntry.update((value) => value == SeriesEntry.ROGUE_LEGACY_ONE ? SeriesEntry.ROGUE_LEGACY_TWO : SeriesEntry.ROGUE_LEGACY_ONE);
    await SettingsManager.updateSettings({prop: "seriesEntry", data: get(seriesEntry)});
  }

  /**
   * Loads the user's save files
   */
  static async loadSaves(): Promise<void> {
    let wasEmpty = false;
    AppController.log(`Loading saves for Rogue Legacy ${get(seriesEntry)}`);
    const saveDir = get(saveDirPath);
    const profile = get(selectedProfile);

    const newTabs = {};
    const newSaveFiles = {};
    const wasChanged = {};
    if (saveDir != "" && profile != "") {
      const loaderId = ToasterController.showLoaderToast("Loading save data");
      const saveConts = await fs.readDir(await path.join(saveDir, profile));

      if (saveConts.length == 0) wasEmpty = true;

      if (get(seriesEntry) == SeriesEntry.ROGUE_LEGACY_ONE) {
        for (let i = 0; i < saveConts.length; i++) {
          const saveFilePath = saveConts[i];
  
          if (isSaveFile(saveFilePath.name)) {
            const data = await fs.readBinaryFile(saveFilePath.path);
            const reader = new Reader(data);
            let save: SaveFile;

            switch (saveFilePath.name) {
              case RogueOneSaveFileNames.BP:
                save = new Rogue1BP(reader);
                break;
              case RogueOneSaveFileNames.PLAYER:
                save = new Rogue1Player(reader);
                break;
              case RogueOneSaveFileNames.LINEAGE:
                save = new Rogue1Lineage(reader);
                break;
            }
  
            if (save) {
              newTabs[saveFilePath.name] = save.asJson();
              newSaveFiles[saveFilePath.name] = save;
              wasChanged[saveFilePath.name] = false;
            }
          }
        }
      } else {

      }

      ToasterController.remLoaderToast(loaderId);

      setTimeout(() => {
        if (wasEmpty) {
          ToasterController.showGenericToast("No save files found");
        } else {
          ToasterController.showSuccessToast("Saves loaded!");
        }
      }, 500);
    }

    unchangedTabs.set(JSON.parse(JSON.stringify(newTabs)));
    changedTabs.set(wasChanged);
    tabs.set(newTabs);
    saveFiles.set(newSaveFiles);

    discardChangesDisabled.set(true);
    saveChangesDisabled.set(true);
    
    AppController.log(`Finished loading saves for Rogue Legacy ${get(seriesEntry)}`);
  }

  /**
   * Backs up the user's saves
   */
  static async backup(): Promise<void> {
    await AppController.backupsController.backup();
  }

  /**
   * Saves the current changes
   */
  static async saveChanges(): Promise<void> {
    const saveFileObj = get(saveFiles);
    const saveFileList = Object.entries(saveFileObj);
    const changes = Object.entries(get(tabs));
    const cTabs = get(changedTabs);

    for (let i = 0; i < saveFileList.length; i++) {
      const fileName = saveFileList[i][0];
      const saveFile = saveFileObj[fileName];

      if (cTabs[fileName]) {
        const filePath = await path.join(get(saveDirPath), get(selectedProfile), fileName);
        const newData = changes[i][1];

        const success = saveFile.fromJson(newData);
        if (success) {
          const dataBuf = saveFile.asBinary();

          await fs.writeBinaryFile(filePath, dataBuf);
          cTabs[fileName] = false;
        } else {
          AppController.error(`Failed to write file ${fileName}`);
        }
      }
    }

    changedTabs.set(cTabs);
    saveFiles.set(saveFileObj);
    discardChangesDisabled.set(true);
    saveChangesDisabled.set(true);
  }

  /**
   * Discards the current changes
   */
  static async discardChanges(): Promise<void> {
    const originalJsons = get(unchangedTabs);
    tabs.set(JSON.parse(JSON.stringify(originalJsons)));

    const selTab = get(selectedTab);
    selectedTab.set("");
    selectedTab.set(selTab);

    discardChangesDisabled.set(true);
    saveChangesDisabled.set(true);

    ToasterController.showSuccessToast("Changes discarded!");
  }

  /**
   * Reloads the user's saves
   */
  static async reload(): Promise<void> {
    await AppController.loadSaves();
  }

  /**
   * Logs a message with level [INFO] to the app's log file.
   * @param message Message to log.
   */
  static log(message:string) {
    AppController.logController.log(message);
    console.log(message);
  }
  
  /**
   * Logs a message with level [WARNING] to the app's log file.
   * @param message Message to log.
   */
  static warn(message:string) {
    AppController.logController.warn(message);
    console.warn(message);
  }
  
  /**
   * Logs a message with level [ERROR] to the app's log file.
   * @param message Message to log.
   */
  static error(message:string) {
    AppController.logController.error(message);
    console.error(message);
  }

  /**
   * Shows the main window.
   */
  static showMainWindow() {
    AppController.windowController.showMainWindow();
  }

  /**
   * Hides the main window.
   */
  static hideMainWindow() {
    AppController.windowController.hideMainWindow();
  }

  /**
   * Shows the splashscreen window.
   */
  static showSplashscreenWindow() {
    AppController.windowController.showSplashscreenWindow();
  }

  /**
   * Hides the splashscreen window.
   */
  static hideSplashscreenWindow() {
    AppController.windowController.hideSplashscreenWindow();
  }

  /**
   * Shows the about window.
   */
  static showAboutWindow(): void {
    AppController.windowController.showAboutWindow();
  }

  /**
   * Hides the about window.
   */
  static hideAboutWindow(): void {
    AppController.windowController.hideAboutWindow();
  }

  /**
   * Shows the backup window.
   */
  static showBackupWindow(): void {
    AppController.windowController.showBackupWindow();
  }

  /**
   * Hides the backup window.
   */
  static hideBackupWindow(): void {
    AppController.windowController.hideBackupWindow();
  }

  /**
   * Function run on app closing/refreshing.
   */
  static onDestroy(): void {
    if (AppController.seriesEntrySub) AppController.seriesEntrySub();
    if (AppController.gameVersionSub) AppController.gameVersionSub();
    if (AppController.saveDirPathSub) AppController.saveDirPathSub();
    if (AppController.selectedTabSub) AppController.selectedTabSub();
    if (AppController.selectedProfileSub) AppController.selectedProfileSub();
  }
}
