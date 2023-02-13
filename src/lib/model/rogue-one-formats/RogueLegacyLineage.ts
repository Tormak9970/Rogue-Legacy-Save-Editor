import { AppController } from "../../controllers/AppController";
import type { Reader } from "../../utils/Reader";
import type { SaveFile } from "../SaveFile";
import { ClassType, SpellType, Traits } from "./RogueOneLUTs";

export class Rogue1Lineage implements SaveFile {
  numCurrentBranch:number;
  branch:Rogue1PlayerLineageData[]; //[numCurrentBranch]

  numLineage:number;
  lineage:Rogue1FamilyTreeNode[]; //[numLineage]

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  parseFile(reader:Reader): void {
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
      const trait:[string, string] = [
        Traits[reader.readInt8()],
        Traits[reader.readInt8()]
      ];
      const isFemale = reader.readInt8() == 1;

      const generationLength = reader.readInt8();
      let generationText = "";
      if (generationLength != 0) generationText = reader.readString(generationLength);

      this.branch.push(new Rogue1PlayerLineageData(nameLength, name, spell, classType, headPiece, chestPiece, shoulderPiece, age, childAge, trait, isFemale, generationLength, generationText));
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
      const trait:[string, string] = [
        Traits[reader.readInt8()],
        Traits[reader.readInt8()]
      ];
      const isFemale = reader.readInt8() == 1;
      
      const generationLength = reader.readInt8();
      let generationText = "";
      if (generationLength != 0) generationText = reader.readString(generationLength);

      this.lineage.push(new Rogue1FamilyTreeNode(nameLength, name, age, classType, headPiece, chestPiece, shoulderPiece, numEnemiesBeaten, beatenABoss, trait, isFemale, generationLength, generationText));
    }

    console.log(this.asJson());
  }

  asJson(): any {
    return {
      "numCurrentBranch": this.numCurrentBranch,
      "branch": this.branch,
      "numLineage": this.numLineage,
      "lineage": this.lineage
    };
  }

  asBinary(): void {
      
  }

  fromJson(json:any) {
    const keys = Object.keys(this).filter((key:string) => typeof this[key] != "function");

    for (const key of keys) {
      if (json[key]) {
        if (key == "branch") {
          this[key] = json[key].map((entry:any) => {
            return Rogue1PlayerLineageData.fromJson(entry);
          });
        } else if (key == "lineage") {
          this[key] = json[key].map((entry:any) => {
            return Rogue1FamilyTreeNode.fromJson(entry);
          });
        } else {
          this[key] = json[key];
        }
      } else {
        AppController.log(`Can't run Lineage.fromJson(). Missing key ${key} in json.`);
      }
    }
  }
}

/**
 * Class representing an entry in a lineage.
 */
export class Rogue1PlayerLineageData {
  nameLength:number;
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
  generationLength:number;
  generationText:string

  constructor(nameLength:number, name:string, spell:string, classType:string, headPiece:number, chestPiece:number, shoulderPiece:number, age:number, childAge:number, trait:[string, string], isFemale:boolean, generationLength:number, generationText:string) {
    this.nameLength = nameLength;
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
    this.generationLength = generationLength;
    this.generationText = generationText;
  }

  /**
   * Creates a new Rogue1PlayerLineageData based on the provided json data.
   * @param json The json data to use.
   * @returns A new Rogue1PlayerLineageData with the provided props.
   */
  static fromJson(json:any): Rogue1PlayerLineageData {
    const props:any = {};
    const keys = Object.keys(this);

    for (const key of keys) {
      if (json[key]) {
        props[key] = json[key];
      } else {
        AppController.log(`Can't run PayerLineageData.fromJson(). Missing key ${key} in json.`);
        return undefined;
      }
    }

    return new Rogue1PlayerLineageData(props.nameLength, props.name, props.spell, props.classType, props.headPiece, props.chestPiece, props.shoulderPiece, props.age, props.childAge, props.trait, props.isFemale, props.generationLength, props.generationText);
  }
}

/**
 * Class representing a node in the family tree.
 */
export class Rogue1FamilyTreeNode {
  nameLength:number;
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
  generationLength:number;
  generationText:string

  constructor(nameLength:number, name:string, age:number, classType:string, headPiece:number, chestPiece:number, shoulderPiece:number, numEnemiesBeaten:number, beatenABoss:boolean, trait:[string, string], isFemale:boolean, generationLength:number, generationText:string) {
    this.nameLength = nameLength;
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
    this.generationLength = generationLength;
    this.generationText = generationText;
  }

  /**
   * Creates a new Rogue1FamilyTreeNode based on the provided json data.
   * @param json The json data to use.
   * @returns A new Rogue1FamilyTreeNode with the provided props.
   */
  static fromJson(json:any): Rogue1FamilyTreeNode {
    const props:any = {};
    const keys = Object.keys(this);

    for (const key of keys) {
      if (json[key]) {
        props[key] = json[key];
      } else {
        AppController.log(`Can't run FamilyTreeNode.fromJson(). Missing key ${key} in json.`);
        return undefined;
      }
    }

    return new Rogue1FamilyTreeNode(props.nameLength, props.name, props.age, props.classType, props.headPiece, props.chestPiece, props.shoulderPiece, props.numEnemiesBeaten, props.beatenABoss, props.trait, props.isFemale, props.generationLength, props.generationText);
  }
}
