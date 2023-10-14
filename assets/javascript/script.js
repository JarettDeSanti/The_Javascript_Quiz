var quizQuestions = [
    {
        question: "Which of the following is an example of a boolean?",
        choices: [
            "1. class",
            "2. 10",
            "3. false",
            "4. '300'"
        ],
        answer: 2
    },
    {
        question: "When linking a Javascript file to an HTML document, where is the &lt;script&gt; tag placed?",
        choices: [
            "1. In the CSS",
            "2. In the HTML",
            "3. In the Javascript",
            "4. None of the above"
        ],
        answer: 1
    },
    {
        question: "Which method is used to insert a new element at the end of an array?",
        choices: [
            "1. unshift()",
            "2. push()",
            "3. pop()",
            "4. None of the above"
        ],
        answer: 1
    },
    {
        question: "Which method returns the first element within the document that matches the specified selector?",
        choices: [
            "1. getElementByClass()",
            "2. getElementById()",
            "3. querySelector()",
            "4. None of the above"
        ],
        answer: 2
    },
    {
        question: "OnClick event is used to handle:",
        choices: [
            "1. change events",
            "2. window size",
            "3. mouse sensitivity",
            "4. click events"
        ],
        answer: 3
    },
];

var scores = [];
if(localStorage.getItem('scores')) {
    scores = JSON.parse(localStorage.getItem('scores'));
}

var startQuizButton = document.getElementById("start-button");
var submitButton = document.getElementById("submit-button");
var quizIntro = document.getElementById("intro");
var timerInterval = document.getElementById("timerInterval");
var timerStatement = document.getElementById("timer");
var viewHighScores = document.getElementById("scores");
var viewHighScorePage = document.getElementById("high-scores");
var highScoresList = document.getElementById("high-scores-list");
var clearHighscoreButton = document.getElementById('clear-highscore-button');
var quizCompletePage = document.getElementById("quiz-complete");
var timerSection = document.getElementById("timer");


var quiz = document.getElementById("quiz");
var question = document.getElementById("question");
var answers = document.getElementById("answers");
var questionFeedback = document.getElementById('question-feedback');
var finalScore = document.getElementById('final-score');

var initialsText = document.getElementById('initials-text');

var timeLeft = 76;
var staticTime = 0;
var timeDeduction = 10;
var score = 0;
var gameOver = false;


var setIntervalFunction;
var generateTimer = function () {
    // Sets interval in variable
    setIntervalFunction = setInterval(function () {
        timeLeft--;
        timerInterval.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame("Out of time!");
        }

    }, 1000);
}


startQuizButton.addEventListener("click", function () {
    generateTimer();
    quizStart();
})


viewHighScores.addEventListener("click", function () {
    showHighScores();
});

clearHighscoreButton.addEventListener("click", function () {
    clearHighScores();
});


function quizStart() {
    quizIntro.style.display = "none";
    quiz.style.display = "block";
    nextQuestion(0);
}

function nextQuestion(index) {
    question.innerHTML = quizQuestions[index].question;
    answers.innerHTML = '';
    questionFeedback.innerHTML = '';
    questionFeedback.style.display = "none";

    quizQuestions[index].choices.forEach(function (choice, c_index) {
        var input = document.createElement('input');
        input.id = 'answer-' + c_index;
        input.name = 'answer-' + index;
        input.type = 'radio';
        input.classList.add('answer-input');
        input.value = choice;

        input.addEventListener('change', function () {
            if (c_index == quizQuestions[index].answer) {
                questionFeedback.innerHTML = 'correct';
                //score++;
            } else {
                questionFeedback.innerHTML = 'wrong';
                timeLeft -= 10;
            }

            document.querySelectorAll('.answer-input').forEach(function (answerInput) {
                answerInput.disabled = 'true';
            });
        
            questionFeedback.style.display = "block";
            if (index + 1 < quizQuestions.length) {
                setTimeout(function () {
                    nextQuestion(index + 1);
                }, 1000);
            } else {
                quizComplete();
            }
        });

        var label = document.createElement('label');
        label.innerHTML = choice;
        label.setAttribute('for', 'answer-' + c_index);

        var br = document.createElement('br');

        answers.appendChild(input);
        answers.appendChild(label);
        answers.appendChild(br);
    });
}

function quizComplete() {
    //score = (score * 10) * timeLeft;
    score = timeLeft;
    endGame('Time: 0');
    //timerSection.textContent = "Time: 0";
}

function showHighScores(){
    function compareScores(a, b) {
        return b.score - a.score;
    }
    scores.sort(compareScores);

    highScoresList.innerHTML = '';

    scores.forEach(function(player){
        var li = document.createElement('li');
        li.innerHTML = player.name + ' - ' + player.score;
        highScoresList.append(li);
    });

    quizIntro.style.display = "none";
    quizCompletePage.style.display = "none";
    quiz.style.display = "none";
    viewHighScorePage.style.display = "block";
}

function clearHighScores(){
    localStorage.removeItem('scores');
    scores = [];
    showHighScores();
}

submitButton.addEventListener("click", function () {
    var initials = initialsText.value.trim();
    if(initials == '') {
        alert('Initials are required to save your score')
    } else {
        var player = scores.find(({ name }) => name === initials);
        if(typeof(player) === 'undefined'){
            scores.push({ name: initials, score: score });
        } else {
            scores.forEach(function(player){
                if(player.name == initials && player.score < score){
                    player.score = score;
                }
            });
        }

        localStorage.setItem('scores', JSON.stringify(scores));

        showHighScores();
    }
});

function endGame(timerMessage) {
    // Stops execution of action at set interval
    clearInterval(setIntervalFunction);
    timerSection.textContent = timerMessage;
    quiz.style.display = "none";
    quizCompletePage.style.display = "block";
    finalScore.innerHTML = 'Your final score is ' + score + '.';
}
