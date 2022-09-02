const { plans, publicKey } = window.recurlyConfig;

// Configure recurly.js -- set this to your own public key
recurly.configure(publicKey);

// Create a CardElement
const elements = recurly.Elements();
const cardElement = elements.CardElement({
	style: {
		fontFamily: 'Open Sans',
		fontSize: '1rem',
		fontWeight: 'bold',
		fontColor: '#2c0730',
	},
});
cardElement.attach('#recurly-elements');
// const cardNumberElement = elements.CardNumberElement();
// const cardMonthElement = elements.CardMonthElement();
// const cardYearElement = elements.CardYearElement();
// const cardCvvElement = elements.CardCvvElement()
// cardNumberElement.attach('#recurly-elements-number');
// cardMonthElement.attach('#recurly-elements-month');
// cardYearElement.attach('#recurly-elements-year');
// cardCvvElement.attach('#recurly-elements-cvv');

const planSelect = document.querySelector('.js-plan-select');

const planOptions = plans.reduce((options, plan) => {
	options += `<option value="${plan.code}" name="${plan.code}">${plan.name}</option>`;
	return options;
}, '<option value="">None</option>');

planSelect.innerHTML = planOptions;

const subscribeBtn = document.getElementById('subscribe');
const recurlyForm = document.querySelector('#form');

recurlyForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const form = this;

	recurly.token(elements, form, async function (err, token) {
		document.getElementById('errors').innerHTML = '';
    const formData = [...new FormData(form)]
      .reduce((entries, [key, value]) => {
        entries[key] = value;
        return entries;
      }, {});

		if (err) error(err);
		else {
			console.log('SUCCESS:', token);
      const response = await fetch('/api/purchases/new', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // body data type must match "Content-Type" header
      });
      console.log(await response.json())
    
			// form.submit();
		}
	});
});

const error = (err) => {
	console && console.error(err);
	const errorEle = document.getElementById('errors');

	errorEle.innerHTML += `<h1>${err.message}</h1>`;
	err.details.forEach((detail) => {
		const { field, messages } = detail;
		errorEle.innerHTML += `<h5>${field}: ${messages.join(', ')}</h5>`;
	});
	// $('button').prop('disabled', false);
};
