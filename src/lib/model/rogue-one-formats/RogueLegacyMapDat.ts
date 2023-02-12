import type { Reader } from "../../utils/Reader";
import type { SaveFile } from "../SaveFile";

export class Rogue1MapDat implements SaveFile {
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
