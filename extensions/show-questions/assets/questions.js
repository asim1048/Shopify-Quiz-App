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
let selectedProductIDS = []
let productss = []
let products = []
let qna = []

//only for imperial
let directMoveToSubmit = false
let name = "";
let email = "";

function displayProducts(products) {
    productss = products;
}


function fetchQuestions(quizId) {
    if (!quizId) {
        return;
    }
    console.log("quizId from function", quizId)
    fetch(`${location.origin}/apps/proxy-1/quizDetail?shop=${Shopify.shop}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ quizId: quizId.toString() })
    })
        .then(response => {
            console.log("response", response)
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            if (data && data.data.questions) {
                host = data.host;
                QuizID = data.data._id;
                shopID = data.data.shopID;
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
    if (currentQuestion.type === 'SingleSelect' || currentQuestion.type == 'radioButton') {
        const otherOptions = document.querySelectorAll('.option-item.selected');
        otherOptions.forEach(option => {
            if (option.getAttribute('data-question-id') !== questionId) {
                option.classList.remove('selected');
            }
        });
    }

    // if (currentQuestion.type === 'SimpleInputFields') {

    //     qna.push({ title: currentQuestion.title, value: inputFieldValue });
    // }

    console.log("selectedOptions", selectedOptions)
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

    const titleElement = document.createElement('h2');
    titleElement.textContent = question.type != "SimpleInputFields" ? question.title : "Get Your Results and Special Offers via Email";
    titleElement.classList.add('questionTitle'); // Add a class for styling

    questionElement.appendChild(titleElement);

    // Add input field if the question type is input
    if (question.type === 'SimpleInputFields') {
        // Create a container div
        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';
        containerDiv.style.flexDirection = 'column'; // Arrange children in a column
        containerDiv.style.gap = '10px'; // Optional: add some space between elements
        containerDiv.style.alignItems = 'center'; // Optional: add some space between elements

        containerDiv.style.marginTop = '60px'; // Optional: add some space between elements


        // Handling first input
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = question.title; // Use the title as the placeholder

        // Apply CSS styles to the input element
        inputElement.classList.add('inputField'); // Add a class for styling
        inputElement.style.padding = '12px'; // Set padding
        inputElement.style.marginTop = '4px'; // Set margin-top
        inputElement.style.border = '1px solid #ccc'; // Add a border
        inputElement.style.borderRadius = '4px'; // Add border-radius for rounded corners
        inputElement.style.fontSize = '16px'; // Set font size
        inputElement.style.outline = 'none'; // Remove outline
        inputElement.style.fontFamily = 'Arial, sans-serif'; // Set font family
        inputElement.style.color = 'black'; // Set text color
        inputElement.style.backgroundColor = '#fff'; // Set background color

        // Pre-fill input if it was previously entered
        const existingAnswer = qna.find(item => item.title == question.title);
        if (existingAnswer) {
            inputElement.value = existingAnswer.value;
        }
        // Add an event listener to store the new value in the variable
        const existingRecord = qna.find(record => record?.id == question._id);
        if (!existingRecord) {
            qna.push({ id: question._id, title: question.title, value: null });
        }
        inputElement.addEventListener('input', (event) => {


            const existingRecord = qna.find(record => record?.id == question._id);
                // Update the existing record
                existingRecord.value = event.target.value;
            
        });

        // Append the first input to the container div
        containerDiv.appendChild(inputElement);

        // Handling next input for only imperial homes
        const inputElement1 = document.createElement('input');
        inputElement1.type = 'text';
        inputElement1.placeholder = questionsArray[questionsArray.length - 1].title; // Use the title as the placeholder

        // Apply CSS styles to the input element
        inputElement1.classList.add('inputField'); // Add a class for styling

        inputElement1.style.padding = '12px'; // Set padding
        inputElement1.style.marginTop = '4px'; // Set margin-top
        inputElement1.style.border = '1px solid #ccc'; // Add a border
        inputElement1.style.borderRadius = '4px'; // Add border-radius for rounded corners
        inputElement1.style.fontSize = '16px'; // Set font size
        inputElement1.style.outline = 'none'; // Remove outline
        inputElement1.style.fontFamily = 'Arial, sans-serif'; // Set font family
        inputElement1.style.color = 'black'; // Set text color
        inputElement1.style.backgroundColor = '#fff'; // Set background color

        // Pre-fill input if it was previously entered
        const existingAnswer1 = qna.find(item => item.title == questionsArray[questionsArray.length - 1].title);
        if (existingAnswer1) {
            inputElement1.value = existingAnswer1.value;
        }

        // Add an event listener to store the new value in the variable
        const existingRecord1 = qna.find(record => record?.id == questionsArray[questionsArray.length - 1]._id);
        if (!existingRecord1) {
            qna.push({ id: questionsArray[questionsArray.length - 1]._id, title: questionsArray[questionsArray.length - 1].title, value: null });
        }
        inputElement1.addEventListener('input', (event) => {
            const existingRecord1 = qna.find(record => record?.id == questionsArray[questionsArray.length - 1]._id);

                // Update the existing record
                existingRecord1.value = event.target.value;
           
        });

        // Append the second input to the container div
        containerDiv.appendChild(inputElement1);

        // Append the container div to the questionElement
        questionElement.appendChild(containerDiv);

        // const fieldReText = document.createElement('p');
        // fieldReText.classList.add('fieldRequireText');
        // fieldReText.textContent ="Please fill in both Name and Email."
        // containerDiv.appendChild(fieldReText);



        directMoveToSubmit = true;

    }

    // Add options if the question type is SingleSelect or MultiSelect
    if (question.type === 'SingleSelect' || question.type === 'MultiSelect') {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container'); // Add a class for styling

        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.classList.add('option-item'); // Add a class for styling

            // Check if option is selected
            const isSelected = selectedOptions.some(selectedOption => selectedOption.questionId === question._id && selectedOption.value === option.value);
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
            const valueElement = document.createElement('p');
            valueElement.textContent = option.value; // Assuming option is an object with 'value' property
            valueElement.classList.add('optiontitle'); // Add a class for styling

            optionItem.appendChild(valueElement);

            optionsContainer.appendChild(optionItem);
        });

        questionElement.appendChild(optionsContainer);
    } else if (question.type === 'radioButton') { // Adjusted condition for radioButton
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
            if (i < currentQuestionIndex) {
                stepItem.classList.add('completed');
            } else if (i === currentQuestionIndex) {
                stepItem.classList.add('active');
            }

            const stepCounter = document.createElement('div');
            stepCounter.classList.add('step-counter');
            stepCounter.textContent = i + 1; // Step numbers should start from 1
            stepCounter.style.color = 'white'; // Ensure the text color is always white
            stepItem.appendChild(stepCounter);

            stepperWrapper.appendChild(stepItem);
        }
    }
}


function backQuestion() {
    directMoveToSubmit = false;
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(questionsArray[currentQuestionIndex]); // Display previous question
        displayStepProgressBar(); // Update step progress bar

        // Handle Back Button visibility
        if (currentQuestionIndex == 0) {
            const backButton = document.querySelector('.previous-button');
            if (backButton) {
                backButton.style.display = 'none'; // Hide the back button if on the first question
            }
        }
    }
}

function nextQuestion() {
    const currentQuestion = questionsArray[currentQuestionIndex];

    if (directMoveToSubmit) {
        console.log("qnaqnaqnaqna", qna)
        if (!qna[qna.length - 2]?.value) {
            alert(`Please enter the name`)
        }
        else if (!qna[qna.length - 1].value) {
            alert(`Please enter the email*`)
        }
        else {
            console.log("Submit the code ");
            console.log("shopID", shopID)
            console.log("QuizID", QuizID)

            fetch(`${location.origin}/apps/proxy-1/answersBaseProductIDS?shop=${Shopify.shop}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ shopID: shopID, QuizID: QuizID, selectedOptions: selectedOptions, qna: qna })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch questions');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the response data
                    console.log("Data", data)
                    selectedProductIDS = data.data;

                     products = data.products;
                    console.log("Matching Products,",products)
                    displayProductsAfterFiltering()
                })
                .catch(error => {
                    console.error('Error fetching questions:', error);
                });

        }
        return;
    }


    // if (currentQuestion.type === 'SimpleInputFields') {
    //     // Get the input field value
    //     const inputElement = document.querySelector('input[type="text"]');
    //     const inputFieldValue = inputElement.value;
    //     if (!inputFieldValue) {
    //         alert(`Please enter the ${currentQuestion?.title}`)
    //         return;
    //     }
    //     else {
    //         toggleOptionSelection(null, currentQuestion._id, inputFieldValue);
    //     }
    // } else {
    //     // For other question types, simply call toggleOptionSelection without inputFieldValue
    //     toggleOptionSelection();
    // }


    if (totalQuestions - 1 > currentQuestionIndex) {
        currentQuestionIndex++;
        displayQuestion(questionsArray[currentQuestionIndex]); // Display next question
        displayStepProgressBar(); // Update step progress bar
        //Handle Back Button
        if (currentQuestionIndex != 0) {
            const backButton = document.querySelector('.previous-button');
            if (backButton) {
                backButton.style.display = 'flex'; // Hide the quiz title
            }
        }

    } else {
        console.log("Submit the code ");
        console.log("shopID", shopID)
        console.log("QuizID", QuizID)

        fetch(`${location.origin}/apps/proxy-1/answersBaseProductIDS?shop=${Shopify.shop}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ shopID: shopID, QuizID: QuizID, selectedOptions: selectedOptions, qna: qna })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response data
                console.log("Data", data)
                selectedProductIDS = data.data;
                products = data.products;
                console.log("Matching Products,",products)
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
    console.log("productssproductss", productss)

    //const filteredProducts = productss.filter(product => selectedProductIDS.includes(product.id));

    // Show the next button now that questions have been loaded
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.style.display = 'none'; // Hide the next button
    }
    const backButton = document.querySelector('.previous-button');
    if (backButton) {
        backButton.style.display = 'none'; // Hide the quiz title
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
        resultsHeading.textContent = 'Hello, Based on your specific answers, Your Results are Below.';
        resultsContainer.classList.add('resultsTitle');
        resultsContainer.appendChild(resultsHeading);
    

    if (products.length > 0) {
        // Display filtered products
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        contentContainer.style.display = 'flex';
        contentContainer.style.flexWrap = 'wrap';
        contentContainer.style.gap = '10px';
        contentContainer.style.marginBottom = '50px';



        contentContainer.style.justifyContent = 'center'; // Center content horizontally
        resultListContainer.appendChild(contentContainer);

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const imageElement = document.createElement('img');
            imageElement.src = product?.image?.src;
            imageElement.alt = product.title;
            imageElement.classList.add('product-image');

            const titleElement = document.createElement('h2');
            titleElement.textContent = product.title;
            titleElement.classList.add('product-title');



            const addButton = document.createElement('a');
            addButton.href = location.origin+"/products/"+product.handle;
            addButton.textContent = 'See More';
            addButton.classList.add('add-to-cart-button');

            productCard.appendChild(imageElement);
            productCard.appendChild(titleElement);
            productCard.appendChild(addButton);

            contentContainer.appendChild(productCard);
        });
        if (products?.length > 0) {
            fetch(`${location.origin}/apps/proxy-1/sendResultsEmail?shop=${Shopify.shop}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: qna[qna?.length - 2]?.value.trim(), email: qna[qna?.length - 1]?.value.trim(), products: products, host:location.origin })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch questions');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the response data
                    console.log("Email results", data)
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                });

        }
    } else {
        // Display "No products found" message
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No products found.';

        noResultsMessage.style.marginBottom = '15px';
        resultsContainer.appendChild(noResultsMessage);
    }
}



