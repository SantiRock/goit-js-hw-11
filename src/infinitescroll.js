import InfiniteScroll from 'infinite-scroll';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector("input");
const submitBtn = document.querySelector("button");
const gallery = document.querySelector(".gallery");
let page = 1;
let hasMore = true;
let perPage = 40;
let images;
let keyword = '';
let lightbox = new SimpleLightbox('.gallery a', { gallery });
//const itemsContainer = document.querySelector('.items-container');
//const loader = document.querySelector('.loader');

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  keyword = input.value.toLowerCase();
  page = 1;
  hasMore = true;
  gallery.innerHTML = '';
  search(keyword)
});

//-----------

let API_KEY = '33065522-142377ea89c4475bb68820c05';

async function search() {
    try {
        const response = await axios.get('https://pixabay.com/api/', 
        {
            params: {
                key: API_KEY,
                q: keyword,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: perPage,
                page : page,
            }
        });
        searchResponse(response);
    } catch (error) {
        console.log(error);
    }
};

function searchResponse(response) {
  images = response.data.hits;
  let imagesText = images.toString();
  let totalHits = response.data.totalHits;
  let totalPages = totalHits/perPage;
  if (imagesText === "" || input.value === "") {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
  } else if (page > totalPages) {
      renderImages(response);
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      renderImages(response);
      page += 1;
      hasMore = totalHits > gallery.children.length;
  };  
}

//-------

const infiniteScroll = new InfiniteScroll(gallery, {
  path: () => `https://pixabay.com/api/?key=${API_KEY}&q=${keyword}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`,
  responseType: 'text',
  history: false,
  scrollThreshold: 500,
  status: '.page-load-status',
  loadOnScroll: true,
  elementScroll: true,
  debug: true,
  append: (response, path, gallery) => {
    const data = JSON.parse(response);
    images = data.hits;
    let totalHits = data.totalHits;
    renderImages(response);
    page += 1;
    hasMore = totalHits > gallery.children.length;
  },
  checkLastPage: (response, gallery) => !hasMore,
  status: gallery,
});

search();

// Render Images ---------

function renderImages() {
  images.forEach(image => {
      let webformatURL = image.webformatURL;
      let largeImageURL = image.largeImageURL;
      let tags = image.tags;
      let likes = image.likes;
      let views = image.views;
      let comments = image.comments;
      let downloads = image.downloads;

      const card = document.createElement("div");
      card.classList.add("photo-card");
      gallery.append(card);

      const link = document.createElement("a")
      link.href = largeImageURL;
      link.classList.add("link");
      card.append(link);

      const img = document.createElement("img");
      img.src = webformatURL;
      img.alt = tags;
      img.loading = "lazy";
      img.classList.add("image")
      link.append(img);

      const info = document.createElement("div");
      info.classList.add("info");
      card.append(info);

      let markup = ` 
      <div class="info-item">
          <p><b>Likes</b></p>
          <p>${likes}</p>
      </div>
      <div class="info-item">
          <p><b>Views</b></p>
          <p>${views}</p>
      </div>
      <div class="info-item">
          <p><b>Comments</b></p>
          <p>${comments}</p>
      </div>
      <div class="info-item">
          <p><b>Downloads</b></p>
          <p>${downloads}</p>
      </div>
      `;

      info.innerHTML = markup;
  });
  lightbox.refresh();
};