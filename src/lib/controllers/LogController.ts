/**
 * Rogue Legacy Save Editor is a tool for viewing and modifying game saves from Rogue Legacy 1 & 2.
 * Copyright (C) 2023 Travis Lane (Tormak)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>
 */

import { LogLevel, RustInterop } from "./RustInterop";

/**
 * Controller that handles all logging done by the app.
 */
export class LogController {
  private logPath:string;

  setFilePath(logPath:string): void {
    this.logPath = logPath;
  }

  async cleanLogFile(): Promise<void> {
    await RustInterop.cleanOutLog(this.logPath);
  }

  async log(message:string): Promise<void> {
    await RustInterop.logToFile(message, LogLevel.INFO, this.logPath);
  }

  async warn(message:string): Promise<void> {
    await RustInterop.logToFile(message, LogLevel.WARN, this.logPath);
  }

  async error(message:string): Promise<void> {
    await RustInterop.logToFile(message, LogLevel.ERROR, this.logPath);
  }
}