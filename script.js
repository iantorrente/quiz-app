'use strict';

const STORE = {
  questionNumber: 0,
  numberCorrect: 0,
  questionsArray: [],
  choice: ""
}

function loadJSON(callback) {
  let xObj = new XMLHttpRequest();
    xObj.overrideMimeType("application/json");
    xObj.open('GET', 'https://api.myjson.com/bins/12oj7y', true);
    xObj.onreadystatechange = function() {
      if (xObj.readyState == 4 && xObj.status == "200") {
        callback(xObj.responseText);
      }
    };
    xObj.send(null);
}

function importQuestionsJSON() {
  //Import questions from JSON or XML file and throw them into STORE.questionsArray
  loadJSON(function(response) {
    STORE.questionsArray = JSON.parse(response).questions;
  });
}

function renderLandingPage() {
  console.log("Rendering landing page");
  $('.quiz-body').append(
    `<div class="welcome">
      <h1>Nonsense In Quiz Form</h1>
      <p>You are about to take part in the most riveting, heart wrenchingly complex, and ravashing flurry of questions in your life. Make sure you are seated, have a pillow to break your fall, and a glass of water to keep yourself hydrated. You are in this for the long haul. I do not eveny you, but what I do envy is your bravery. Godspeed and good luck, you pioneer. <br /><br />
      
      May you be remembered as a hero.</p>
      <button class="start-quiz-btn">Start Quiz</button>
    </div>`
    );
}

function handleStartQuiz() {
  $('.quiz-body').on('click', '.start-quiz-btn', event => {
    console.log("Starting quiz");
    $('.welcome').remove();
    renderTrackers();
    renderQuiz();
    renderFooter();
  });
}

function renderFooter() {
  $('footer').append(
    `<p><b><i>Nonsense In Quiz Form</i></b> made by Ian Torrente</p>`)
  ;
}

function renderTrackers() {
  $('header').append(
    `<section class="location-tracker">Question ${STORE.questionNumber + 1} of ${STORE.questionsArray.length}</section>
    <section class="score-tracker">${STORE.numberCorrect} Correct</section>`
  );
}

function updateTrackers() {
  $('.location-tracker').text(`Question ${STORE.questionNumber + 1} of ${STORE.questionsArray.length}`);
  $('.score-tracker').text(`${STORE.numberCorrect} Correct`)
}

function renderQuiz() {
  console.log("Rendering main quiz elements");
  $('.quiz-body').append(
    `<div class="question-body">
      <form class="question-form">
        <legend class="question-legend">
          <h3>${STORE.questionsArray[STORE.questionNumber].question}</h3>
        </legend><br /><hr />
        <label>
          <input type="radio" name="question-choice" value="${STORE.questionsArray[STORE.questionNumber].choices[0]}">${STORE.questionsArray[STORE.questionNumber].choices[0]}</input>
        </label><br />
        <label>
          <input type="radio" name="question-choice" value="${STORE.questionsArray[STORE.questionNumber].choices[1]}">${STORE.questionsArray[STORE.questionNumber].choices[1]}</input>
        </label><br />
        <label>
          <input type="radio" name="question-choice" value="${STORE.questionsArray[STORE.questionNumber].choices[2]}">${STORE.questionsArray[STORE.questionNumber].choices[2]}</input>
        </label><br />
        <label>
          <input type="radio" name="question-choice" value="${STORE.questionsArray[STORE.questionNumber].choices[3]}">${STORE.questionsArray[STORE.questionNumber].choices[3]}</input>
        </label><br />
      </form>
      <span class="submission-warning"></span>
      <button class="submit-btn">Submit</button>
    </div>`
  );
}

function handleQuestionResults() {
  $('.quiz-body').on('click', '.submit-btn', event => {
    console.log("Going to the results page");
    if (STORE.choice != "") {
      renderQuestionResults();
    } else {
      if ($('.submission-warning-text')) {
        $('.submission-warning-text').remove();
      }
      $('.submission-warning').append(`<p class="submission-warning-text">You must make a choice!</p>`)
    }
  });
}

function renderQuestionResults() {
  console.log("Rendering question results");
  $('.question-body').remove();
  if (STORE.choice == STORE.questionsArray[STORE.questionNumber].answer) {
    STORE.numberCorrect += 1;
    updateTrackers();
    $('.quiz-body').append(
      `<div class="answer-body">
        <h1>CORRECT</h1>
        <p>${STORE.questionsArray[STORE.questionNumber].correctResponse}</p><hr />
        <button class="next-question-btn">Next Question</button>
      </div>`
    );
  } else {
    $('.quiz-body').append(
    `<div class="answer-body">
        <h1>INCORRECT</h1>
        <p>${STORE.questionsArray[STORE.questionNumber].incorrectResponse}</p><hr />
        <button class="next-question-btn">Next Question</button>
      </div>`
    );
  }
}

function clearStoreChoice() {
  STORE.choice = "";
}

function handleNextQuestion() {
  $('.quiz-body').on('click', '.next-question-btn', event => {
    if (STORE.questionNumber + 1 < STORE.questionsArray.length) {
      console.log(`Going to question ${STORE.questionNumber + 1}`);
      STORE.questionNumber += 1;
      $('.answer-body').remove();
      clearStoreChoice();
      updateTrackers();
      renderQuiz();
    } else {
      handleEndOfQuiz();
    }
  });
}

function handleChoice() {
  $('.quiz-body').on('click', 'input', event => {
    let radioText = $(event.currentTarget).val();
    STORE.choice = radioText;
  });
}

function handleEndOfQuiz() {
  $('.location-tracker').remove();
  $('.score-tracker').remove();
  $('.answer-body').remove();
  renderEndOfQuiz();
}

function renderEndOfQuiz() {
  $('.quiz-body').append(
    `<div class="end-of-quiz">
      <h1>CONGRATULATIONS</h1>
      <p>You have made it to the end of the quiz with ${STORE.numberCorrect} correct answers out of ${STORE.questionsArray.length}! I hope you enjoyed the ride! We look forward to the next time you step foot in our general direction. <br /><br />Thank you and have a nice day,<br /> Ian Torrente</p>
      <button class="restart-quiz-btn">Restart Quiz</button>
    </div>`
  );
}

function restartStore() {
  STORE.numberCorrect = 0;
  STORE.questionNumber = 0;
  STORE.choice = "";
}

function restartQuiz() {
  restartStore();
  $('.end-of-quiz').remove();
  $('footer').remove();
  renderLandingPage();
}

function handleRestartQuiz() {
  $('.quiz-body').on('click', '.restart-quiz-btn', event => {
    restartQuiz();
  });
}

function quizController() {
  importQuestionsJSON();
  renderLandingPage();
  handleStartQuiz();
  handleQuestionResults();
  handleNextQuestion();
  handleChoice();
  handleRestartQuiz();
}

$(quizController);
