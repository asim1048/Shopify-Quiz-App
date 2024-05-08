document.addEventListener("DOMContentLoaded", function() {
    fetchQuestions();
});

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
        //console.log(data.data);

        // Check if questions exist
        if (data && data.data.questions) {
            const questions = data.data.questions;
            // Update the DOM to display the questions
            displayQuestions(questions);
            console.log(questions)
        }
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });
}

function displayQuestions(questions) {
    const quizContainer = document.querySelector('.quiz-container');

    if (!quizContainer) {
        return;
    }

    // Clear existing content
    quizContainer.innerHTML = '';

    // Create elements to display questions
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const titleElement = document.createElement('h3');
        titleElement.textContent = question.title;
        questionElement.appendChild(titleElement);

        

        quizContainer.appendChild(questionElement);
    });
}
