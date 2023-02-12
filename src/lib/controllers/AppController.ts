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
import { SettingsManager } from "../utils/SettingsManager";
import { SeriesEntry } from "../model/SeriesEntry";
import { LogController } from "./LogController";
import type { SaveFile } from "../model/SaveFile";
import { RogueOneSaveFileNames } from "../model/SaveFileNames";
import { Rogue1Player } from "../model/rogue-one-formats/RogueLegacyPlayer";
import { Rogue1BP } from "../model/rogue-one-formats/RogueLegacyBP";
import { Rogue1Lineage } from "../model/rogue-one-formats/RogueLegacyLineage";
import { Rogue1Map } from "../model/rogue-one-formats/RogueLegacyMap";
import { Rogue1MapDat } from "../model/rogue-one-formats/RogueLegacyMapDat";

/**
 * The main controller for the application
 */
export class AppController {
  private static logFilePath = "";
  static logController = new LogController();
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
    saveDirPath.set(settings.seriesEntry === SeriesEntry.ROGUE_LEGACY_ONE ? settings.legacy1SaveDir : settings.legacy2SaveDir);
    gameVersion.set(settings.seriesEntry === SeriesEntry.ROGUE_LEGACY_ONE ? settings.legacy1Version : settings.legacy2Version);

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
        await SettingsManager.updateSettings({
            prop: get(seriesEntry) === SeriesEntry.ROGUE_LEGACY_ONE ? "legacy1SaveDir": "legacy2SaveDir",
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
    const logDir = await path.join(await path.appDataDir(), "logs");

    AppController.logFilePath = await path.join(logDir, "rogue-legacy-editor.log");
    AppController.logController.setFilePath(AppController.logFilePath);
    await AppController.logController.cleanLogFile();

    const appDir = get(appDataDir);
    const backupPath = await path.join(appDir, "backups");

    if (!(await fs.exists(backupPath))) await fs.createDir(backupPath);
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
    const saveDir = get(saveDirPath);

    const newTabs = {};
    const newSaveFiles = {};
    const wasChanged = {};
    if (saveDir != "") {
      const loaderId = ToasterController.showLoaderToast("Loading save data");
      const saveConts = await fs.readDir(saveDir);

      if (get(seriesEntry) == SeriesEntry.ROGUE_LEGACY_ONE) {
        for (let i = 0; i < saveConts.length; i++) {
          const saveFilePath = saveConts[i];
  
          if (isSaveFile(saveFilePath.name)) {
            const data = await fs.readBinaryFile(saveFilePath.path);
            const reader = new Reader(data);
            let save: SaveFile; //! need to make this alternate between 1 and 2

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
              case RogueOneSaveFileNames.MAP:
                save = new Rogue1Map(reader);
                break;
              case RogueOneSaveFileNames.MAP_DAT:
                save = new Rogue1MapDat(reader);
                break;
            }
  
            newTabs[saveFilePath.name] = save.asJson();
            newSaveFiles[saveFilePath.name] = save;
            wasChanged[saveFilePath.name] = false;
          }
        }
      } else {

      }

      ToasterController.remLoaderToast(loaderId);

      setTimeout(() => {
        ToasterController.showSuccessToast("Saves loaded!");
      }, 500);
    }

    unchangedTabs.set(JSON.parse(JSON.stringify(newTabs)));
    changedTabs.set(wasChanged);
    tabs.set(newTabs);
    saveFiles.set(newSaveFiles);

    discardChangesDisabled.set(true);
    saveChangesDisabled.set(true);
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
    await AppController.backupsController.showBackupsModal();
  }

  /**
   * Saves the current changes
   */
  static async saveChanges(): Promise<void> {
    // const revision = Object.values(get(dsonFiles))[0].header.revision;
    // const changes = Object.entries(get(tabs));
    // const cTabs = get(changedTabs);

    // // TODO only write files with changes
    // for (let i = 0; i < changes.length; i++) {
    //   const fileName = changes[i][0];

    //   if (cTabs[fileName]) {
    //     const filePath = await path.join(get(saveDirPath), fileName);
    //     const newData = changes[i][1];

    //     const dWriter = new DsonWriter(newData as any, revision);
    //     const dataBuf = dWriter.bytes();

    //     await fs.writeBinaryFile(filePath, dataBuf);
    //   }
    // }

    // discardChangesDisabled.set(true);
    // saveChangesDisabled.set(true);
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
   * Function run on app closing/refreshing.
   */
  static onDestroy(): void {
    if (AppController.seriesEntrySub) AppController.seriesEntrySub();
    if (AppController.gameVersionSub) AppController.gameVersionSub();
    if (AppController.saveDirPathSub) AppController.saveDirPathSub();
    if (AppController.selectedTabSub) AppController.selectedTabSub();
  }
}
