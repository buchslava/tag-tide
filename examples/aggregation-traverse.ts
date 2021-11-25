import { El, TagTide } from "../src";

const original = "<div>1 <div>2 <div>3</div></div></div>";
let total = 0;
new TagTide(original).traverse((el: El) => {
  if (el.content) {
    total += +el.content.trim();
  }
});

console.log(total);
