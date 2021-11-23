import { TagTide } from "../src";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten().removeAttributes().result();

console.log(prettified);

// prints
// <div>1 2 3</div> middle <div>4 5</div>
