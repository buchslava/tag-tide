export interface Attributes {
  [key: string]: string;
}

export interface El {
  type: string;
  name?: string;
  voidElement?: boolean;
  attrs?: Attributes;
  children?: El[];
  content?: string;
}

export interface AttributesByTag {
  [key: string]: string[];
}

export interface TraceInfo {
  original: string;
  ast: El[];
}

export type TraversePoint = (branch: El, level: number) => void;
