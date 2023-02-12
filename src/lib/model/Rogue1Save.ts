import type { Reader } from "../utils/Reader";
import type { SaveFile } from "./SaveFile";

export const ROGUE_ONE_DEFAULT_PATH = "C:/Users/USER/Documents/SavedGames/RogueLegacy/RogueLegacyStorageContainer/AllPlayers/PROFILE";

export class Rogue1Save implements SaveFile {
  constructor(reader: Reader) {
    
  }

  asJson(): any {

  }

  asBinary(): void {
      
  }
}
