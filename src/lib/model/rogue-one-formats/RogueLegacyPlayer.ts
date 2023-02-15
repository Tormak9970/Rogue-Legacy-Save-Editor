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
import { ClassType, SpecialItem, SpellType, Traits } from "./RogueOneLUTs";

/**
 * Class representing the RogueLegacyPlayer.rcdat save file.
 */
export class Rogue1Player implements SaveFile {
  gold:number;
  currentHealth:number;
  currentMana:number;
  age:number;
  childAge:number;

  spell:string; //SpellType
  classType:string; //ClassType
  specialItem:string; //SpecialItem
  trait:[string, string]; //Trait

  private nameLength:number;
  name:string;

  headPiece:number; //head model?
  shoulderPiece:number; //cape model?
  chestPiece:number; //chest model?
  diaryEntry:number;

  bonusHealth:number;
  bonusStrength:number;
  bonusManapeak:number;
  bonusDefense:number;
  bonusWeight:number;
  bonusMagic:number;

  lichHealth:number;
  lichMana:number;
  lichHealthMod:number;

  newBossBeaten:boolean;
  eyeballBossBeaten:boolean;
  fairyBossBeaten:boolean;
  fireballBossBeaten:boolean;
  blobBossBeaten:boolean;
  lastBossBeaten:boolean;

  timesCastleBeaten:number;
  numEnemiesBeaten:number;

  tutorialComplete:boolean;
  characterFound:boolean;
  loadStartingRoom:boolean;
  lockCastle:boolean;

  spokeToBlacksmith:boolean;
  spokeToEnchantress:boolean;
  spokeToArchitect:boolean;
  spokeToCollector:boolean;

  isDead:boolean;
  finalDoorOpened:boolean;
  rerolledChildren:boolean;
  isFemale:boolean;

  timesDead:number;

  hasArchitectFree:boolean;
  readLastDiary:boolean;
  spokenToLastBoss:boolean;
  hardcoreMode:boolean;

  totalHoursPlayed:number;

  wizardSpellList:[number, number, number];

  // 4 difficulties, 34 different kinds of mobs
  enemiesBeaten: number[][]; // [4][34]
  numTypesEnemiesKilled:number;

  typesEnemiesKilled:{mobId:number, count:number}[]; //[numTypesEnemiesKilled][2]

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  /**
   * Reads the Player data from the provided reader.
   * @param reader The reader to use.
   */
  parseFile(reader:Reader): void {
    AppController.log("Started reading RogueLegacyPlayer.rcdat");

    this.gold = reader.readInt32();
    this.currentHealth = reader.readInt32();
    this.currentMana = reader.readInt32(); //12

    this.age = reader.readUint8();
    this.childAge = reader.readInt8();
    this.spell = SpellType[reader.readInt8().toString()];
    this.classType = ClassType[reader.readInt8().toString()];
    this.specialItem = SpecialItem[reader.readInt8().toString()];
    this.trait = [ Traits[reader.readInt8().toString()], Traits[reader.readInt8().toString()] ]; //19

    this.nameLength = reader.readInt8();
    this.name = reader.readString(this.nameLength);

    this.headPiece = reader.readInt8(); //1
    this.shoulderPiece = reader.readInt8();
    this.chestPiece = reader.readInt8();
    this.diaryEntry = reader.readInt8(); //4

    this.bonusHealth = reader.readInt32();
    this.bonusStrength = reader.readInt32();
    this.bonusManapeak = reader.readInt32();
    this.bonusDefense = reader.readInt32();
    this.bonusWeight = reader.readInt32();
    this.bonusMagic = reader.readInt32(); //28

    this.lichHealth = reader.readInt32();
    this.lichMana = reader.readInt32();
    this.lichHealthMod = reader.readFloat32(); //36

    this.newBossBeaten = reader.readInt8() == 1;
    this.eyeballBossBeaten = reader.readInt8() == 1;
    this.fairyBossBeaten = reader.readInt8() == 1;
    this.fireballBossBeaten = reader.readInt8() == 1;
    this.blobBossBeaten = reader.readInt8() == 1;
    this.lastBossBeaten = reader.readInt8() == 1; //42

    this.timesCastleBeaten = reader.readInt32();
    this.numEnemiesBeaten = reader.readInt32(); //50

    this.tutorialComplete = reader.readInt8() == 1;
    this.characterFound = reader.readInt8() == 1;
    this.loadStartingRoom = reader.readInt8() == 1;
    this.lockCastle = reader.readInt8() == 1;
    this.spokeToBlacksmith = reader.readInt8() == 1;
    this.spokeToEnchantress = reader.readInt8() == 1;
    this.spokeToArchitect = reader.readInt8() == 1;
    this.spokeToCollector = reader.readInt8() == 1;
    this.isDead = reader.readInt8() == 1;
    this.finalDoorOpened = reader.readInt8() == 1;
    this.rerolledChildren = reader.readInt8() == 1;
    this.isFemale = reader.readInt8() == 1; //62

    this.timesDead = reader.readInt32();

    this.hasArchitectFree = reader.readInt8() == 1;
    this.readLastDiary = reader.readInt8() == 1;
    this.spokenToLastBoss = reader.readInt8() == 1;
    this.hardcoreMode = reader.readInt8() == 1; //70

    this.totalHoursPlayed = reader.readFloat32();

    this.wizardSpellList = [
      reader.readInt8(),
      reader.readInt8(),
      reader.readInt8()
    ]; //77

    this.enemiesBeaten = [];
    for (let i = 0; i < 4; i++) {
      const enemyInfo = [];

      for (let j = 0; j < 34; j++) {
        enemyInfo.push(reader.readInt8());
      }

      this.enemiesBeaten.push(enemyInfo);
    }

    this.numTypesEnemiesKilled = reader.readInt32();

    this.typesEnemiesKilled = [];
    for (let i = 0; i < this.numTypesEnemiesKilled; i++) {
      this.typesEnemiesKilled.push({
        "mobId": reader.readInt32(),
        "count": reader.readInt32()
      });
    }

    AppController.log("Finished reading RogueLegacyPlayer.rcdat");
  }

  /**
   * Gets the json representation of this Rogue1Player.
   * @returns The json representation of this Rogue1Player.
   */
  asJson(): any {
    return {
      "gold": this.gold,
      "currentHealth": this.currentHealth,
      "currentMana": this.currentMana,

      "age": this.age,
      "childAge": this.childAge,
      "spell": this.spell,
      "classType": this.classType,
      "specialItem": this.specialItem,
      "trait": this.trait,

      "name": this.name,

      "headPiece": this.headPiece,
      "shoulderPiece": this.shoulderPiece,
      "chestPiece": this.chestPiece,
      "diaryEntry": this.diaryEntry,

      "bonusHealth": this.bonusHealth,
      "bonusStrength": this.bonusStrength,
      "bonusManapeak": this.bonusManapeak,
      "bonusDefense": this.bonusDefense,
      "bonusWeight": this.bonusWeight,
      "bonusMagic": this.bonusMagic,

      "lichHealth": this.lichHealth,
      "lichMana": this.lichMana,
      "lichHealthMod": this.lichHealthMod,

      "newBossBeaten": this.newBossBeaten,
      "eyeballBossBeaten": this.eyeballBossBeaten,
      "fairyBossBeaten": this.fairyBossBeaten,
      "fireballBossBeaten": this.fireballBossBeaten,
      "blobBossBeaten": this.blobBossBeaten,
      "lastBossBeaten": this.lastBossBeaten,

      "timesCastleBeaten": this.timesCastleBeaten,
      "numEnemiesBeaten": this.numEnemiesBeaten,

      "tutorialComplete": this.tutorialComplete,
      "characterFound": this.characterFound,
      "loadStartingRoom": this.loadStartingRoom,
      "lockCastle": this.lockCastle,
      "spokeToBlacksmith": this.spokeToBlacksmith,
      "spokeToEnchantress": this.spokeToEnchantress,
      "spokeToArchitect": this.spokeToArchitect,
      "spokeToCollector": this.spokeToCollector,
      "isDead": this.isDead,
      "finalDoorOpened": this.finalDoorOpened,
      "rerolledChildren": this.rerolledChildren,
      "isFemale": this.isFemale,

      "timesDead": this.timesDead,

      "hasArchitectFree": this.hasArchitectFree,
      "readLastDiary": this.readLastDiary,
      "spokenToLastBoss": this.spokenToLastBoss,
      "hardcoreMode": this.hardcoreMode,

      "totalHoursPlayed": this.totalHoursPlayed,

      "wizardSpellList": this.wizardSpellList,

      "enemiesBeaten": this.enemiesBeaten,

      "typesEnemiesKilled": this.typesEnemiesKilled
    };
  }

  /**
   * Gets the binary representation of this Rogue1Player.
   * @returns The json representation of this Rogue1Player.
   */
  asBinary(): ArrayBuffer {
    AppController.log("Started writing RogueLegacyPlayer buffer.");

    const playerInfoLength = 20 + this.name.length + 78 + 3;
    const enemiesBeatenLength = 4 * 34;
    const numTypesEnemiesLength = 4;
    const typesEnemiesKilledLength = this.numTypesEnemiesKilled * 8;
    
    const spellTypeReverseLUT = Object.fromEntries(Object.entries(SpellType).map(a => a.reverse()));
    const classTypeReverseLUT = Object.fromEntries(Object.entries(ClassType).map(a => a.reverse()));
    const specialItemReverseLUT = Object.fromEntries(Object.entries(SpecialItem).map(a => a.reverse()));
    const traitsReverseLUT = Object.fromEntries(Object.entries(Traits).map(a => a.reverse()));

    const writer = new Writer(new Uint8Array(playerInfoLength + enemiesBeatenLength + numTypesEnemiesLength + typesEnemiesKilledLength));

    writer.writeInt32(this.gold);
    writer.writeInt32(this.currentHealth);
    writer.writeInt32(this.currentMana);

    writer.writeInt8(this.age);
    writer.writeInt8(this.childAge);
    writer.writeInt8(parseInt(spellTypeReverseLUT[this.spell]));
    writer.writeInt8(parseInt(classTypeReverseLUT[this.classType]));
    writer.writeInt8(parseInt(specialItemReverseLUT[this.specialItem]));

    writer.writeInt8(parseInt(traitsReverseLUT[this.trait[0]]));
    writer.writeInt8(parseInt(traitsReverseLUT[this.trait[1]]));

    writer.writeInt8(this.name.length);
    writer.writeString(this.name);

    writer.writeInt8(this.headPiece);
    writer.writeInt8(this.shoulderPiece);
    writer.writeInt8(this.chestPiece);
    writer.writeInt8(this.diaryEntry);

    writer.writeInt32(this.bonusHealth);
    writer.writeInt32(this.bonusStrength);
    writer.writeInt32(this.bonusManapeak);
    writer.writeInt32(this.bonusDefense);
    writer.writeInt32(this.bonusWeight);
    writer.writeInt32(this.bonusMagic);
    
    writer.writeInt32(this.lichHealth);
    writer.writeInt32(this.lichMana);
    writer.writeInt32(this.lichHealthMod);
    
    writer.writeInt8(this.newBossBeaten ? 1 : 0);
    writer.writeInt8(this.eyeballBossBeaten ? 1 : 0);
    writer.writeInt8(this.fairyBossBeaten ? 1 : 0);
    writer.writeInt8(this.fireballBossBeaten ? 1 : 0);
    writer.writeInt8(this.blobBossBeaten ? 1 : 0);
    writer.writeInt8(this.lastBossBeaten ? 1 : 0);
    
    writer.writeInt32(this.timesCastleBeaten);
    writer.writeInt32(this.numEnemiesBeaten);
    
    writer.writeInt8(this.tutorialComplete ? 1 : 0);
    writer.writeInt8(this.characterFound ? 1 : 0);
    writer.writeInt8(this.loadStartingRoom ? 1 : 0);
    writer.writeInt8(this.lockCastle ? 1 : 0);
    writer.writeInt8(this.spokeToBlacksmith ? 1 : 0);
    writer.writeInt8(this.spokeToEnchantress ? 1 : 0);
    writer.writeInt8(this.spokeToArchitect ? 1 : 0);
    writer.writeInt8(this.spokeToCollector ? 1 : 0);
    writer.writeInt8(this.isDead ? 1 : 0);
    writer.writeInt8(this.finalDoorOpened ? 1 : 0);
    writer.writeInt8(this.rerolledChildren ? 1 : 0);
    writer.writeInt8(this.isFemale ? 1 : 0);
    
    writer.writeInt8(this.hasArchitectFree ? 1 : 0);
    writer.writeInt8(this.readLastDiary ? 1 : 0);
    writer.writeInt8(this.spokenToLastBoss ? 1 : 0);
    writer.writeInt8(this.hardcoreMode ? 1 : 0);
    
    writer.writeInt32(this.totalHoursPlayed);
    
    writer.writeInt8(this.wizardSpellList[0]);
    writer.writeInt8(this.wizardSpellList[1]);
    writer.writeInt8(this.wizardSpellList[2]);

    for (let i = 0; i < 4; i++) {
      const enemyInfo = this.enemiesBeaten[i];

      for (let j = 0; j < 34; j++) {
        writer.writeInt8(enemyInfo[j]);
      }
    }
    
    writer.writeInt32(this.numTypesEnemiesKilled);

    for (let i = 0; i < this.numTypesEnemiesKilled; i++) {
      const enemyType = this.typesEnemiesKilled[i];

      writer.writeInt32(enemyType.mobId);
      writer.writeInt32(enemyType.count);
    }

    AppController.log("Finished writing RogueLegacyPlayer buffer.");
    return writer.data;
  }

  /**
   * Sets this Rogue1Player based on the provided json data.
   * @param json The json data to use.
   * @returns true if there were no errors.
   */
  fromJson(json:any): boolean {
    const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function" && key != "nameLength" && key != "numTypesEnemiesKilled");
    const jKeys = Object.keys(json);

    console.log(json);
    for (const key of keys) {
      if (jKeys.includes(key)) {
        this[key] = json[key];
      } else {
        AppController.error(`Can't run Payer.fromJson(). Missing key ${key} in json.`);
        return false;
      }
    }

    this.nameLength = json.name.length;
    this.numTypesEnemiesKilled = json.typesEnemiesKilled.length;

    return true;
  }
}
