import { El, TagTide } from "../src";

const original = "<div>level 1 <div>level 2 <div>level 3</div></div></div>";
const prettified = new TagTide(original)
  .traverse((el: El, level: number) => {
    if (level === 2 && el.content) {
      el.content = `modified ${el.content}`;
    }
  })
  .result();

console.log(prettified);

// prints
// <div>level 1 <div>modified level 2 <div>level 3</div></div></div>
