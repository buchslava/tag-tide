import * as chai from "chai";

import { El, TagTide } from "../src/index";

const expect = chai.expect;

describe("additional", () => {
  it("change root elements to paragraphs", () => {
    const original = "<p>foo</p><div>1 <div>2 <div><span>3</span></div></div></div> middle <div>4 <div>5</div></div>";
    const expected = "<p>foo</p><p>1 2 3</p><p> middle </p><p>4 5</p>";
    const prettified = new TagTide(original).flatten().rootParagraphs().result();

    expect(prettified).to.equal(expected);
  });

  it("came from google doc", () => {
    const htmlFromGoogleDocs = `
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta charset="utf-8">
    <b style="font-weight:normal;" id="docs-internal-guid-f45b8314-7fff-c131-346a-1affd24e93d7">
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
        <span style="font-size:13pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test </span>
        <span style="font-size:13pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">test test</span>
      </p>
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
        <span style="font-size:13.999999999999998pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test test test</span>
      </p>
      <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><a href="http://www.microsoft.com" style="text-decoration:none;"><span style="font-size:11pt;font-family:Arial;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Test</span></a><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> test test</span></p>
      <br /><br /><br /><div dir="ltr" style="margin-left:0pt;" align="left">
      <table style="border:none;border-collapse:collapse;table-layout:fixed;width:468pt"><colgroup><col /><col /></colgroup><tbody>
         <tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">1</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">2</span></p></td></tr>
         <tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">3</span></p></td><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">4</span></p></td></tr>
      </tbody></table>
      </div><br /><br />
      <ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Aaa</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Bbb</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Ccc</span></p></li></ul>
      <br /><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The end</span></p></b><br class="Apple-interchange-newline">`;
    const expected = `<p> Test test test </p><p> Test test test </p><p><a href="http://www.microsoft.com">Test</a> test test</p><br/><br/><br/><p> 12 34 </p><br/><br/><ul><li>Aaa</li><li>Bbb</li><li>Ccc</li></ul><br/><p>The end</p>`;
    const prettified = new TagTide(htmlFromGoogleDocs)
      .startAfter("id", /^docs-internal-guid-.+/)
      .textTable()
      .flatten(["a", "img", "li"])
      .removeAttributes({ a: ["href", "_target"], img: ["src", "alt"] })
      .rootParagraphs()
      .result();

    expect(prettified).to.equal(expected);
  });

  it("change 2-nd level content via traverse", () => {
    const original = "<div>level 1 <div>level 2 <div>level 3</div></div></div>";
    const expected = "<div>level 1 <div>modified level 2 <div>level 3</div></div></div>";
    const prettified = new TagTide(original)
      .traverse((el: El, level: number) => {
        if (level === 2 && el.content) {
          el.content = `modified ${el.content}`;
        }
      })
      .result();

    expect(prettified).to.equal(expected);
  });

  it("aggregation via traverse", () => {
    const original = "<div>1 <div>2 <div>3</div></div></div>";
    let total = 0;
    new TagTide(original).traverse((el: El) => {
      if (el.content) {
        total += +el.content.trim();
      }
    });

    expect(total).to.equal(6);
  });

  it("Shakespeare", () => {
    const original = `
    <div id="content"><div class="sent">Shakespeare produced most of his known works between <span style="color: red; font-size: 24px;">1589</span> and
         <span style="color: red">1613</span>.</div>
    <div><div class="sent">His early plays were primarily comedies and histories and are regarded as some of the best work produced in these genres.</div>
      <div class="sent">He then wrote mainly tragedies until 1608, among them Hamlet, Romeo and Juliet, Othello, King Lear, and Macbeth, all considered to be among the finest works in the English language.</div><div></div>`;
    const tagTide = new TagTide(original).startAfter("id", /^content/);
    const startedAfter = tagTide.result();

    expect(startedAfter).to.equal(
      '<div class="sent">Shakespeare produced most of his known works between <span style="color: red; font-size: 24px;">1589</span> and <span style="color: red">1613</span>.</div> <div><div class="sent">His early plays were primarily comedies and histories and are regarded as some of the best work produced in these genres.</div> <div class="sent">He then wrote mainly tragedies until 1608, among them Hamlet, Romeo and Juliet, Othello, King Lear, and Macbeth, all considered to be among the finest works in the English language.</div><div></div></div>'
    );

    tagTide.flatten();
    const flattened = tagTide.result();

    expect(flattened).to.equal(
      '<div class="sent">Shakespeare produced most of his known works between 1589 and 1613.</div> <div>His early plays were primarily comedies and histories and are regarded as some of the best work produced in these genres. He then wrote mainly tragedies until 1608, among them Hamlet, Romeo and Juliet, Othello, King Lear, and Macbeth, all considered to be among the finest works in the English language.</div>'
    );

    tagTide.rootParagraphs();
    const paragraphs = tagTide.result();

    expect(paragraphs).to.equal(
      '<p class="sent">Shakespeare produced most of his known works between 1589 and 1613.</p><p>His early plays were primarily comedies and histories and are regarded as some of the best work produced in these genres. He then wrote mainly tragedies until 1608, among them Hamlet, Romeo and Juliet, Othello, King Lear, and Macbeth, all considered to be among the finest works in the English language.</p>'
    );

    tagTide.removeAttributes();
    const pureHtml = tagTide.result();

    expect(pureHtml).to.equal(
      "<p>Shakespeare produced most of his known works between 1589 and 1613.</p><p>His early plays were primarily comedies and histories and are regarded as some of the best work produced in these genres. He then wrote mainly tragedies until 1608, among them Hamlet, Romeo and Juliet, Othello, King Lear, and Macbeth, all considered to be among the finest works in the English language.</p>"
    );
  });
});
