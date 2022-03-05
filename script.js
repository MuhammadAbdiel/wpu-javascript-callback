// * Jquery (Ajax)

// $('.search-button').on('click', function () {
//     $.ajax({
//         url: 'https://www.omdbapi.com/?apikey=8fc1c0ef&s=' + $('.input-keyword').val(),
//         success: results => {
//             const movies = results.Search;
//             let cards = '';
//             movies.forEach(movie => {
//                 cards += showCards(movie);
//             });
//             $('.movie-container').html(cards);

//             // Ketika tombol detail diklik
//             $('.modal-detail-button').on('click', function () {
//                 $.ajax({
//                     url: 'https://www.omdbapi.com/?apikey=8fc1c0ef&i=' + $(this).data('imdbid'),
//                     success: detail => {
//                         const movieDetail = showMovieDetail(detail);
//                         $('.modal-body').html(movieDetail);
//                     },
//                     error: e => {
//                         console.log(e.responseText);
//                     }
//                 });
//             });
//         },
//         error: e => {
//             console.log(e.responseText);
//         }
//     });
// });

// * Vanilla Javascript (Fetch)

// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {

//     const inputKeyword = document.querySelector('.input-keyword');
//     fetch('https://www.omdbapi.com/?apikey=8fc1c0ef&s=' + inputKeyword.value)
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cards = '';
//             movies.forEach(movie => cards += showCards(movie));

//             const movieContainer = document.querySelector('.movie-container');
//             movieContainer.innerHTML = cards;

//             // Ketika tombol detail diklik

//             const modalDetailButton = document.querySelectorAll('.modal-detail-button');
//             modalDetailButton.forEach(mdb => {
//                 mdb.addEventListener('click', function () {
//                     const imdbid = this.dataset.imdbid;

//                     fetch('https://www.omdbapi.com/?apikey=8fc1c0ef&i=' + imdbid)
//                         .then(response => response.json())
//                         .then(response => {
//                             const movieDetail = showMovieDetail(response);

//                             const modalBody = document.querySelector('.modal-body');
//                             modalBody.innerHTML = movieDetail;
//                         });

//                 })
//             });
//         });

// });

// ! Awal Refactor

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (error) {
    alert(error);
  }
});

// TODO: Error Handling : Fetch

function getMovies(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=8fc1c0ef&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((movie) => (cards += showCards(movie)));

  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// ? Event Binding

document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("modal-detail-button")) {
    const imdbid = event.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetail(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch("https://www.omdbapi.com/?apikey=8fc1c0ef&i=" + imdbid)
    .then((response) => response.json())
    .then((movie) => movie);
}

function updateUIDetail(movie) {
  const movieDetail = showMovieDetail(movie);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

// ! Akhir Refactor

function showCards(movie) {
  return `
        <div class="col-md-4 my-3">
            <div class="card">
                <img src="${movie.Poster}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                    <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Details</a>
                </div>
            </div>
        </div>
    `;
}

function showMovieDetail(detail) {
  return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <img src="${detail.Poster}" class="img-fluid">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <h4>${detail.Title} (${detail.Year})</h4>
                        </li>
                        <li class="list-group-item"><strong>Director : </strong> ${detail.Director}
                        </li>
                        <li class="list-group-item"><strong>Actors : </strong> ${detail.Actors}
                        </li>
                        <li class="list-group-item"><strong>Writer : </strong> ${detail.Writer}</li>
                        <li class="list-group-item"><strong>Plot : </strong> <br> ${detail.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}
