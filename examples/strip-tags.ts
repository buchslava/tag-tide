import { TagTide } from "../src";

const original = "<div>level 1 <div><a href='#'><span>level <i>2</i></span></a> <div>level 3<br></div></div></div>";
const prettified = new TagTide(original)
  .result(['a', 'span', 'i', 'br']);

console.log(prettified);
