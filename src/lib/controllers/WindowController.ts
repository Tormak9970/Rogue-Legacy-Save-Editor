import { WebviewWindow } from '@tauri-apps/api/window';
import { showingAbout, showingBackup } from "../../Stores";

/**
 * Controller to handle the app's various window.
 */
export class WindowController {
  private mainWindow: WebviewWindow;
  private aboutWindow: WebviewWindow;
  private backupWindow: WebviewWindow;

  constructor() {
    this.mainWindow = WebviewWindow.getByLabel('main');
    this.aboutWindow = WebviewWindow.getByLabel('about');
    this.backupWindow = WebviewWindow.getByLabel('backup');
  }

  /**
   * Shows the about window.
   */
  showAboutWindow() {
    showingAbout.set(true);
    this.aboutWindow.show();
  }

  /**
   * Hides the about window.
   */
  hideAboutWindow() {
    console.log("hiding about window");
    showingAbout.set(false);
    this.aboutWindow.hide();
  }

  /**
   * Shows the backup window.
   */
  showBackupWindow() {
    showingBackup.set(true);
    this.backupWindow.show();
  }

  /**
   * Hides the backup window.
   */
  hideBackupWindow() {
    console.log("hiding backup window");
    showingBackup.set(false);
    this.backupWindow.hide();
  }
}