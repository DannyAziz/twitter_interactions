var TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";
var other_user = document.getElementsByClassName("ProfileHeaderCard-screennameLink u-linkComplex js-nav")[0].children[0].children[0].textContent;
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var count = 0;

var container = document.getElementsByClassName("SidebarCommonModules")[0];

var module = document.createElement("div");
module.className += "module";
module.style = "margin-top: 10px;";

var flex_module = document.createElement("div");
flex_module.className += "flex-module";

var spinner = document.createElement("span");
spinner.className += "spinner"

var flex_module_header = document.createElement("div");
flex_module_header.className += "flex-module-header";

var header = document.createElement("h3");
header.textContent = "Interactions";
flex_module_header.append(header);

flex_module.append(flex_module_header);
flex_module.append(spinner)

var flex_module_inner = document.createElement("div");
flex_module_inner.className += "flex-module-inner";
flex_module_inner.style = "max-height: 300px; overflow-y: scroll; margin-right: -15px; margin-left: -15px; margin-bottom: -15px;";

var tweet_stream = document.createElement("ol");
tweet_stream.className += "stream-items js-navigable-stream";

module.append(flex_module);



function sortByDate(a, b) {
  a = new Date(a.created_at);
  b = new Date(b.created_at);
  return a>b ? -1 : a<b ? 1 : 0;
}

function addInteractions(current_user) {
  if (container.children.length < 4) {
    container.insertBefore(module, container.children[0]);
    interactionsSearch(current_user);
  } else {
  }
}

function searchParse(from, to) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","https://twitter.com/search?q=from%3A" + from + "%20to%3A" + to + "&src=typd&lang=en",false);
  xmlhttp.send();
  let parser = new DOMParser();
  let search_dom = parser.parseFromString(xmlhttp.responseText,"text/html");
  let stream = search_dom.getElementsByClassName("stream-items js-navigable-stream")[0]
  let tweet_ids = [];
  for (child in [...Array(stream.children.length).keys()]) {
    tweet_ids.push(stream.children[child].dataset.itemId)
  };
  return tweet_ids
}

function openTweet(tweet) {
  chrome.runtime.sendMessage({url: "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str});
}

function parseTweet(tweet) {
  var tweetElem = document.createElement("li");
  tweetElem.className += "js-stream-item stream-item stream-item";
  tweetElem.style = "border-left-width: 0;"

  var tweetDiv = document.createElement("div");
  tweetDiv.className += "tweet js-stream-tweet js-actionable-tweet js-profile-popup-actionable dismissible-content original-tweet js-original-tweet";
  tweetDiv.dataset.tweetId = tweet.id_str;
  tweetDiv.dataset.permalinkPath = "/" + tweet.user.screen_name + "/status/" + tweet.id_str;
  tweetDiv.dataset.itemId = tweet.id_str;
  tweetDiv.onclick = () => {
    openTweet(tweet);
  }

  var tweetContent = document.createElement("div");
  tweetContent.className += "content";

  var tweetHeader = document.createElement("div");
  tweetHeader.className += "stream-item-header";

    var headerA = document.createElement("a");
    headerA.className += "account-group js-account-group js-action-profile js-user-profile-link js-nav";

      var headerImage = document.createElement("img");
      headerImage.className += "avatar js-action-profile-avatar";
      headerImage.src = tweet.user.profile_image_url_https;

      headerA.append(headerImage);

      var headerName = document.createElement("span");
      headerName.className += "FullNameGroup";


      var headerNameStrong = document.createElement("strong");
      headerNameStrong.className += "fullname show-popup-with-id";
      headerNameStrong.textContent = tweet.user.name;

      headerName.append(headerNameStrong);

      headerA.append(headerName);


  tweetHeader.append(headerA);

  tweetContent.append(tweetHeader);

    var tweetTextContent = document.createElement("div");
    tweetTextContent.className += "js-tweet-text-container";

    var tweetTextP = document.createElement("p");
    tweetTextP.style = "font-size: 14px;";
    tweetTextP.textContent = tweet.text;

    tweetTextContent.append(tweetTextP)

  tweetContent.append(tweetTextContent);

  tweetDiv.append(tweetContent);

  tweetElem.append(tweetDiv);

  tweet_stream.append(tweetElem);
}

function interactionsSearch(current_user) {
  first_tweet_ids = searchParse(current_user, other_user);
  second_tweet_ids = searchParse(other_user, current_user);
  var tweet_ids = first_tweet_ids.concat(second_tweet_ids);

  if (tweet_ids.length != 0) {
    fetch("https://api.twitter.com/1.1/statuses/lookup.json?id=" + tweet_ids.join(","), {
      headers: {
        "Authorization": TWITTER_AUTH
      }
    })
    .then((response) => {
      response.json().then((data) => {
        tweets = data.sort(sortByDate);
        for (tweet in tweets) {
          parseTweet(tweets[tweet]);
        };
        flex_module_inner.append(tweet_stream)
      })
    })
  } else {
    flex_module_inner.textContent = "You haven't interacted with " + document.getElementsByClassName("ProfileHeaderCard-nameLink u-textInheritColor js-nav")[0].textContent + " before. Say Hey!";
    flex_module_inner.style = "max-height: 300px; overflow-y: auto; font-size: 14px;"
  }

  flex_module.append(flex_module_inner);
  spinner.remove();

}


chrome.storage.sync.get("twus", (value) => {
  twitter_user_name = value.twus;
  addInteractions(twitter_user_name);
})
