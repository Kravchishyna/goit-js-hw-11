import { fetchImages } from './js/pixabay-api.js';
import { renderImages, showError, showSuccess, showLoader, hideLoader } from './js/render-functions.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    showError('Please enter a search term!');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  gallery.innerHTML = ''; // Очищення галереї перед новим пошуком

  await fetchAndRenderImages();
}

async function onLoadMore() {
  currentPage += 1;
  await fetchAndRenderImages();
}

async function fetchAndRenderImages() {
  try {
    showLoader();
    const data = await fetchImages(currentQuery, currentPage);
    hideLoader();

    if (data.hits.length === 0 && currentPage === 1) {
      showError('Sorry, there are no images matching your search query. Please try again!');
      return;
    }

    renderImages(data.hits);

    if (data.totalHits > currentPage * 12) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }

    if (currentPage === 1) {
      showSuccess(`Found ${data.totalHits} images!`);
    }
  } catch (error) {
    hideLoader();
    showError('Something went wrong. Please try again later.');
  }
}