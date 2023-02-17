import { WebviewWindow } from '@tauri-apps/api/window';

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
    this.aboutWindow.show();
  }

  /**
   * Hides the about window.
   */
  hideAboutWindow() {
    this.aboutWindow.hide();
  }

  /**
   * Shows the backup window.
   */
  showBackupWindow() {
    this.backupWindow.show();
  }

  /**
   * Hides the backup window.
   */
  hideBackupWindow() {
    this.backupWindow.hide();
  }
}