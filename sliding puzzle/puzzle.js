let size = 4;
let numberOfTiles = size ** 2;
let emptyPosition = numberOfTiles; // Starting empty position (bottom-right)
let shuffled = false;
let moves = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerInterval = null;
let initialTilesState = [];
let initialEmptyPosition = numberOfTiles;

// DOM Elements
const buttonContainer = document.getElementById('tiles');
const timeDisplay = document.getElementById('timeDisplay');
const moveDisplay = document.getElementById('moveDisplay');
const winModal = document.getElementById('winModal');
const timeupModal = document.getElementById('timeupModal');

// Event Listeners
document.getElementById('newGameBtnMain').addEventListener('click', resetGame);
document.getElementById('newGameModalBtn').addEventListener('click', () => {
    winModal.style.display = 'none';
    newGame();
});
document.getElementById('tryAgainModalBtn').addEventListener('click', () => {
    timeupModal.style.display = 'none';
    newGame();
});
document.querySelectorAll('.wooden-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        winModal.style.display = 'none';
        timeupModal.style.display = 'none';
        resetGame();
    });
});

// Keyboard Controls
window.addEventListener('keydown', (event) => {
    if (!shuffled) return;
    
    let newPosition = -1;
    switch(event.key) {
        case 'ArrowUp': newPosition = emptyPosition + size; break;
        case 'ArrowDown': newPosition = emptyPosition - size; break;
        case 'ArrowLeft': newPosition = emptyPosition + 1; break;
        case 'ArrowRight': newPosition = emptyPosition - 1; break;
    }
    
    if (isValidMove(newPosition)) {
        moveTile(newPosition);
    }
});

// Initialize Game
newGame();
function newGame() {
    // Full game reset
    moves = 0;
    timeLeft = 300;
    shuffled = false;
    updateMoveDisplay();
    clearInterval(timerInterval);
    
    // Create fresh tiles
    loadTiles();
    
    // Generate new shuffle
    setTimeout(() => {
        shuffleTiles(() => {
            startTimer();
            saveInitialState(); // Save new initial state
        });
    }, 500);
}

function loadTiles() {
    buttonContainer.innerHTML = '';
    const numbers = Array.from({length: numberOfTiles - 1}, (_, i) => i + 1);

    for (let i = 1; i <= numberOfTiles; i++) {
        const tile = document.createElement('button');
        tile.className = `btn ${i === emptyPosition ? 'empty' : ''}`;
        tile.textContent = i === emptyPosition ? '' : numbers[i - 1];
        tile.addEventListener('click', () => handleTileClick(i));
        buttonContainer.appendChild(tile);
    }
}

function handleTileClick(position) {
    if (!shuffled || !isValidMove(position)) return;
    moveTile(position);
}

function isValidMove(position) {
    if (position < 1 || position > numberOfTiles) return false;
    
    const emptyRow = Math.ceil(emptyPosition / size);
    const emptyCol = emptyPosition % size || size;
    const targetRow = Math.ceil(position / size);
    const targetCol = position % size || size;
    
    // Check if adjacent
    return (Math.abs(emptyRow - targetRow) + Math.abs(emptyCol - targetCol)) === 1;
}

function moveTile(position) {
    // Swap positions
    const tiles = document.querySelectorAll('.btn');
    [tiles[position - 1].textContent, tiles[emptyPosition - 1].textContent] = 
    ['', tiles[position - 1].textContent];
    
    // Update classes
    tiles[position - 1].classList.add('empty');
    tiles[emptyPosition - 1].classList.remove('empty');
    
    // Update state
    emptyPosition = position;
    moves++;
    updateMoveDisplay();
    
    checkWin();
}

function shuffleTiles(callback) {
    let shuffleMoves = 200;
    const directions = [-1, 1, -size, size];

    for (let i = 0; i < shuffleMoves; i++) {
        setTimeout(() => {
            const validMoves = directions
                .map(d => emptyPosition + d)
                .filter(p => isValidMove(p));
            
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            if (randomMove) {
                const tiles = document.querySelectorAll('.btn');
                [tiles[randomMove - 1].textContent, tiles[emptyPosition - 1].textContent] = 
                ['', tiles[randomMove - 1].textContent];
                
                tiles[randomMove - 1].classList.add('empty');
                tiles[emptyPosition - 1].classList.remove('empty');
                emptyPosition = randomMove;
            }
        }, i * 5);
    }

    setTimeout(() => {
        shuffled = true;
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.classList.contains('empty')) {
                btn.style.cursor = 'pointer';
            }
        });
        saveInitialState(); // Save the initial state after shuffling
        if (callback) callback();
    }, shuffleMoves * 5);
}

function saveInitialState() {
    const tiles = document.querySelectorAll('.btn');
    initialTilesState = Array.from(tiles).map(tile => tile.textContent);
    initialEmptyPosition = emptyPosition;
}

function checkWin() {
    const tiles = Array.from(document.querySelectorAll('.btn:not(.empty)'));
    const isWinning = tiles.every((tile, index) => 
        parseInt(tile.textContent) === index + 1
    );
    
    if (isWinning) {
        clearInterval(timerInterval);
        document.getElementById('winMessage').textContent = `Time Left: ${formatTime(timeLeft)}`;
        document.getElementById('movesMessage').textContent = `Moves: ${moves}`;
        winModal.style.display = 'block';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeupModal.style.display = 'block';
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateMoveDisplay() {
    moveDisplay.textContent = `Moves: ${moves}`;
}

function resetGame() {
    clearInterval(timerInterval);
    const tiles = document.querySelectorAll('.btn');
    
    // Restore tile contents and classes
    tiles.forEach((tile, index) => {
        tile.textContent = initialTilesState[index];
        tile.classList.toggle('empty', initialTilesState[index] === '');
    });

    // Restore game state
    emptyPosition = initialEmptyPosition;
    moves = 0;
    timeLeft = 300;
    shuffled = true;
    
    // Update displays
    updateMoveDisplay();
    timeDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
    
    // Restart timer
    startTimer();
}
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
        "Welcome to the Sliding Puzzle game!",
        "Slide the pieces to complete the box!"
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