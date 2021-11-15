import * as chai from "chai";

import { Prosaic, TraceInfo } from "../src/index";

const expect = chai.expect;

describe("nested tags to remove", () => {
  // it("basic case", () => {
  //   const original = "<div>1 <div>2 <div><span>3</span></div></div></div> middle <div>4 <div>5</div></div>";
  //   const expected = "<div>1 2 3</div> middle <div>4 5</div>";
  //   const prettified = prosaic(original);

  //   expect(prettified).to.equal(expected);
  // });

  // it("basic case", () => {
  //   const original =
  //     "<div>1 <div id='first'>2 <div><span class='foo' style='color: red;'>3</span></div></div></div> middle <div>4 <div>5</div></div>";
  //   const expected = "<div>1 2 3</div> middle <div>4 5</div>";
  //   const prettified = new Prosaic(original)
  //     .flatten()
  //     .removeAttributes()
  //     // .trace((info: TraceInfo) => {
  //     //   console.log(JSON.stringify(info.ast, null, 2));
  //     // })
  //     .result();

  //   expect(prettified).to.equal(expected);
  // });

  it("basic case", () => {
    const original =
      "<div><div> 111 <img src='http://www.foo.com'/> 222</div></div>";
    const expected = "<div> 111  222</div>";
    const prettified = new Prosaic(original)
      .flatten()
      .removeAttributes()
      // .trace((info: TraceInfo) => {
      //   console.log(JSON.stringify(info.ast, null, 2));
      // })
      .result();

    expect(prettified).to.equal(expected);
  });
});
