document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "421c89d274f06022233ed75e8271a1c4";
  const idioma = "es-MX";

  function sliderPrincipal() {
    let urlActual = window.location.href;
    let tipoDeContenido = "";

    if (urlActual.includes("/")) {
      tipoDeContenido = "all";
    } else if (urlActual.includes("peliculas.html")) {
      tipoDeContenido = "movie";
    } else {
      tipoDeContenido = "tv";
    }

    const apiUrl = `https://api.themoviedb.org/3/trending/${tipoDeContenido}/week?api_key=${apiKey}&language=${idioma}`;

    const contenedorDelCarrusel = document.querySelector(
      "#sliderPrincipal .carousel-inner"
    );

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const resultados = data.results;

        resultados.forEach((item, i) => {
          const nombre = item.media_type === "movie" ? item.title : item.name;
          const anio =
            item.media_type === "movie"
              ? new Date(item.release_date).getFullYear()
              : new Date(item.first_air_date).getFullYear();

          const contenidoDelCarrusel = document.createElement("div");
          contenidoDelCarrusel.classList.add("carousel-item");

          contenidoDelCarrusel.innerHTML = `
            <div class="card">
              <div class="img-dark-overlay">
                <img src="https://www.themoviedb.org/t/p/original/${item.backdrop_path}" class="card-img" alt="${nombre}">
              </div>
              <div class="card-img-overlay">
                <div class="card mb-3">
                  <div class="row g-0">
                    <div class="col-md-12">
                      <div class="card-body margenContenidoSlider d-flex">
                      <img
                      src="https://www.themoviedb.org/t/p/original/${item.poster_path}"
                      alt="${nombre}"
                      class="rounded"
                    />
                    <div class="mt-5">
                      <h1 class="titulo">
                        ${nombre} (${anio})
                      </h1>
                      <h5 class="descripcion">
                        ${item.overview}
                      </h5>
                      <div class="d-grid gap-2 d-md-flex">
                          <button class="btn me-md-2 botonesTrailerInfo botonTrailer" type="button" data-bs-toggle="modal"
                          data-bs-target="#trailerYT${item.id}">
                            <i class="fa-solid fa-circle-play"></i> Reproducir tráiler
                          </button>
                          <button class="btn botonesTrailerInfo botonMasInfo" type="button" onclick="window.location.href='detalles.html?id=${item.id}&tipo=${item.media_type}'">
                            <i class="fa-solid fa-circle-info"></i> Más información
                          </button>
                        </div>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;

          trailerYT(item.media_type, item.id, nombre);

          contenedorDelCarrusel.appendChild(contenidoDelCarrusel);

          if (i === 0) {
            contenidoDelCarrusel.classList.add("active");
          }
        });
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  sliderPrincipal();

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
        }
      })
      .catch((error) => {
        console.error("Error al cargar el tráiler:", error);
      });
  }
});