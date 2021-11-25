import { TagTide, TraceInfo } from "../src";

const original =
  "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
new TagTide(original)
  .flatten()
  .removeAttributes()
  .trace((info: TraceInfo) => {
    console.log(JSON.stringify(info.ast, null, 2));
  })
  .result();
