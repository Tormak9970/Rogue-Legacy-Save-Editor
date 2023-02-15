import type { Reader } from "../utils/Reader";

export interface SaveFile {
  parseFile(reader:Reader): void;
  asJson(): any;
  asBinary(): ArrayBuffer;
  fromJson(json:any): boolean;
}