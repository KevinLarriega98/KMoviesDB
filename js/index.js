document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "421c89d274f06022233ed75e8271a1c4";
  const idioma = "es-MX";

  function carruselDePeliculasYSeries(apiUrl, selectorDelContenedor) {
    const contenedorDelCarrusel = document.querySelector(selectorDelContenedor);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const resultados = data.results;

        for (let i = 0; i < resultados.length; i += 5) {
          const grupo = resultados.slice(i, i + 5);

          const contenidoDelCarrusel = document.createElement("div");
          contenidoDelCarrusel.classList.add("carousel-item");

          const row = document.createElement("div");
          row.classList.add(
            "row",
            "row-cols-1",
            "row-cols-md-5",
            "g-4",
            "mx-auto"
          );

          grupo.forEach((item) => {
            const calificacion = parseFloat(item.vote_average).toFixed(1);
            const anio =
              new Date(item.release_date).getFullYear() ||
              new Date(item.first_air_date).getFullYear();
            const nombre = item.title || item.name;
            const tipo = apiUrl.split("/")[4];

            const col = document.createElement("div");
            col.classList.add("col");

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="overlay rounded" onclick="window.location.href='detalles.html?id=${
                  item.id
                }&tipo=${tipo}'">
                    <div class="play-icon"><i class="fa-solid fa-circle-play"></i></div>
                    <div class="tercero"><i class="fa-solid fa-star"></i> ${calificacion}</div>
                    <div class="segundo">${anio}</div>
                    <div class="primero">${nombre}</div>
                </div>
                ${
                  item.poster_path
                    ? `<img
                        src="https://www.themoviedb.org/t/p/original/${item.poster_path}"
                        class="rounded imagenISP"
                        alt="${nombre}"
                      />`
                    : `<div class="rounded bordeNoImagen">
                        <img
                            src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                            class="card-img-top rounded personas"
                            alt="${nombre}"
                        >
                        </div>`
                }
            `;

            col.appendChild(card);
            row.appendChild(col);
          });

          contenidoDelCarrusel.appendChild(row);
          contenedorDelCarrusel.appendChild(contenidoDelCarrusel);

          if (i === 0) {
            contenidoDelCarrusel.classList.add("active");
          }
        }

        const cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
          card.addEventListener("mouseover", () => {
            card.querySelector(".play-icon").style.display = "block";
          });

          card.addEventListener("mouseout", () => {
            card.querySelector(".play-icon").style.display = "none";
          });
        });
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  const currentMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=${idioma}`;
  const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${idioma}`;
  const currentSeriesUrl = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=${idioma}`;
  const popularSeriesUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=${idioma}`;

  carruselDePeliculasYSeries(
    currentMoviesUrl,
    "#currentMovies .carousel-inner"
  );
  carruselDePeliculasYSeries(
    popularMoviesUrl,
    "#popularMovies .carousel-inner"
  );
  carruselDePeliculasYSeries(
    currentSeriesUrl,
    "#currentSeries .carousel-inner"
  );
  carruselDePeliculasYSeries(
    popularSeriesUrl,
    "#popularSeries .carousel-inner"
  );
});