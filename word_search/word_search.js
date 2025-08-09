const wordBank = [
    'HAPPY', 'SUNNY', 'CLOUD', 'RAINY', 'WINDY', 'APPLE', 'BEACH', 
    'CHERRY', 'DRAGON', 'EAGLE', 'FLOWER', 'GARDEN', 'JELLY', 'KETCHUP', 
    'LEMON', 'ORANGE', 'PENCIL', 'LANTERN', 'PLANET', 'RIVER', 'MOUNTAIN', 
    'FOREST', 'CANDLE', 'PYRAMID', 'MIRROR', 'GIRAFFE', 'ROCKET', 'GUITAR', 
    'LIBRARY', 'CASTLE', 'OCTOPUS', 'LADDER', 'VILLAGE', 'BOTTLE', 'WINDOW', 
    'BRIDGE', 'PIRATE', 'TREASURE', 'FESTIVAL', 'BALLOON', 'ELEPHANT', 
    'BASKET', 'BORDER', 'PYTHON', 'NOTEBOOK', 'TROPHY', 'ZEBRA', 'PANTHER', 
    'KINGDOM', 'NECKLACE', 'WHALE', 'TIGER', 'PLANET', 'GHOST', 'COWBOY', 
    'LANTERN', 'TUNNEL', 'CANYON', 'CIRCUS', 'SUNFLOWER', 'JOURNAL', 'GEMSTONE', 
    'DOLPHIN', 'CARAVAN', 'PEACOCK', 'GOLDEN', 'WILLOW', 'HORIZON', 'LIGHTHOUSE', 
    'FURNACE', 'BANYAN', 'ASTRONAUT', 'PENGUIN', 'CHAMELEON', 'HONEYBEE', 'GLACIER', 
    'OASIS', 'VOLCANO', 'STADIUM', 'BUNGALOW', 'WIZARD', 'SNOWFLAKE', 'MARBLE', 
    'CANDLE', 'PYTHON', 'LANTERN', 'GALAXY', 'RAINBOW', 'TUNNEL', 'MEADOW', 
    'SPHINX', 'CROWN', 'FOUNTAIN', 'SPECTRUM', 'LULLABY', 'VINTAGE', 'TOPAZ', 
    'RADIANCE', 'ORBIT', 'CONSTELLATION', 'MIRAGE'
];

const boardSize = 12;
let selectedCells = new Set();
let foundWords = new Set();
let currentBoard = [];
let currentWords = [];

function getRandomWords() {
    const shuffled = wordBank.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

function createBoard() {
    // Initialize game state
    currentWords = getRandomWords();
    selectedCells.clear();
    foundWords.clear();
    
    const board = document.getElementById('board');
    const wordList = document.getElementById('wordList');
    
    // Clear previous board
    board.innerHTML = '';
    wordList.innerHTML = '<h3>Words to find:</h3>';
    
    // Create individual word elements
    currentWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordElement.dataset.word = word;
        wordList.appendChild(wordElement);
    });
    
    // Initialize empty board
    currentBoard = Array.from({length: boardSize}, () => 
        Array.from({length: boardSize}, () => ''));
    
    // Place words with improved positioning
    currentWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = Math.floor(Math.random() * 3);
            const maxStart = boardSize - word.length;
            const row = Math.floor(Math.random() * (maxStart + 1));
            const col = Math.floor(Math.random() * (maxStart + 1));
            
            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
            attempts++;
        }
    });

    // Fill remaining cells with random letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!currentBoard[i][j]) {
                currentBoard[i][j] = alphabet[Math.floor(Math.random() * 26)];
            }
        }
    }

    // Create board UI elements
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = currentBoard[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('mousedown', handleCellClick);
            cell.addEventListener('touchstart', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function canPlaceWord(word, row, col, direction) {
    const length = word.length;
    try {
        if (direction === 0 && col + length > boardSize) return false;
        if (direction === 1 && row + length > boardSize) return false;
        if (direction === 2 && (row + length > boardSize || col + length > boardSize)) return false;
        
        for (let i = 0; i < length; i++) {
            let currentRow = row;
            let currentCol = col;
            
            if (direction === 0) currentCol = col + i;
            else if (direction === 1) currentRow = row + i;
            else if (direction === 2) {
                currentRow = row + i;
                currentCol = col + i;
            }
            
            if (currentBoard[currentRow][currentCol] && 
                currentBoard[currentRow][currentCol] !== word[i]) {
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
}

function placeWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        let currentRow = row;
        let currentCol = col;
        
        if (direction === 0) currentCol = col + i;
        else if (direction === 1) currentRow = row + i;
        else if (direction === 2) {
            currentRow = row + i;
            currentCol = col + i;
        }
        
        currentBoard[currentRow][currentCol] = word[i];
    }
}

// Rest of the JavaScript functions remain the same
function handleCellClick(e) {
    const cell = e.target;
    const index = `${cell.dataset.row}-${cell.dataset.col}`;
    
    if (selectedCells.has(index)) {
        selectedCells.delete(index);
        cell.classList.remove('selected');
    } else {
        selectedCells.add(index);
        cell.classList.add('selected');
    }
    
    checkSelectedWord();
}


function checkSelectedWord() {
const cellObjects = Array.from(selectedCells).map(index => {
const [row, col] = index.split('-').map(Number);
return { row, col };
});

if (cellObjects.length < 3) return;

// Sort cells properly by row and column
cellObjects.sort((a, b) => {
// First sort by row, then by column
if (a.row !== b.row) return a.row - b.row;
return a.col - b.col;
});

// Check both forward and reverse directions
const letters = cellObjects.map(cell => currentBoard[cell.row][cell.col]).join('');
const reversed = letters.split('').reverse().join('');

currentWords.forEach(word => {
if ((letters === word || reversed === word) && !foundWords.has(word)) {
    foundWords.add(word);
    
    // Update grid cells
    cellObjects.forEach(cell => {
        const cellElement = document.querySelector(
            `[data-row="${cell.row}"][data-col="${cell.col}"]`
        );
        cellElement.style.background = '#4a2c18';
        cellElement.classList.remove('selected');
    });
    
    // Strike through word in list
    const wordElement = document.querySelector(`.word-item[data-word="${word}"]`);
    if (wordElement) {
        wordElement.classList.add('found');
    }
    
    selectedCells.clear();
    
    if (foundWords.size === currentWords.length) {
        document.getElementById('popup').style.display = 'block';
    }
}
});
}

function newGame() {
    document.getElementById('popup').style.display = 'none';
    createBoard();
}
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        document.querySelector(".word-list").classList.add("active");
    }, 500); // ⏳ Delay for smoother transition
});


// Initialize game properly
window.addEventListener('DOMContentLoaded', createBoard);
    



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
        "Welcome to the Word Search challenge!",
        "Find all the hidden words to win!"
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





