// Stripe payments
var stripe = Stripe('pk_test_x0KinHEXn7nVTrhTgaHayxYJ');
var elements = stripe.elements();
var email='';

var card = elements.create('card', {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/charges
    $.ajax({
		url:"/createCharge",
		type: "post",
		data: {
      "stripeToken" : result.token.id,
      "email":email
    },
		success: function(d){
			var msg;
			if(d.err == null){
        /*
				if(d.charge.status=="succeeded"){
					msg = "Payment Successful";
				}else{
					msg = "Payment UnSuccessful";
				}
        */
        msg = "Subscription Successful";
			}else{
				msg = "Error in Transaction";
			}
			successElement.querySelector('.token').textContent = msg;
			console.log(d);
		},
		error: function(e){
			console.log(e);
		},
		complete: function(x){
			console.log(x);
		}
	});
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/charges
    successElement.querySelector('.token').textContent = result.token.id;
    successElement.classList.add('visible');
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}
card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = document.querySelector('form');
  var extraDetails = {
    name: form.querySelector('#inputName').value,
  };
  email = form.querySelector('#inputEmail3').value,
  stripe.createToken(card, extraDetails).then(setOutcome);
});
