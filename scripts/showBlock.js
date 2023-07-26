const favicon = "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=";
var qwitterBypassed = false;

const loading_bar_width = 300;
const loading_time = 1000 * 10;
const increment = loading_time / loading_bar_width;
var quotes = [];

disableScroll();

// get all quotes
fetch(chrome.runtime.getURL('scripts/quotes.json'))
    .then((resp) => resp.json())
    .then(function (jsonData) {
        quotes = jsonData.quotes;
        startTimer();
    });

// start timer after loading the quotes
function startTimer() {
    // cover whole page with qwitter loading screen
    const dv = document.createElement("div");
    dv.id = "qwitter-block";
    body = document.querySelector("body");
    body.appendChild(dv);

    // select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // add the quote to the page
    const quoteText = document.createElement("div");
    quoteText.id = "qwitter-quote-text";
    quoteText.innerHTML = '"' + randomQuote.quote + '"';

    const quoteAuthor = document.createElement("div");
    quoteAuthor.id = "qwitter-quote-author";
    quoteAuthor.innerHTML = " - " + randomQuote.author;

    dv.appendChild(quoteText);
    dv.appendChild(quoteAuthor);

    // create progress bar
    const progressBar = document.createElement("div");
    progressBar.id = "qwitter-progress-bar";
    const loading = document.createElement("div");
    loading.id = "qwitter-progress";
    progressBar.appendChild(loading);

    dv.appendChild(progressBar);

    i = 1;
    moveBar(loading, i);

}

// increment the progress bar 1% at a time
function moveBar(loading, i) {
    if (i == loading_bar_width) {
        // remove bar and add buttons after bar is done
        loading.parentElement.remove();
        addButtons();
    }
    else {
        i++;
        window.scrollTo(0, 0);
        if (document.querySelector("#qwitter-block") == null) {
            alert("Nice try!");
            startTimer();
        }
        loading.style.width = i + "px";
        setTimeout(moveBar.bind(null, loading, i), increment);
    }
}

// add buttons
function addButtons() {
    const btnDiv = document.createElement("div");
    btnDiv.id = "qwitter-btn-div";

    // just remove both buttons if 'no' is clicked
    const quitBtn = document.createElement("button");
    quitBtn.id = "qwitter-quit-btn";
    quitBtn.innerHTML = "I don't want to waste my time on Twitter";
    quitBtn.addEventListener("click", function() { this.parentElement.remove(); });

    // if 'continue' is clicked, remove the qwitter loading screen
    const continueBtn = document.createElement("button");
    continueBtn.id = "qwitter-continue-btn";
    continueBtn.innerHTML = "Continue to Twitter";
    continueBtn.addEventListener("click", function() {
        dv.remove();
        enableScroll();
    });

    btnDiv.appendChild(quitBtn);
    btnDiv.appendChild(continueBtn);

    dv.appendChild(btnDiv);
}

function refresh_icon() {
    if (qwitterBypassed) {
        return;
    }
    document.title = "Twitter";
    var link = document.querySelector("link[rel~='icon']");
    link.href = favicon;
    setTimeout(refresh_icon, 50);
}

setTimeout(refresh_icon, 50);



