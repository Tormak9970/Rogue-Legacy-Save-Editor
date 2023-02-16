import { fs, path } from "@tauri-apps/api";
import JSZip from "jszip";
import { get } from "svelte/store";
import { saveDirPath, selectedProfile, showLoadBackupModal } from "../../Stores";
import { ToasterController } from "./ToasterController";
import { isSaveFile } from "../utils/Utils";

type SaveData = {
  saveSlot: string;
  day: number;
  month: number;
  year: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Controls all backup functionality
 */
export class BackupsController {
  private backupDir: string;

  constructor() {
    this.setInitialBackupDir();
  }

  private async setInitialBackupDir() {
    this.backupDir = await path.join(await path.appDataDir(), "backups");
  }

  /**
   * Gets the save backup directory
   * @returns The save backup directory
   */
  getBackupDir(): string {
    return this.backupDir;
  }

  /**
   * Sets the backup directory
   * @param newDir The new backup directory
   */
  setBackupDir(newDir: string) {
    this.backupDir = newDir;
  }

  /**
   * Gets the current date and time
   * @returns The current date and type
   */
  private getBackupInfo() {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      day: day,
      month: month,
      year: year,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  /**
   * Formats the saveSlot and backupInfo in the desired way
   * @param saveSlot The slot that is being backed up
   * @param backupInfo The current time info
   * @returns The saveSlot and backupInfo formatted in the desired manner
   */
  private saveSchema(
    saveSlot: string,
    backupInfo: {
      day: number;
      month: number;
      year: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  ): string {
    const { day, month, year, hours, minutes, seconds } = backupInfo;
    return `${saveSlot}__${day}.${month}.${year}__${hours}.${minutes}.${seconds}`;
  }

  /**
   * Deconstructs the fileName into the desired data
   * @param fileName FileName to deconstruct
   * @returns The data decontructed form the fileName
   */
  deconstructSave(fileName: string): SaveData {
    const segs = fileName.substring(0, fileName.length - 3).split("__");
    const saveSlot = segs[0];
    const [day, month, year] = segs[1].split(".");
    const [hours, minutes, seconds] = segs[2].split(".");

    return {
      saveSlot: saveSlot,
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    };
  }

  /**
   * Creates a backup of the currently selected save directory
   */
  async backup() {
    const loaderId = ToasterController.showLoaderToast("Generating backup...");
    const saveDir = get(saveDirPath);
    const profile = get(selectedProfile);
    const zip = new JSZip();

    const zipName = `${this.saveSchema(profile, this.getBackupInfo())}.zip`;

    const saveConts = await fs.readDir(await path.join(saveDir, profile));

    for (let i = 0; i < saveConts.length; i++) {
      const saveFilePath = saveConts[i];

      if (isSaveFile(saveFilePath.name)) {
        const name = saveFilePath.name;
        const data = await fs.readBinaryFile(saveFilePath.path);

        zip.file(name, data);
      }
    }

    const zipData = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });
    await fs.writeBinaryFile(await path.join(this.backupDir, zipName), zipData);

    ToasterController.remLoaderToast(loaderId);

    setTimeout(() => {
      ToasterController.showSuccessToast("Backup complete!");
    }, 500);
  }

  /**
   * Displays the backup selection modal
   */
  async showBackupsModal() {
    showLoadBackupModal.set(true);
  }

  /**
   * Loads the provided backup and overwrites the current save
   * @param filePath Path of the backup to load
   */
  async loadBackup(filePath: string) {
    const loaderId = ToasterController.showLoaderToast("Restoring backup...");

    const saveDir = get(saveDirPath);
    const saveParentDir = await path.dirname(saveDir);

    const fileName = await path.basename(filePath);
    const backupData = this.deconstructSave(fileName);
    const saveSlot = backupData.saveSlot;

    const zipData = await fs.readBinaryFile(filePath);

    const zip = await JSZip.loadAsync(zipData);
    const zipFiles = Object.entries(zip.files);

    for (let i = 0; i < zipFiles.length; i++) {
      const kvp = zipFiles[i];
      const saveFileName = kvp[0];
      const saveFileData = await kvp[1].async("arraybuffer");

      const saveFilePath = await path.join(
        saveParentDir,
        saveSlot,
        saveFileName
      );
      await fs.writeBinaryFile(saveFilePath, saveFileData);
    }

    ToasterController.remLoaderToast(loaderId);

    setTimeout(() => {
      ToasterController.showSuccessToast("Backup restored!");
    }, 500);
  }
}
