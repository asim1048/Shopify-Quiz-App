// Select the submit button by its type
let submitButton = document.querySelector('input[type="submit"]');

submitButton.addEventListener("click", function (e) {
   e.preventDefault()
//    console.log(Shopify.id);
//    fetch(`${location.origin}/apps/proxy-1/info?shop=${Shopify.shop}}`,{
//        method:'GET',
//        headers:{"Content-Type":"application/json"},
//    })
//    .then(response=>response.json())
//    .then(data=>console.log(data))
//    .catch(error=>console.log(error))

    fetch(`${location.origin}/apps/proxy-1/firstQuiz?shop=${Shopify.shop}}`,{
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    // Add any additional data you need to send in the request body
    body: JSON.stringify({ shopID:63500976295 })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }
    return response.json();
})
.then(data => {
    // Handle the response data
    console.log(data);
})
.catch(error => {
    console.error('Error fetching questions:', error);
});

});
