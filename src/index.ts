import { parse, stringify, El, Attributes } from "html-parse-stringify";

export interface AttributesByTag {
  [key: string]: string[];
}

function stripNested(astPiece: El[] | undefined, omit: string[]) {
  if (!astPiece) {
    return;
  }
  for (const tag of astPiece) {
    if (tag.voidElement && tag.name !== "div") {
      continue;
    }
    if (tag.type === "tag" && !!tag.name && !omit.includes(tag.name)) {
      tag.name = "remove";
    }
    if (tag.children) {
      stripNested(tag.children || [], omit);
    }
  }
}

function tableAsText(astPiece: El[] | undefined) {
  if (!astPiece) {
    return;
  }
  for (const tag of astPiece) {
    if (tag.type === "tag" && tag.name === "td") {
      tag.name = "div";
      for (let child of tag.children || []) {
        if (child.type === "text") {
          child.content += " ";
        }
      }
    } else if (["table", "thead", "tbody", "tfoot", "th", "tr", "td", "col", "colgroup"].includes(tag.name as string)) {
      tag.name = "div";
    }
    if (tag.children) {
      tableAsText(tag.children || []);
    }
  }
}

export interface TraceInfo {
  original: string;
  ast: El[];
}

export class Prosaic {
  private ast: El[];

  constructor(private original: string) {
    this.ast = parse(this.original);
  }

  public trace(cb: (info: TraceInfo) => void): Prosaic {
    cb({
      original: this.original,
      ast: [...this.ast],
    });
    return this;
  }

  public flatten(omit?: string[]): Prosaic {
    for (const tag of this.ast) {
      stripNested(tag.children, omit || []);
    }
    return this;
  }

  public textTable(): Prosaic {
    tableAsText(this.ast);
    return this;
  }

  public rootParagraphs(): Prosaic {
    for (let i = 0; i < this.ast.length; i++) {
      const tag = this.ast[i];
      if (tag.type === "tag" && tag?.name === "div") {
        tag.type = "tag";
        tag.name = "p";
      } else if (tag.type === "text") {
        this.ast[i] = {
          type: "tag",
          name: "p",
          voidElement: false,
          attrs: {},
          children: [
            {
              type: "text",
              content: this.ast[i].content,
            },
          ],
        };
      }
    }
    return this;
  }

  public removeAttributes(omit?: AttributesByTag): Prosaic {
    const removeAttr = (tag: El) => {
      if (!tag) {
        return;
      }
      if (!omit) {
        delete tag.attrs;
      } else {
        if (omit) {
          tag.attrs = Object.keys(tag.attrs || [])
            .filter(
              (key) =>
                (omit[tag.name || ""] && omit[tag.name || ""].includes(key)) || (omit["*"] && omit["*"].includes(key))
            )
            .reduce((obj: Attributes, key: string) => {
              if (tag && tag.attrs && tag.attrs[key]) {
                obj[key] = tag.attrs[key];
              }
              return obj;
            }, {});
        }
      }
      if (tag.children) {
        for (const child of tag.children) {
          removeAttr(child);
        }
      }
    };
    for (const tag of this.ast) {
      removeAttr(tag);
    }
    return this;
  }

  public startFrom(attr: string, re: RegExp): Prosaic {
    const newRoot = this.getElementByAttrRegex(attr, re);
    if (newRoot) {
      this.ast = [newRoot];
    } else {
      throw Error(`Can't find related tag for ${attr} ${re.source}`);
    }
    return this;
  }

  public startAfter(attr: string, re: RegExp): Prosaic {
    const newRoot = this.getElementByAttrRegex(attr, re);
    if (newRoot && newRoot.children) {
      this.ast = newRoot.children;
    } else {
      throw Error(`Can't find related tag for ${attr} ${re.source}`);
    }
    return this;
  }

  public result(tagsToStrip?: string[]): string {
    let res = stringify(this.ast).replace(/<(\/?|\!?)(remove)(\s*\/)?>/g, "");
    if (tagsToStrip) {
      for (const tag of tagsToStrip) {
        res = res.replace(new RegExp(`<(\/?|\!?)(${tag})>`, "g"), "");
      }
    }
    res = res.replace(new RegExp(`<p>\\s*<\\/p>`, "g"), "");
    return res.replace(new RegExp(`\\s+`, "g"), " ");
  }

  private getElementByAttrRegex(expectedAttr: string, re: RegExp): El | null {
    const res: El[] = [];
    const deepSearch = (ast: El[]) => {
      for (const tag of ast) {
        for (const attr of Object.keys(tag.attrs || {})) {
          if (attr !== expectedAttr) {
            continue;
          }
          const attrValue = tag.attrs ? tag.attrs[attr] : "";
          if (attrValue.match(re)) {
            res.push(tag);
          }
        }
        deepSearch(tag.children || []);
      }
    };
    deepSearch(this.ast);
    return res.length > 0 ? res[0] : null;
  }
}
