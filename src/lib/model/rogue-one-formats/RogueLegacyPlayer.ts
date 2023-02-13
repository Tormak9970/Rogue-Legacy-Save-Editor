import { AppController } from "../../controllers/AppController";
import type { Reader } from "../../utils/Reader";
import type { SaveFile } from "../SaveFile";
import { ClassType, SpecialItem, SpellType, Traits } from "./RogueOneLUTs";


export class Rogue1Player implements SaveFile {
  gold:number;
  currentHealth:number;
  currentMana:number;
  age:number;
  childAge:number;

  spell:string; //SpellType
  class:string; //ClassType
  specialItem:string; //SpecialItem
  trait:[string, string]; //Trait

  private nameLength:number;
  name:string;

  headPiece:number;
  shoulderPiece:number;
  chestPiece:number;
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

  parseFile(reader:Reader): void {
    this.gold = reader.readInt32();
    this.currentHealth = reader.readInt32();
    this.currentMana = reader.readInt32();

    this.age = reader.readUint8();
    this.childAge = reader.readInt8();
    this.spell = SpellType[reader.readInt8().toString()];
    this.class = ClassType[reader.readInt8().toString()];
    this.specialItem = SpecialItem[reader.readInt8().toString()];
    this.trait = [ Traits[reader.readInt8().toString()], Traits[reader.readInt8().toString()] ];

    this.nameLength = reader.readInt8();
    this.name = reader.readString(this.nameLength);

    this.headPiece = reader.readInt8();
    this.shoulderPiece = reader.readInt8();
    this.chestPiece = reader.readInt8();
    this.diaryEntry = reader.readInt8();

    this.bonusHealth = reader.readInt32();
    this.bonusStrength = reader.readInt32();
    this.bonusManapeak = reader.readInt32();
    this.bonusDefense = reader.readInt32();
    this.bonusWeight = reader.readInt32();
    this.bonusMagic = reader.readInt32();

    this.lichHealth = reader.readInt32();
    this.lichMana = reader.readInt32();
    this.lichHealthMod = reader.readFloat32();

    this.newBossBeaten = reader.readInt8() == 1;
    this.eyeballBossBeaten = reader.readInt8() == 1;
    this.fairyBossBeaten = reader.readInt8() == 1;
    this.fireballBossBeaten = reader.readInt8() == 1;
    this.blobBossBeaten = reader.readInt8() == 1;
    this.lastBossBeaten = reader.readInt8() == 1;

    this.timesCastleBeaten = reader.readInt32();
    this.numEnemiesBeaten = reader.readInt32();

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
    this.isFemale = reader.readInt8() == 1;

    this.timesDead = reader.readInt32();

    this.hasArchitectFree = reader.readInt8() == 1;
    this.readLastDiary = reader.readInt8() == 1;
    this.spokenToLastBoss = reader.readInt8() == 1;
    this.hardcoreMode = reader.readInt8() == 1;

    this.totalHoursPlayed = reader.readFloat32();

    this.wizardSpellList = [
      reader.readInt8(),
      reader.readInt8(),
      reader.readInt8()
    ];

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

    AppController.log(`Player Data: ${this.asJson()}`);
  }

  asJson(): any {
    return {
      "gold": this.gold,
      "currentHealth": this.currentHealth,
      "currentMana": this.currentMana,

      "age": this.age,
      "childAge": this.childAge,
      "spell": this.spell,
      "class": this.class,
      "specialItem": this.specialItem,
      "trait": this.trait,

      "nameLength": this.nameLength,
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

      "numTypesEnemiesKilled": this.numTypesEnemiesKilled,

      "typesEnemiesKilled": this.typesEnemiesKilled
    };
  }

  asBinary(): void {
      
  }

  fromJson(json:any) {
    
  }
}