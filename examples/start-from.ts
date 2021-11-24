import { TagTide } from "../src";

const source = `<body><div class="container-1"><p>content</p></div></body>`;
const result = new TagTide(source)
  .startFrom("class", /^container-\d/)
  .result();

console.log(result);
