import { TagTide } from "../src";

const original = "<p>foo</p><div>1 <div>2 <div><span>3</span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten().rootParagraphs().result();

console.log(prettified);

// prints
// <p>foo</p><p>1 2 3</p><p> middle </p><p>4 5</p>
