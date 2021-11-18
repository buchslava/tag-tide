import { El } from "html-parse-stringify";

export interface AttributesByTag {
  [key: string]: string[];
}

export interface TraceInfo {
  original: string;
  ast: El[];
}
