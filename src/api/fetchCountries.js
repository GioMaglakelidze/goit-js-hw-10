export const fetchCountries = name => {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 404) {
        throw new Error(response.status);
      }
    })
    .catch(error => {
      console.error(error);
    });
};
