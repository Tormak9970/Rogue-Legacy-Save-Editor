import { fs, path } from "@tauri-apps/api";

/**
 * A class for managing application settings
 */
export class SettingsManager {
  static settingsPath = "";

  /**
   * Sets `settingsPath` and copies default settings if necessary
   */
  static async setSettingsPath() {
    const appDir = await path.appConfigDir();
    // @ts-ignore
    if (!(await fs.exists(appDir))) {
      await fs.createDir(appDir);
    }
    const setsPath = await path.join(await path.appConfigDir(), "settings.json");
    // @ts-ignore
    if (!(await fs.exists(setsPath))) {
      await fs.readTextFile(setsPath).then(
        () => {},
        async () => {
          await fs.copyFile(
            await path.resolveResource("../settings.json"),
            setsPath
          );
        }
      );
    }
    SettingsManager.settingsPath = setsPath;
  }

  /**
   * Updates a field settings JSON with the provided data
   * @param data Specifies the field to set and the data to set it to
   */
  static async updateSettings(data: { prop: string; data: any }) {
    const settingsData = await fs.readTextFile(SettingsManager.settingsPath);

    const settings = JSON.parse(settingsData);
    settings[data.prop] = data.data;

    await fs.writeFile({
      path: SettingsManager.settingsPath,
      contents: JSON.stringify(settings),
    });
  }
}
