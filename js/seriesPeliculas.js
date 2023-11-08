document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "421c89d274f06022233ed75e8271a1c4";
  const idioma = "es-MX";

  let paginaActual = 1;
  let generoSeleccionado = "";

  function construirApiUrlFinal(tipo, genero, pagina) {
    const urlBase = "https://api.themoviedb.org/3/";

    if (genero) {
      return `${urlBase}discover/${tipo}?api_key=${apiKey}&language=${idioma}&page=${
        pagina + 1
      }&with_genres=${genero}`;
    }

    return `${urlBase}${tipo}/popular?api_key=${apiKey}&language=${idioma}&page=${pagina + 1}`;
  }

  function cargarMasContenido() {
    let urlActual = window.location.href;

    let apiUrl;

    let tipo;

    if (urlActual.includes("series.html")) {
      tipo = "tv";
      apiUrl = construirApiUrlFinal(tipo, generoSeleccionado, paginaActual);
    } else {
      tipo = "movie";
      apiUrl = construirApiUrlFinal(tipo, generoSeleccionado, paginaActual);
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const resultados = data.results;

        if (resultados.length > 0) {
          const contenedorSP = document.querySelector("#todoElContenido");

          for (let i = 0; i < resultados.length; i += 5) {
            const grupo = resultados.slice(i, i + 5);

            const row = document.createElement("div");
            row.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");

            grupo.forEach((item) => {
              const calificacion = parseFloat(item.vote_average).toFixed(1);
              const anio =
                new Date(item.release_date).getFullYear() ||
                new Date(item.first_air_date).getFullYear();
              const nombre = item.title || item.name;

              const col = document.createElement("div");
              col.classList.add("col");

              const card = document.createElement("div");
              card.classList.add("card", "cardSearch");

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
                            class="card-img-top rounded imagenISP"
                            alt="${nombre}"
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

          paginaActual++;
        } else {
          const mostrarMasSP = document.querySelector("#mostrarMasSP");
          mostrarMasSP.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  function construirApiUrlInicial(tipo, genero, pagina) {
    const urlBase = "https://api.themoviedb.org/3/";

    if (genero) {
      return `${urlBase}discover/${tipo}?api_key=${apiKey}&language=${idioma}&page=${pagina}&with_genres=${genero}`;
    }

    return `${urlBase}${tipo}/popular?api_key=${apiKey}&language=${idioma}`;
  }

  function todoElContenido(idDelGenero = "") {
    paginaActual = 1;

    let urlActual = window.location.href;

    let apiUrl;

    let tipo;

    if (urlActual.includes("series.html")) {
      tipo = "tv";
      apiUrl = construirApiUrlInicial(tipo, idDelGenero, paginaActual);
    } else {
      tipo = "movie";
      apiUrl = construirApiUrlInicial(tipo, idDelGenero, paginaActual);
    }

    const contenedorSP = document.querySelector("#todoElContenido");
    contenedorSP.innerHTML = "";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const resultados = data.results;

        for (let i = 0; i < resultados.length; i += 5) {
          const grupo = resultados.slice(i, i + 5);

          const row = document.createElement("div");
          row.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");

          grupo.forEach((item) => {
            const calificacion = parseFloat(item.vote_average).toFixed(1);
            const anio =
              new Date(item.release_date).getFullYear() ||
              new Date(item.first_air_date).getFullYear();
            const nombre = item.title || item.name;

            const col = document.createElement("div");
            col.classList.add("col");

            const card = document.createElement("div");
            card.classList.add("card", "cardSearch");

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
                            class="card-img-top rounded imagenISP"
                            alt="${nombre}"
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

          const mostrarMasSP = document.querySelector("#mostrarMasSP");
          mostrarMasSP.addEventListener("click", cargarMasContenido);

          contenedorSP.appendChild(row);
        }
      })
      .catch((error) => {
        console.error("Error al cargar datos desde la API de TMDb:", error);
      });
  }

  function cambiarGenero() {
    const selectorDeGenero = document.querySelector("#selectorDeGenero");
    generoSeleccionado = selectorDeGenero.value;

    todoElContenido(generoSeleccionado);
  }

  const selectorDeGenero = document.querySelector("#selectorDeGenero");
  selectorDeGenero.addEventListener("change", cambiarGenero);

  todoElContenido();

  function construirApiUrlGenero(tipo) {
    const urlBase = "https://api.themoviedb.org/3/";

    return `${urlBase}genre/${tipo}/list?api_key=${apiKey}&language=${idioma}`;
  }

  function listaDeGeneros() {
    const selectorDeGenero = document.querySelector("#selectorDeGenero");

    let urlActual = window.location.href;
    let apiUrl;

    if (urlActual.includes("series.html")) {
      apiUrl = construirApiUrlGenero("tv");
    } else {
      apiUrl = construirApiUrlGenero("movie");
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const generos = data.genres;

        generos.forEach((genre) => {
          const option = document.createElement("option");
          option.value = genre.id;
          option.textContent = genre.name;
          selectorDeGenero.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error al cargar los géneros:", error);
      });
  }

  listaDeGeneros();
});