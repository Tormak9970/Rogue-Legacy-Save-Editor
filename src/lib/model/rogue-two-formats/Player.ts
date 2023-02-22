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

import { AppController } from "../../controllers/AppController";
import type { Reader } from "../../utils/Reader";
import { Writer } from "../../utils/Writer";
import type { SaveFile } from "../SaveFile";

/**
 * Class representing the Player.rc2dat save file.
 */
export class Rogue2Player implements SaveFile {
  

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  /**
   * Reads the Player data from the provided reader.
   * @param reader The reader to use.
   */
  parseFile(reader:Reader): void {
    AppController.log("Started reading Player.rc2dat");

    const headerOffset = 98;

    const fieldsList = [];

    reader.seek(headerOffset);

    const formatTypeLength = reader.readInt8();
    const formatType = reader.readString(formatTypeLength);
    const numFields = reader.readInt32();

    for (let i = 0; i < numFields; i++) {
      const fieldLength = reader.readInt8();
      const field = reader.readString(fieldLength);
      fieldsList.push(field);
    }

    reader.seek(1805, 0);

    // gold saved offset is 5025

    console.log(`${formatType}:`, fieldsList);
    AppController.log("Finished reading Player.rc2dat");
  }

  /**
   * Gets the json representation of this Rogue2Player.
   * @returns The json representation of this Rogue2Player.
   */
  asJson(): any {
    return {
      
    };
  }

  /**
   * Gets the binary representation of this Rogue2Player.
   * @returns The json representation of this Rogue2Player.
   */
  asBinary(): ArrayBuffer {
    // AppController.log("Started writing Player buffer.");

    // AppController.log("Finished writing Player buffer.");
    return null;
  }

  /**
   * Sets this Rogue2Player based on the provided json data.
   * @param json The json data to use.
   * @returns true if there were no errors.
   */
  fromJson(json:any): boolean {
    return false;
    // const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function" && key != "nameLength" && key != "numTypesEnemiesKilled");
    // const jKeys = Object.keys(json);

    // console.log(json);
    // for (const key of keys) {
    //   if (jKeys.includes(key)) {
    //     this[key] = json[key];
    //   } else {
    //     AppController.error(`Can't run Player.fromJson(). Missing key ${key} in json.`);
    //     return false;
    //   }
    // }

    // this.nameLength = json.name.length;
    // this.numTypesEnemiesKilled = json.typesEnemiesKilled.length;

    // return true;
  }
}
