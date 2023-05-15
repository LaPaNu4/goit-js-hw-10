import './css/styles.css';
import fetchCountries from './fetchCountries.js';
let debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countriListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(hollowName, DEBOUNCE_DELAY));

function hollowName() {
  if (refs.input.value.trim() === '') {
    refs.countriListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
  } else {
    result();
  }
}

function result() {
  fetchCountries(refs.input.value.trim())
    .then(data => {
      if (data.length > 10) {
        handleTooManyMatchesFound();
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else if (data.length === 1) {
        createCountryCard(data);
      } else {
        Notiflix.Notify.failure('Oops, something went wrong!');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong!');
    });
}

function handleTooManyMatchesFound() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
function renderCountryList(data) {
  refs.countriListEl.innerHTML = ``;
  refs.countriListEl = data
    .map(({ flags, name }) => {
      `<li class="list-item">
  <img src="${flags.svg}" alt="${flags.alt}">
  <h2 class="item-title">${name.official}</h2>
</li>`;
    })
    .join('');
  refs.countryInfoEl.innerHTML = '';
}

function createCountryCard(data) {
  refs.countryInfoEl.innerHTML = data
    .map(({ capital, flags, languages, name, population }) => {
      `<img src="${flags.svg}" alt="${flags.alt}">
<h2>${name.common} (${name.official})</h2>
<p>Capital: ${capital}</p>
<p>Population: ${population.toLocaleString()}</p>
<p>Languages: ${languages.join(', ')}</p>`;
    })
    .join('');
  refs.countriListEl.innerHTML = '';
}
//Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується,
//а розмітка списку країн або інформації про країну зникає.
