import { WebviewWindow } from '@tauri-apps/api/window';

export class WindowController {
  private mainWindow;
  private aboutWindow;
  private backupWindow;

  constructor() {
    // set windows here
    const mainWindow = WebviewWindow.getByLabel('main')
  }

  showAboutWindow() {

  }

  hideAboutWindow() {

  }

  showBackupWindow() {

  }

  hideBackupWindow() {

  }
}