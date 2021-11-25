import { TagTide } from "../src";

const original = "<br /><table><tr><td>11</td><td>22</td></tr><td>33</td><td>44</td></tr></table>";
const prettified = new TagTide(original).textTable().flatten().rootParagraphs().result();

console.log(prettified);
