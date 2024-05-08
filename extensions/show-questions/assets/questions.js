// Select the submit button by its type
let submitButton = document.querySelector('input[type="submit"]');

submitButton.addEventListener("click", function (e) {
   e.preventDefault()
   console.log(Shopify.id);
   fetch(`${location.origin}/apps/proxy-1?shop=${Shopify.shop}}`,{
       method:'GET',
       headers:{"Content-Type":"application/json"},
   })
   .then(response=>response.json())
   .then(data=>console.log(data))
   .catch(error=>console.log(error))

});
