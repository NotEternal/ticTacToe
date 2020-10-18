'use strict';

const sectionChoice = document.querySelector('.choice');
const choiceContainer = document.querySelector('.choice__container');
const userChoiceDescription = document.querySelector(
  '.user-choice-description'
);
let userElement = null;
let userArrElement = null;
let myElement = null;
let myArrElement = null;

choiceContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('user-choice-zero')) {
    setChoice('item__zero', '◯', 'item__cross', '╳');
  } else if (event.target.classList.contains('user-choice-cross')) {
    setChoice('item__cross', '╳', 'item__zero', '◯');
  }
});

function setChoice(userClass, userArrElem, myClass, myArrElem) {
  userElement = userClass;
  userArrElement = userArrElem;
  myElement = myClass;
  myArrElement = myArrElem;

  userChoiceDescription.textContent = `Your choice: ${userArrElem}`;
  sectionChoice.classList.add('hidden');
}

const resultGame = document.querySelector('.game-result');
const gameField = document.querySelector('.game-field');
const arrGameItems = [...document.querySelectorAll('.game-item')];
const arrSteps = new Array(9).fill(null);
const mySteps = [];
const userSteps = [];
let userStepsCounter = 0;
let myStepsCounter = 0;

gameField.addEventListener('click', (event) => {
  if (
    event.target.classList.contains('game-item') &&
    !event.target.classList.contains('item__cross') &&
    !event.target.classList.contains('item__zero')
  ) {
    userStepsCounter += 1;
    addUserElement(event);
    gameField.style.pointerEvents = 'none';

    myStepsCounter += 1;
    addMyElement();
    gameField.style.pointerEvents = 'auto';
  }
});

function addUserElement(event) {
  const numUserPoint = arrGameItems.indexOf(event.target);

  arrSteps[numUserPoint] = userArrElement;
  userSteps.push(numUserPoint);
  event.target.classList.add(userElement);
  event.target.style.pointerEvents = 'none';

  checkWin();
}

function addMyElement() {
  const bestNumPosition = returnBestPosition();

  if (typeof bestNumPosition === 'number') {
    arrSteps[bestNumPosition] = myArrElement;
    mySteps.push(bestNumPosition);
    arrGameItems[bestNumPosition].classList.add(myElement);
    arrGameItems[bestNumPosition].style.pointerEvents = 'none';
  }

  checkWin();
}

function returnBestPosition() {
  let result = null;

  if (userStepsCounter < 2) {
    result = bestPositionOnFirstStep();
  } else {
    result = bestPositionOnSecondStep();
  }

  if (!arrSteps.includes(null)) {
    completeGame('Draw');
  }

  return result;
}

function bestPositionOnFirstStep() {
  let result = null;
  // checking best empty cell
  if (arrSteps[4] === null) {
    result = 4;
  } else if (arrSteps[0] === null) {
    result = 0;
  } else if (arrSteps[2] === null) {
    result = 2;
  } else if (arrSteps[6] === null) {
    result = 6;
  } else if (arrSteps[8] === null) {
    return 8;
  } else if (arrSteps[1] === null) {
    result = 1;
  } else if (arrSteps[3] === null) {
    result = 3;
  } else if (arrSteps[5] === null) {
    result = 5;
  } else if (arrSteps[7] === null) {
    result = 7;
  }

  return result;
}

const WINS_COMBINATION = [
  [0, 1, 2], // row one
  [3, 4, 5], // row two
  [6, 7, 8], // row three
  [0, 3, 6], // column one
  [1, 4, 7], // column two
  [2, 5, 8], // column three
  [0, 4, 8], // diagonal one
  [2, 4, 6], // diagonal two
];

function bestPositionOnSecondStep() {
  const result = returnBlockPosition() || bestPositionOnFirstStep();

  return result;
}

const arrBlockCombination = [];

function returnBlockPosition() {
  let result = null;

  WINS_COMBINATION.forEach((combination) => {
    let coincidences = 0;

    userSteps.forEach((numStep) => {
      if (combination.includes(numStep)) {
        coincidences += 1;
      }
    });

    if (coincidences >= 2 && !arrBlockCombination.includes(combination)) {
      const lastTwoUserSteps = userSteps.slice(userSteps.length - 2);

      combination.forEach((numCell) => {
        if (
          numCell !== lastTwoUserSteps[0] &&
          numCell !== lastTwoUserSteps[1] &&
          !arrGameItems[numCell].classList.contains('item__cross') &&
          !arrGameItems[numCell].classList.contains('item__zero')
        ) {
          result = numCell;
        }
      });

      arrBlockCombination.push(combination);
    }
  });

  return result;
}

function checkWin() {
  WINS_COMBINATION.forEach((combination) => {
    if (
      userSteps.includes(combination[0]) &&
      userSteps.includes(combination[1]) &&
      userSteps.includes(combination[2])
    ) {
      completeGame('User won');
    } else if (
      mySteps.includes(combination[0]) &&
      mySteps.includes(combination[1]) &&
      mySteps.includes(combination[2])
    ) {
      completeGame('Program won');
    }
  });
}

function completeGame(message) {
  resultGame.textContent = message;
  resultGame.classList.add('end-game');
}

document.querySelector('.btn-repeat-choice').onclick = () => {
  userStepsCounter = myStepsCounter = 0;
  sectionChoice.classList.remove('hidden');

  cleanGameField();
};

function cleanGameField() {
  resultGame.classList.remove('end-game');

  for (let i = 0; i < arrSteps.length; i += 1) {
    arrSteps[i] = null;
  }

  userSteps.length = 0;
  mySteps.length = 0;

  arrGameItems.map((item) => {
    item.classList.remove('item__zero');
    item.classList.remove('item__cross');
    item.style.pointerEvents = 'auto';
  });
}
