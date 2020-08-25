import moment from "moment";

function xml2json(srcDOM) {
  let children = [...srcDOM.children];

  if (!children.length) {
    return srcDOM.innerHTML;
  }

  let jsonResult = {};

  for (let child of children) {
    let childIsArray =
      children.filter((eachChild) => eachChild.nodeName === child.nodeName)
        .length > 1;

    if (childIsArray) {
      if (jsonResult[child.nodeName] === undefined) {
        jsonResult[child.nodeName] = [xml2json(child)];
      } else {
        jsonResult[child.nodeName].push(xml2json(child));
      }
    } else {
      jsonResult[child.nodeName] = xml2json(child);
    }
  }

  return jsonResult;
}

export const getText = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input === "object") {
    return getText(Object.values(input)[0]);
  }
};

export const getLatestFiveNewsItems = (strxml) => {
  const trimStrxml = strxml
    .split(`<![CDATA[`).join("")
    .split(`]]>`).join("")
    .split("&nbsp;").join("");
  const parser = new DOMParser();
  const inputDom = parser.parseFromString(trimStrxml, "application/xml");
  const json = xml2json(inputDom);
  // grab five latest items or all items in feed if less than 5
  const items = []
  let i = 0
  try {
    const itemsToReturnTotal = Math.min(5, json.rss.channel.item.length)
    for (i; i < itemsToReturnTotal; i++) {
      const item = json.rss.channel.item[i];
      const pubDate = moment.utc(item.pubDate);
      const result = {
        title: item.title,
        description: getText(item.description),
        link: item.link,
        timestamp: pubDate.format("DD MMM YYYY HH:mm"),
      }
      items.push(result);
    }
    return items;
  } catch (error) {
    // returns empty array if feed is empty
    return items;
  }
};
