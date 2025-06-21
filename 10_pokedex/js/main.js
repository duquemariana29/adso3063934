const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const modal = document.querySelector("#pokemonModal");
const modalBody = document.querySelector("#modalBody");
const closeModal = document.querySelector(".close-modal");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const errorMessage = document.querySelector("#errorMessage");
let allPokemon = [];
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Cargar los primeros 151 Pokémon
for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => {
            allPokemon.push(data);
            mostrarPokemon(data);
        })
        .catch(error => console.error("Error fetching Pokémon:", error));
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height/10}m</p>
                <p class="stat">${poke.weight/10}kg</p>
            </div>
        </div>
    `;
    
    div.addEventListener("click", () => {
        mostrarModal(poke);
    });
    
    listaPokemon.append(div);
}

function mostrarModal(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const stats = poke.stats.map(stat => {
        return {
            name: stat.stat.name.replace('-', ' '),
            value: stat.base_stat
        };
    });

    const statsHTML = stats.map(stat => `
        <div class="modal-stat">
            <span class="stat-name">${stat.name}:</span>
            <span class="stat-value">${stat.value}</span>
        </div>
    `).join('');

    modalBody.innerHTML = `
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
        <div class="modal-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" style="width:100%">
        </div>
        <div class="modal-stats">
            ${statsHTML}
            <div class="modal-stat">
                <span class="stat-name">height:</span>
                <span class="stat-value">${poke.height/10}m</span>
            </div>
            <div class="modal-stat">
                <span class="stat-name">weight:</span>
                <span class="stat-value">${poke.weight/10}kg</span>
            </div>
        </div>
    `;

    modal.style.display = "block";
}

// Función de búsqueda
function buscarPokemon() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    errorMessage.style.display = "none";
    
    if (!searchTerm) {
        // Si está vacío, mostrar todos
        listaPokemon.innerHTML = "";
        allPokemon.forEach(poke => mostrarPokemon(poke));
        return;
    }

    const resultados = allPokemon.filter(poke => 
        poke.name.toLowerCase().includes(searchTerm) || 
        poke.id.toString() === searchTerm
    );

    listaPokemon.innerHTML = "";
    
    if (resultados.length > 0) {
        resultados.forEach(poke => mostrarPokemon(poke));
    } else {
        errorMessage.style.display = "block";
    }
}

// Event listeners
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

searchButton.addEventListener("click", buscarPokemon);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        buscarPokemon();
    }
});

// Filtrado por tipo
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";
    errorMessage.style.display = "none";

    if (botonId === "ver-todos") {
        allPokemon.forEach(poke => mostrarPokemon(poke));
    } else {
        const resultados = allPokemon.filter(poke => 
            poke.types.some(type => type.type.name.includes(botonId))
        );
        
        if (resultados.length > 0) {
            resultados.forEach(poke => mostrarPokemon(poke));
        } else {
            errorMessage.textContent = `No hay Pokémon de tipo ${botonId}`;
            errorMessage.style.display = "block";
        }
    }
}));