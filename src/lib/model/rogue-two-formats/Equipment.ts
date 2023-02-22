import { AppController } from "../../controllers/AppController";
import type { Reader } from "../../utils/Reader";
import { Writer } from "../../utils/Writer";
import type { SaveFile } from "../SaveFile";
// import { EquipmentState, GearLevels, Runes, SkillType } from "./RogueTwoLUTs";

/**
 * Class representing the Equipment.rc2dat save file.
 */
export class Equipment implements SaveFile {
  // blueprints = {
  //   "sword": {},
  //   "helm": {},
  //   "chest": {},
  //   "limbs": {},
  //   "cape": {}
  // };
  
  // runes = {
  //   "sword": {},
  //   "helm": {},
  //   "chest": {},
  //   "limbs": {},
  //   "cape": {}
  // };

  // equippedArmor = {
  //   "sword": "None",
  //   "helm": "None",
  //   "chest": "None",
  //   "limbs": "None",
  //   "cape": "None"
  // };

  // equppedRunes = {
  //   "sword": "None",
  //   "helm": "None",
  //   "chest": "None",
  //   "limbs": "None",
  //   "cape": "None"
  // }

  // manorSkillLevels:{[key:string]: number};

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  /**
   * Reads the Equipment data from the provided reader.
   * @param reader The reader to use.
   */
  parseFile(reader:Reader): void {
    AppController.log("Started reading Equipment.rc2dat");

    const headerOffset = 98;

    AppController.log("Finished writing Equipment.rc2dat");
  }

  /**
   * Gets the json representation of this Rogue1BP.
   * @returns The json representation of this Rogue1BP.
   */
  asJson(): any {
    return {
      // "blueprints": this.blueprints,
      // "runes": this.runes,
      // "equippedArmor": this.equippedArmor,
      // "equippedRunes": this.equppedRunes,
      // "manorSkillLevels": this.manorSkillLevels
    };
  }

  /**
   * Gets the binary representation of this Equipment.
   * @returns The binary representation of this Equipment.
   */
  asBinary(): ArrayBuffer {
    // AppController.log("Started writing Equipment buffer.");

    // AppController.log("Finished writing Equipment buffer.");
    return null;
  }

  /**
   * Sets this Equipment based on the provided json data.
   * @param json The json data to use.
   * @returns true if there were no errors.
   */
  fromJson(json:any): boolean {
    const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function");

    for (const key of keys) {
      if (json[key]) {
        this[key] = json[key];
      } else {
        AppController.error(`Can't run Equipment.fromJson(). Missing key ${key} in json.`);
        return false;
      }
    }

    return true;
  }
}
