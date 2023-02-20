import { WebviewWindow } from '@tauri-apps/api/window';
import { showingAbout, showingBackup } from "../../Stores";

/**
 * Controller to handle the app's various window.
 */
export class WindowController {
  private mainWindow: WebviewWindow;
  private aboutWindow: WebviewWindow;
  private backupWindow: WebviewWindow;
  private splashscreenWindow: WebviewWindow;

  constructor() {
    this.mainWindow = WebviewWindow.getByLabel('main');
    this.aboutWindow = WebviewWindow.getByLabel('about');
    this.backupWindow = WebviewWindow.getByLabel('backup');
    this.splashscreenWindow = WebviewWindow.getByLabel('splashscreen');
  }

  /**
   * Shows the main window.
   */
  showMainWindow() {
    this.mainWindow.show();
  }

  /**
   * Hides the main window.
   */
  hideMainWindow() {
    this.mainWindow.hide();
  }

  /**
   * Shows the splashscreen window.
   */
  showSplashscreenWindow() {
    this.splashscreenWindow.show();
  }

  /**
   * Hides the splashscreen window.
   */
  hideSplashscreenWindow() {
    this.splashscreenWindow.hide();
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
    showingBackup.set(false);
    this.backupWindow.hide();
  }
}