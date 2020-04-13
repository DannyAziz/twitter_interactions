const TWITTER_URL = "https://twitter.com/";
const TWITTER_AUTH = "Bearer AAAAAAAAAAAAAAAAAAAAAFGa1wAAAAAAuGnnYw4j106lO4MugBS1sxeqVSE%3DrgSjxkWNO217j5VtJc7WJmn7XBq894A3wfxlZEEdUK60ZKfmD0";

var title = "";

function fetchUserName(id) {
    fetch(`https://api.twitter.com/1.1/users/show.json?user_id=${id.replace("u%3D", "")}`, {
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


function getTweets(tweets) {
    fetch("https://api.twitter.com/1.1/statuses/lookup.json?id=" + tweetIDS.join(","), {
        headers: {
            "Authorization": TWITTER_AUTH
        }
    })
    .then((response) => {
        console.log(response.body)
        response.json().then((data) => {
            
        })
    })
}

function fetchTweets(from, to, sendResponse) {
    fetch(`http://localhost:8000/fetch-interactions?from_user=${from}&to_user=${to}`)
    .then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                sendResponse(data);
            });
        };
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.url) {
        chrome.tabs.create({url: request.url});
    } else if (request.from && request.to) {
        fetchTweets(request.from, request.to, sendResponse);
    } else if (request.type === 'tweetFetch') {
        fetch("https://api.twitter.com/1.1/statuses/lookup.json?id=" + request.tweetIDS.join(","), {
            headers: {
                "Authorization": TWITTER_AUTH
            }
        })
        .then((response) => {
            response.json().then((data) => {
                sendResponse({data: data})
            })
        })
        return true;
    }
})
