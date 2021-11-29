import { El } from "./definitions";
import parseTag from "./parse-tag";

const tagRE = /<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
const whitespaceRE = /^\s*$/;

export default function parse(html: string): El[] {
  const options: any = {
    components: Object.create(null),
  };

  const result: El[] = [];
  const arr: El[] = [];
  //@ts-ignore
  let current;
  let level = -1;
  let inComponent = false;

  if (html.indexOf("<") !== 0) {
    var end = html.indexOf("<");
    result.push({
      type: "text",
      content: end === -1 ? html : html.substring(0, end),
    });
  }

  //@ts-ignore
  html.replace(tagRE, function (tag, index) {
    if (inComponent) {
      //@ts-ignore
      if (tag !== "</" + current.name + ">") {
        return;
      } else {
        inComponent = false;
      }
    }
    const isOpen = tag.charAt(1) !== "/";
    const isComment = tag.startsWith("<!--");
    const start = index + tag.length;
    const nextChar = html.charAt(start);
    let parent;

    if (isComment) {
      const comment = parseTag(tag);

      // if we're at root, push new base node
      if (level < 0) {
        result.push(comment);
        //@ts-ignore
        return result;
      }
      //@ts-ignore
      parent = arr[level];
      //@ts-ignore
      parent.children.push(comment);
      //@ts-ignore
      return result;
    }

    if (isOpen) {
      level++;

      current = parseTag(tag);
      //@ts-ignore
      if (current.type === "tag" && options.components[current.name]) {
        current.type = "component";
        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== "<") {
        //@ts-ignore
        current.children.push({
          type: "text",
          content: html.slice(start, html.indexOf("<", start)),
        });
      }

      // if we're at root, push new base node
      if (level === 0) {
        result.push(current);
      }

      //@ts-ignore
      parent = arr[level - 1];

      if (parent) {
        //@ts-ignore
        parent.children.push(current);
      }

      arr[level] = current;
    }

    //@ts-ignore
    if (!isOpen || current.voidElement) {
      //@ts-ignore
      if (level > -1 && (current.voidElement || current.name === tag.slice(2, -1))) {
        level--;
        // move current up a level to match the end tag
        //@ts-ignore
        current = level === -1 ? result : arr[level];
      }
      if (!inComponent && nextChar !== "<" && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        //@ts-ignore
        parent = level === -1 ? result : arr[level].children;

        // calculate correct end of the content slice in case there's
        // no tag after the text node.
        const end = html.indexOf("<", start);
        let content = html.slice(start, end === -1 ? undefined : end);
        // if a node is nothing but whitespace, collapse it as the spec states:
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1
        if (whitespaceRE.test(content)) {
          content = " ";
        }
        // don't add whitespace-only text nodes if they would be trailing text nodes
        // or if they would be leading whitespace-only text nodes:
        //  * end > -1 indicates this is not a trailing text node
        //  * leading node is when level is -1 and parent has length 0
        //@ts-ignore
        if ((end > -1 && level + parent.length >= 0) || content !== " ") {
          //@ts-ignore
          parent.push({
            type: "text",
            content: content,
          });
        }
      }
    }
  });

  return result;
}
