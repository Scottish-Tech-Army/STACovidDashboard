import {
  getLatestNewsItem,
} from "./RssFeedUtils";

const inputXml = `
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
<link>link1</link>
<category>Scotland</category>
<title>title1</title>
<description>description1</description>
<pubDate>Fri, 03 Jul 2020 11:54:32 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link2</link>
<category>Scotland</category>
<title>title2</title>
<description>description2</description>
<pubDate>Fri, 03 Jul 2020 08:32:48 Z</pubDate>
</item>
</channel>
</rss>
`;

it("getLatestNewsItem reads feed", () => {
  const result = getLatestNewsItem(inputXml);
  const expectedResult = {title: "title1", description: "description1", link: "link1"};
  expect(result).toEqual(expectedResult);
});
