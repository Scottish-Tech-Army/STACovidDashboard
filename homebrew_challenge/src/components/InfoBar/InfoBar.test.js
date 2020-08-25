/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "checkNewsItems"] }] */

import React from "react";
import InfoBar from "./InfoBar";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

var container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetch.resetMocks();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.resetAllMocks();
});

test("infoBar renders default data when fetch fails", async () => {
  fetch.mockReject(new Error("fetch failed"));
  global.suppressConsoleErrorLogs();

  await act(async () => {
    render(<InfoBar />, container);
  });
  checkNewsItems(["No news available, please check back later"]);
  checkNewsItemLinks([]);
});

test("infoBar renders dynamic fetched five news items", async () => {
  fetch.mockResponse(inputXml);

  await act(async () => {
    render(<InfoBar />, container);
  });
  const expectedResult = [
    "title1 - description1 | 19 Aug 2020 14:16",
    "title2 - description2 | 19 Aug 2020 14:17",
    "title3 - description3 | 19 Aug 2020 14:18",
    "title4 - description4 | 19 Aug 2020 14:19",
    "title5 - description5 | 19 Aug 2020 14:20"
  ];
  checkNewsItems(expectedResult);
  checkNewsItemLinks(["link1", "link2", "link3", "link4", "link5"]);
});

test("infoBar renders dynamic fetched three news items", async () => {
  fetch.mockResponse(inputXmlSmall);

  await act(async () => {
    render(<InfoBar />, container);
  });
  const expectedResult = [
    "title1 - description1 | 19 Aug 2020 14:16",
    "title2 - description2 | 19 Aug 2020 14:17",
    "title3 - description3 | 19 Aug 2020 14:18"
  ];
  checkNewsItems(expectedResult);
  checkNewsItemLinks(["link1", "link2", "link3"]);
});

test("infoBar displays message when no news items available", async () => {
  fetch.mockResponse(inputXmlEmpty);

  await act(async () => {
    render(<InfoBar />, container);
  });
  checkNewsItems(["No news available, please check back later"]);
  checkNewsItemLinks([]);
});

function newsItems() {
  return container.querySelectorAll(".news-item");
}
function newsItemLinks() {
  return container.querySelectorAll(".news-item-link");
}

function checkNewsItems(expectedResult) {
  const resultItems = newsItems();
  expect(resultItems).toHaveLength(expectedResult.length);
  for (let i = 0; i < expectedResult.length; i++) {
    expect(resultItems[i].textContent).toStrictEqual(expectedResult[i]);
  }
}

function checkNewsItemLinks(expectedResult) {
  const resultItems = newsItemLinks();
  expect(resultItems).toHaveLength(expectedResult.length);
  for (let i = 0; i < expectedResult.length; i++) {
    expect(resultItems[i].getAttribute("href")).toStrictEqual(
      expectedResult[i]
    );
  }
}

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
