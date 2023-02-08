import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './Api_query';
import Notiflix from 'notiflix';

const formUrl = document.querySelector('#search-form');
const formInputUrl = formUrl.querySelector('[name="searchQuery"]');
const galleryListUrl = document.querySelector('.gallery');
const loadBtnUrl = document.querySelector('.load-more');

loadBtnUrl.hidden = true;
let inputValue = '';

formUrl.addEventListener('submit', onSubmit);
loadBtnUrl.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();

  inputValue = formInputUrl.value.trim();
  const getPhoto = API.searchPhoto(inputValue);
  galleryListUrl.innerHTML = ' ';

  getPhoto
    .then(({ hits }) => {
      if (hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      loadBtnUrl.hidden = false;
      for (const key in hits) {
        createMarkupChoises(hits[key]);
      }
    })
    .catch(Errors => onError(Errors))
    .finally(() => formUrl.reset());
}

function createMarkupChoises({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return galleryListUrl.insertAdjacentHTML(
    'beforeend',
    ` <div class="photo-card">
      
        <img src="${webformatURL}" alt="${tags}" loading="lazy" title="" /></a>
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
      </div>`
    // <a href="${largeImageURL}" rel="noopener noreferrer">
  );
}
function onLoadMore() {
  API.searchPhoto(inputValue)
    .then(({ hits }) => {
      if (hits.length === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      loadBtnUrl.hidden = false;
      for (const key in hits) {
        createMarkupChoises(hits[key]);
      }
    })
    .catch(Errors => onError(Errors));
}
// const gallery = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 500,
// });

function onError(Error) {
  Notiflix.Notify.failure(Error.message);
}
