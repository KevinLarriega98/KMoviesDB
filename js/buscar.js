let paginaActual = 1;
let consultaActual = "";

const apiKey = "421c89d274f06022233ed75e8271a1c4";
const idioma = "es-MX";

function cargarMasResultados(consulta) {
  const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${consulta}&language=${idioma}&page=${
    paginaActual + 1
  }`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultados = data.results;

      if (resultados.length > 0) {
        const contenedorDeBusqueda = document.querySelector(
          "#resultadosDeBusqueda"
        );

        for (let i = 0; i < resultados.length; i += 5) {
          const grupo = resultados.slice(i, i + 5);

          const row = document.createElement("div");
          row.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");

          grupo.forEach((item) => {
            const calificacion = parseFloat(item.vote_average).toFixed(1);
            const anio =
              item.media_type === "movie"
                ? new Date(item.release_date).getFullYear()
                : new Date(item.first_air_date).getFullYear();
            const nombre = item.media_type === "movie" ? item.title : item.name;

            const col = document.createElement("div");
            col.classList.add("col");

            const card = document.createElement("div");
            card.classList.add("card", "cardSearch");

            card.innerHTML = `
              ${
                item.media_type == "person"
                  ? `<div class="overlay rounded">
                      <div class="segundo">${item.known_for_department}</div>
                      <div class="primero">${nombre}</div>
                    </div>
                    ${
                      item.profile_path
                        ? `<img
                            src="https://www.themoviedb.org/t/p/original/${item.profile_path}"
                            class="rounded personas"
                            alt="${nombre}"
                          >`
                        : `<div class="rounded bordeNoImagen">
                            <img
                              src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                              class="card-img-top rounded personas"
                              alt="${nombre}"
                            >
                          </div>`
                    }`
                  : `<div class="overlay rounded" onclick="window.location.href='detalles.html?id=${
                    item.id
                  }&tipo=${item.media_type}'">
                      <div class="play-icon"><i class="fa-solid fa-circle-play"></i></div>
                      <div class="tercero"><i class="fa-solid fa-star"></i> ${calificacion}</div>
                      <div class="segundo">${anio}</div>
                      <div class="primero">${nombre}</div>
                    </div>
                    ${
                      item.poster_path
                        ? `<img
                            src="https://www.themoviedb.org/t/p/original/${item.poster_path}"
                            class="rounded imagenSP"
                            alt="${nombre}"
                          />`
                        : `<div class="rounded bordeNoImagen">
                            <img
                                src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                                class="card-img-top rounded personas"
                                alt="${nombre}"
                            >
                            </div>`
                    }`
              }
            `;

            col.appendChild(card);
            row.appendChild(col);
          });

          contenedorDeBusqueda.appendChild(row);
        }

        paginaActual++;
      } else {
        const mostrarMas = document.querySelector("#mostrarMas");
        mostrarMas.style.display = "none";
      }

      if (paginaActual >= data.total_pages) {
        mostrarMas.style.display = "none";
      } else {
        mostrarMas.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error al cargar datos desde la API de TMDb:", error);
    });
}

function busquedaEnTiempoReal(consulta) {
  const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${consulta}&language=${idioma}`;

  const contenedorDeBusqueda = document.querySelector("#resultadosDeBusqueda");
  contenedorDeBusqueda.innerHTML = "";

  consultaActual = consulta;

  paginaActual = 1;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultados = data.results;

      if (resultados.length === 0 && consulta !== "") {
        const sinResultados = document.createElement("p");
        sinResultados.textContent = "No hay resultados";
        sinResultados.classList.add("text-center");
        contenedorDeBusqueda.appendChild(sinResultados);
      } else {
        for (let i = 0; i < resultados.length; i += 5) {
          const grupo = resultados.slice(i, i + 5);

          const row = document.createElement("div");
          row.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");

          grupo.forEach((item) => {
            const calificacion = parseFloat(item.vote_average).toFixed(1);
            const anio =
              item.media_type === "movie"
                ? new Date(item.release_date).getFullYear()
                : new Date(item.first_air_date).getFullYear();
            const nombre = item.media_type === "movie" ? item.title : item.name;

            const col = document.createElement("div");
            col.classList.add("col");

            const card = document.createElement("div");
            card.classList.add("card", "cardSearch");

            card.innerHTML = `
              ${
                item.media_type == "person"
                  ? `<div class="overlay rounded">
                      <div class="segundo">${item.known_for_department}</div>
                      <div class="primero">${nombre}</div>
                    </div>
                    ${
                      item.profile_path
                        ? `<img
                            src="https://www.themoviedb.org/t/p/original/${item.profile_path}"
                            class="rounded"
                            alt="${nombre}"
                          >`
                        : `<div class="rounded bordeNoImagen">
                            <img
                              src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                              class="card-img-top rounded personas"
                              alt="${nombre}"
                            >
                          </div>`
                    }`
                  : `<div class="overlay rounded" onclick="window.location.href='detalles.html?id=${
                      item.id
                    }&tipo=${item.media_type}'">
                      <div class="play-icon"><i class="fa-solid fa-circle-play"></i></div>
                      <div class="tercero"><i class="fa-solid fa-star"></i> ${calificacion}</div>
                      <div class="segundo">${anio}</div>
                      <div class="primero">${nombre}</div>
                    </div>
                    ${
                      item.poster_path
                        ? `<img
                            src="https://www.themoviedb.org/t/p/original/${item.poster_path}"
                            class="rounded imagenSP"
                            alt="${nombre}"
                          />`
                        : `<div class="rounded bordeNoImagen">
                            <img
                                src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
                                class="card-img-top rounded personas"
                                alt="${nombre}"
                            >
                            </div>`
                    }`
              }
            `;

            col.appendChild(card);
            row.appendChild(col);
          });

          contenedorDeBusqueda.appendChild(row);
        }
      }

      if (data.total_pages > 1) {
        mostrarMas.style.display = "block";
      } else {
        mostrarMas.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error al buscar:", error);
    });
}

const mostrarMas = document.querySelector("#mostrarMas");
mostrarMas.style.display = "none";
mostrarMas.addEventListener("click", () => {
  cargarMasResultados(consultaActual);
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("modalDeBusqueda")
    .addEventListener("shown.bs.modal", function () {
      document.getElementById("inputDeBusqueda").focus();
    });
});