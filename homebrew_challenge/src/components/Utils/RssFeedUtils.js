import { format } from "date-fns";

function xml2json(srcDOM) {
  let children = [...srcDOM.children];

  if (!children.length) {
    return srcDOM.innerHTML;
  }

  let jsonResult = {};

  for (let child of children) {
    let childIsArray =
      children.filter(eachChild => eachChild.nodeName === child.nodeName)
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

export const getText = input => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input === "object") {
    return getText(Object.values(input)[0]);
  }
};

export const getLatestNewsItem = strxml => {
  const trimStrxml = strxml.replace(`<![CDATA[`, "").replace(`]]>`, "");
  const parser = new DOMParser();
  const inputDom = parser.parseFromString(trimStrxml, "application/xml");
  const json = xml2json(inputDom);
  const item = json.rss.channel.item[0];
  const pubDate = Date.parse(item.pubDate);
  const result = {
    title: item.title,
    description: getText(item.description),
    link: item.link,
    timestamp: format(pubDate, "dd MMM yyyy HH:mm")
  };
  return result;
};
