document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const tipo = urlParams.get("tipo");

  if (!id || !tipo) {
    window.location.href = "/KMoviesDB/";
    return;
  }

  if (id) {
    const detallesUrl = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=${apiKey}&language=${idioma}`;

    cargarYMostrarDetalles(detallesUrl);
  }

  function cargarYMostrarDetalles(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const detallesSPContainer = document.getElementById("detallesSP");

        const anio =
          new Date(data.release_date).getFullYear() ||
          new Date(data.first_air_date).getFullYear();
        const nombre = data.title || data.name;

        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card");

        cardContainer.innerHTML = `
          <div class="img-dark-overlay">
            ${
              data.backdrop_path
                ? `<img src="https://www.themoviedb.org/t/p/original/${data.backdrop_path}" class="rounded" />`
                : `<div class="rounded">
                    <img
                        src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                        class="card-img-top rounded noImagenDeFondo"
                        alt="${nombre}"
                    >
                  </div>`
            }
          </div>
          <div class="card-img-overlay">
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-12">
                        <div class="card-body margenContenidoSlider d-flex">
                        ${
                          data.poster_path
                            ? `<img src="https://www.themoviedb.org/t/p/original/${data.poster_path}" alt="${nombre}" class="rounded" />`
                            : `<div class="rounded noImagen bordeNoImagen">
                                <img
                                    src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                                    class="rounded"
                                    alt="${nombre}"
                                >
                                </div>`
                        }
                            <div class="mt-5">
                                <h1 class="card-title titulo">${nombre} (${anio})</h1>
                                <ul class="d-flex lista">
                                    ${data.genres
                                      .map(
                                        (genre) =>
                                          `<li><a class="botonesTrailerInfo generos">${genre.name}</a></li>`
                                      )
                                      .join("")}
                                </ul>
                                <h5 class="card-text eslogan"><i>${
                                  data.tagline
                                }</i></h5>
                                <h5 class="card-text descripcion">${
                                  data.overview
                                }</h5>
                                <button class="btn me-md-2 botonesTrailerInfo botonTrailer" type="button" data-bs-toggle="modal"
                                data-bs-target="#trailerYT${data.id}">
                                    <i class="fa-solid fa-circle-play"></i> Reproducir tráiler
                                </button>
                            </div>
                    </div>
                </div>
            </div>
          </div>
        `;

        trailerYT(tipo, data.id, nombre);

        detallesSPContainer.appendChild(cardContainer);
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  function reparto() {
    const apiUrl = `https://api.themoviedb.org/3/${tipo}/${id}/credits?api_key=${apiKey}&language=${idioma}`;

    const contenedorDelCarrusel = document.querySelector(
      "#repartoCarrusel .carousel-inner"
    );

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const resultados = data.cast;

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
            const col = document.createElement("div");
            col.classList.add("col");

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
            <div class="overlay rounded">
                <div class="segundo">${item.name}</div>
                <div class="primero">${item.character}</div>
            </div>
          ${
            item.profile_path
              ? `<img
                  src="https://www.themoviedb.org/t/p/original/${item.profile_path}"
                  class="rounded"
                  alt="${item.name}"
                >`
              : `<div class="rounded bordeNoImagen">
                  <img
                    src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                    class="card-img-top rounded reparto"
                    alt="${item.name}"
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
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  reparto();

  function trailerYT(tipo, id, nombre) {
    const apiUrl = `https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${apiKey}&language=${idioma}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const trailers = data.results.filter(
          (video) => video.type === "Trailer"
        );

        if (trailers.length > 0) {
          const trailerKey = trailers[0].key;
          const trailerModal = document.createElement("div");
          trailerModal.innerHTML = `
            <div class="modal fade" id="trailerYT${id}" tabindex="-1" aria-labelledby="trailerYT${id}Label" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-4" id="trailerYT${id}Label">${nombre}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <iframe width="100%" height="600px" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(trailerModal);
        } else {
          const trailerModal = document.createElement("div");
          trailerModal.innerHTML = `
            <div class="modal fade" id="trailerYT${id}" tabindex="-1" aria-labelledby="trailerYT${id}Label" aria-hidden="true">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-4" id="trailerYT${id}Label">${nombre}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <h1>No hay tráiler disponible</h1>
                  </div>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(trailerModal);
        }
      })
      .catch((error) => {
        console.error("Error al cargar el tráiler:", error);
      });
  }

  if (tipo == "tv") {
    let idDeLaTemporada;

    function listaDeTemporadas() {
      const selectorDeTemporada = document.querySelector(
        "#selectorDeTemporada"
      );

      let apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=${idioma}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const temporadas = data.seasons;

          idDeLaTemporada = temporadas[0].season_number;

          temporadas.forEach((temporada) => {
            const option = document.createElement("option");
            option.value = temporada.season_number;
            option.textContent = temporada.name;
            selectorDeTemporada.appendChild(option);
          });

          listaDeEpisodios(idDeLaTemporada);
        })
        .catch((error) => {
          console.error("Error al cargar los géneros:", error);
        });
    }

    function listaDeEpisodios(idDeLaTemporada) {
      let apiUrl = `https://api.themoviedb.org/3/tv/${id}/season/${idDeLaTemporada}?api_key=${apiKey}&language=${idioma}`;

      const contenedorSP = document.querySelector("#listaDeEpisodios");
      contenedorSP.innerHTML = "";

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const resultados = data.episodes;

          for (let i = 0; i < resultados.length; i += 5) {
            const grupo = resultados.slice(i, i + 5);

            const row = document.createElement("div");
            row.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");

            grupo.forEach((item) => {
              const calificacion = parseFloat(item.vote_average).toFixed(1);

              const col = document.createElement("div");
              col.classList.add("col");

              const card = document.createElement("div");
              card.classList.add("card", "cardSearch");

              card.innerHTML = `
                      <div class="overlay rounded">
                          <div class="play-icon"><i class="fa-solid fa-circle-play"></i></div>
                          <div class="terceroEp"><i class="fa-solid fa-star"></i> ${calificacion}</div>
                          <div class="segundoEp">${item.runtime}m</div>
                          <div class="primero">${item.episode_number}. ${
                item.name
              }</div>
                      </div>
                      ${
                        item.still_path
                          ? `<img
                                src="https://www.themoviedb.org/t/p/original/${item.still_path}"
                                class="rounded episodiosConImagen"
                                alt="${item.name}" 
                            >`
                          : `<div class="rounded bordeNoImagen">
                              <img
                                  src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                                  class="card-img-top rounded episodios"
                                  alt="${item.name}"
                              >
                            </div>`
                      }
                  `;

              col.appendChild(card);
              row.appendChild(col);
            });

            const cards = document.querySelectorAll(".card");

            cards.forEach((card) => {
              card.addEventListener("mouseover", () => {
                card.querySelector(".play-icon").style.display = "block";
              });

              card.addEventListener("mouseout", () => {
                card.querySelector(".play-icon").style.display = "none";
              });
            });

            contenedorSP.appendChild(row);
          }
        })
        .catch((error) => {
          console.error("Error al cargar datos desde la API de TMDb:", error);
        });
    }

    function cambiarTemporada() {
      const selectorDeTemporada = document.querySelector(
        "#selectorDeTemporada"
      );
      const temporadaSeleccionada = selectorDeTemporada.value;

      listaDeEpisodios(temporadaSeleccionada);
    }

    const selectorDeTemporada = document.querySelector("#selectorDeTemporada");
    selectorDeTemporada.addEventListener("change", cambiarTemporada);

    listaDeTemporadas();
  } else {
    const episodios = document.getElementById("episodios");
    episodios.style.display = "none";
  }
});