import { fs, path } from "@tauri-apps/api";
import { get, type Unsubscriber } from "svelte/store";
import {
  appDataDir,
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
} from "../../Stores";
import { Reader } from "../utils/Reader";
import { BackupsController } from "./BackupsController";
import { ToasterController } from "./ToasterController";
import { isSaveFile } from "../utils/Utils";
import { Rogue1Save } from "../model/Rogue1Save";
import { SettingsManager } from "../utils/SettingsManager";
import { SeriesVersion } from "../model/SeriesVersion";

/**
 * The main controller for the application
 */
export class AppController {
  static backupsController = new BackupsController();

  private static seriesEntrySub:Unsubscriber;
  private static gameVersionSub:Unsubscriber;
  private static saveDirPathSub:Unsubscriber;
  private static selectedTabSub:Unsubscriber;

  static async setup(): Promise<void> {
    await SettingsManager.setSettingsPath();
    let settings:AppSettings = await SettingsManager.getSettings();

    appDataDir.set(settings.appDataDir == "" ? (await path.appConfigDir()) : settings.appDataDir);
    seriesEntry.set(settings.seriesEntry);
    saveDirPath.set(settings.seriesEntry === SeriesVersion.ROGUE_LEGACY_ONE ? settings.legacy1SaveDir : settings.legacy2SaveDir);
    gameVersion.set(settings.seriesEntry === SeriesVersion.ROGUE_LEGACY_ONE ? settings.legacy1Version : settings.legacy2Version);

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
            prop: get(seriesEntry) === SeriesVersion.ROGUE_LEGACY_ONE ? "legacy1Version": "legacy2Version",
            data: newVal
        });
      });
    }

    if (!AppController.saveDirPathSub) {
      AppController.saveDirPathSub = saveDirPath.subscribe(async (newVal:string) => {
        await SettingsManager.updateSettings({
            prop: get(seriesEntry) === SeriesVersion.ROGUE_LEGACY_ONE ? "legacy1SaveDir": "legacy2SaveDir",
            data: newVal
        });
      });
    }

    if (!AppController.selectedTabSub) {
      AppController.selectedTabSub = selectedTab.subscribe(async (newVal:string) => {
        await SettingsManager.updateSettings({
            prop: "selectedTab",
            data: newVal
        });
      });
    }
  }

  /**
   * Sets up the app
   */
  static async init(): Promise<void> {
    const appDir = get(appDataDir);
    const backupPath = await path.join(appDir, "backups");

    if (!(await fs.exists(backupPath))) await fs.createDir(backupPath);
    this.backupsController.setBackupDir(backupPath);
  }

  static switchGameVersion(): void {

  }

  /**
   * Loads the user's save files
   */
  static async loadSaves(): Promise<void> {
    const saveDir = get(saveDirPath);

    // const newTabs = {};
    // const newSaveFiles = {};
    // const wasChanged = {};
    // if (saveDir != "") {
    //   const loaderId = ToasterController.showLoaderToast("Loading save data");
    //   const saveConts = await fs.readDir(saveDir);

    //   for (let i = 0; i < saveConts.length; i++) {
    //     const saveFilePath = saveConts[i];

    //     if (isSaveFile(saveFilePath.name)) {
    //       const data = await fs.readBinaryFile(saveFilePath.path);
    //       const reader = new Reader(data);
    //       const save = new Rogue1Save(reader); //! need to make this alternate between 1 and 2

    //       newTabs[saveFilePath.name] = save.asJson();
    //       newSaveFiles[saveFilePath.name] = save;
    //       wasChanged[saveFilePath.name] = false;
    //     }
    //   }
    //   ToasterController.remLoaderToast(loaderId);

    //   setTimeout(() => {
    //     ToasterController.showSuccessToast("Saves loaded!");
    //   }, 500);
    // }

    // unchangedTabs.set(JSON.parse(JSON.stringify(newTabs)));
    // changedTabs.set(wasChanged);
    // tabs.set(newTabs);
    // saveFiles.set(newSaveFiles);

    // discardChangesDisabled.set(true);
    // saveChangesDisabled.set(true);
  }

  /**
   * Backs up the user's saves
   */
  static async backup(): Promise<void> {
    await AppController.backupsController.backup();
  }

  /**
   * Load up the existing backups
   */
  static async loadBackups(): Promise<void> {

  }

  /**
   * Saves the current changes
   */
  static async saveChanges(): Promise<void> {

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

  static onDestroy(): void {
    if (AppController.seriesEntrySub) AppController.seriesEntrySub();
    if (AppController.gameVersionSub) AppController.gameVersionSub();
    if (AppController.saveDirPathSub) AppController.saveDirPathSub();
    if (AppController.selectedTabSub) AppController.selectedTabSub();
  }
}
