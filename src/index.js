import './css/styles.css';
// Імпортуємо бібліотеки
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// імпортуємо зовнішні модулі
import { fetchCountries } from './api/fetchCountries';
// визначаємо  елементи HTML-розмітки
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
// додаємо прослуховувач подій на інпут пошуку зі затримкою
searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
// Колбек-функція яка викликається при події введення тексту у інпут пошуку
function onSearch(event) {
  // зберігаємо значення з інпуту, видаляючи всі пробіли з кінця і початку рядка
  const searchQuery = event.target.value.trim();
  // якщо інпут порожній, очистимо розмітку
  if (!searchQuery || searchQuery === '') {
    clearMarkup();
    return;
  }
  // отримуємо список країн з API
  fetchCountries(searchQuery)
    // якщо є відповідь - рендеремо
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        return;
      }

      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        return;
      }
    })
    .catch(error => {
      // При помилці очищаємо та виводимо помилку
      clearMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
// очистимо попередні результати пошуку
function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
// функція для рендеру списку країн
function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="${country.name.official} flag"><p>${country.name.official}</p> </li>`
    )
    .join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const languages = Object.values(country.languages)
    .map(el => el)
    .join(', ');

  const markup = `<div class="wrap">
    <img src="${country.flags.svg}" alt="${country.name.official} flag">
    <h1>${country.name.official}</h1></div>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    `;

  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}
