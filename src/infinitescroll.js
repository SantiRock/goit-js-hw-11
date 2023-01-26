import InfiniteScroll from 'infinite-scroll';

const itemsContainer = document.querySelector('.items-container');
const loader = document.querySelector('.loader');

let page = 1;
let hasMore = true;

const fetchData = () => {
  // Pixabay API endpoint
  const api = `https://pixabay.com/api/?key=YOUR_API_KEY&q=YOUR_QUERY&page=${page}`;

  // Fetch data from the Pixabay API
  fetch(api)
    .then(response => response.json())
    .then(data => {
      data.hits.forEach(item => {
        const img = document.createElement('img');
        img.src = item.webformatURL;
        img.alt = item.tags;
        itemsContainer.appendChild(img);
      });
      page += 1;
      hasMore = data.totalHits > itemsContainer.children.length;
    });
};

const infiniteScroll = new InfiniteScroll(itemsContainer, {
  path: () => `https://pixabay.com/api/?key=YOUR_API_KEY&q=YOUR_QUERY&page=${page}`,
  responseType: 'text',
  history: false,
  scrollThreshold: 400,
  status: '.page-load-status',
  loadOnScroll: true,
  elementScroll: true,
  debug: true,
  append: (response, path, itemsContainer) => {
    const data = JSON.parse(response);
    data.hits.forEach(item => {
      const img = document.createElement('img');
      img.src = item.webformatURL;
      img.alt = item.tags;
      itemsContainer.appendChild(img);
    });
    page += 1;
    hasMore = data.totalHits > itemsContainer.children.length;
  },
  checkLastPage: (response, itemsContainer) => !hasMore,
  status: loader,
});

infiniteScroll.loadNextPage();
