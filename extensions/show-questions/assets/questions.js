// document.addEventListener("DOMContentLoaded", function () {
//     fetchQuestions();
// });

let currentQuestionIndex = 0; // Keep track of the current question index
let totalQuestions = 0; // Total number of questions
let questionsArray = []; // Array to store questions locally
let host = "";
let selectedOptions = [];
let shopID;
let QuizID;
let selectedProductIDS=[] 
let productss=[]
let qna=[]

function displayProducts(products){
    productss=products;
}


function fetchQuestions(quizId) {
    if(!quizId){
        return;
    }
    console.log("quizId from function",quizId)
    fetch(`${location.origin}/apps/proxy-1/quizDetail?shop=${Shopify.shop}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ quizId:quizId.toString() })
    })
        .then(response => {
            console.log("response",response)
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            if (data && data.data.questions) {
                host = data.host;
                QuizID=data.data._id;
                shopID=data.data.shopID;
                const questions = data.data.questions;
                questionsArray = questions; // Store questions in the array
                totalQuestions = questions.length;
                displayStepProgressBar(); // Display the initial step progress bar
                displayQuestion(questions[currentQuestionIndex]); // Display the first question
                displayQuizTitle(data.data.title); // Display the quiz title

                  // Show the next button now that questions have been loaded
                  const nextButton = document.querySelector('.next-button');
                  if (nextButton) {
                      nextButton.style.display = 'block'; // Make the button visible
                  }
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
function toggleOptionSelection(value, questionId, inputFieldValue = null) {
    const currentQuestion = questionsArray[currentQuestionIndex];

    // Check if this option is already selected
    const existingIndex = selectedOptions.findIndex(option => option.questionId === questionId && option.value === value);

    if (existingIndex !== -1) {
        // If already selected, remove it
        selectedOptions.splice(existingIndex, 1);
    } else {
        // For SingleSelect questions, remove any existing selections for this question
        if (currentQuestion.type === 'SingleSelect' || currentQuestion.type == 'radioButton') {
            selectedOptions = selectedOptions.filter(option => option.questionId !== questionId);
        }

        // Add the new selection
        selectedOptions.push({ questionId, value });
    }

    // If SingleSelect question, remove any other selections
    if (currentQuestion.type === 'SingleSelect' ||currentQuestion.type == 'radioButton') {
        const otherOptions = document.querySelectorAll('.option-item.selected');
        otherOptions.forEach(option => {
            if (option.getAttribute('data-question-id') !== questionId) {
                option.classList.remove('selected');
            }
        });
    }

    if (currentQuestion.type === 'SimpleInputFields') {
        // Push the title and value to the qna array
        qna.push({ title: currentQuestion.title, value: inputFieldValue });
    }

    console.log("selectedOptions",selectedOptions)
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
                toggleOptionSelection(option.value, question._id);
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
            optionItem.addEventListener('click', () => {
                toggleOptionSelection(option.value, question._id);
            });
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
    const currentQuestion = questionsArray[currentQuestionIndex];

    if (currentQuestion.type === 'SimpleInputFields') {
        // Get the input field value
        const inputElement = document.querySelector('input[type="text"]');
        const inputFieldValue = inputElement.value;
        toggleOptionSelection(null, currentQuestion._id, inputFieldValue);
    } else {
        // For other question types, simply call toggleOptionSelection without inputFieldValue
        toggleOptionSelection();
    }


    if (totalQuestions - 1 > currentQuestionIndex) {
        currentQuestionIndex++;
        displayQuestion(questionsArray[currentQuestionIndex]); // Display next question
        displayStepProgressBar(); // Update step progress bar
    } else {
        console.log("Submit the code ");
        console.log("shopID",shopID)
        console.log("QuizID",QuizID)

    fetch(`${location.origin}/apps/proxy-1/answersBaseProductIDS?shop=${Shopify.shop}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ shopID: shopID,QuizID:QuizID,selectedOptions:selectedOptions,qna:qna })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            console.log("Data",data)
            selectedProductIDS=data.data;
            displayProductsAfterFiltering()
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
    }


    //FIlter the products based on the selectedProductIDS array for  products and the display
}
function displayProductsAfterFiltering() {
    // Filter products based on selectedProductIDS
    const filteredProducts = productss.filter(product => selectedProductIDS.includes(product.id));

    // Show the next button now that questions have been loaded
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.style.display = 'none'; // Hide the next button
    }
    const quizTitle = document.querySelector('.quiz-title');
    if (quizTitle) {
        quizTitle.style.display = 'none'; // Hide the quiz title
    }
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.style.display = 'none'; // Hide the question container
    }
    const stepperWrapper = document.querySelector('.stepper-wrapper');
    if (stepperWrapper) {
        stepperWrapper.style.display = 'none'; // Hide the stepper wrapper
    }

    // Clear existing content in product-list
    const productListContainer = document.querySelector('.product-list-filtered');
    productListContainer.innerHTML = '';

    // Clear existing content in result-list
    const resultListContainer = document.querySelector('.result-list');
    resultListContainer.innerHTML = '';

    // Display "Results" heading and "No products found" message
    const resultsContainer = document.createElement('div');
    resultsContainer.classList.add('results-container');
    resultsContainer.style.textAlign = 'center'; // Center align content
    resultListContainer.appendChild(resultsContainer);

    const resultsHeading = document.createElement('h2');
    resultsHeading.textContent = 'Results';
    resultsHeading.style.marginBottom = '10px'; // Add some space below the heading
    resultsContainer.appendChild(resultsHeading);

    if (filteredProducts.length > 0) {
        // Display filtered products
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        contentContainer.style.display = 'flex';
        contentContainer.style.flexWrap = 'wrap';
        contentContainer.style.justifyContent = 'center'; // Center content horizontally
        resultListContainer.appendChild(contentContainer);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const imageElement = document.createElement('img');
            imageElement.src = product.imageUrl;
            imageElement.alt = product.title;
            imageElement.classList.add('product-image');

            const titleElement = document.createElement('h2');
            titleElement.textContent = product.title;
            titleElement.classList.add('product-title');

            const priceElement = document.createElement('p');
            priceElement.textContent = product.price;
            priceElement.classList.add('product-price');

            const addButton = document.createElement('a');
            addButton.href = product.url;
            addButton.textContent = 'Add to Cart';
            addButton.classList.add('add-to-cart-button');

            productCard.appendChild(imageElement);
            productCard.appendChild(titleElement);
            productCard.appendChild(priceElement);
            productCard.appendChild(addButton);

            contentContainer.appendChild(productCard);
        });
    } else {
        // Display "No products found" message
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No products match the selected criteria.';
        resultsContainer.appendChild(noResultsMessage);
    }
}



