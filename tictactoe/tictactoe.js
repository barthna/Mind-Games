document.addEventListener("DOMContentLoaded", () => {
    const playerChoice = document.getElementById("player-choice");
    const overlay = document.getElementById("overlay");
    const leftTurnBox = document.getElementById("left-turn-box");
    const rightTurnBox = document.getElementById("right-turn-box");
    const leftTurnText = document.getElementById("left-turn-text");
    const rightTurnText = document.getElementById("right-turn-text");
    const gameBoard = document.getElementById("game-board");
    const cells = document.querySelectorAll(".cell");
    const resultMessage = document.getElementById("result-message");
    const modal = document.getElementById("result-modal");
    const restartBtn = document.getElementById("restart-btn");
    const playAgainBtn = document.getElementById("play-again-btn");
    const newGameBtn = document.getElementById("new-game-btn");
    

    let board = Array(9).fill(null);
    let playerSymbol = "";
    let aiSymbol = "";
    let isPlayerTurn = true;
    let gameStarted = false;

    // Winning combinations
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    playerChoice.style.display = "flex";
    overlay.style.display = "block";
    window.chooseSymbol = function (symbol) {
        playerSymbol = symbol;
        aiSymbol = symbol === "X" ? "O" : "X";
    
        playerChoice.style.display = "none";
        overlay.style.display = "none";
    
        isPlayerTurn = playerSymbol === "X"; // अगर प्लेयर ने "X" लिया, तो वही पहले खेलेगा
    
        updateTurnIndicators();
    
        // अगर AI को पहला मूव करना है
        if (!isPlayerTurn) {
            setTimeout(aiMove, 500); // AI की मूव को थोड़ा डिले करें ताकि UI अपडेट हो
        }
    };
    

    // Player move function (fix applied)
function playerMove(e) {
    if (!playerSymbol) return; // Block moves if no selection
    const index = e.target.getAttribute("data-index");
    if (board[index] || !isPlayerTurn) return;

    board[index] = playerSymbol;
    e.target.textContent = playerSymbol; // FIX: Board update ho UI me bhi reflect kare

    if (!gameStarted) {
        restartBtn.style.display = "flex"; // Restart button first move ke baad dikhe
        gameStarted = true;
    }

    if (checkWinner(playerSymbol)) {
        showResult("Player wins!");
        return;
    }
    if (isBoardFull()) {
        showResult("It's a draw!");
        return;
    }

    isPlayerTurn = false;
    updateTurnIndicators();
    setTimeout(aiMove, 1000);
}

function aiMove() {
    let emptyCells = getEmptyCells(board);                                              

    if (emptyCells.length === 0) return;

    let bestMove = minimax(board, aiSymbol).index;
    if (bestMove !== undefined) {
        board[bestMove] = aiSymbol;

        // **UI अपडेट को फोर्स करें**
        cells[bestMove].textContent = aiSymbol;
        cells[bestMove].classList.add("ai-move"); // CSS क्लास एड करें (Optional)

        if (checkWinner(aiSymbol)) {
            showResult("AI wins!");
            return;
        }
        if (isBoardFull()) {
            showResult("It's a draw!");
            return;
        }
    }

    isPlayerTurn = true;
    updateTurnIndicators();
}



    // Minimax algorithm
    function minimax(newBoard, player) {
        const emptyCells = getEmptyCells(newBoard);

        if (checkWinnerMinimax(newBoard, playerSymbol)) return { score: -10 };
        if (checkWinnerMinimax(newBoard, aiSymbol)) return { score: 10 };
        if (emptyCells.length === 0) return { score: 0 };

        let moves = [];

        for (let i = 0; i < emptyCells.length; i++) {
            let move = { index: emptyCells[i] };
            newBoard[emptyCells[i]] = player;

            move.score = (player === aiSymbol) ?
                minimax(newBoard, playerSymbol).score :
                minimax(newBoard, aiSymbol).score;

            newBoard[emptyCells[i]] = null;
            moves.push(move);
        }

        return moves.reduce((bestMove, move) =>
            (player === aiSymbol && move.score > bestMove.score) ||
            (player !== aiSymbol && move.score < bestMove.score) ? move : bestMove
        );
    }

    // Check winner
    function checkWinner(player) {
        return winningCombos.some(combo => combo.every(index => board[index] === player));
    }

    function checkWinnerMinimax(board, player) {
        return winningCombos.some(combo => combo.every(index => board[index] === player));
    }

    // Get empty cells
    function getEmptyCells(board) {
        return board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    }

    // Check if the board is full
    function isBoardFull() {
        return board.every(cell => cell !== null);
    }

    function showResult(message) {
        resultMessage.textContent = message;
        modal.style.display = "flex";
        newGameBtn.style.display = "flex"; // Show play button when someone wins
    }

    function restartGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove("ai-move");
        });
    
        modal.style.display = "none";
        restartBtn.style.display = "none";
        gameStarted = false;
        playerSymbol = ""; // Reset player choice
        aiSymbol = "";     // Reset AI choice
    
        // Show Player Choice Modal again
        playerChoice.style.display = "flex";
        overlay.style.display = "block";
    
        updateTurnIndicators();
    }
    function updateTurnIndicators() {
        leftTurnBox.style.display = "flex";
        rightTurnBox.style.display = "flex";
        leftTurnText.innerHTML = `Your Turn<br><span style='font-size: 20px;'>(${playerSymbol})</span>`;
        rightTurnText.innerHTML = `AI Turn<br><span style='font-size: 20px;'>(${aiSymbol})</span>`;

        leftTurnBox.classList.toggle("active", isPlayerTurn);
        rightTurnBox.classList.toggle("active", !isPlayerTurn);
    }
    
    document.getElementById("new-game-btn").addEventListener("click", function () {
        resetGame(); // Call reset function
       
    });
    function resetGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove("ai-move");
        });
    
        modal.style.display = "none";
        newGameBtn.style.display = "none";
        gameStarted = false; // Ensure game resets properly
    
        // Do NOT show player choice modal
        playerChoice.style.display = "none";
        overlay.style.display = "none";
    
        isPlayerTurn = playerSymbol === "X"; // Ensure turn resets correctly
        updateTurnIndicators();
    
        // If AI's turn, make its move after reset
        if (!isPlayerTurn) {
            setTimeout(aiMove, 500);
        }
    }
    

    cells.forEach(cell => cell.addEventListener("click", playerMove));
    restartBtn.addEventListener("click", restartGame);
    playAgainBtn.addEventListener("click", restartGame);
    newGameBtn.addEventListener("click", resetGame)
});



document.addEventListener("DOMContentLoaded", function () {
    const speechBubble = document.querySelector(".speech-bubble");
    const speechText = document.getElementById("speech-text");
    const characterContainer = document.getElementById("character-container");
    const gameOverlay = document.getElementById("game-overlay"); // Get overlay element
    const playerChoice = document.getElementById("player-choice");
    // Ensure speech bubble is visible
    playerChoice.style.display = "none";
    speechBubble.style.display = "block";
    speechBubble.style.opacity = "1";
    characterContainer.style.display = "flex"; 
    characterContainer.style.opacity = "1"; 
    gameOverlay.style.display = "flex"; // Show overlay during tutorial
   
    // Sentences for typewriter effect
    const sentences = [
        "Hello!! I am Barth..",
            "Welcome to the Tic-Tac-Toe game!",
            "In Tic Tac Toe, place three marks (O/X) in a row/column/diagonal to win!"
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
                gameOverlay.style.display = "none";
    
                // After the tutorial, show the player symbol selection
                playerChoice.style.display = "flex";
                overlay.style.display = "block";
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