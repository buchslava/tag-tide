import * as chai from "chai";

import { Prosaic } from "../src/index";

const expect = chai.expect;

describe("tables", () => {
  it("simple", () => {
    const original = "<br /><table><tr><td>11</td><td>22</td></tr><td>33</td><td>44</td></tr></table>";
    const expected = "<br/><p>11 22 33 44 </p>";
    const prettified = new Prosaic(original).textTable().flatten().rootParagraphs().result();

    expect(prettified).to.equal(expected);
  });

  it("div covered", () => {
    const original =
      "<div><br /><table><tr><td>11</td><td>22<br/>999</td></tr><td>33</td><td>44</td></tr></table></div>";
    const expected = "<p><br/>11 22 <br/>999 33 44 </p>";
    const prettified = new Prosaic(original).textTable().flatten().rootParagraphs().result();

    expect(prettified).to.equal(expected);
  });
});
