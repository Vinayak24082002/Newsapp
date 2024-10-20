let lang ;
let preference = 'publishedAt';
let allArticles = [];
let searchdata;
let sortOrder ="newest";

const newsContainer = document.getElementById("news-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-news");
const searchIcon = document.getElementById("search-icon");
const languageFilter = document.getElementById("language-filter");
const sortFilter = document.getElementById("sort-filter");

function fetchNews(searchdata,lang) {
  
  fetch(`https://gnews.io/api/v4/search?q=${searchdata}&lang=${lang}&apikey=ffd0ab3788b520d60dbd690c38c7f65a`)
    .then((res) => res.json())
    .then((res) => {
    
        allArticles = res.articles;
        loadNews(allArticles); 
      
    })
    .catch(function (error) {
      console.error("Error:", error);
      newsContainer.innerHTML = `<p>Failed to fetch news. Please try again later.</p>`; 
    });
}

function showNews(data) {
  newsContainer.innerHTML = "";
  data.forEach((news) => {
    if (!news.image || !news.title || !news.description) {
      return; 
    }

    const newCard = document.createElement("div");
    const source = document.createElement("span");
    const image = document.createElement("img");
    const title = document.createElement("h2");
    const author = document.createElement("span");
    const published = document.createElement("p");

    source.classList.add("source");
    source.innerText = news.source.name;

    image.classList.add("image");
    image.src = news.image;
    image.alt = news.title;

    title.classList.add("title");
    title.innerText = news.title;

    author.classList.add("author", "published");
    author.innerText = `${news.author || "Unknown Author"} | ${new Date(news.publishedAt).toLocaleString()}`;

    published.classList.add("description");
    published.innerText = news.description;

    newCard.appendChild(source);
    newCard.appendChild(image);
    newCard.appendChild(title);
    newCard.appendChild(author);
    newCard.appendChild(published);

    newsContainer.appendChild(newCard);
  });
}

function loadNews(data) {
  if (Array.isArray(data) && data.length > 0) {
    
    if (sortOrder === 'newest') {
        data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else {
        data.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    }
    showNews(data);
} else {
    newsContainer.innerHTML = `<p>No news articles to display.</p>`;
}
}

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    alert("Type something to search");
    return;
  } else {
    fetchNews(query);
  }
}

searchIcon.addEventListener("click", function () {
  performSearch();
});

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  performSearch();
});

languageFilter.addEventListener("change", function () {
  lang = this.value; 
  fetchNews(searchdata,lang); 
});

sortFilter.addEventListener("change", function (e) {
   e.preventDefault();
  sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'; 
  loadNews(allArticles); 
});

const relevancy = document.getElementById("sort-filter");

function filterArticlesByRelevance(keywords) {
    if (!keywords) {
        loadNews(allArticles); 
        return; 
    }

    const filteredArticles = allArticles.filter(article => {
        
        return (
            article.title.toLowerCase().includes(keywords) || 
            article.description.toLowerCase().includes(keywords)
        );
    });
  
    loadNews(filteredArticles);
  }

relevancy.addEventListener("input", function () {
    const keywords = relevancy.value.toLowerCase().trim(); 
    filterArticlesByRelevance(keywords); 
});


searchdata = 'india';
lang = 'en';
fetchNews(searchdata, lang);
