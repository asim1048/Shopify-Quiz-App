// document.addEventListener("DOMContentLoaded", function () {
//     fetchQuestions();
// });

let currentQuestionIndex = 0; // Keep track of the current question index
let totalQuestions = 0; // Total number of questions
let questionsArray = []; // Array to store questions locally
let host = "";
let selectedOptions = [];


function fetchQuestions(shopId) {
    fetch(`${location.origin}/apps/proxy-1/firstQuiz?shop=${Shopify.shop}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ shopID: shopId })
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
                host = data.host;
                const questions = data.data.questions;
                questionsArray = questions; // Store questions in the array
                totalQuestions = questions.length;
                displayStepProgressBar(); // Display the initial step progress bar
                displayQuestion(questions[currentQuestionIndex]); // Display the first question
                displayQuizTitle(data.data.title); // Display the quiz title
                console.log(host);
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
// Function to toggle option selection
function toggleOptionSelection(optionId, questionId) {
    const currentQuestion = questionsArray[currentQuestionIndex];

    // Check if this option is already selected
    const existingIndex = selectedOptions.findIndex(option => option.questionId === questionId && option.optionId === optionId);

    if (existingIndex !== -1) {
        // If already selected, remove it
        selectedOptions.splice(existingIndex, 1);
    } else {
        // For SingleSelect questions, remove any existing selections for this question
        if (currentQuestion.type === 'SingleSelect') {
            selectedOptions = selectedOptions.filter(option => option.questionId !== questionId);
        }

        // Add the new selection
        selectedOptions.push({ questionId, optionId });
    }

    // If SingleSelect question, remove any other selections
    if (currentQuestion.type === 'SingleSelect') {
        const otherOptions = document.querySelectorAll('.option-item.selected');
        otherOptions.forEach(option => {
            if (option.getAttribute('data-question-id') !== questionId) {
                option.classList.remove('selected');
            }
        });
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

    const titleElement = document.createElement('p');
    titleElement.textContent = question.title;
    titleElement.style.marginTop = '-10px'; // Set font size
    titleElement.style.fontSize = '20px'; // Set font size
    titleElement.style.color = 'black'; // Set text color
    titleElement.style.fontFamily = 'Arial, sans-serif'; // Set font family

    questionElement.appendChild(titleElement);



    // Add input field if the question type is input
    if (question.type === 'SimpleInputFields') {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = question.title; // Use the title as the placeholder

        // Apply CSS styles to the input element
        inputElement.style.width = '350px'; // Set the width to 100%
        inputElement.style.padding = '12px'; // Set padding
        inputElement.style.marginTop = '4px'; // Set margin-top
        inputElement.style.border = '1px solid #ccc'; // Add a border
        inputElement.style.borderRadius = '4px'; // Add border-radius for rounded corners
        inputElement.style.fontSize = '16px'; // Set font size
        inputElement.style.outline = 'none'; // Set font size
        inputElement.style.fontFamily = 'Arial, sans-serif'; // Set font family
        inputElement.style.color = 'black'; // Set text color
        inputElement.style.backgroundColor = '#fff'; // Set background color




        questionElement.appendChild(inputElement);
    }


    // Add options if the question type is SingleSelect or MultiSelect
    if (question.type === 'SingleSelect' || question.type === 'MultiSelect') {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container'); // Add a class for styling

        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.classList.add('option-item'); // Add a class for styling

            // Check if option is selected
            const isSelected = selectedOptions.some(option => option.questionId === question._id && option.optionId === option.id);
            if (isSelected) {
                optionItem.classList.add('selected'); // Add selected class
            }

            // Add event listener to toggle selection
            optionItem.addEventListener('click', () => {
                toggleOptionSelection(option.id, question._id);
                optionItem.classList.toggle('selected'); // Toggle selected class
            });

            // Add image for option if available
            if (option.image) {
                const imageElement = document.createElement('img');
                imageElement.src = `${host}/${option.image}`; // Assuming 'host' holds the host URL
                imageElement.alt = option.value; // Use option value as alt text
                optionItem.appendChild(imageElement);
            }

            // Add value of option
            const valueElement = document.createElement('span');
            valueElement.textContent = option.value; // Assuming option is an object with 'value' property
            optionItem.appendChild(valueElement);

            // Add radio or checkbox input (if needed)

            optionsContainer.appendChild(optionItem);
        });

        questionElement.appendChild(optionsContainer);
    }
    else if (question.type === 'radioButton') { // Adjusted condition for radioButton
        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'option'; // Ensure all radio buttons have the same name
            radio.value = option.value;
            optionItem.appendChild(radio);
            const label = document.createElement('label');
            label.textContent = option.value;
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

// Function to display the step progress bar
function displayStepProgressBar() {
    const stepperWrapper = document.querySelector('.stepper-wrapper');
    if (stepperWrapper) {
        stepperWrapper.innerHTML = ''; // Clear existing content

        // Generate step items
        for (let i = 0; i < totalQuestions; i++) {
            const stepItem = document.createElement('div');
            stepItem.classList.add('stepper-item');
            if (i < currentQuestionIndex+1) {
                stepItem.classList.add('completed');
            } else if (i === currentQuestionIndex+1) {
                stepItem.classList.add('active');
            }
            
            const stepCounter = document.createElement('div');
            stepCounter.classList.add('step-counter');
            stepCounter.textContent = i + 1;
            stepItem.appendChild(stepCounter);
            
            const stepName = document.createElement('div');
            stepName.classList.add('step-name');
            stepName.textContent = `Step ${i + 1}`;
            stepItem.appendChild(stepName);

            stepperWrapper.appendChild(stepItem);
        }
    }
}




function nextQuestion() {
    if (totalQuestions - 1 > currentQuestionIndex) {
        currentQuestionIndex++;
        displayQuestion(questionsArray[currentQuestionIndex]); // Display next question
        displayStepProgressBar(); // Update step progress bar
    } else {
        console.log("Submit the code ");
    }
}
