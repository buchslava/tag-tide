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

/*
  prints
[
  {
    "type": "tag",
    "name": "div",
    "voidElement": false,
    "children": [
      {
        "type": "text",
        "content": "1 "
      },
      {
        "type": "tag",
        "name": "remove",
        "voidElement": false,
        "children": [
          {
            "type": "text",
            "content": "2 "
          },
          {
            "type": "tag",
            "name": "remove",
            "voidElement": false,
            "children": [
              {
                "type": "tag",
                "name": "remove",
                "voidElement": false,
                "children": [
                  {
                    "type": "text",
                    "content": "3"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "type": "text",
    "content": " middle "
  },
  {
    "type": "tag",
    "name": "div",
    "voidElement": false,
    "children": [
      {
        "type": "text",
        "content": "4 "
      },
      {
        "type": "tag",
        "name": "remove",
        "voidElement": false,
        "children": [
          {
            "type": "text",
            "content": "5"
          }
        ]
      }
    ]
  }
]
*/
