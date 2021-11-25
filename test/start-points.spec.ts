import * as chai from "chai";

import { TagTide } from "../src/index";

const expect = chai.expect;

describe("start points", () => {
  it("start after - happy flow", () => {
    const source = `<meta /><div id='content'><p>info</p></div>`;
    const expected = `<p>info</p>`;
    const prettified = new TagTide(source).startAfter("id", /^content/).result();

    expect(prettified).to.equal(expected);
  });

  it("start after - related start point is missing", () => {
    const source = `<meta /><div><p>info</p></div>`;
    const expected = `<meta/><div><p>info</p></div>`;
    const prettified = new TagTide(source).startAfter("id", /^content/).result();
    expect(prettified).to.equal(expected);
  });

  it("start from - happy flow", () => {
    const source = `<meta /><div id='content'><p>info</p></div>`;
    const expected = `<div id="content"><p>info</p></div>`;
    const prettified = new TagTide(source).startFrom("id", /^content/).result();

    expect(prettified).to.equal(expected);
  });

  it("start from - related start point is missing", () => {
    const source = `<meta /><div><p>info</p></div>`;
    const expected = `<meta/><div><p>info</p></div>`;
    const prettified = new TagTide(source).startFrom("id", /^content/).result();
    expect(prettified).to.equal(expected);
  });
});
