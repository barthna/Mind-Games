// List of items with images and prices
const items = [
    { name: 'pencil', price: 0, imgSrc: '../pictures/pencil.png' },
    { name: 'eraser', price: 0, imgSrc: '../pictures/rubber.png' },
    { name: 'sharpener', price: 0, imgSrc: '../pictures/sharpner.png' },
    { name: 'rounder', price: 0, imgSrc: '../pictures/rounder.png' },
    { name: 'scale', price: 0, imgSrc: '../pictures/scale.png' },
    { name: 'colourplat', price: 0, imgSrc: '../pictures/colorplate.png' }
];

let currentQuestion = {};
let selectedItems = [];

// Function to initialize prices
function initializePrices() {
    items.forEach(item => {
        item.price = getRandomPrice(1, 10);
        document.getElementById(`price-${item.name}`).innerText = `$${item.price}`;
    });
}

// Function to get random price
function getRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a question
function generateQuestion() {
    const numItems = Math.random() < 0.5 ? 2 : 4;
    selectedItems = shuffleArray([...items]).slice(0, numItems);

    let questionContainer = document.getElementById('question');
    questionContainer.innerHTML = '';
    let correctAnswer = 0;

    selectedItems.forEach((item, index) => {
        const quantity = getRandomPrice(1, 5);
        correctAnswer += item.price * quantity;

        let itemDiv = document.createElement('div');
        itemDiv.style.display = 'inline-block';
        itemDiv.style.margin = '0 10px';

        let img = document.createElement('img');
        img.src = item.imgSrc;
        img.alt = item.name;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.display = 'block';
        img.style.margin = '0 auto';

        let quantitySpan = document.createElement('span');
        quantitySpan.innerText = `${quantity} x `;
        quantitySpan.style.fontSize = '16px';
        quantitySpan.style.display = 'block';
        quantitySpan.style.textAlign = 'center';

        itemDiv.appendChild(quantitySpan);
        itemDiv.appendChild(img);
        questionContainer.appendChild(itemDiv);

        if (index < selectedItems.length - 1) {
            let plusOperator = document.createElement('span');
            plusOperator.innerText = '+';
            plusOperator.style.fontSize = '20px';
            plusOperator.style.margin = '0 10px';
            plusOperator.style.verticalAlign = 'middle';
            questionContainer.appendChild(plusOperator);
        }
    });

    let equalsSign = document.createElement('span');
    equalsSign.innerText = '=';
    equalsSign.style.fontSize = '20px';
    equalsSign.style.display = 'block';
    equalsSign.style.marginTop = '10px';
    questionContainer.appendChild(equalsSign);

    currentQuestion = {
        items: selectedItems,
        correctAnswer: correctAnswer
    };

    document.getElementById('answer').value = '';
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to handle submission
function handleSubmit() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    if (isNaN(userAnswer)) {
        showPopup("⚠ Please enter a valid number!", "orange");
        return;
    }

    if (userAnswer === currentQuestion.correctAnswer) {
        showPopup("✅ Correct!", "green", true);
    } else {
        showPopup(`❌ Incorrect! The correct answer was ${currentQuestion.correctAnswer}.`, "red", false);
    }
}

// Function to show popup with close button
function showPopup(message, color, isCorrect) {
    let existingPopup = document.querySelector(".popup");
    if (existingPopup) {
        existingPopup.remove();
    }

    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <span class="popup-message">${message}</span> 
        <span class="popup-close">&times;</span>
    `;
    popup.style.backgroundColor = color;
    document.body.appendChild(popup);

    document.querySelector(".popup-close").addEventListener("click", () => {
        popup.remove();
        if (isCorrect) generateQuestion();
    });
}


    // Initialize game on page load
    window.onload = function () {
        initializePrices();
        generateQuestion();
        document.getElementById('submit').addEventListener('click', handleSubmit);
    };
    document.addEventListener("DOMContentLoaded", () => {
        // Page load transition (light to dark)
        setTimeout(() => {
            document.querySelector(".page-transition").style.display = "none"; // Hide after animation
        }, 1500);
    });