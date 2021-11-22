import { El } from "html-parse-stringify";
import { TraversePoint } from "./definitions";

export function lowerCaseNested(astPiece: El[] | undefined) {
  if (!astPiece) {
    return;
  }
  for (const tag of astPiece) {
    if (tag.type === "tag" && !!tag.name) {
      tag.name = tag.name.toLowerCase();
    }
    if (tag.children) {
      lowerCaseNested(tag.children || []);
    }
  }
}

export function stripNested(astPiece: El[] | undefined, omit: string[]) {
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

export function tableAsText(astPiece: El[] | undefined) {
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

export function traverse(f: TraversePoint, astPiece: El[] | undefined, level: number) {
  if (!astPiece) {
    return;
  }
  for (const tag of astPiece) {
    f(tag, level);
    if (tag.children) {
      traverse(f, tag.children || [], level + 1);
    }
  }
}
