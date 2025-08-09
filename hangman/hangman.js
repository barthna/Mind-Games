const wordsByCategory = {
    animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'PENGUIN', 'CHEETAH', 'TIGER', 'DOLPHIN', 'FLAMINGO', 'CROCODILE', 'RHINOCEROS'],
    countries: ['CANADA', 'BRAZIL', 'JAPAN', 'EGYPT', 'ITALY', 'GERMANY', 'FRANCE', 'AUSTRALIA', 'INDIA', 'MEXICO'],
    programming: ['JAVASCRIPT', 'FUNCTION', 'VARIABLE', 'REACT', 'DATABASE', 'PYTHON', 'COMPILER', 'DEBUGGING', 'ALGORITHM', 'SYNTAX'],
    sports: ['FOOTBALL', 'BASKETBALL', 'VOLLEYBALL', 'BASEBALL', 'CRICKET', 'TENNIS', 'HOCKEY', 'BADMINTON', 'RUGBY', 'GOLF'],
    fruits: ['APPLE', 'BANANA', 'MANGO', 'PINEAPPLE', 'CHERRY', 'GRAPE', 'WATERMELON', 'STRAWBERRY', 'PEACH', 'PAPAYA'],
    professions: ['DOCTOR', 'ENGINEER', 'TEACHER', 'SCIENTIST', 'LAWYER', 'NURSE', 'PILOT', 'ARCHITECT', 'MUSICIAN', 'CHEF'],
    space: ['PLANET', 'ASTEROID', 'GALAXY', 'NEBULA', 'SATELLITE', 'TELESCOPE', 'COMET', 'BLACKHOLE', 'MOON', 'GRAVITY'],
    landmarks: ['PYRAMIDS', 'STATUEOFLIBERTY', 'EIFFELTOWER', 'COLISEUM', 'TAJMAHAL', 'BIGBEN', 'MACHUPICCHU', 'GREATWALL', 'PAGODA', 'SYDNEYOPERA'],
    colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN', 'BLACK', 'WHITE']
};

const hangmanParts = document.querySelectorAll(".hangman-part");

let currentWord, guessedLetters, wrongAttempts, currentCategory;

function initializeGame() {
    const categories = Object.keys(wordsByCategory);
    currentCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = wordsByCategory[currentCategory];
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongAttempts = 0;

    document.getElementById('category').textContent = `Category: ${currentCategory.toUpperCase()}`;
    document.getElementById('wordDisplay').textContent = displayWord();

    hangmanParts.forEach(part => {
        part.style.display = 'none';
    });

    closePopup();
    createAlphabetButtons();
}

function createAlphabetButtons() {
    const alphabetContainer = document.getElementById('alphabet');
    alphabetContainer.innerHTML = ''; // Clear previous buttons

    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.className = 'letter-btn';
        button.textContent = letter;
        button.dataset.letter = letter;
        button.onclick = () => handleLetterClick(letter);
        alphabetContainer.appendChild(button);
    }
}

function displayWord() {
    return currentWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join('');
}

function handleLetterClick(letter) {
    if (guessedLetters.includes(letter)) return;

    const button = document.querySelector(`button[data-letter="${letter}"]`);
    guessedLetters.push(letter);
    button.disabled = true;

    if (currentWord.includes(letter)) {
        button.classList.add('correct');
        document.getElementById('wordDisplay').textContent = displayWord();
        checkWin();
    } else {
        button.classList.add('wrong');
        wrongAttempts++;

        if (wrongAttempts <= hangmanParts.length) {
            hangmanParts[wrongAttempts - 1].style.display = 'block';
        }
        checkLoss();
    }
}

function checkWin() {
    if (!displayWord().includes('_')) {
        showPopup(true);
    }
}

function checkLoss() {
    if (wrongAttempts === 1) {  
        document.querySelector(".head").style.display = 'block'; // Show head first
    }
    if (wrongAttempts === 2) {  
        document.querySelectorAll('.eyes').forEach(eye => eye.style.display = "block"); // Show both eyes together
    }
    if (wrongAttempts === 3) {  
        document.querySelector('.mouth').style.display = "block"; // Show mouth
    }
    if (wrongAttempts === 4) {  
        document.querySelector('.body').style.display = "block"; // Show body
    }
    if (wrongAttempts === 5) {  
        document.querySelector('.left-arm').style.display = "block"; // Left Arm
    }
    if (wrongAttempts === 6) {  
        document.querySelector('.right-arm').style.display = "block"; // Right Arm
    }
    if (wrongAttempts === 7) {  
        document.querySelector('.left-leg').style.display = "block"; // Left Leg
    }
    if (wrongAttempts === 8) {  
        document.querySelector('.right-leg').style.display = "block"; // Right Leg
    }
    if (wrongAttempts >= 8) {  
        setTimeout(() => {
            showPopup(false);
        }, 800);
    }
}


function showPopup(isWin) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupButton = document.getElementById('popup-button'); // Add a button in HTML

    const winMessages = [
        "🎉 Congratulations! You cracked the word!",
        "🏆 Victory! You're a Hangman Champion!",
        "🔥 Amazing! You solved the puzzle!",
        "🎊 Great job! You guessed it right!",
        "🎯 Bullseye! That was impressive!"
    ];

    const loseMessages = [
        `😢 Game Over! The word was: ${currentWord}. Try again!`,
        `💀 Oops! You got hanged. The word was: ${currentWord}.`,
        `😬 Not this time! The correct word was: ${currentWord}.`,
        `😕 Tough luck! The word was: ${currentWord}. Keep practicing!`,
        `🚀 Mission failed! The secret word was: ${currentWord}.`
    ];

    const selectedMessage = isWin 
        ? winMessages[Math.floor(Math.random() * winMessages.length)]
        : loseMessages[Math.floor(Math.random() * loseMessages.length)];

    popupTitle.textContent = isWin ? "🎉 Congratulations!" : "😢 Game Over!";
    popupMessage.textContent = selectedMessage;

    popup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function skipWord() {
    initializeGame();
}

initializeGame();
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
        "Welcome to the Hangman game!",
        "Guess the correct word before it's too late!"
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

document.getElementById('back-icon').addEventListener('click', function() {
    window.history.back(); // Go back to the previous page
});