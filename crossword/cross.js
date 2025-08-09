const puzzle = {
    grid: [
        [{ letter: 'B', number: 1 }, { letter: 'R' }, { letter: 'O' }, { letter: 'U' }, { letter: 'G' }, { letter: 'H' }, { letter: 'T', number: 2 }, null, null, null, null],
        [{ letter: 'R' }, null, null, null, null, null, { letter: 'H' }, null, null, null, null],
        [{ letter: 'O'}, null, { letter: 'W', number:3}, null, null, { letter: 'F' , number:4}, { letter: 'O' }, { letter: 'R' }, { letter: 'G' }, { letter: 'O' }, { letter: 'T', number:5 }],
        [{ letter: 'K', number:6 }, { letter: 'N' }, { letter: 'E' }, { letter: 'W' }, null, null, { letter: 'U' }, null, null, null, { letter: 'O' }],
        [{ letter: 'E' }, null, { letter: 'N' }, null, null,null, { letter: 'G' }, null, { letter: 'C' , number:7}, null, { letter: 'O' }],
        [null, null, { letter: 'T' }, null, { letter: 'H', number:8 }, null, { letter: 'H' }, null, { letter: 'H' }, null, { letter: 'K' }],
        [null,null, null, { letter: 'S' , number:9}, { letter: 'E' }, { letter: 'N' }, { letter: 'T' }, null, { letter: 'O' }, null, null],
        [null, null, { letter: 'F', number:10 }, null, { letter: 'L' }, null, null, null, { letter: 'S' }, null, null],
        [{ letter: 'S', number:11 }, { letter: 'T' }, { letter: 'O' }, { letter: 'O' }, { letter: 'D' }, null, null, { letter: 'R' , number:12}, { letter: 'E' }, { letter: 'A' }, { letter: 'D', number:13 }],
        [{ letter: 'W' }, null, { letter: 'U' }, null, null, null, null, { letter: 'O' }, null, null, { letter: 'R' }],
        [{ letter: 'A' },null, { letter: 'N' }, null, null, null, null, { letter: 'D' }, null, null, { letter: 'A' }],
        [{ letter: 'M' , number:15}, { letter: 'A' }, { letter: 'D' }, { letter: 'E', number:16 }, null, { letter: 'D', number:17 }, { letter: 'R' }, { letter: 'E' }, { letter: 'W' , number:18},null, { letter: 'N' }],
        [null, null, null, { letter: 'A' },  null, null,  null, null, { letter: 'R' },null, { letter: 'K' }],
        [{ letter: 'L', number:19 }, { letter: 'O' }, { letter: 'S' }, { letter: 'T' },  null, null, { letter: 'L' , number:20}, null, { letter: 'O' },  null, null],
        [ null, null, null, null,  null, null, { letter: 'O' , number:23}, { letter: 'P' }, { letter: 'T' }, null, { letter: 'S', number:21 }],
        [ null, null, { letter: 'L', number:22 },  null, null,null, { letter: 'S' },null, { letter: 'E' }, null, { letter: 'T' }],
        [null, { letter: 'C', number:24 }, { letter: 'A' }, { letter: 'U' }, { letter: 'G' }, { letter: 'H' , number:25}, { letter: 'T' },  null, null, null, { letter: 'O' }],
        [ null, null, { letter: 'M' }, null, null, { letter: 'E' },  null, null, null, null, { letter: 'L' }],
        [{ letter: 'F', number:26 }, { letter: 'L' }, { letter: 'E' }, { letter: 'W', number:27 }, null, { letter: 'A' }, null, { letter: 'W' , number:28}, { letter: 'E' }, { letter: 'R' }, { letter: 'E' }],
        [ null, null,null, { letter: 'A' }, null, { letter: 'R' },  null, null, null, null, null],
        [ null, null, null, { letter: 'S' },null, { letter: 'D', number:29 }, { letter: 'R' }, { letter: 'O' }, { letter: 'V' }, { letter: 'E' }, null],
    ],
    acrossClues: {
        1: '.....my lunch to work',
        4: '.....to do my homework',
        6: ',.....the answer to a question',
        9: '.....an e-mail to my friend',
        11: '.....at a bus stop for 10 minutes',
        12: '.....my favorite magazine',
        15: '.....a mistake on a test',
        17: '.....a picture of a tree',
        19: '.....the pen.i still have it',
        23: '.....ten dollars at the store',
        24: '.....a ball at the park',
        26: '.....in an airplane',
        28: 'was late,but they.....on time',
        29: '.....my car to a park',
        // ... (other across clues)
    },
    downClues: {
        1: '.....an egg on the floor',
        2: '.....about a difficult problem',
        3: '.....to the library to real a book',
        5: '.....my little brother to a cinema',
        7: '.....the blue pen,not the red one',
        8: '.....a baby in my arms',
        10: '.....a sock under my bed',
        11: '.....in a swimming pool',
        12: '.....my bicycle tp school',
        13: '.....a glass of orange juice',
        14: '.....my homework',
        16: 'Did not.....breakfast',
        18: '.....a story about a princess',
        20: '.....my key.I could not find it',
        21: '.....my brother`s cookie',
        22: '.....to class late',
        25: '.....a strange sound at midnight',
        27: '.....very happy',




        

        // ... (other down clues)
    }
};

// Function to create the crossword grid
function createGrid() {
    const crosswordGrid = document.querySelector('.crossword-grid');
    crosswordGrid.innerHTML = '';
    const { grid } = puzzle;

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');

            if (cell === null) {
                // Hide the cell if the value is null
                cellElement.classList.add('hidden-cell');
            } else {
                if (cell.letter) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = '1';
                    input.dataset.row = rowIndex;
                    input.dataset.col = colIndex;
                    input.dataset.answer = cell.letter.toUpperCase();
                    cellElement.appendChild(input);
                }

                if (cell.number) {
                    const clueNumberElement = document.createElement('span');
                    clueNumberElement.classList.add('clue-number');
                    clueNumberElement.textContent = cell.number;
                    cellElement.appendChild(clueNumberElement);
                }
            }

            crosswordGrid.appendChild(cellElement);
        });
    });
}




// Function to populate clues
function populateClues() {
    const acrossCluesElement = document.getElementById('across-clues');
    const downCluesElement = document.getElementById('down-clues');
    acrossCluesElement.innerHTML = '';
    downCluesElement.innerHTML = '';

    Object.entries(puzzle.acrossClues).forEach(([number, clue]) => {
        const clueElement = document.createElement('li');
        clueElement.textContent = `${number}. ${clue}`;
        acrossCluesElement.appendChild(clueElement);
    });

    Object.entries(puzzle.downClues).forEach(([number, clue]) => {
        const clueElement = document.createElement('li');
        clueElement.textContent = `${number}. ${clue}`;
        downCluesElement.appendChild(clueElement);
    });
}
document.getElementById('check-answers-button').addEventListener('click', checkAllAnswers);

// Function to create the crossword grid
function createGrid() {
    const crosswordGrid = document.querySelector('.crossword-grid');
    crosswordGrid.innerHTML = '';
    const { grid } = puzzle;

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');

            if (cell === null) {
                // Hide the cell if the value is null
                cellElement.classList.add('hidden-cell');
            } else {
                if (cell.letter) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = '1';
                    input.dataset.row = rowIndex;
                    input.dataset.col = colIndex;
                    input.dataset.answer = cell.letter.toUpperCase();

                    // Add event listeners to remove 'correct' and 'incorrect' classes on focus or input
                    input.addEventListener('focus', () => {
                        input.classList.remove('correct', 'incorrect');
                    });
                    input.addEventListener('input', () => {
                        input.classList.remove('correct', 'incorrect');
                    });

                    cellElement.appendChild(input);
                }

                if (cell.number) {
                    const clueNumberElement = document.createElement('span');
                    clueNumberElement.classList.add('clue-number');
                    clueNumberElement.textContent = cell.number;
                    cellElement.appendChild(clueNumberElement);
                }
            }

            crosswordGrid.appendChild(cellElement);
        });
    });
}


// Function to check all answers
function checkAllAnswers() {
    document.querySelectorAll('.cell input').forEach(input => {
        const userAnswer = input.value.toUpperCase();
        const correctAnswer = input.dataset.answer.toUpperCase();
        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
    });

    // After 2 seconds, change correct answers to yellow
    setTimeout(() => {
        document.querySelectorAll('.cell input.correct').forEach(input => {
            input.classList.remove('correct');
            input.classList.add('correct-checked');
        });
        // Remove incorrect styling
        document.querySelectorAll('.cell input.incorrect').forEach(input => {
            input.classList.remove('incorrect');
        });
    }, 2000); // 2000 milliseconds = 2 seconds
}

// Event listener for the "Check Answers" button
document.getElementById('check-answers-button').addEventListener('click', checkAllAnswers);

// Optional: Remove color indicators when user starts typing
document.querySelectorAll('.cell input').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('correct', 'incorrect', 'correct-checked');
    });
});

// Optional: Remove color indicators when user starts typing
document.querySelectorAll('.cell input').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('correct', 'incorrect');
    });
});

function renderCrossword(crossword) {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = ''; // Clear any existing grid
  
    crossword.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
  
        if (cell) {
          const inputElement = document.createElement('input');
          inputElement.type = 'text';
          inputElement.maxLength = 1;
          inputElement.dataset.row = rowIndex;
          inputElement.dataset.col = colIndex;
  
          if (cell.position) {
            const positionElement = document.createElement('span');
            positionElement.classList.add('clue-number');
            positionElement.textContent = cell.position;
            cellElement.appendChild(positionElement);
          }
  
          cellElement.appendChild(inputElement);
        } else {
          // Add 'empty-cell' class to empty cells
          cellElement.classList.add('empty-cell');
        }
  
        gridContainer.appendChild(cellElement);
      });
    });
  }
  




// Initialize the crossword puzzle
createGrid();
populateClues();
function enableKeyboardNavigation() {
    document.querySelectorAll('.cell input').forEach(input => {
        input.addEventListener('keydown', (event) => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);

            let newRow = row, newCol = col;

            switch (event.key) {
                case "ArrowUp":
                    newRow--;
                    break;
                case "ArrowDown":
                    newRow++;
                    break;
                case "ArrowLeft":
                    newCol--;
                    break;
                case "ArrowRight":
                    newCol++;
                    break;
                default:
                    return;
            }

            event.preventDefault(); // Prevent page scrolling

            // Find the next valid cell
            const nextInput = findNextValidInput(newRow, newCol);
            if (nextInput) nextInput.focus();
        });
    });
}

// Function to find the next valid input cell (ignores null cells)
function findNextValidInput(row, col) {
    while (row >= 0 && row < puzzle.grid.length && col >= 0 && col < puzzle.grid[row].length) {
        const cell = puzzle.grid[row][col];
        if (cell && cell.letter) {  // If cell exists and contains a letter
            return document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        }
        // Move in the same direction until a valid cell is found
        return null;
    }
    return null;
}

// Call the function after creating the grid
createGrid();
populateClues();
enableKeyboardNavigation();
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
        "Welcome to the Crossword puzzle!",
        "Solve the question carefully! & Find and place the correct answer in the grid!",
        
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