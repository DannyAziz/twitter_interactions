const TWITTER_URL = "https://twitter.com/";
const TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";

var title = "";

function fetchUserName(id) {
  fetch("https://api.twitter.com/1.1/users/show.json?user_id=" + id.slice(3, -1), {
    headers: {
      "Authorization": TWITTER_AUTH
    }
  })
  .then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        chrome.storage.sync.set({"twus": data.screen_name});
      });
    };
  });
};

function myListener(int, info, tab) {
  if (tab.url) {
    if (tab.url.includes("https://twitter.com/") &&
      !tab.url.includes("https://twitter.com/i/") &&
      !tab.url.includes("https://twitter.com/hashtag") &&
      !tab.url.includes("https://twitter.com/search") &&
      !tab.url.includes("https://ads.twitter.com") &&
      !tab.url.includes("https://analytics.twitter.com/") &&
      !tab.url.includes("https://studio.twitter.com/") &&
      !tab.url.includes("https://twitter.com/settings/") &&
      !tab.url.includes("https://support.twitter.com/") &&
      !tab.url.includes("/status") &&
      !tab.url.includes("/lists") &&
      !tab.url.includes("/following") &&
      !tab.url.includes("/followers") &&
      !tab.url.includes("/likes") &&
      !tab.url.includes("/?") &&
      TWITTER_URL.match(tab.url) == null) {
        chrome.cookies.get({url: "https:twitter.com/", name: "twid"}, (cookie) => {
          if (cookie !== null) {
            if (info.title == tab.title) {

              chrome.storage.sync.get("twid", (value) => {
                if (value.twid !== cookie.value) {
                  chrome.storage.sync.set({"twid": cookie.value});
                  fetchUserName(cookie.value);
                }
              })

              title = info.title;
              setTimeout(() => {
                chrome.tabs.executeScript(tab.id, {
                  file: "index.js"
                });
              }, 500);
            };
          }
        })
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.url) {
    chrome.tabs.create({url: request.url});
  }
})

chrome.tabs.onUpdated.addListener(myListener);
