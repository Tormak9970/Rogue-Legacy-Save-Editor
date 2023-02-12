import type { Reader } from "../utils/Reader";

export interface SaveFile {
  parseFile(reader:Reader): void;
  asJson(): any;
  asBinary(): void;
  fromJson(json:any): void;
}