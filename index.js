var TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";

tweet_stream = document.createElement("div");
tweet_stream.className = 'css-1dbjc4n';
tweet_stream.style.maxHeight = '300px';
tweet_stream.style.overflowY = 'scroll';

let state = {
    currentUser: '',
};

function sortByDate(a, b) {
    a = new Date(a.created_at);
    b = new Date(b.created_at);
    return a>b ? -1 : a<b ? 1 : 0;
}

function addInteractions(current_user) {
    var container = document.getElementsByClassName("css-1dbjc4n r-1l5qxre r-m611by")[0];
    var mainModule = createContainerElem();

    if (document.body.style.backgroundColor !== 'rgb(255, 255, 255)') {
        mainModule.className += ' r-1uaug3w r-1uhd6vh'
        let asideHeaderTextElementWrapper = mainModule.querySelector('[id="interactions-header-container"]');
        let asideHeader = mainModule.querySelector('[id="interactions-header-wrapper"]');
        asideHeaderTextElementWrapper.className += " r-jwli3a" 
        asideHeader.className += " r-1ila09b"
    }

    container.insertBefore(mainModule, container.children[4]);
    interactionsSearch(current_user, mainModule);
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

    tweetArticle.className = 'tweet-interaction';

    if (document.body.style.backgroundColor !== 'rgb(255, 255, 255)') {
        tweetArticle.className += ' tweet-interaction-dark';
    }

    tweetArticle.innerHTML = `
    <div class='tweet-interaction-image'>
        <img alt="" draggable="false" src="${tweet.user.profile_image_url_https}">
    </div>
    <div class='tweet-interaction-text'>
        <p>${tweet.text}</p>
    </div>
    `

    tweetArticle.onclick = () => {
        openTweet(tweet);
    }
    tweet_stream.append(tweetArticle);
}

async function interactionsSearch(current_user, mainModule) {
    let aside = mainModule.getElementsByTagName('aside')[0];
    let spinner = mainModule.querySelector('[id="interactions-spinner"]');
    let otherUserName = state.currentUser;
    if (current_user != otherUserName) {
        const results = await Promise.all([searchParse(current_user, otherUserName), searchParse(otherUserName, current_user)].map(p => p.catch(e => e)));
        const validResults = results.filter(result => !(result == "error"));
        let tweetIDS = validResults.flat(1);
        if (tweetIDS.length !== 0) {
            chrome.runtime.sendMessage({type: "tweetFetch", tweetIDS}, function(response) {
                tweets = response.data.sort(sortByDate);
                for (tweet in tweets) {
                    parseTweet(tweets[tweet]);
                };
                aside.append(tweet_stream);
            });
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
    } else {
        mainModule.remove();
    }
};

var createContainerElem = () => {
    var mainModule = document.createElement('div');
    mainModule.id = 'interactionModule';
    mainModule.className = 'css-1dbjc4n r-t23y2h r-1phboty r-rs99b7 r-15d164r r-1udh08x r-9cbz99 r-1u4rsef r-9cbz99 r-1u4rsef'
    mainModule.innerHTML = `
        <div class="css-1dbjc4n r-gzqks2">
            <aside id='interactions-aside' class="css-1dbjc4n">
                <div id='interactions-header-wrapper' class="css-1dbjc4n r-my5ep6 r-rull8r r-qklmqi r-1wtj0ep r-1sp51qo">
                    <h2 class="css-4rbku5 css-1dbjc4n r-1awozwy r-18u37iz r-1wtj0ep"><div id='interactions-header-container' class="css-901oao css-bfa6kz r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0  r-hkyrab r-hkyrab"><span class="css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0">Your Interactions</span></div></h2></div>
                <div class="css-1dbjc4n" style="max-height: 300px; overflow-y: scroll;">
                </div>
            </aside>
            <div id='interactions-spinner' class="css-1dbjc4n r-1awozwy r-1777fci">
                <div class="css-1dbjc4n r-17bb2tj r-1muvv40 r-127358a r-1ldzwu0" css-901oao css-bfa6kz r-1qd0xha r-1b6yd1w r-1vr29t4 r-ad9z0x r-bcqeeo r-qvutc0 style="height:26px; width:26px;">
                    <svg height="100%" viewBox="0 0 32 32" width="100%"><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 161, 242); opacity: 0.2;"></circle><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29, 161, 242); stroke-dasharray: 80; stroke-dashoffset: 60;"></circle></svg>
                </div>
            </div>
        </div>
    `;
    mainModule.dataset['currentUser'] = state.currentUser;
    mainModule.getElementById
    return mainModule;
}

var createContainer = () => {
    chrome.storage.sync.get("twus", (value) => {
        twitter_user_name = value.twus;
        addInteractions(twitter_user_name);
    });
};

var loop = () => {
    setTimeout(() => {
        var container = document.getElementsByClassName("css-1dbjc4n r-1l5qxre r-m611by")[0];
        var element = document.querySelector('[aria-label="Profile timelines"]');
        if (container && element) {
            if (state.currentUser !== location.pathname.replace('/', '')) {
                tweet_stream.innerHTML = '';
                state.currentUser = location.pathname.replace('/', '');
                var mainModule = document.getElementById('interactionModule');
                if (mainModule) {
                    mainModule.remove()
                }
                createContainer();
            }
        } else {
            state.currentUser = '';
        }
        loop();
    }, 1000);
}


loop();
