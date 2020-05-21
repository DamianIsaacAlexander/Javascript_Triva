var question = document.querySelector(".question");
var optionsList = document.querySelectorAll(".option");
var timer = document.querySelector(".count");
var outcome = document.querySelector(".outcome");
var viewHighscores = document.querySelector("#highscores");
var cardContainer = document.querySelector(".card-container");
var cardTitle = document.querySelector(".question-count");
var currrentQuestion = document.querySelector(".question-start");
var questionRemaining = document.querySelector(".question-remaining");
var questionTimer = 60;
var queestionTimerSub = 10;
var questionCount = 0;
var questionCountText = 1;
var scores = []
//Questions
const questionList = [
    {
        q: 'How do you write "Hello World" in an alert box?',
        options: ['msg("Hello World");', 'msgBox("Hello World");', 'alert("Hello World");', 'console.log(Hello World);'],
        a: 2,
        isA: false
    },
    {
        q: 'How do you create a function in JavaScript?',
        options: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'function myFunction'],
        a: 1,
        isA: false
    },
    {
        q: 'How do you call a function named myFunction in JavaScript?',
        options: ['function();', 'myFunction();', 'function myFunction();', 'myFunction;'],
        a: 1,
        isA: false
    },
    {
        q: 'Which event occurs when the user clicks on an HTML element?',
        options: ["onmouseclick", "onchange", "onmouseover", "onclick"],
        a: 3,
        isA: false
    },
    {
        q: 'How can you add a comment in a JavaScript?',
        options: ['/This is a comment', '<--This is a comment-->', 'This is a comment--!>', '//This is a comment'],
        a: 3,
        isA: false
    }

];

    viewHighscores.addEventListener("click", function () {
        scoresSet();
        loadHighScores();
    })

    questionRemaining.innerHTML = questionList.length;
    var correctAnswer = 0;

    function setInitialValues() {
        timer.innerHTML = questionTimer;
        currrentQuestion.innerHTML = questionCountText;
        loadNextQuestion(questionCount);
    }
    setInitialValues();
    var count = setInterval(countDown, 1000);
    function countDown() {
        if (questionTimer !== 0) {
            timer.innerHTML = --questionTimer;
        }
        else {
            addHighscore(correctAnswer);
        }
    }
    // add event listener to each option and check if click is the correct answer
    for (var i = 0; i < optionsList.length; i++) {
        optionsList[i].addEventListener("click", function (event) {
            if (questionCount < questionList.length) {
                if (event.target.innerHTML === questionList[questionCount].options[questionList[questionCount].a]) {
                    ++correctAnswer;
                    trackAnswers(true, questionCount);
                    ++questionCount;
                    updateQuestionCounter();
                    loadNextQuestion(questionCount, questionTimer);
                }
                else {
                    questionTimer -= queestionTimerSub;
                    trackAnswers(false, questionCount);
                    ++questionCount;
                    updateQuestionCounter();
                    loadNextQuestion(questionCount, questionTimer);
                }
            }

        });
    }
    var isQuestionAnswered = [];

    for (var j = 0; j < questionList.length; j++) {
        isQuestionAnswered.push(questionList[j].isA);
    }
    function isAnswered(value) {
        if (value != false) {
            return value;
        }
    }

    function updateQuestionCounter() {
        if (questionCountText < 5) {
            ++questionCountText;
            currrentQuestion.innerHTML = questionCountText;
        }
    }
    // Generate Question/Option 
    function loadNextQuestion(num, time) {
        if (time <= 0) {
            addHighscore(correctAnswer)
        }
        else if (num <= optionsList.length) {
            for (var i = 0; i < optionsList.length; i++) {
                question.innerHTML = questionList[num].q;
                optionsList[i].innerHTML = questionList[num].options[i];
            }
        }
    }
    function trackAnswers(result, num) {
        if (isQuestionAnswered.length <= questionList.length) {
            isQuestionAnswered[num] = true;
            checkIfAllAnswered();
        }

        if (result) {
            outcome.innerHTML = "Correct!";
            setTimeout(function () {
                outcome.innerHTML = "";
            }, 1000);
        }
        else {
            outcome.innerHTML = "Wrong!";
            setTimeout(function () {
                outcome.innerHTML = "";
            }, 1000);
        }

    }
    function checkIfAllAnswered() {
        var answered = isQuestionAnswered.filter(isAnswered);
        if (answered.length == questionList.length) {
            setTimeout(function () {
                addHighscore(correctAnswer);
            }, 1000);
        }
    }
    function scoresSet() {
        var storedScores = JSON.parse(localStorage.getItem("scores"));

        if (storedScores !== null) {
            scores = storedScores;
        }
    }
    function addHighscore(score) {
        scoresSet();
        if (score != 0) {
            var finalScore = (score / questionList.length) * 100;
        }
        else {
            finalScore = 0;
        }
        clearInterval(count);

        cardContainer.innerHTML = "";
        var promt1 = document.createElement("h4");
        var inputBox = document.createElement("input");
        var submitButton = document.createElement("button");
        submitButton.innerText = "Submit";
        promt1.innerText = "Enter Name";
        var lookAtThisDiv = document.createElement("div");
        cardContainer.appendChild(lookAtThisDiv);
        lookAtThisDiv.classList.add("end-options");
        lookAtThisDiv.appendChild(promt1)
        lookAtThisDiv.appendChild(inputBox)
        lookAtThisDiv.appendChild(submitButton)
        promt1Handle = document.querySelector("input");
        promt1Handle.setAttribute("value", "");
        var name = "";
        var subHit = document.querySelector("button");
        subHit.addEventListener("click", function () {
            name = promt1Handle.value;
            scores.push({ user: name, userScore: finalScore })
            localStorage.setItem("scores", JSON.stringify(scores));
            loadHighScores();
        });

    }

    function loadHighScores() {
        cardContainer.innerHTML = "";
        var title = document.createElement("h1");
        var list = document.createElement("ul");
        var myDiv = document.createElement("div");
        myDiv.classList.add("end-options");
        var buttonRetry = document.createElement("button");
        var buttonClear = document.createElement("button");
        list.classList.add("scores-list");
        var listHandle = document.querySelector(".scores-list");
        title.innerHTML = "HighScores";
        title.classList.add("question-count");
        cardContainer.appendChild(title);
        cardContainer.appendChild(list);
        cardContainer.appendChild(myDiv);
        myDiv.appendChild(buttonRetry);
        myDiv.appendChild(buttonClear);
        buttonClear.innerText = " clear ";
        buttonRetry.innerText = " retry ";
        if (scores.length > 15) {
            localStorage.clear();
        }
        buttonClear.addEventListener("click", function () {
            localStorage.clear();
            scores = 0;
            loadHighScores();
        });
        buttonRetry.addEventListener("click", function () {
            location.reload();
        });

        for (var m = 0; m < scores.length; m++) {
            var li = document.createElement("li");
            li.innerHTML = "User: " + scores[m].user + " -- " + " Score: " + scores[m].userScore;
            list.appendChild(li);
        }
    }

