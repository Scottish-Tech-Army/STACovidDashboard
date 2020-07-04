import { format } from "date-fns";

const defaultStrXml = `
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Scottish Government News - News</title>
<link>https://news.gov.scot/</link>
<description>News from Scottish Government</description>
<language>en-GB</language>
<generator>PRgloo</generator>
<atom:link href="https://news.gov.scot/feed/rss" rel="self" type="application/rss+xml"/>
<item>
<guid isPermaLink="false">5eff1688e74ad70920c25c70</guid>
<link>https://news.gov.scot/news/lifeline-support-for-performing-arts-venues</link>
<category>Scotland</category>
<title>Lifeline support for Performing Arts Venues</title>
<description>
<![CDATA[ <p><strong>Dedicated £10 million fund announced.</strong></p> ]]>
</description>
<pubDate>Fri, 03 Jul 2020 11:54:32 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>https://news.gov.scot/news/promoting-skills-and-employment</link>
<category>Scotland</category>
<title>Promoting skills and employment</title>
<description>
<![CDATA[ <p><strong>Expert report welcomed.</strong></p> ]]>
</description>
<pubDate>Fri, 03 Jul 2020 08:32:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efe0aace74ad70920c25846</guid>
<link>https://news.gov.scot/news/travel-restrictions-lifted</link>
<category>Scotland</category>
<title>Travel restrictions lifted</title>
<description>
<![CDATA[ <p><strong>Tourism to benefit from further Phase 2 changes.</strong></p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 23:01:00 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efde4c1e74ad70920c25590</guid>
<link>https://news.gov.scot/news/mobile-testing-units</link>
<category>Scotland</category>
<title>Mobile Testing Units</title>
<description>
<![CDATA[ <p><strong>Scottish Ambulance Service to take over sites.</strong></p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 23:01:00 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efdcfc3e74ad70920c254aa</guid>
<link>https://news.gov.scot/news/final-phase-2-measures-confirmed</link>
<category>Scotland</category>
<title>Final Phase 2 measures confirmed</title>
<description>
<![CDATA[ <p><strong>Face coverings and 2 metre rule exemptions announced in preparation for Phase 3.</strong></p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 13:45:00 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efddc1de74ad70920c2553e</guid>
<link>https://news.gov.scot/news/management-of-local-covid-19-outbreak</link>
<title>Coronavirus (COVID-19): Dumfries and Galloway</title>
<description>
<![CDATA[ <p>Delay to relaxation of restrictions in parts of the region.</p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 13:44:34 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efdc178e74ad70920c253fd</guid>
<link>https://news.gov.scot/news/new-school-butterstone-2</link>
<category>Scotland</category>
<title>New School Butterstone</title>
<description>
<![CDATA[ <p>Independent Review published.</p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 11:15:35 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efdbbb4e74ad70920c252c5</guid>
<link>https://news.gov.scot/news/cross-border-operation-welcomed</link>
<category>Scotland</category>
<title>Cross border operation welcomed</title>
<description>
<![CDATA[ <p><strong>Controlled drugs, cash and firearms seized.</strong></p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 11:10:00 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efda1b7e74ad70920c25138</guid>
<link>https://news.gov.scot/news/update-to-shielding-guidance</link>
<title>Update to Shielding guidance</title>
<description>
<![CDATA[ <p>Changes to advice for children and young people.</p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 10:49:24 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efc390ee74ad70920c24096</guid>
<link>https://news.gov.scot/news/expert-advisory-group-on-migration-and-population</link>
<category>Scotland</category>
<title>Expert Advisory Group on migration and population</title>
<description>
<![CDATA[ <p>Experts report UK plans could trigger fall in migration.</p> ]]>
</description>
<pubDate>Thu, 02 Jul 2020 08:40:23 Z</pubDate>
</item>
</channel>
</rss>
`;

function xml2json(srcDOM) {
  let children = [...srcDOM.children];

  // base case for recursion.
  if (!children.length) {
    return srcDOM.innerHTML;
  }

  // initializing object to be returned.
  let jsonResult = {};

  for (let child of children) {
    // checking is child has siblings of same name.
    let childIsArray =
      children.filter(eachChild => eachChild.nodeName === child.nodeName)
        .length > 1;

    // if child is array, save the values as array, else as strings.
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

//  psuedo code for function
// Initialize variable jsonResult is empty object.
// If scrDOM has no children nodes:
//     return innerHTML of the DOM. // This is our base case.
//
// For each childNode in children nodes:
//     Check if childNode has siblings of same name.
//     If it has no siblings of same name:
//         set childnode name as key whose value is json of the child node. (we're calling the function recursively.)
//     If it has no siblings of same name
//         set childnode name as key whose value is an empty array, every child whose name is same as this pushed into this array.
// return jsonResult
