document.addEventListener("DOMContentLoaded", function () {
    fetchQuestions();
});

let currentQuestionIndex = 0; // Keep track of the current question index
let totalQuestions = 0; // Total number of questions
let questionsArray = []; // Array to store questions locally
let port = 0;

function fetchQuestions() {
    fetch(`${location.origin}/apps/proxy-1/firstQuiz?shop=${Shopify.shop}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ shopID: 63500976295 })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            if (data && data.data.questions) {
                port = data.port;
                const questions = data.data.questions;
                questionsArray = questions; // Store questions in the array
                totalQuestions = questions.length;
                displayQuestion(questions[currentQuestionIndex]); // Display the first question
                displayQuizTitle(data.data.title); // Display the quiz title
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function displayQuizTitle(title) {
    const quizTitleElement = document.querySelector('.quiz-title');
    if (quizTitleElement) {
        quizTitleElement.textContent = title;
    }
}

function displayQuestion(question) {
    const questionContainer = document.querySelector('.question-container');

    if (!questionContainer) {
        return;
    }

    // Clear existing content
    questionContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const titleElement = document.createElement('h3');
    titleElement.textContent = question.title;
    questionElement.appendChild(titleElement);

    // Add image if available
    if (question.image) {
        const imageElement = document.createElement('img');
        imageElement.src = `http://localhost:${port}/${question.image}`; // Assuming 'port' variable holds the port number
        imageElement.alt = question.title; // Use title as alt text
        questionElement.appendChild(imageElement);
    }

    // Add input field if the question type is input
    if (question.type === 'SimpleInputFields') {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = question.title; // Use the title as the placeholder
        questionElement.appendChild(inputElement);
    }

    // Add options if the question type is SingleSelect or MultiSelect
    if (question.type === 'SingleSelect' || question.type === 'MultiSelect') {
        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            if (question.type === 'MultiSelect') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option.value; // Assuming option is an object with 'value' and 'image' properties
                optionItem.appendChild(checkbox);
            } else {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'option'; // Ensure all radio buttons have the same name
                radio.value = option.value; // Assuming option is an object with 'value' and 'image' properties
                optionItem.appendChild(radio);
            }
            const label = document.createElement('label');
            label.textContent = option.value; // Assuming option is an object with 'value' and 'image' properties
            optionItem.appendChild(label);

            // Add image for option if available
            if (option.image) {
                const imageElement = document.createElement('img');
                imageElement.src = `http://localhost:${port}/${option.image}`; // Assuming 'port' variable holds the port number
                imageElement.alt = option.value; // Use option value as alt text
                optionItem.appendChild(imageElement);
            }

            questionElement.appendChild(optionItem);
        });
    } else if (question.type === 'radioButton') { // Adjusted condition for radioButton
        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'option'; // Ensure all radio buttons have the same name
            radio.value = option.value;
            optionItem.appendChild(radio);
            const label = document.createElement('label');
            label.textContent = option;
            optionItem.appendChild(label);
            questionElement.appendChild(optionItem);
        });
    }

    questionContainer.appendChild(questionElement);

    // Change button text to 'Submit' if it's the last question
    if (currentQuestionIndex === totalQuestions - 1) {
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.textContent = 'Submit';
        }
    }
}


function nextQuestion() {
    if (totalQuestions-1 > currentQuestionIndex) {
        currentQuestionIndex++;
        displayQuestion(questionsArray[currentQuestionIndex]); // Display next question
    } else {
        console.log("Submit the code ");
    }
}
