import { TagTide } from "../src";

const original = "<div>start</div> middle <div>finish</div>";
const prettified = new TagTide(original).rootParagraphs().result();

console.log(prettified);
