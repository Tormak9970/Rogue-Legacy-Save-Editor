import type { Reader } from "../utils/Reader";
import type { SaveFile } from "./SaveFile";

export const ROGUE_TWO_DEFAULT_PATH = "C:/Users/USER/AppData/LocalLow/Cellar Door Games/Rogue Legacy 2/Saves/PLATFORM/GAME_ID/PROFILE";

export class Rogue2Save implements SaveFile {
  constructor(reader: Reader) {
    
  }

  asJson(): any {

  }

  asBinary(): void {
      
  }
}
