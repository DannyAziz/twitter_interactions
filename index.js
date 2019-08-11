var nightMode = false;
var TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";
var otherUserName = location.href.replace("https://twitter.com/", "");

var container = document.getElementsByClassName("css-1dbjc4n r-1l5qxre r-m611by")[0];

var mainModule = document.createElement("div");
mainModule.id = 'interactionModule';
mainModule.className += "css-1dbjc4n r-t23y2h r-1phboty r-rs99b7 r-15d164r r-1udh08x";

var flex_module = document.createElement("div");
flex_module.className += "css-1dbjc4n r-gzqks2";

var aside = document.createElement("aside");
aside.className = 'css-1dbjc4n';

var asideHeader = document.createElement("div");
asideHeader.className = 'css-1dbjc4n r-my5ep6 r-rull8r r-qklmqi r-1wtj0ep r-1sp51qo';

var asideHeaderTextElement = document.createElement("h2");
asideHeaderTextElement.className = 'css-4rbku5 css-1dbjc4n r-1awozwy r-18u37iz r-1wtj0ep'
var asideHeaderTextElementWrapper = document.createElement("div");
asideHeaderTextElementWrapper.className = 'css-901oao css-bfa6kz r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0 '
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
tweet_stream.style.maxHeight = '300px';
tweet_stream.style.overflowY = 'scroll';


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
        fetch(`https://fy374ckv00.execute-api.eu-west-1.amazonaws.com/api/fetch-interactions?from_user=${from}&to_user=${to}`)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    resolve(data);
                });
            } else {
                reject('error')
            }
        })
        .catch((error) => {
            reject(error);
        })
    });
}

function openTweet(tweet) {
    chrome.runtime.sendMessage({url: "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str});
}

function parseTweet(tweet) {
    var tweetArticle = document.createElement("article");

    tweetArticle.className = 'css-1dbjc4n r-1loqt21 r-1udh08x r-o7ynqc r-1j63xyz r-1ila09b r-qklmqi r-1adg3ll';

    if (!nightMode) {
        tweetArticle.className += ' r-my5ep6';
    }

    tweetArticle.innerHTML = `
    <div class="css-1dbjc4n r-1j3t67a">
            <div class="css-1dbjc4n r-m611by"></div>
            <div class="css-1dbjc4n r-18u37iz r-thb0q2" data-testid="tweet">
                <div class="css-1dbjc4n r-1awozwy r-1iusvr4 r-16y2uox r-5f2r5o r-1gmbmnb r-bcqeeo">
                    <div class="css-1dbjc4n r-18kxxzh r-1wbh5a2 r-13qz1uu">
                        <div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
                            <a aria-haspopup="false" href="${"/" + tweet.user.screen_name + "/status/" + tweet.id_str}" target="_blank" role="link" data-focusable="true" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-sdzlij r-1loqt21 r-1adg3ll r-1udh08x r-13qz1uu">
                                <div class="css-1dbjc4n r-1adg3ll r-1udh08x" style="">
                                    <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 100%;"></div>
                                    <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                                        <div class="css-1dbjc4n r-sdzlij r-1p0dtai r-1mlwlqe r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010">
                                            <div class="css-1dbjc4n r-1niwhzg r-vvn4in r-u6sd8q r-4gszlv r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw" style="background-image: url(${tweet.user.profile_image_url_https});"></div><img alt="" draggable="false" src="${tweet.user.profile_image_url_https}" class="css-9pa8cd"></div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="css-1dbjc4n r-1iusvr4 r-46vdb2 r-1777fci r-5f2r5o r-bcqeeo r-1mi0q7o">
                    <div class="css-1dbjc4n r-18u37iz r-1wtj0ep r-zl2h9q">
                        <div class="css-1dbjc4n r-1d09ksm r-18u37iz r-1wbh5a2">
                            <div class="css-1dbjc4n r-1wbh5a2 r-dnmrzs">
                                <a aria-haspopup="false" href="${"/" + tweet.user.screen_name + "/status/" + tweet.id_str}" target="_blank" role="link" data-focusable="true" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs">
                                    <div class="css-1dbjc4n r-18u37iz r-1wbh5a2 r-dnmrzs">
                                        <div class="css-1dbjc4n r-18u37iz r-dnmrzs">
                                            <div dir="auto" class="css-901oao css-bfa6kz ${(nightMode ? "r-jwli3a" : "r-hkyrab")} r-1qd0xha r-a023e6 r-vw2c0b r-ad9z0x r-bcqeeo r-3s2u2q r-qvutc0">
                                                <span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">
                                                    <span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">
                                                        ${tweet.user.name}
                                                    </span>
                                                </span>
                                            </div>
                                            <div dir="auto" class="css-901oao ${(nightMode ? "r-jwli3a" : "r-hkyrab")} r-18u37iz r-1q142lx r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0"></div>
                                        </div>
                                        <div class="css-1dbjc4n r-18u37iz r-1wbh5a2 r-1f6r7vd">
                                            <div dir="ltr" class="css-901oao css-bfa6kz r-111h2gw r-18u37iz r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0"><span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">@${tweet.user.screen_name}</span></div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div dir="auto" aria-hidden="true" class="css-901oao r-111h2gw r-1q142lx r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-ou255f r-qvutc0"><span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">·</span></div>
                        </div>
                    </div>
                    <div lang="en" dir="auto" class="${(nightMode ? "r-jwli3a" : "r-hkyrab")} r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0">
                        <span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">${tweet.text}</span>
                    </div>
                </div>
            </div>
        </div>
    `
    tweetArticle.onclick = () => {
        openTweet(tweet);
    }
    tweet_stream.append(tweetArticle);
}

function interactionsSearch(current_user) {
    if (current_user != otherUserName) {
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
                        tweets = data.sort(sortByDate);
                        for (tweet in tweets) {
                            parseTweet(tweets[tweet]);
                        };
                        aside.append(tweet_stream)
                    })
                })
            } else {
                var messageContainer = document.createElement("div");
                messageContainer.textContent = "You haven't interacted with " + otherUserName + " before. Say Hey!";
                messageContainer.className = 'css-1dbjc4n css-901oao r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0'
                messageContainer.className += (nightMode ? " r-jwli3a" : " r-hkyrab");
                messageContainer.style.padding = "20px";
                messageContainer.style.fontSize = "14px";
                messageContainer.style.textAlign = "center";

                aside.appendChild(messageContainer);
            }
            spinner.remove();
        })
        .catch((error) => {
            var messageContainer = document.createElement("div");
            messageContainer.textContent = "You haven't interacted with " + otherUserName + " before. Say Hey!";
            messageContainer.className = 'css-1dbjc4n css-901oao r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0'
            messageContainer.className += (nightMode ? " r-jwli3a" : " r-hkyrab");
            messageContainer.style.padding = "20px";
            messageContainer.style.fontSize = "14px";
            messageContainer.style.textAlign = "center";
            aside.appendChild(messageContainer);
            spinner.remove();
        })
    } else {
        mainModule.remove();
    }
};

var createContainer = () => {
    var interactionModule = document.getElementById("interactionModule");
    if (interactionModule) {
        interactionModule.remove();
    }
    chrome.storage.sync.get("twus", (value) => {
        twitter_user_name = value.twus;
        addInteractions(twitter_user_name);
    });
    
    chrome.storage.sync.get("night_mode", (resp) => {
        if (resp.night_mode == '1') {
            nightMode = true;
        };
        mainModule.className += (nightMode ? ' r-1uaug3w r-1uhd6vh': ' r-9cbz99 r-1u4rsef');
        asideHeaderTextElementWrapper.className += (nightMode ? " r-jwli3a" : " r-hkyrab");
        asideHeader.className += (nightMode ? " r-1ila09b" : "")
    });
};

createContainer();