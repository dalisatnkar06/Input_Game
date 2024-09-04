const start_butt = document.getElementById('start_butt');
const select_butt = document.getElementById('select_butt');
const next_question_btn = document.getElementById('next-question');
const question_text = document.getElementById('question-text');
const answers_div = document.getElementById('answers');
const result_text = document.getElementById('result-text');
const category_form = document.querySelector('.category-form');
const question_form = document.querySelector('.question-form');
const result_div = document.querySelector('.result');

let questions = [];
let currentQuestionIndex = 0;
let playerScores = [0, 0];
let currentPlayer = 0;
let players = [];

// Start Game
start_butt.addEventListener('click', () => {
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    if (player1 === "" || player2 === "") {
        alert("Please enter both player names");
    } else {
        players = [player1, player2];
        document.querySelector('.player-form').style.display = 'none';
        category_form.style.display = 'block';
        fetchCategories();
    }
});

// Fetch Categories
const fetchCategories = async() => {
    try {
        const response = await fetch('https://the-trivia-api.com/api/categories');
        const categories = await response.json();
        const categorySelect = document.getElementById('category');

        Object.keys(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

// Select Category
select_butt.addEventListener('click', () => {
    const selectedCategory = document.getElementById('category').value;
    if (selectedCategory) {
        fetchQuestions(selectedCategory);
        category_form.style.display = 'none';
        question_form.style.display = 'block';
    } else {
        alert("Please select a category");
    }
});

// Fetch Questions
const fetchQuestions = async(category) => {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=6&difficulty=easy,medium,hard`);
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
};

// Display Question
const displayQuestion = () => {
    next_question_btn.style.display = 'none'; // hide next question button

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        const player = players[currentPlayer];
        question_text.innerHTML = `<h4 style="color:#007bff">This question is for ${player}<h4><h5>${question.question.text}<h5>`;
        answers_div.innerHTML = '';
        const allAnswers = [...question.incorrectAnswers, question.correctAnswer];
        allAnswers.sort(() => Math.random() - 0.5);
        // allAnswers.sort();

        allAnswers.forEach(answer => {
            const answer_btn = document.createElement('button');
            answer_btn.className = 'answer-button';
            answer_btn.textContent = answer;
            answers_div.appendChild(answer_btn);
            answer_btn.addEventListener('click', () => checkAnswer(answer));
        });
    } else {
        endGame();
    }
};

// Check Answer
const checkAnswer = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        if (currentQuestionIndex < 2) {
            playerScores[currentPlayer] += 10;
        } else if (currentQuestionIndex < 4) {
            playerScores[currentPlayer] += 15;
        } else {
            playerScores[currentPlayer] += 20;
        }
    }

    currentPlayer = currentPlayer === 0 ? 1 : 0; // Change player for the next question
    currentQuestionIndex++;

    next_question_btn.style.display = 'block'; // Next Question button
    next_question_btn.addEventListener('click', displayQuestion);

};
// End Game
const endGame = () => {
    question_form.style.display = 'none';
    result_div.style.display = 'block';

    if (playerScores[0] > playerScores[1]) {
        result_text.textContent = `${players[0]} wins with ${playerScores[0]} points!`;
    } else if (playerScores[1] > playerScores[0]) {
        result_text.textContent = `${players[1]} wins with ${playerScores[1]} points!`;
    } else {
        result_text.textContent = `It's a tie! Both players have ${playerScores[0]} points!`;
    }
};