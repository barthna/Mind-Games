const ballsContainer = document.getElementById('game-container');
    const playButton = document.getElementById('play-button');
    const modal = document.getElementById('game-over-modal');
    const finalRoundsDisplay = document.getElementById('final-rounds');
    const finalRecordDisplay = document.getElementById('final-record');
    const newGameButton = document.getElementById('new-game-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');

    let sequence = [];
    let userSequence = [];
    let level = 1;
    let bestRecord = 0;
    let canClick = false;
    let numBalls = 9;

    function generateBalls(num) {
      ballsContainer.innerHTML = '';
      const gridSize = Math.sqrt(num);
      ballsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      
      for (let i = 0; i < num; i++) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ballsContainer.appendChild(ball);
      }
      addBallClickListeners();
    }

    function addBallClickListeners() {
      const balls = document.querySelectorAll('.ball');
      balls.forEach((ball, index) => {
        ball.addEventListener('click', () => {
          if (!canClick) return;
          lightUpBall(index);
          userSequence.push(index);
          checkSequence();
        });
      });
    }

    function lightUpBall(ballIndex) {
      const balls = document.querySelectorAll('.ball');
      balls[ballIndex].style.animation = 'none';
      void balls[ballIndex].offsetWidth;
      balls[ballIndex].classList.add('active');
      setTimeout(() => {
        balls[ballIndex].classList.remove('active');
      }, 300);
    }

    function checkSequence() {
      for (let i = 0; i < userSequence.length; i++) {
        if (userSequence[i] !== sequence[i]) {
          gameOver();
          return;
        }
      }

      if (userSequence.length === sequence.length) {
        level++;
        userSequence = [];
        setTimeout(nextRound, 1000);
      }
    }

    function gameOver() {
      const roundsCleared = level - 1;
      if (roundsCleared > bestRecord) bestRecord = roundsCleared;
      finalRoundsDisplay.textContent = roundsCleared;
      finalRecordDisplay.textContent = bestRecord;
      modal.style.display = 'block';
    }

    function nextRound() {
      generateSequence();
      playSequence();
    }

    function resetGame() {
      sequence = [];
      userSequence = [];
      level = 1;
      generateBalls(numBalls);
    }

    difficultyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        numBalls = e.target.id === 'easy-button' ? 9 : 
                  e.target.id === 'medium-button' ? 16 : 25;
        resetGame();
        playButton.style.display = 'block';
      });
    });

    playButton.addEventListener('click', () => {
      playButton.style.display = 'none';
      nextRound();
    });

    newGameButton.addEventListener('click', () => {
      modal.style.display = 'none';
      resetGame();
      nextRound();
    });

    function generateSequence() {
      const randomBall = Math.floor(Math.random() * numBalls);
      sequence.push(randomBall);
    }

    function playSequence() {
      let i = 0;
      canClick = false;

      const interval = setInterval(() => {
        lightUpBall(sequence[i]);
        i++;

        if (i >= sequence.length) {
          clearInterval(interval);
          canClick = true;
        }
      }, 800);
    }

    // Initialize game with easy difficulty
    difficultyButtons[0].click();

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
        "Welcome to the Memory Ball Game!",
        "Test your memory with this fun challenge!"
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