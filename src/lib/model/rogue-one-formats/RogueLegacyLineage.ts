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
import { ClassType, SpellType, Traits } from "./RogueOneLUTs";

/**
 * Class representing the RogueLegacyLineage.rcdat save file.
 */
export class Rogue1Lineage implements SaveFile {
  numCurrentBranch:number;
  branch:Rogue1PlayerLineageData[]; //[numCurrentBranch]

  numLineage:number;
  lineage:Rogue1FamilyTreeNode[]; //[numLineage]

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  /**
   * Reads the Lineage data from the provided reader.
   * @param reader The reader to use.
   */
  parseFile(reader:Reader): void {
    AppController.log("Started reading RogueLegacyLineage.rcdat");

    this.numCurrentBranch = reader.readInt32();
    this.branch = [];
    for (let i = 0; i < this.numCurrentBranch; i++) {
      const nameLength = reader.readInt8();
      const name = reader.readString(nameLength);
      const spell = SpellType[reader.readInt8()];
      const classType = ClassType[reader.readInt8()];
      const headPiece = reader.readInt8();
      const chestPiece = reader.readInt8();
      const shoulderPiece = reader.readInt8();
      const age = reader.readInt8();
      const childAge = reader.readInt8();

      const traitA = reader.readInt8();
      const traitB = reader.readInt8();
      const trait:[string, string] = [
        Traits[traitA],
        Traits[traitB]
      ];

      const isFemale = reader.readInt8() == 1;

      const generationLength = reader.readInt8();
      let generationText = "";
      if (generationLength != 0) generationText = reader.readString(generationLength);

      this.branch.push(new Rogue1PlayerLineageData(name, spell, classType, headPiece, chestPiece, shoulderPiece, age, childAge, trait, isFemale, generationText));
    }
    
    this.numLineage = reader.readInt32();
    this.lineage = [];
    for (let i = 0; i < this.numLineage; i++) {
      const nameLength = reader.readInt8();
      const name = reader.readString(nameLength);
      const age = reader.readInt8();
      const classType = ClassType[reader.readInt8()];
      const headPiece = reader.readInt8();
      const chestPiece = reader.readInt8();
      const shoulderPiece = reader.readInt8();
      const numEnemiesBeaten = reader.readInt32();
      const beatenABoss = reader.readInt8() == 1;

      const traitA = reader.readInt8();
      const traitB = reader.readInt8();
      const trait:[string, string] = [
        Traits[traitA],
        Traits[traitB]
      ];
      const isFemale = reader.readInt8() == 1;
      
      const generationLength = reader.readInt8();
      let generationText = "";
      if (generationLength != 0) generationText = reader.readString(generationLength);

      this.lineage.push(new Rogue1FamilyTreeNode(name, age, classType, headPiece, chestPiece, shoulderPiece, numEnemiesBeaten, beatenABoss, trait, isFemale, generationText));
    }

    AppController.log("Finished reading RogueLegacyLineage.rcdat");
  }

  /**
   * Gets the json representation of this Rogue1Lineage.
   * @returns The json representation of this Rogue1Lineage.
   */
  asJson(): any {
    return {
      "branch": this.branch,
      "lineage": this.lineage
    };
  }

  /**
   * Gets the binary representation of this Rogue1Lineage.
   * @returns The binary representation of this Rogue1Lineage.
   */
  asBinary(): ArrayBuffer {
    AppController.log("Started writing RogueLegacyLineage buffer.");

    const numCurBranchLength = 4;
    let branchListLength = 0;
    for (let i = 0; i < this.numCurrentBranch; i++) {
      const iBranch = this.branch[i];
      branchListLength += 1 + iBranch.name.length + 11;
      if (iBranch.generationText.length > 0) branchListLength += iBranch.generationText.length;
    }
    const numLineageLength = 4;
    let lineageListLength = 0;
    for (let i = 0; i < this.numLineage; i++) {
      const iLineage = this.lineage[i];
      lineageListLength += 1 + iLineage.name.length + 14;
      if (iLineage.generationText.length > 0) lineageListLength += iLineage.generationText.length;
    }

    const traitsReverseLUT = Object.fromEntries(Object.entries(Traits).map(a => a.reverse()));
    const spellTypeReverseLUT = Object.fromEntries(Object.entries(SpellType).map(a => a.reverse()));
    const classTypeReverseLUT = Object.fromEntries(Object.entries(ClassType).map(a => a.reverse()));

    const writer = new Writer(new Uint8Array(numCurBranchLength + branchListLength + numLineageLength + lineageListLength));


    writer.writeInt32(this.numCurrentBranch);
    for (let i = 0; i < this.numCurrentBranch; i++) {
      const iBranch = this.branch[i];

      writer.writeLenPrefixString(iBranch.name);
      writer.writeInt8(parseInt(spellTypeReverseLUT[iBranch.spell]));
      writer.writeInt8(parseInt(classTypeReverseLUT[iBranch.classType]));
      writer.writeInt8(iBranch.headPiece);
      writer.writeInt8(iBranch.chestPiece);
      writer.writeInt8(iBranch.shoulderPiece);
      
      writer.writeInt8(iBranch.age);
      writer.writeInt8(iBranch.childAge);
      
      writer.writeInt8(parseInt(traitsReverseLUT[iBranch.trait[0]]));
      writer.writeInt8(parseInt(traitsReverseLUT[iBranch.trait[1]]));

      writer.writeInt8(iBranch.isFemale);
      
      if (iBranch.generationText.length > 0) {
        writer.writeLenPrefixString(iBranch.generationText);
      } else {
        writer.writeInt8(0);
      }
    }
    
    writer.writeInt32(this.numLineage);
    for (let i = 0; i < this.numLineage; i++) {
      const iLineage = this.lineage[i];

      writer.writeLenPrefixString(iLineage.name);
      writer.writeInt8(iLineage.age);
      writer.writeInt8(parseInt(classTypeReverseLUT[iLineage.classType]));
      writer.writeInt8(iLineage.headPiece);
      writer.writeInt8(iLineage.chestPiece);
      writer.writeInt8(iLineage.shoulderPiece);
      
      writer.writeInt32(iLineage.numEnemiesBeaten);
      writer.writeInt8(iLineage.beatenABoss ? 1 : 0);
      
      writer.writeInt8(parseInt(traitsReverseLUT[iLineage.trait[0]]));
      writer.writeInt8(parseInt(traitsReverseLUT[iLineage.trait[1]]));

      writer.writeInt8(iLineage.isFemale);
      
      if (iLineage.generationText.length > 0) {
        writer.writeLenPrefixString(iLineage.generationText);
      } else {
        writer.writeInt8(0);
      }
    }

    AppController.log("Finished writing RogueLegacyLineage buffer.");
    return writer.data;
  }

  /**
   * Sets this Rogue1Lineage based on the provided json data.
   * @param json The json data to use.
   * @returns true if there were no errors.
   */
  fromJson(json:any): boolean {
    const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function" && key != "numCurrentBranch" && key != "numLineage");

    for (const key of keys) {
      if (json[key]) {
        if (key == "branch") {
          console.log(json[key]);
          this[key] = json[key].map((entry:any) => {
            console.log(entry);
            return Rogue1PlayerLineageData.fromJson(entry);
          });
          console.log(this[key]);
        } else if (key == "lineage") {
          this[key] = json[key].map((entry:any) => {
            return Rogue1FamilyTreeNode.fromJson(entry);
          });
        } else {
          this[key] = json[key];
        }
      } else {
        AppController.error(`Can't run Lineage.fromJson(). Missing key ${key} in json.`);
        return false;
      }
    }

    this.numCurrentBranch = this.branch.length;
    this.numLineage = this.lineage.length;

    console.log(this);

    return true;
  }
}

/**
 * Class representing an entry in a lineage.
 */
export class Rogue1PlayerLineageData {
  name:string;
  spell:string;
  classType:string;
  headPiece:number;
  chestPiece:number;
  shoulderPiece:number;
  age:number;
  childAge:number;
  trait:[string, string];
  isFemale:boolean;
  generationText:string

  constructor(name:string, spell:string, classType:string, headPiece:number, chestPiece:number, shoulderPiece:number, age:number, childAge:number, trait:[string, string], isFemale:boolean, generationText:string) {
    this.name = name;
    this.spell = spell;
    this.classType = classType;
    this.headPiece = headPiece;
    this.chestPiece = chestPiece;
    this.shoulderPiece = shoulderPiece;
    this.age = age;
    this.childAge = childAge;
    this.trait = trait;
    this.isFemale = isFemale;
    this.generationText = generationText;
  }

  /**
   * Creates a new Rogue1PlayerLineageData based on the provided json data.
   * @param json The json data to use.
   * @returns A new Rogue1PlayerLineageData with the provided props.
   */
  static fromJson(json:any): Rogue1PlayerLineageData {
    const keys = Object.keys(this);

    for (const key of keys) {
      if (!json[key]) {
        AppController.error(`Can't run PayerLineageData.fromJson(). Missing key ${key} in json.`);
        return undefined;
      }
    }

    return new Rogue1PlayerLineageData(json.name, json.spell, json.classType, json.headPiece, json.chestPiece, json.shoulderPiece, json.age, json.childAge, json.trait, json.isFemale, json.generationText);
  }
}

/**
 * Class representing a node in the family tree.
 */
export class Rogue1FamilyTreeNode {
  name:string;
  age:number;
  classType:string;
  headPiece:number;
  chestPiece:number;
  shoulderPiece:number;
  numEnemiesBeaten:number;
  beatenABoss:boolean;
  trait:[string, string];
  isFemale:boolean;
  generationText:string

  constructor(name:string, age:number, classType:string, headPiece:number, chestPiece:number, shoulderPiece:number, numEnemiesBeaten:number, beatenABoss:boolean, trait:[string, string], isFemale:boolean, generationText:string) {
    this.name = name;
    this.age = age;
    this.classType = classType;
    this.headPiece = headPiece;
    this.shoulderPiece = shoulderPiece;
    this.chestPiece = chestPiece;
    this.numEnemiesBeaten = numEnemiesBeaten;
    this.beatenABoss = beatenABoss;
    this.trait = trait;
    this.isFemale = isFemale;
    this.generationText = generationText;
  }

  /**
   * Creates a new Rogue1FamilyTreeNode based on the provided json data.
   * @param json The json data to use.
   * @returns A new Rogue1FamilyTreeNode with the provided props.
   */
  static fromJson(json:any): Rogue1FamilyTreeNode {
    const keys = Object.keys(this);

    for (const key of keys) {
      if (!json[key]) {
        AppController.error(`Can't run FamilyTreeNode.fromJson(). Missing key ${key} in json.`);
        return undefined;
      }
    }

    return new Rogue1FamilyTreeNode(json.name, json.age, json.classType, json.headPiece, json.chestPiece, json.shoulderPiece, json.numEnemiesBeaten, json.beatenABoss, json.trait, json.isFemale, json.generationText);
  }
}
