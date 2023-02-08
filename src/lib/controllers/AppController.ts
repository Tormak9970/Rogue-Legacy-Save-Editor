import { fs, path } from "@tauri-apps/api";
import { get } from "svelte/store";
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
} from "../../Stores";
import { Reader } from "../utils/Reader";
import { BackupsController } from "./BackupsController";
import { ToasterController } from "./ToasterController";
import { isSaveFile } from "../utils/Utils";
import { Rogue1Save } from "../model/Rogue1Save";

/**
 * The main controller for the application
 */
export class AppController {
  static backupsController = new BackupsController();

  /**
   * Sets up the app
   */
  static async init() {
    const appDir = get(appDataDir);
    const backupPath = await path.join(appDir, "backups");
    
    if (!(await fs.exists(backupPath))) await fs.createDir(backupPath);
    this.backupsController.setBackupDir(backupPath);
  }

  /**
   * Loads the user's save files
   */
  static async loadSaves() {
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
  static async backup() {
    await AppController.backupsController.backup();
  }

  /**
   * Load up the existing backups
   */
  static async loadBackups() {
    
  }

  /**
   * Saves the current changes
   */
  static async saveChanges() {
    
  }

  /**
   * Discards the current changes
   */
  static async discardChanges() {
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
  static async reload() {
    await AppController.loadSaves();
  }
}
