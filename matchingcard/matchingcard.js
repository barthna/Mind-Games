document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');
    const playBtn = document.getElementById('play-btn');
    const gameBoard = document.getElementById('game-board');
    
    let firstCard, secondCard;
    let hasFlippedCard = false;
    let lockBoard = false;
    let score = 0;
    let time = 0;
    let timerInterval;
    let isPlaying = false;

    // Start the timer function
    function startTimer() {
        timerInterval = setInterval(() => {
            time++;
            timerElement.textContent = `Time: ${time}s`;
        }, 1000);
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timerInterval);
        time = 0;
        timerElement.textContent = `Time: 0s`;
    }

    // Shuffle the cards randomly
    function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    }

    // Flip the card and check for a match
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');
        this.querySelector('img').style.visibility = 'visible'; // Show the image

        if (!hasFlippedCard) {
            // First card flip
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Second card flip
        secondCard = this;
        checkForMatch();
    }

    // Check if two flipped cards match
    function checkForMatch() {
        let isMatch = firstCard.getAttribute('data-name') === secondCard.getAttribute('data-name');
        isMatch ? disableCards() : unflipCards();
    }

    // Disable the matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        score++;
        scoreElement.textContent = `Score: ${score}`;

        // Check if the game is completed
        if (score === 8) { // Since there are 8 pairs
            clearInterval(timerInterval); // Stop the timer
            showPopup(); // Show the completion popup
        }

        resetBoard();
    }

    // Unflip the cards if they don't match
    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            firstCard.querySelector('img').style.visibility = 'hidden'; // Hide the image
            secondCard.querySelector('img').style.visibility = 'hidden'; // Hide the image

            resetBoard();
        }, 1000);
    }

    // Reset the board state
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Restart the game
    function restartGame() {
        score = 0;
        scoreElement.textContent = `Score: 0`;
        resetTimer();
        isPlaying = false;
        gameBoard.classList.add('hidden');
        playBtn.style.display = 'inline-block';

        // Reset all cards
        cards.forEach(card => {
            card.classList.remove('flip', 'matched');
            card.querySelector('img').style.visibility = 'hidden';
            card.addEventListener('click', flipCard);
        });

        shuffle();
    }

    // Start the game
    function startGame() {
        isPlaying = true;
        gameBoard.classList.remove('hidden');
        playBtn.style.display = 'none';
        score = 0;
        scoreElement.textContent = `Score: 0`;
        shuffle();
        startTimer();
    }

    // Show the popup with the score
    function showPopup() {
        const finalScore = Math.max(0, 100 - time);
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `<h2>Game Completed!</h2><p>Your Score: ${finalScore}</p><button id="close-popup">Close</button>`;
        document.body.appendChild(popup);

        document.getElementById('close-popup').addEventListener('click', () => {
            document.body.removeChild(popup);
            restartGame(); // Restart the game when popup is closed
        });
    }

    // Add event listener to all cards
    cards.forEach(card => card.addEventListener('click', flipCard));

    // Restart button functionality
    restartBtn.addEventListener('click', restartGame);

    // Play button functionality
    playBtn.addEventListener('click', startGame);

    // Initial setup: Hide game board initially
    gameBoard.classList.add('hidden');
    playBtn.style.display = 'inline-block';
    shuffle();


});
