declare module "html-parse-stringify" {
  export var parse: function (string): El[];
  export var stringify: function (El[]): string;
}
