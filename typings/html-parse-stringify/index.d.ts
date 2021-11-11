declare module "html-parse-stringify" {
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

  export var parse: function (string): El[];
  export var stringify: function (El[]): string;
}
