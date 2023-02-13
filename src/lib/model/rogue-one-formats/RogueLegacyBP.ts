import { AppController } from "../../controllers/AppController";
import type { Reader } from "../../utils/Reader";
import type { SaveFile } from "../SaveFile";
import { EquipmentState, GearLevels, Runes } from "./RogueOneLUTs";

/**
 * Class representing the ROgueLegacyBP.rcdat save file.
 */
export class Rogue1BP implements SaveFile {
  blueprints = {
    "sword": {},
    "helm": {},
    "chest": {},
    "limbs": {},
    "cape": {}
  };
  runes = {
    "sword": {},
    "helm": {},
    "chest": {},
    "limbs": {},
    "cape": {}
  };

  // Sword, Helm, Chest, Limb, Cape
  equippedArmor:number[]; //[5]

  equppedRunes:number[]; //[5]

  manorSkillLevels:string[]; //[32]

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  /**
   * Reads the BP data from the provided reader.
   * @param reader The reader to use.
   */
  parseFile(reader:Reader): void {
    AppController.log("Started reading RogueLegacyBP.rcdat");
    
    for (let i = 0; i < 15; i++) this.blueprints.sword[GearLevels[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 15; i++) this.blueprints.helm[GearLevels[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 15; i++) this.blueprints.chest[GearLevels[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 15; i++) this.blueprints.limbs[GearLevels[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 15; i++) this.blueprints.cape[GearLevels[i]] = EquipmentState[reader.readInt8()];

    for (let i = 0; i < 11; i++) this.runes.sword[Runes[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 11; i++) this.runes.helm[Runes[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 11; i++) this.runes.chest[Runes[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 11; i++) this.runes.limbs[Runes[i]] = EquipmentState[reader.readInt8()];
    for (let i = 0; i < 11; i++) this.runes.cape[Runes[i]] = EquipmentState[reader.readInt8()];

    console.log(this.asJson());
    // AppController.log("Finished writing RogueLegacyBP.rcdat");
  }

  /**
   * Gets the json representation of this Rogue1BP.
   * @returns The json representation of this Rogue1BP.
   */
  asJson(): any {
    return {
      "blueprints": this.blueprints,
      "runes": this.runes,
      "equippedArmor": this.equippedArmor,
      "equippedRunes": this.equppedRunes,
      "manorSkillLevels": this.manorSkillLevels
    };
  }

  /**
   * Gets the binary representation of this Rogue1BP.
   * @returns The binary representation of this Rogue1BP.
   */
  asBinary(): ArrayBuffer {
    // AppController.log("Started writing RogueLegacyBP buffer.");
    // AppController.log("Finished writing RogueLegacyBP buffer.");
    return null;
  }

  /**
   * Sets this Rogue1BP based on the provided json data.
   * @param json The json data to use.
   */
  fromJson(json:any) {
    const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function");

    for (const key of keys) {
      if (json[key]) {
        this[key] = json[key];
      } else {
        AppController.log(`Can't run BP.fromJson(). Missing key ${key} in json.`);
        break;
      }
    }
  }
}
