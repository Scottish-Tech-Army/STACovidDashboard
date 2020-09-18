import { getLatestFiveNewsItems, getText } from "./RssFeedUtils";

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
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link1</link>
<category>Scotland</category>
<title>title1&nbsp;</title>
<description>
<![CDATA[ <p><strong>description1</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:16:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link2</link>
<category>Scotland</category>
<title>title2&nbsp;</title>
<description>
<![CDATA[ <p><strong>description2</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:17:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link3</link>
<category>Scotland</category>
<title>title3&nbsp;</title>
<description>
<![CDATA[ <p><strong>description3</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:18:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link4</link>
<category>Scotland</category>
<title>title4&nbsp;</title>
<description>
<![CDATA[ <p><strong>description4</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:19:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link5</link>
<category>Scotland</category>
<title>title5&nbsp;</title>
<description>
<![CDATA[ <p><strong>description5</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:20:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link6</link>
<category>Scotland</category>
<title>title6&nbsp;</title>
<description>
<![CDATA[ <p><strong>description6</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:21:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link7</link>
<category>Scotland</category>
<title>title7&nbsp;</title>
<description>
<![CDATA[ <p><strong>description7</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:22:48 Z</pubDate>
</item>
</channel>
</rss>
`;

const inputXmlSmall = `
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Scottish Government News - News</title>
<link>https://news.gov.scot/</link>
<description>News from Scottish Government</description>
<language>en-GB</language>
<generator>PRgloo</generator>
<atom:link href="https://news.gov.scot/feed/rss" rel="self" type="application/rss+xml"/>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link1</link>
<category>Scotland</category>
<title>title1&nbsp;</title>
<description>
<![CDATA[ <p><strong>description1</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:16:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link2</link>
<category>Scotland</category>
<title>title2&nbsp;</title>
<description>
<![CDATA[ <p><strong>description2</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:17:48 Z</pubDate>
</item>
<item>
<guid isPermaLink="false">5efeed31e74ad70920c25969</guid>
<link>link3</link>
<category>Scotland</category>
<title>title3&nbsp;</title>
<description>
<![CDATA[ <p><strong>description3</strong></p> ]]>
</description>
<pubDate>Wed, 19 Aug 2020 14:18:48 Z</pubDate>
</item>
</channel>
</rss>
`;

const inputXmlEmpty = `
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Scottish Government News - News</title>
<link>https://news.gov.scot/</link>
<description>News from Scottish Government</description>
<language>en-GB</language>
<generator>PRgloo</generator>
<atom:link href="https://news.gov.scot/feed/rss" rel="self" type="application/rss+xml"/>
</channel>
</rss>
`;

test("getLatestFiveNewsItems reads feed", () => {
  const result = getLatestFiveNewsItems(inputXml);
  const expectedResult = [
    {
      title: "title1",
      description: "description1",
      link: "link1",
      timestamp: "19 Aug 2020 14:16"
    },
    {
      title: "title2",
      description: "description2",
      link: "link2",
      timestamp: "19 Aug 2020 14:17"
    },
    {
      title: "title3",
      description: "description3",
      link: "link3",
      timestamp: "19 Aug 2020 14:18"
    },
    {
      title: "title4",
      description: "description4",
      link: "link4",
      timestamp: "19 Aug 2020 14:19"
    },
    {
      title: "title5",
      description: "description5",
      link: "link5",
      timestamp: "19 Aug 2020 14:20"
    }
  ];
  expect(result).toStrictEqual(expectedResult);
});

test("getLatestFiveNewsItems reads feed when items are less than five", () => {
  const result = getLatestFiveNewsItems(inputXmlSmall);
  const expectedResult = [
    {
      title: "title1",
      description: "description1",
      link: "link1",
      timestamp: "19 Aug 2020 14:16"
    },
    {
      title: "title2",
      description: "description2",
      link: "link2",
      timestamp: "19 Aug 2020 14:17"
    },
    {
      title: "title3",
      description: "description3",
      link: "link3",
      timestamp: "19 Aug 2020 14:18"
    }
  ];
  expect(result).toStrictEqual(expectedResult);
});

test("getLatestFiveNewsItems reads feed when items are not returned", () => {
  const result = getLatestFiveNewsItems(inputXmlEmpty);
  const expectedResult = [];
  expect(result).toStrictEqual(expectedResult);
});

test("getText", () => {
  expect(getText("string1")).toStrictEqual("string1");
  expect(getText({ p: "string1" })).toStrictEqual("string1");
  expect(getText({ p: { strong: "string1" } })).toStrictEqual("string1");
});
