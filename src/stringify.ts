import { El, Attributes } from "./definitions";

function attrString(attrs: Attributes) {
  const buff = [];
  for (let key in attrs) {
    buff.push(key + '="' + attrs[key] + '"');
  }
  if (!buff.length) {
    return "";
  }
  return " " + buff.join(" ");
}

function stringify(buff: string, doc: El): string {
  switch (doc.type) {
    case "tag":
      buff += "<" + doc.name + (doc.attrs ? attrString(doc.attrs) : "") + (doc.voidElement ? "/>" : ">");
      if (doc.voidElement) {
        return buff;
      }
      return buff + (doc.children || []).reduce(stringify, "") + "</" + doc.name + ">";
    case "comment":
      buff += "<!--" + doc.comment + "-->";
      return buff;
    default:
      return buff + doc.content;
  }
}

export default function (doc: El[]): string {
  return doc.reduce(function (token, rootEl) {
    return token + stringify("", rootEl);
  }, "");
}
