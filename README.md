# Tag Tide

Allows to prettify, change or manipulate HTML via AST. This solution is based on [html-parse-stringify](https://github.com/HenrikJoreteg/html-parse-stringify) library. Contains some patterns regarding HTML structure transformation. This library is isomorphic, so it can be used in both browser and NodeJS applications without any additional configuration and it doesn't require DOM environment.

## Install

`npm i tag-tide`

or

`yarn add tag-tide`

## Test and run the examples

```
git clone git@github.com:buchslava/tag-tide.git
cd tag-tide
npm i
npm test
```

## Use cases

There is a couple fundamental approaches how to change your HTML code via `tag-tide`:

- Direct changes via `traverse`
- Changes via the set of patterns

This part contains different examples illustrating the approaches above.

## Direct changes via `traverse`

### Change some content in 2-nd nesting level

```typescript
import { El, TagTide } from "tag-tide";

const original = "<div>level 1 <div>level 2 <div>level 3</div></div></div>";
const prettified = new TagTide(original)
  .traverse((el: El, level: number) => {
    if (level === 2 && el.content) {
      el.content = `modified ${el.content}`;
    }
  })
  .result();

console.log(prettified);
```

Prints the following:
```
<div>level 1 <div>modified level 2 <div>level 3</div></div></div>
```

### Aggregate numeric values from different nesting levels

```typescript
import { El, TagTide } from "tag-tide";

const original = "<div>1 <div>2 <div>3</div></div></div>";
let total = 0;
new TagTide(original).traverse((el: El) => {
  if (el.content) {
    total += +el.content.trim();
  }
});

console.log(total);
```

Prints `6`

### Strip some tags

```typescript
import { TagTide } from "tag-tide";

const original = "<div>level 1 <div><a href='#'><span>level <i>2</i></span></a> <div>level 3<br></div></div></div>";
const prettified = new TagTide(original)
  .result(['a', 'span', 'i', 'br']);

console.log(prettified);
```

Prints the following:
```
<div>level 1 <div>level 2 <div>level 3</div></div></div>
```

## Changes via the patterns

### "Start after" or "Start from"

This pattern allows ignore some parent structures.

```typescript
import { TagTide } from "tag-tide";

const source = `<body><div class="container-1"><p>content</p></div></body>`;
const result = new TagTide(source)
  .startAfter("class", /^container-\d/)
  .result();

console.log(result);
```

Prints the following:
```
<p>content</p>
```

The following code illustrates another approach to set starter-tag. Also, related tag can be included:

```typescript
import { TagTide } from "tag-tide";

const source = `<body><div class="container-1"><p>content</p></div></body>`;
const result = new TagTide(source)
  .startFrom("class", /^container-\d/)
  .result();

console.log(result);
```

Prints the following:
```
<div class="container-1"><p>content</p></div>
```

Important notes:

1. In the "Start With" case, the result will include the associated (search) tag.
2. If no matching tag is found, these patterns don't affect the result.

### "Flatten"

This pattern will be useful if we need to remove nested tags.

```typescript
import { TagTide } from "tag-tide";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten().result();

console.log(prettified);
```
Prints the following:
```
<div>1 2 3</div> middle <div>4 5</div>
```

Also, you can omit some tags:

```typescript
import { TagTide } from "tag-tide";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'><a href='1' target='_blank'>3</a></span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten(['a']).result();

console.log(prettified);
```
Prints the following:
```
<div>1 2 <a href="1" target="_blank">3</a></div> middle <div>4 5</div>
```

### Remove attributes

This pattern allows removing all or some attributes through the whole content.

In the following example, all attributes have been removed.

```typescript
import { TagTide } from "tag-tide";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten().removeAttributes().result();

console.log(prettified);
```

Prints the following:
```
<div>1 <div>2 <div><span>3</span></div></div></div> middle <div>4 <div>5</div></div>
```

In the following example, all attributes have been removed except:

* `id` attribute in all `span` tags
* all `style` attributes

```typescript
import { TagTide } from "tag-tide";

const original =
  "<div>1 <div id='first'>2 <div><span id='s1' class='foo' style='color: red;'>3</span></div></div></div> middle <div style='color: red;'>4 <div>5</div></div>";
const prettified = new TagTide(original).removeAttributes({'span': ['id'], '*': ['style']}).result();

console.log(prettified);
```

Prints the following:
```
<div>1 <div>2 <div><span id="s1" style="color: red;">3</span></div></div></div> middle <div style="color: red;">4 <div>5</div></div>
```

### "Root paragraphs"

The following functionality is sometimes appropriate. We need to replace the `divs` in the first level of HTML with `paragraphs`. If the `plain text` appears at the `first level` instead of another tag, it should be enclosed in a `paragraph`.

The following example shows how this approach works.

```typescript
import { TagTide } from "tag-tide";

const original = "<div>start</div> middle <div>finish</div>";
const prettified = new TagTide(original).rootParagraphs().result();

console.log(prettified);
```

Prints the following:
```
<p>start</p><p> middle </p><p>finish</p>
```

## How to apply different approaches at the same content

First of all, this case is more difficult than other previous. Secondly, the example below has taken from real life. It represents clipboard content taken from Google Docs. The issue is that this code is too messy. It contains a lot of redundant tags and attributes. Let's focus on the issues.

1. Actually, it starts after the following: `<b style="font-weight:normal;" id="docs-internal-guid-f45b8314-7fff-c131-346a-1affd24e93d7">`
2. There are a lot of redundant attributes
3. There are a lot of redundant spans

The following script resolves these issues.

```typescript
import { TagTide } from "tag-tide";

const htmlFromGoogleDocs = `
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta charset="utf-8">
    <b style="font-weight:normal;" id="docs-internal-guid-f45b8314-7fff-c131-346a-1affd24e93d7">
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
        <span style="font-size:13pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test </span>
        <span style="font-size:13pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">test test</span>
      </p>
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
        <span style="font-size:13.999999999999998pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test test test</span>
      </p>
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><a href="http://www.example.com" style="text-decoration:none;"><span style="font-size:11pt;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test</span></a><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> test test</span></p>
      <br /><br /><br /><div dir="ltr" style="margin-left:0pt;" align="left">
      <table style="border:none;border-collapse:collapse;table-layout:fixed;width:468pt"><colgroup><col /><col /></colgroup><tbody>
         <tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">2</span></p></td></tr>
         <tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">3</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">4</span></p></td></tr>
      </tbody></table>
      </div><br /><br />
      <ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Aaa</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Bbb</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ccc</span></p></li></ul>
      <br /><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The end</span></p></b><br class="Apple-interchange-newline">`;

const prettified = new TagTide(htmlFromGoogleDocs)
  .startAfter("id", /^docs-internal-guid-.+/)
  .textTable()
  .flatten(["a", "img", "li"])
  .removeAttributes({ a: ["href", "_target"], img: ["src", "alt"] })
  .rootParagraphs()
  .result();

console.log(prettified);
```

The result is:
```
<p> Test test test </p><p> Test test test </p><p><a href="http://www.example.com">Test</a> test test</p><br/><br/><br/><p> 12 34 </p><br/><br/><ul><li>Aaa</li><li>Bbb</li><li>Ccc</li></ul><br/><p>The end</p>
```

Let's focus on content transformation flow.

1. First of all, redundant parent tags should be omitted: `.startAfter("id", /^docs-internal-guid-.+/)`
2. Also, we need to prettify tables. It means making space-split text from them: `.textTable()`
3. Flatten the whole content, but leave lists, links, and images untouched: `.flatten(["a", "img", "li"])`
4. Remove all attributes except "href", "_target" in links; "src", "alt" in images: `.removeAttributes({ a: ["href", "_target"], img: ["src", "alt"] })`
5. Transform root divs to paragraphs: `.rootParagraphs()`
6. And, get the result: .result();

The above case is especially relevant for the case where we are trying to paste content from somewhere in a WYSIWYG editor.

## How to trace the result

This library is based on the AST. If we want to know what's going on, there is only one correct way to find out. It is possible to obtain AST at different stages of the flow. The following example illustrates this approach.

```typescript
import { TagTide, TraceInfo } from "tag-tide";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
new TagTide(original)
  .flatten()
  // also, you can apply "trace" here
  .removeAttributes()
  // and here
  .trace((info: TraceInfo) => {
    console.log(JSON.stringify(info.ast, null, 2));
  })
  .result();
```

Prints the following:
```
[
  {
    "type": "tag",
    "name": "div",
    "voidElement": false,
    "children": [
      {
        "type": "text",
        "content": "1 "
      },
      {
        "type": "tag",
        "name": "remove",
        "voidElement": false,
        "children": [
          {
            "type": "text",
            "content": "2 "
          },
          {
            "type": "tag",
            "name": "remove",
            "voidElement": false,
            "children": [
              {
                "type": "tag",
                "name": "remove",
                "voidElement": false,
                "children": [
                  {
                    "type": "text",
                    "content": "3"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "text",
    "content": " middle "
  },
  {
    "type": "tag",
    "name": "div",
    "voidElement": false,
    "children": [
      {
        "type": "text",
        "content": "4 "
      },
      {
        "type": "tag",
        "name": "remove",
        "voidElement": false,
        "children": [
          {
            "type": "text",
            "content": "5"
          }
        ]
      }
    ]
  }
]
```

Pay attention to `info` variable here: `.trace((info: TraceInfo) => {`.
This variable represents just a copy of the AST. That's why any modification of `info` doesn't affect the result.
