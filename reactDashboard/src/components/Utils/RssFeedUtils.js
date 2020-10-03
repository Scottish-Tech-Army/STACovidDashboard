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

// Repeatedly render the input to remove layers of HTML escaping
export const getText = (input) => {
  do {
    const doc = new DOMParser().parseFromString(input, "text/html");
    const parsed = doc.documentElement.textContent.trim();
    if (parsed === input) {
      return parsed;
    }
    input = parsed;
  } while (true);
};

// Captures description content and surrounding description tags
const REGEX_DESCRIPTION_ELEMENT = /(<description>[^]*?<\/description>)/;
// Captures title content and surrounding title tags
const REGEX_TITLE_ELEMENT = /(<title>[^]*?<\/title>)/;

function preprocessDescriptions(inputXml) {
  return preprocessElement(inputXml, "description", REGEX_DESCRIPTION_ELEMENT);
}

function preprocessTitles(inputXml) {
  return preprocessElement(inputXml, "title", REGEX_TITLE_ELEMENT);
}

// For the chosen element type, convert HTML markup to plaintext
function preprocessElement(inputXml, elementName, elementRegex) {
  const elementStartTag = "<" + elementName + ">";
  const elementEndTag = "</" + elementName + ">";

  return (
    inputXml
      // Remove CDATA tags - DOMParser has issues with the closing tag
      .split(`<![CDATA[`)
      .join("")
      .split(`]]>`)
      .join("")
      // Split on the chosen element
      .split(elementRegex)
      .map((split) =>
        split.startsWith(elementStartTag)
          ? // If chosen element - convert to plaintext, then rewrap in chosen element tags
            elementStartTag + getText(split) + elementEndTag
          : // Otherwise return unmodified
            split
      )
      // Rebuild the full XML document with the chosen element contents modified
      .join("")
  );
}

export const getLatestFiveNewsItems = (strxml) => {
  const decodedStrxml = preprocessTitles(preprocessDescriptions(strxml));
  const parser = new DOMParser();
  const inputDom = parser.parseFromString(decodedStrxml, "application/xml");
  const json = xml2json(inputDom);
  // grab five latest items or all items in feed if less than 5
  const items = [];
  let i = 0;
  try {
    const itemsToReturnTotal = Math.min(5, json.rss.channel.item.length);
    for (i; i < itemsToReturnTotal; i++) {
      const item = json.rss.channel.item[i];
      const pubDate = moment.utc(item.pubDate);
      const result = {
        title: item.title,
        description: item.description,
        link: item.link,
        timestamp: pubDate.format("DD MMM YYYY HH:mm"),
      };
      items.push(result);
    }
    return items;
  } catch (error) {
    // returns empty array if feed is empty
    return items;
  }
};
