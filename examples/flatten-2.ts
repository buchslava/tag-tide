import { TagTide } from "../src";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'><a href='1' target='_blank'>3</a></span></div></div></div> middle <div>4 <div>5</div></div>";
const prettified = new TagTide(original).flatten(['a']).result();

console.log(prettified);
