function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close-button");
  
  function toggleModal() {
    modal.classList.toggle("show-modal");
  }
  
  function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
  }
  
  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);
  
  let cardTest = [];
  let cards = ["diamond", "diamond", "plane", "plane", "anchor", "anchor", "bolt", "bolt", "leaf", "leaf"
    , "bicycle", "bicycle", "cube", "cube", "bomb", "bomb"];
  
  let shuffledCards = shuffle(cards);
  
  function createCards() {
    for (let card of shuffledCards) {
        const li = document.createElement("LI");
        li.classList.toggle("card");
        const i = document.createElement("i");
        i.classList.toggle("fa");
        if (card === "plane") {
            i.classList.toggle("fa-paper-plane-o");
        } else {
            i.classList.toggle("fa-" + card);
        }
        const deck = document.querySelector('.deck');
        li.appendChild(i);
        deck.appendChild(li);
  
    }
  }
  
  const ul = document.querySelector('.deck');
  let moves = document.querySelector(".moves");
  let movesCounter = 0;
  let stars = 3;
  let match = 0;
  let isfirstClick = true;
  let timerID;
  let isRestart = false;
  
  function initGame() {
    createCards();
    const card = document.querySelectorAll('.card');
    for (let i = 0; i < card.length; i++) {
        card[i].addEventListener("click", function (event) {
            if (card[i] !== event.target) return;
            if (event.target.classList.contains("show")) return;
            if (isfirstClick) {
                timerID = setInterval(timer, 1000);
                isfirstClick = false;
            }
            showCard(event.target);
            setTimeout(addCard, 550, shuffledCards[i], event.target, cardTest, i);
        }, false);
    }
  }
  
  function showCard(card) {
    card.classList.add('show');
  
  }
  
  function addCard(card, cardHTML, testList, pos) {
    if (isRestart) {
        testList.length = 0;
        isRestart = false;
    }
    testList.push(card);
    testList.push(cardHTML)
    testList.push(pos);
    if (testList.length === 6) {
        updateMoveCounter();
        testCards(testList[0], testList[1], testList[2], testList[3], testList[4], testList[5]);
        testList.length = 0;
    }
  }
  
  function testCards(card1, html1, x1, card2, html2, x2) {
    if (card1 === card2 && x1 != x2) {
        cardsMatch(html1, html2);
    } else {
        cardsDontMatch(html1, html2);
    }
  }
  
  function cardsMatch(card1, card2) {
    card1.classList.add('match');
    card2.classList.add('match');
    match++;
    if (match === 8) {
        win();
    }
  }
  
  function cardsDontMatch(card1, card2) {
    card1.classList.toggle('no-match');
    card2.classList.toggle('no-match');
    setTimeout(function () {
        card1.classList.toggle('no-match');
        card2.classList.toggle('no-match');
        card1.classList.toggle('show');
        card2.classList.toggle('show');
  
    }, 300);
  }
  
  function win() {
    clearInterval(timerID);
    toggleModal();
    const stats = document.querySelector(".stats");
    if (s % 60 < 10) {
        stats.textContent = "You won with: " + stars + " stars in " + movesCounter + " moves with time: " + m + ":0" + s % 60;
    } else {
        stats.textContent = "You won with: " + stars + " stars in " + movesCounter + " moves with time: " + m + ":" + s % 60;
    }
  }
  
  function updateMoveCounter() {
    movesCounter++;
    moves.textContent = "Moves: " + movesCounter;
    if (movesCounter === 13) {
        let star = document.querySelector("#star3");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    } else if (movesCounter === 25) {
        let star = document.querySelector("#star2");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    } else if (movesCounter === 35) {
        let star = document.querySelector("#star1");
        star.classList.toggle("fa-star");
        star.classList.add("fa-star-o");
        stars--;
    }
  }
  
  let s = 0;
  let m = 0;
  function timer() {
    ++s;
    m = Math.floor(s / 60);
    let timer = document.querySelector(".timer");
    if (s % 60 < 10) {
        timer.textContent = "Elapsed Time: " + m + ":0" + s % 60;
    } else {
        timer.textContent = "Elapsed Time: " + m + ":" + s % 60;
    }
  
  }
  
  let restart = document.querySelector(".restart");
  restart.addEventListener("click", restartGame, false);
  function restartGame() {
    clearInterval(timerID);
    movesCounter = 0;
    match = 0;
    s = 0;
    m = 0;
    isfirstClick = true;
    isRestart = true;
    const deck = document.querySelector('.deck');
    var elements = deck.getElementsByClassName("card");
  
    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    shuffledCards = shuffle(cards);
    let timer = document.querySelector(".timer");
    timer.textContent = "Elapsed Time: 0:00";
    moves.textContent = "Moves: " + movesCounter;
  
    resetStars();
    initGame();
  }
  
  function resetStars() {
    stars = 3;
    let star = document.querySelector("#star3");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
  
    star = document.querySelector("#star2");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
  
    star = document.querySelector("#star1");
    star.classList.remove("fa-star");
    star.classList.remove("fa-star-o");
    star.classList.add("fa-star");
  }
  
  const newGameButton = document.querySelector(".new-game");
  newGameButton.addEventListener("click", newGame);
  function newGame() {
    toggleModal();
    restartGame();
  }
  
  initGame();
  document.getElementById('back-icon').addEventListener('click', function() {
    window.history.back(); // Go back to the previous page
});
document.addEventListener("DOMContentLoaded", function () {
  const speechBubble = document.querySelector(".speech-bubble");
  const speechText = document.getElementById("speech-text");
  const characterContainer = document.getElementById("character-container");
  const gameOverlay = document.getElementById("game-overlay"); // Get overlay element

  // Ensure speech bubble is visible
  speechBubble.style.display = "block";
  speechBubble.style.opacity = "1";
  characterContainer.style.display = "flex"; 
  characterContainer.style.opacity = "1"; 
  gameOverlay.style.display = "flex"; // Show overlay during tutorial

  // Sentences for typewriter effect
  const sentences = [
    "Hello!! I am Barth..",
    "Welcome to the Matching Game!",
    "Find and match the correct pairs to win!",
    "Can you match them all before time runs out?"
];

  let sentenceIndex = 0;
  let charIndex = 0;
  let isTyping = false;

  function typeSentence() {
      isTyping = true;

      if (charIndex === 0) {
          speechText.textContent = ""; // Reset text only at new sentence
      }

      if (charIndex < sentences[sentenceIndex].length) {
          speechText.textContent += sentences[sentenceIndex][charIndex];
          charIndex++;
          setTimeout(typeSentence, 50);
      } else {
          isTyping = false;
          setTimeout(() => {
              sentenceIndex++;
              if (sentenceIndex < sentences.length) {
                  charIndex = 0;
                  typeSentence();
              } else {
                  setTimeout(() => {
                      fadeOutCharacter();
                  }, 500);
              }
          }, 1000);
      }
  }

  function nextSentence() {
      if (isTyping) {
          speechText.textContent = sentences[sentenceIndex];
          charIndex = sentences[sentenceIndex].length;
          isTyping = false;
      } else {
          sentenceIndex++;
          if (sentenceIndex < sentences.length) {
              charIndex = 0;
              typeSentence();
          } else {
              fadeOutCharacter();
          }
      }
  }

  function fadeOutCharacter() {
      let opacity = 1;
      let fadeOut = setInterval(() => {
          if (opacity > 0) {
              opacity -= 0.05;
              characterContainer.style.opacity = opacity;
              speechBubble.style.opacity = opacity;
          } else {
              clearInterval(fadeOut);
              characterContainer.style.display = "none";
              speechBubble.style.display = "none";
              gameOverlay.style.display = "none"; // Remove overlay
            
          }
      }, 50);
  }

  setTimeout(typeSentence, 1000);

  document.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          nextSentence();
      }
  });

  document.addEventListener("click", function () {
      nextSentence();
  });
}); 