import simpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import API from './Api_query';
import Notiflix from 'notiflix';

const formUrl = document.querySelector('#search-form');
const formInputUrl = formUrl.querySelector('[name="searchQuery"]');
const galleryListUrl = document.querySelector('.gallery');
const loadBtnUrl = document.querySelector('.load-more');

loadBtnUrl.classList.add('hide-btn');
let inputValue = '';
let count = 0;

formUrl.addEventListener('submit', onSubmit);
loadBtnUrl.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  API.newSearchPhoto(1);
  inputValue = formInputUrl.value.trim();
  const getPhoto = API.searchPhoto(inputValue);
  galleryListUrl.innerHTML = ' ';

  getPhoto
    .then(({ hits, totalHits }) => {
      count += hits.length;
      if (hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        loadBtnUrl.classList.remove('hide-btn');
        Simpl(hits);
      }
    })
    .catch(Errors => onError(Errors))
    .finally(() => formUrl.reset());
}

function createMarkupChoises(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `

      <div class="photo-card">
        <a  href="${largeImageURL}" title= " caption">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
    </div>
`;
    })
    .join('');
  return galleryListUrl.insertAdjacentHTML('beforeend', markup);
}

function onLoadMore() {
  API.searchPhoto(inputValue)
    .then(({ hits, totalHits }) => {
      count += hits.length;
      // createMarkupChoises(hits);
      Simpl(hits);
      console.log('count: ' + count + 'total hits: ' + totalHits);
      if (count >= totalHits) {
        loadBtnUrl.classList.add('hide-btn');
        throw new Error(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(Errors => onError(Errors));
}

function onError(Error) {
  Notiflix.Notify.failure(Error.message);
}

function Simpl(hits) {
  createMarkupChoises(hits);
  new simpleLightBox('.gallery a').refresh();
}
