let question = document.querySelector(".question");
let optionsList = document.querySelectorAll(".option");
let timer = document.querySelector(".count");
let outcome = document.querySelector(".outcome");
let viewHighscores = document.querySelector("#highscores");
let cardContainer = document.querySelector(".card-container");
let cardTitle = document.querySelector(".question-count");
let currrentQuestion = document.querySelector(".question-start");
let questionRemaining = document.querySelector(".question-remaining");
let questionTimer = 60;
let queestionTimerSub = 10;
let questionCount = 0;
let questionCountText = 1;
let scores = []
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
    let correctAnswer = 0;

    function setInitialValues() {
        timer.innerHTML = questionTimer;
        currrentQuestion.innerHTML = questionCountText;
        loadNextQuestion(questionCount);
    }
    setInitialValues();
    let count = setInterval(countDown, 1000);
    function countDown() {
        if (questionTimer !== 0) {
            timer.innerHTML = --questionTimer;
        }
        else {
            addHighscore(correctAnswer);
        }
    }
    // add event listener to each option and check if click is the correct answer
    for (let i = 0; i < optionsList.length; i++) {
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
    let isQuestionAnswered = [];

    for (let j = 0; j < questionList.length; j++) {
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
            for (let i = 0; i < optionsList.length; i++) {
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
        let answered = isQuestionAnswered.filter(isAnswered);
        if (answered.length == questionList.length) {
            setTimeout(function () {
                addHighscore(correctAnswer);
            }, 1000);
        }
    }
    function scoresSet() {
        let storedScores = JSON.parse(localStorage.getItem("scores"));

        if (storedScores !== null) {
            scores = storedScores;
        }
    }
    function addHighscore(score) {
        scoresSet();
        if (score != 0) {
            let finalScore = (score / questionList.length) * 100;
        }
        else {
            finalScore = 0;
        }
        clearInterval(count);

        cardContainer.innerHTML = "";
        let promt1 = document.createElement("h4");
        let inputBox = document.createElement("input");
        let submitButton = document.createElement("button");
        submitButton.innerText = "Submit";
        promt1.innerText = "Enter Name";
        let lookAtThisDiv = document.createElement("div");
        cardContainer.appendChild(lookAtThisDiv);
        lookAtThisDiv.classList.add("end-options");
        lookAtThisDiv.appendChild(promt1)
        lookAtThisDiv.appendChild(inputBox)
        lookAtThisDiv.appendChild(submitButton)
        promt1Handle = document.querySelector("input");
        promt1Handle.setAttribute("value", "");
        let name = "";
        let subHit = document.querySelector("button");
        subHit.addEventListener("click", function () {
            name = promt1Handle.value;
            scores.push({ user: name, userScore: finalScore })
            localStorage.setItem("scores", JSON.stringify(scores));
            loadHighScores();
        });

    }

    function loadHighScores() {
        cardContainer.innerHTML = "";
        let title = document.createElement("h1");
        let list = document.createElement("ul");
        let myDiv = document.createElement("div");
        myDiv.classList.add("end-options");
        let buttonRetry = document.createElement("button");
        let buttonClear = document.createElement("button");
        list.classList.add("scores-list");
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

        for (let m = 0; m < scores.length; m++) {
            let li = document.createElement("li");
            li.innerHTML = "User: " + scores[m].user + " -- " + " Score: " + scores[m].userScore;
            list.appendChild(li);
        }
    }

