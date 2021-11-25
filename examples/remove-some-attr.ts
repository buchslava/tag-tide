import { TagTide } from "../src";

const original =
  "<div>1 <div id='first'>2 <div><span id='s1' class='foo' style='color: red;'>3</span></div></div></div> middle <div style='color: red;'>4 <div>5</div></div>";
const prettified = new TagTide(original).removeAttributes({'span': ['id'], '*': ['style']}).result();

console.log(prettified);
