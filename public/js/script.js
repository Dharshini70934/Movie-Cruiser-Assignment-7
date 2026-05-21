let movieItems = [];
let favItems = [];
const pendingFavIds = new Set();
const MOVIES_URL = "http://localhost:3000/movies";
const FAV_URL = "http://localhost:3000/favourites";

/* ---------------- INIT ---------------- */
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        getMovies();
        getFavourites();
    });
}

/* ---------------- GET MOVIES ---------------- */
function getMovies() {
    return fetch(MOVIES_URL)
        .then(response => response.json())
        .then(data => {
            movieItems = data;
            const moviesList = document.getElementById("moviesList");
            moviesList.innerHTML = "";
            data.forEach(movie => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; width:100%; padding:0.75rem 0.75rem 1rem;">
                        <img src="${movie.posterPath}" alt="${movie.title}" style="width:100%; height:200px; object-fit:cover; object-position:center top;">
                        <h5>${movie.title}</h5>
                        <p>${movie.releaseDate}</p>
                        <button
                            class="btn btn-primary btn-sm"
                            onclick="addFavourite('${movie.id}')">
                            Add to Favourites
                        </button>
                    </div>
                `;
                moviesList.appendChild(li);
            });
            return data;
        })
        .catch(error => console.log(error));
}

/* ---------------- GET FAVOURITES ---------------- */
function getFavourites() {
    return fetch(FAV_URL)
        .then(response => response.json())
        .then(data => {
            favItems = data;
            const favouritesList = document.getElementById("favouritesList");
            favouritesList.innerHTML = "";
            data.forEach(movie => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; width:100%; padding:0.75rem 0.75rem 1rem;">
                        <img src="${movie.posterPath}" alt="${movie.title}" style="width:100%; height:200px; object-fit:cover; object-position:center top;">
                        <h5>${movie.title}</h5>
                        <p>${movie.releaseDate}</p>
                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteFavourite('${movie.id}')">
                            Remove
                        </button>
                    </div>
                `;
                favouritesList.appendChild(li);
            });
            return data;
        })
        .catch(error => console.log(error));
}

/* ---------------- ADD FAVOURITE ---------------- */
function addFavourite(id) {
    const movie = movieItems.find(
        movie => String(movie.id) === String(id)
    );
    if (!movie) {
        return Promise.reject(new Error('Movie not found'));
    }

    const alreadyExists = favItems.find(
        fav => String(fav.id) === String(id)
    );
    if (alreadyExists) {
        return Promise.reject(new Error('Movie is already added to favourites'));
    }

    return fetch(FAV_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    })
        .then(response => response.json())
        .then(data => {
            favItems.push(data);
            if (typeof document !== "undefined") {
                const favouritesList = document.getElementById("favouritesList");
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; width:100%; padding:0.75rem 0.75rem 1rem;">
                        <img src="${data.posterPath}" alt="${data.title}" style="width:100%; height:200px; object-fit:cover; object-position:center top;">
                        <h5>${data.title}</h5>
                        <p>${data.releaseDate}</p>
                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteFavourite('${data.id}')">
                            Remove
                        </button>
                    </div>
                `;
                favouritesList.appendChild(li);
            }
            return favItems;
        });
}

/* ---------------- DELETE FAVOURITE ---------------- */
function deleteFavourite(id) {
    return fetch(`${FAV_URL}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            favItems = favItems.filter(fav => String(fav.id) !== String(id));
            getFavourites();
        })
        .catch(error => console.log(error));
}

if (typeof module !== "undefined") {
    module.exports = {
        getMovies,
        getFavourites,
        addFavourite,
        deleteFavourite
    };
}