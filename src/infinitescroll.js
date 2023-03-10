import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector("input");
const submitBtn = document.querySelector("button");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
let page = 1;
let perPage = 40;
let images;
let lightbox = new SimpleLightbox('.gallery a', { gallery });

// Event Listener ----

submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const keyword = input.value.toLowerCase();
    page = 1;
    search(keyword)
});

window.addEventListener('scroll', ()=>{
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        const keyword = input.value.toLowerCase();
        page += 1;
        searchMore(keyword);
    }
})

// Pixabay Query --------
let API_KEY = '33065522-142377ea89c4475bb68820c05';

async function search(word) {
    try {
        const response = await axios.get('https://pixabay.com/api/', 
        {
            params: {
                key: API_KEY,
                q: word,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: perPage,
                page : page
            }
        });
        searchResponse(response);
    } catch (error) {
        console.log(error);
    }
};

async function searchMore(word) {
    try {
        const response = await axios.get('https://pixabay.com/api/', 
        {
            params: {
                key: API_KEY,
                q: word,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: perPage,
                page : page
            }
        });
        renderMore(response);
       
    } catch (error) {
        console.log(error);
    }
};

// Render Content ----

function searchResponse(response) {
    gallery.innerHTML = "";
    images = response.data.hits;
    let imagesText = images.toString();
    let totalHits = response.data.totalHits;
    if (imagesText === "" || input.value === "") {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    } else if (response.data.totalHits < perPage) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        renderImages();
    } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        renderImages();
    };  
}

function renderMore(response) {
    images = response.data.hits;
    let totalHits = response.data.totalHits;
    let totalPages = totalHits/perPage;

    if (page > totalPages) {
        renderImages();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        window.scrollBy({
            top: 500,
            behavior: "smooth",
          });
    } else {
        renderImages();
        window.scrollBy({
            top: 500,
            behavior: "smooth",
          });
    }
}

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