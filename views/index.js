
// Create our card inputs
 //var request = require('request');
var style = {
  base: {
    color: "#fff"
  }
};
//headers: {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'Content-Type, Authorization, Content-Length, X-Requested-With','Content-Type': 'application/json','Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'}, 
//const card = elements.create('card', { style });
//card.mount('#card-element');

const form = document.querySelector('form');
var clientidSource = document.querySelector('clientidSource');
var clientsecretSource = document.querySelector('clientsecretSource');
var accountidSource = document.querySelector('accountidSource');
var granttypeSource = document.querySelector('granttypeSource');

console.log(clientidSource);
console.log(clientsecretSource);
console.log(accountidSource);
console.log(granttypeSource);

const errorEl = document.querySelector('#card-errors');

// Give our token to our form
const accessTokenHandler = {
 

// form.submit();
}

// Create token from card data
form.addEventListener('submit', e => {
  
//e.preventDefault();
  var formData = {
            'client_secret': $('input[name=ClientSecretSource]').val(),
            'client_id': $('input[name=ClientIdSource]').val(),
            'account_id': $('input[name=AccountIdSource]').val(),
            'grant_type' : $('input[name=GrantTypeSource]').val()
        };


 
 
 
    
  
  //done
})
