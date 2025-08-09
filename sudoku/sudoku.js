
let selectedCell = null; // Keep track of the selected cell
let board = generateValidSudokuBoard(); // Generate a valid Sudoku board
let initialBoard = JSON.parse(JSON.stringify(board)); // Store the initial board state
let timerInterval = null;
let secondsElapsed = 0;

function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Reset any existing timer
    secondsElapsed = 0;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    secondsElapsed++;
    let minutes = Math.floor(secondsElapsed / 60);
    let seconds = secondsElapsed % 60;
    document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function createBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
            } else {
                cell.contentEditable = true;
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                cell.addEventListener('click', () => selectCell(cell));
                cell.addEventListener('keydown', handleKeyDown); // Allow keyboard input
            }
            boardElement.appendChild(cell);
        }
    }

    // Listen for arrow key movements
    document.addEventListener('keydown', handleArrowKeys);
}

function generateValidSudokuBoard() {
    // Generate a complete valid Sudoku board
    const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValidMove(board, row, col, num) {
        // Check the row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
        }
        // Check the column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        // Check the 3x3 subgrid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        return true;
    }


    function fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    numbers.sort(() => Math.random() - 0.5); // Shuffle numbers randomly

                    for (let num of numbers) {
                        if (isValidMove(board, row, col, num)) {
                            board[row][col] = num;

                            if (fillBoard(board)) {
                                return true;
                            }

                            board[row][col] = 0; // Backtrack if not solvable
                        }
                    }
                    return false; // If no valid number, backtrack
                }
            }
        }
        return true;
    }

    fillBoard(emptyBoard); // Fill the board with a valid Sudoku configuration

    // Remove some numbers to make it a puzzle
    let puzzle = JSON.parse(JSON.stringify(emptyBoard));
    let cellsToRemove = 45; // Number of cells to clear for the puzzle

    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) { 
            puzzle[row][col] = 0;
            cellsToRemove--;
        }
    }

    return puzzle;
}


document.getElementById('new-game').addEventListener('click', () => {
    showModal();
});


function showModal() {
    document.getElementById('newGameModal').style.display = 'flex'; // Show modal
}


function hideModal() {
    document.getElementById('newGameModal').style.display = 'none'; // Hide modal
}


document.getElementById('yes-new-game').addEventListener('click', () => {
    hideModal(); // Hide modal
    board = generateValidSudokuBoard(); // Generate new board
    initialBoard = JSON.parse(JSON.stringify(board));
    createBoard(); // Create new board on screen
    startTimer(); // Start the timer when the game begins

});

document.getElementById('no-new-game').addEventListener('click', hideModal); // Dismiss modal on "No"


function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = cell;
    cell.classList.add('selected');
    cell.focus(); // Focus the selected cell for keyboard input
}

function fillCellWithNumber(number) {
    if (selectedCell && selectedCell.isContentEditable) {
        selectedCell.textContent = number;
        selectedCell.classList.remove('selected'); // Deselect the cell
        selectedCell = null;
    }
}

function handleKeyDown(event) {
    const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Allow only one digit between 1-9
    if (validNumbers.includes(event.key)) {
        event.preventDefault(); // Prevent typing more than one number
        this.textContent = event.key;
        //this.classList.remove('selected'); // Deselect the cell after entering a number
        //selectedCell = null;
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault(); // Allow deleting the number
        this.textContent = '';
    } else {
        event.preventDefault(); // Block any other inputs
    }
}

function handleArrowKeys(event) {
    if (!selectedCell) return; // If no cell is selected, do nothing

    const row = parseInt(selectedCell.getAttribute('data-row'));
    const col = parseInt(selectedCell.getAttribute('data-col'));

    let newRow = row;
    let newCol = col;

    switch (event.key) {
        case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
        case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
        case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
        case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        default:
            return; // If not an arrow key, exit
    }

    // Find the new cell and select it
    const newCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
    if (newCell) {
        selectCell(newCell);
    }
}


function validateBoard() {
    const cells = document.querySelectorAll('.cell[contenteditable="true"]');
    let hasError = false;

    cells.forEach(cell => {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        const value = parseInt(cell.textContent);

        if (!isValidMove(board, row, col, value)) {
            cell.style.backgroundColor = '#f8d7da'; // Highlight invalid cells
            hasError = true;
        } 
    });

    if (hasError) {
        showValidationModal(false);
        setTimeout(() => {
            cells.forEach(cell => {
                cell.style.backgroundColor = ''; // Reset background color after 2 seconds
            });
        }, 3000);
    } else {
        stopTimer(); // Stop the timer if the board is solved
        showValidationModal(true);
    }
}


function showValidationModal(success) {
    const messageElement = document.getElementById('validationMessage');
    if (success) {
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        messageElement.textContent = `Congratulations! You solved the Sudoku in ${minutes}:${seconds}.`;
    } else {
        messageElement.textContent = 'The solution is incorrect. Please try again.';
    }
    document.getElementById('validationModal').style.display = 'flex';
}

function closeValidationModal() {
    document.getElementById('validationModal').style.display = 'none';
}

document.getElementById('close-validation-modal').addEventListener('click', closeValidationModal);

function isValidMove(board, row, col, value) {
    if (value < 1 || value > 9 || isNaN(value)) return false;

    // Check the row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === value && i !== col) return false;
    }

    // Check the column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === value && i !== row) return false;
    }

    // Check the 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === value && (i !== row || j !== col)) return false;
        }
    }

    return true;
}

function resetBoard() {
    board = JSON.parse(JSON.stringify(initialBoard));
    createBoard();
}

// Event listener for number buttons
document.querySelectorAll('.number-btn').forEach(button => {
    button.addEventListener('click', () => {
        const selectedNumber = button.textContent;
        fillCellWithNumber(selectedNumber); // Insert number into selected cell
        document.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

document.getElementById('validate').addEventListener('click', validateBoard);
document.getElementById('reset').addEventListener('click', resetBoard);

createBoard();
startTimer(); // Start the timer when the game begins
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

    const sentences = [
        "Hello!! I am Barth..",
        "Welcome to the Sudoku challenge!",
        "Fill the grid so every row, column, and box has unique numbers!"
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