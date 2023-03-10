import axios from 'axios';
const ENDPOINT = 'https://pixabay.com/api/';
const KEY = '33398845-ceea68c8fd971c39a472032d7';
const FILTER = '&image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = '&per_page=40';
let PAGES;

async function searchPhoto(query) {
  const response = await axios
    .get(`${ENDPOINT}?key=${KEY}&q=${query}${FILTER}${PER_PAGE}&page=${PAGES}`)
    .then(data => {
      PAGES += 1;
      // console.log(PAGES);
      return data;
    });

  return response.data;
}

function newSearchPhoto(query) {
  PAGES = query;
}

export default { searchPhoto, newSearchPhoto };
