var TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";
var otherUserName = location.href.replace("https://twitter.com/", "");
console.log(otherUserName);
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var count = 0;

var container = document.getElementsByClassName("css-1dbjc4n r-1l5qxre r-m611by")[0];

var mainModule = document.createElement("div");
mainModule.className += "css-1dbjc4n r-1u4rsef r-9cbz99 r-t23y2h r-1phboty r-rs99b7 r-15d164r r-1udh08x";

var flex_module = document.createElement("div");
flex_module.className += "css-1dbjc4n r-gzqks2";

var aside = document.createElement("aside");
aside.className = 'css-1dbjc4n';

var asideHeader = document.createElement("div");
asideHeader.className = 'css-1dbjc4n r-my5ep6 r-rull8r r-qklmqi r-1wtj0ep r-1sp51qo';

var asideHeaderTextElement = document.createElement("h2");
asideHeaderTextElement.className = 'css-4rbku5 css-1dbjc4n r-1awozwy r-18u37iz r-1wtj0ep'
var asideHeaderTextElementWrapper = document.createElement("div");
asideHeaderTextElementWrapper.className = 'css-901oao css-bfa6kz r-hkyrab r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0'
var asideHeaderTextSpan = document.createElement("span");
asideHeaderTextSpan.className = 'css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0';
asideHeaderTextSpan.textContent = 'Your Interactions';

asideHeaderTextElementWrapper.appendChild(asideHeaderTextSpan);
asideHeaderTextElement.appendChild(asideHeaderTextElementWrapper);

asideHeader.appendChild(asideHeaderTextElement);
aside.appendChild(asideHeader);

var asideContent = document.createElement("div");
asideContent.className = 'css-1dbjc4n';

flex_module.appendChild(aside);
mainModule.appendChild(flex_module);

var spinner = document.createElement("div");
spinner.className = 'css-1dbjc4n r-1awozwy r-1777fci';
var spinnerInner = document.createElement("div");
spinnerInner.className = 'css-1dbjc4n r-17bb2tj r-1muvv40 r-127358a r-1ldzwu0';
spinnerInner.style.height = '26px';
spinnerInner.style.width = '26px';
spinnerInner.innerHTML = '<svg height="100%" viewBox="0 0 32 32" width="100%"><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 161, 242); opacity: 0.2;"></circle><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 161, 242); stroke-dasharray: 80; stroke-dashoffset: 60;"></circle></svg>';
spinner.appendChild(spinnerInner);
flex_module.appendChild(spinner);

tweet_stream = document.createElement("div");
tweet_stream.className = 'css-1dbjc4n';


function sortByDate(a, b) {
    a = new Date(a.created_at);
    b = new Date(b.created_at);
    return a>b ? -1 : a<b ? 1 : 0;
}

function addInteractions(current_user) {
    container.insertBefore(mainModule, container.children[4]);
    interactionsSearch(current_user);
}

function parsePartialHtml(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html'),
        frag = document.createDocumentFragment(),
        childNodes = doc.body.childNodes;

    while (childNodes.length) frag.appendChild(childNodes[0]);

    return frag;
}

function fixScriptsSoTheyAreExecuted(el) {
    var scripts = el.querySelectorAll('script'),
        script, fixedScript, i, len;

    for (i = 0, len = scripts.length; i < len; i++) {
        script = scripts[i];

        fixedScript = document.createElement('script');
        fixedScript.type = script.type;
        if (script.innerHTML) fixedScript.innerHTML = script.innerHTML;
        else fixedScript.src = script.src;
        fixedScript.async = false;

        script.parentNode.replaceChild(fixedScript, script);
    }
}

function searchParse(from, to) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000/fetch-interactions?from_user=${from}&to_user=${to}`)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    resolve(data);
                });
            };
        });
    });
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
    Promise.all([searchParse(current_user, otherUserName), searchParse(otherUserName, current_user)])
    .then(data => {
        let tweetIDS = data.flat(1);
        if (tweetIDS.length != 0) {
            fetch("https://api.twitter.com/1.1/statuses/lookup.json?id=" + tweetIDS.join(","), {
                headers: {
                "Authorization": TWITTER_AUTH
                }
            })
            .then((response) => {
                response.json().then((data) => {
                    console.log(data);
                    tweets = data.sort(sortByDate);
                    for (tweet in tweets) {
                        parseTweet(tweets[tweet]);
                    };
                    flex_module.append(tweet_stream)
                })
            })
        } else {
            flex_module.textContent = "You haven't interacted with " + document.getElementsByClassName("ProfileHeaderCard-nameLink u-textInheritColor js-nav")[0].textContent + " before. Say Hey!";
            flex_module.style = "max-height: 300px; overflow-y: auto; font-size: 14px;"
        }
        spinner.remove();
    });
}

chrome.storage.sync.get("twus", (value) => {
    twitter_user_name = value.twus;
    addInteractions(twitter_user_name);
});

