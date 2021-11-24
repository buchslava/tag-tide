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

### "Start after"

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
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'><a href='1' tatger='_blank'>3</a></span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten(['a']).result();

console.log(prettified);
```
Prints the following:
```
<div>1 2 <a href="1" tatger="_blank">3</a></div> middle <div>4 5</div>
```

### Remove attributes

### "Root paragraphs"

## How to apply different approaches at the same time
