import { parse, stringify, El } from "html-parse-stringify";

function stripNested(astPiece: El[], expectedTag: string[]) {
  if (!astPiece) {
    return;
  }
  for (const tag of astPiece) {
    if (tag.type === "tag" && !!tag.name && expectedTag.includes(tag.name)) {
      tag.name = "remove";
    }
    if (tag.children) {
      stripNested(tag.children, expectedTag);
    }
  }
}

export interface TraceInfo {
  original: string;
  ast: El[];
  nestedTagsToRemove: string[];
}

export class Prosaic {
  private ast: El[];
  private nestedTagsToRemove = ["div", "span"];

  constructor(private original: string) {
    this.ast = parse(this.original);
  }

  public trace(cb: (info: TraceInfo) => void): Prosaic {
    cb({
      original: this.original,
      ast: [...this.ast],
      nestedTagsToRemove: [...this.nestedTagsToRemove],
    });
    return this;
  }

  public setNestedTagsToRemove(nestedTagsToRemove: string[]): Prosaic {
    this.nestedTagsToRemove = nestedTagsToRemove;
    return this;
  }

  public result(): string {
    for (const tag of this.ast) {
      if (tag.children) {
        stripNested(tag.children, this.nestedTagsToRemove);
      }
    }

    return stringify(this.ast).replace(/<(\/?|\!?)(remove)>/g, "");
  }
}
