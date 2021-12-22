import { Attributes, AttributesByTag, El, TraceInfo, TraversePoint } from "./definitions";
import parse from "./parse";
import stringify from "./stringify";
import { lowerCaseNested, stripNested, tableAsText, traverse } from "./utils";

export class TagTide {
  private ast: El[];

  constructor(private original: string) {
    this.ast = parse(this.original);
  }

  public static stripDashes(content: string) {
    return content.replace(/&mdash;|&ndash;/g, "-");
  }

  public traverse(f: TraversePoint): TagTide {
    traverse(f, this.ast, 0);
    return this;
  }

  public trace(cb: (info: TraceInfo) => void): TagTide {
    cb({
      original: this.original,
      ast: [...this.ast],
    });
    return this;
  }

  public flatten(omit?: string[]): TagTide {
    for (const tag of this.ast) {
      stripNested(tag.children, omit || []);
    }
    return this;
  }

  public lowerCaseTags(): TagTide {
    lowerCaseNested(this.ast);
    return this;
  }

  public textTable(): TagTide {
    tableAsText(this.ast);
    return this;
  }

  public rootParagraphs(): TagTide {
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

  public removeAttributes(omit?: AttributesByTag): TagTide {
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

  public startFrom(attr: string, re: RegExp): TagTide {
    const newRoot = this.getElementByAttrRegex(attr, re);
    if (newRoot) {
      this.ast = [newRoot];
    }
    return this;
  }

  public startAfter(attr: string, re: RegExp): TagTide {
    const newRoot = this.getElementByAttrRegex(attr, re);
    if (newRoot && newRoot.children) {
      this.ast = newRoot.children;
    }
    return this;
  }

  public result(tagsToStrip?: string[] | "*"): string {
    let res = stringify(this.ast).replace(/<(\/?|\!?)(remove)[^>]*>/g, "");
    if (tagsToStrip === "*") {
      res = res.replace(new RegExp(`</?.+?[^>]*>`, "g"), "");
    } else if (tagsToStrip) {
      for (const tag of tagsToStrip) {
        res = res.replace(new RegExp(`</?${tag}[^>]*>`, "g"), "");
      }
    }
    res = res.replace(new RegExp(`<p>\\s*<\\/p>`, "g"), "");
    return res.replace(new RegExp(`\\s+`, "g"), " ");
  }

  public blocksToText(): string[] {
    return this.ast.reduce((result: string[], branch: El) => {
      const text = new TagTide(this.blockTextByAst(branch)).result("*")
      result.push(text.replace(/&nbsp;/g, " "));
      return result;
    }, []);
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

  private blockTextByAst(ast: El): string {
    let res = stringify([ast]);
    res = res.replace(new RegExp(`<p>\\s*<\\/p>`, "g"), "");
    return res.replace(new RegExp(`\\s+`, "g"), " ");
  }
}
