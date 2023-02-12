import type { Reader } from "../../utils/Reader";
import type { SaveFile } from "../SaveFile";


export class Rogue1Player implements SaveFile {
  gold:number;
  currentHealth:number;
  currentMana:number;
  age:number;
  childAge:number;

  spell:number; //SpellType
  class:number; //ClassType
  specialItem:number; //SpecialItem
  traits:[number?, number?]; //Trait

  nameLength:number;
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

  typesEnemiesKilled:{modId:string, count:number}[]; //[numTypesEnemiesKilled][2]

  constructor(reader?: Reader) {
    if (reader) this.parseFile(reader);
  }

  parseFile(reader:Reader): void {

  }

  asJson(): any {
    return {};
  }

  asBinary(): void {
      
  }

  fromJson(json:any) {
    
  }
}
