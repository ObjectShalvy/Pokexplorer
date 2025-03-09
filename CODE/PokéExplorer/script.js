const types = [
    { name: 'normal', color: 'energy-normal' },
    { name: 'fire', color: 'energy-fire' },
    { name: 'water', color: 'energy-water' },
    { name: 'electric', color: 'energy-electric' },
    { name: 'grass', color: 'energy-grass' },
    { name: 'ice', color: 'energy-ice' },
    { name: 'fighting', color: 'energy-fighting' },
    { name: 'poison', color: 'energy-poison' },
    { name: 'ground', color: 'energy-ground' },
    { name: 'flying', color: 'energy-flying' },
    { name: 'psychic', color: 'energy-psychic' },
    { name: 'bug', color: 'energy-bug' },
    { name: 'rock', color: 'energy-rock' },
    { name: 'ghost', color: 'energy-ghost' },
    { name: 'dragon', color: 'energy-dragon' },
    { name: 'dark', color: 'energy-dark' },
    { name: 'steel', color: 'energy-steel' },
    { name: 'fairy', color: 'energy-fairy' }
];

let currentView = 'catalog';
let selectedType = null;
let selectedPokemon = null;
let currentSelection = 0;
let pokemonData = [];
let allPokemon = []; // Array para almacenar todos los Pokémon

const searchInput = document.getElementById('searchInput');
const suggestionsContainer = document.getElementById('suggestions');
const catalogGrid = document.querySelector('.catalog-grid');
const pokemonGrid = document.querySelector('.pokemon-grid');
const backButton = document.getElementById('backButton');
const homeButton = document.getElementById('homeButton');
const startButton = document.getElementById('startButton');
const dPadButtons = {
    up: document.getElementById('upButton'),
    down: document.getElementById('downButton'),
    left: document.getElementById('leftButton'),
    right: document.getElementById('rightButton')
};

async function fetchAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000'); // Obtener los primeros 1000 Pokémon
    const data = await response.json();
    allPokemon = data.results.map(p => p.name); // Almacenar solo los nombres
}

function setupSearchBar() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        suggestionsContainer.innerHTML = ''; // Limpiar sugerencias

        if (searchTerm.length > 0) {
            const filteredPokemon = allPokemon.filter(pokemon => pokemon.includes(searchTerm));
            if (filteredPokemon.length > 0) {
                suggestionsContainer.style.display = 'block'; // Mostrar sugerencias
                filteredPokemon.forEach(pokemon => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = pokemon;
                    suggestionItem.addEventListener('click', () => {
                        searchInput.value = pokemon; // Establecer el valor del input
                        suggestionsContainer.innerHTML = ''; // Limpiar sugerencias
                        suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
                        fetchPokemonDetails(pokemon);
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                });
            } else {
                suggestionsContainer.style.display = 'none'; // Ocultar si no hay coincidencias
            }
        } else {
            suggestionsContainer.style.display = 'none'; // Ocultar si el input está vacío
        }
    });
}

async function fetchPokemonDetails(pokemonName) {
    try {
        currentView = 'details';
        currentSelection = 0;
        selectedType = null;
        
        catalogGrid.style.display = 'none';
        pokemonGrid.style.display = 'none';
        
        const existingDetailsView = document.querySelector('.pokemon-details');
        if (existingDetailsView) {
            existingDetailsView.remove();
        }
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (response.ok) {
            const pokemon = await response.json();
            showPokemonDetails(pokemon);
        }
    } catch (error) {
        console.log('Pokémon no encontrado');
    }
}

function initializeCatalog() {
    setupSearchBar();
    types.forEach((type, index) => {
        const typeCard = document.createElement('div');
        typeCard.className = 'catalog-item';
        typeCard.setAttribute('data-index', index);
        
        const energyBg = document.createElement('div');
        energyBg.className = `type-energy ${type.color}`;
        
        const typeName = document.createElement('div');
        typeName.className = 'type-name';
        typeName.textContent = type.name;
        
        typeCard.appendChild(energyBg);
        typeCard.appendChild(typeName);
        
        typeCard.addEventListener('click', () => selectType(type, index));
        catalogGrid.appendChild(typeCard);
    });
    
    updateSelection();
}

function showPokemonDetails(pokemon) {
    currentView = 'details';
    catalogGrid.style.display = 'none';
    pokemonGrid.style.display = 'none';
    
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'pokemon-details';
    detailsContainer.style.padding = '10px'; // Ajustar padding
    detailsContainer.style.maxHeight = '90vh'; // Limitar altura máxima
    detailsContainer.style.overflow = 'hidden'; // Ocultar overflow
    
    const content = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1; padding-right: 10px;">
                <h2 style="text-transform: capitalize; font-size: 20px;">${pokemon.name}</h2>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 10px;">
                    <p><strong>Número:</strong> #${pokemon.id}</p>
                    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Tipos:</strong> ${pokemon.types.map(t => 
                        `<span style="text-transform: capitalize">${t.type.name}</span>`).join(', ')}</p>
                    <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => 
                        `<span style="text-transform: capitalize">${a.ability.name}${a.is_hidden ? ' (Oculta)' : ''}</span>`).join(', ')}</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 10px; margin-top: 10px;">
                    <h3 style="margin-bottom: 10px;">Estadísticas base</h3>
                    ${pokemon.stats.map(stat => `
                        <div style="margin-bottom: 5px;">
                            <strong style="text-transform: capitalize">${stat.stat.name}:</strong>
                            <span>${stat.base_stat}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="flex: 0 0 150px; display: flex; flex-direction: column; align-items: center;">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" 
                     style="width: 150px; height: 150px; image-rendering: pixelated;">
                <img src="${pokemon.sprites.back_default}" alt="${pokemon.name} back" 
                     style="width: 150px; height: 150px; image-rendering: pixelated;">
            </div>
        </div>
    `;
    
    detailsContainer.innerHTML = content;
    pokemonGrid.parentElement.appendChild(detailsContainer);
    
    setupDetailsNavigation();
}

function setupDetailsNavigation() {
    const detailsSections = document.querySelectorAll('.pokemon-details > div');
    let currentSection = 0;

    function navigateDetails(direction) {
        if (direction === 'down' && currentSection < detailsSections.length - 1) {
            currentSection++;
        } else if (direction === 'up' && currentSection > 0) {
            currentSection--;
        }
        detailsSections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }

    document.addEventListener('keydown', (e) => {
        if (currentView === 'details') {
            switch (e.key) {
                case 'ArrowUp':
                    navigateDetails('up');
                    break;
                case 'ArrowDown':
                    navigateDetails('down');
                    break;
                case 'Escape':
                    backButton.click(); // Volver a la vista anterior
                    break;
            }
        }
    });
}

function navigateGrid(direction) {
    if (currentView === 'details') {
        return; // No navegar en la vista de detalles
    }

    const gridItems = currentView === 'catalog'
        ? document.querySelectorAll('.catalog-item')
        : document.querySelectorAll('.pokemon-card');
    
    const itemsPerRow = 3;
    const totalItems = gridItems.length;
    let newSelection = currentSelection;
    
    switch(direction) {
        case 'up':
            if (currentSelection >= itemsPerRow) {
                newSelection -= itemsPerRow;
            } else {
                const totalRows = Math.ceil(totalItems / itemsPerRow);
                const lastRowStart = totalItems - (totalItems % itemsPerRow || itemsPerRow);
                newSelection = Math.min(lastRowStart + (currentSelection % itemsPerRow), totalItems - 1);
            }
            break;
        case 'down':
            if (currentSelection + itemsPerRow < totalItems) {
                newSelection += itemsPerRow;
            } else {
                newSelection = currentSelection % itemsPerRow;
            }
            break;
        case 'left':
            if (currentSelection % itemsPerRow > 0) {
                newSelection--;
            } else {
                const currentRow = Math.floor(currentSelection / itemsPerRow);
                const itemsInCurrentRow = Math.min(itemsPerRow, totalItems - (currentRow * itemsPerRow));
                newSelection += itemsInCurrentRow - 1;
            }
            break;
        case 'right':
            if ((currentSelection + 1) % itemsPerRow !== 0 && currentSelection < totalItems - 1) {
                newSelection++;
            } else {
                newSelection -= (currentSelection % itemsPerRow);
            }
            break;
    }
    
    if (newSelection >= 0 && newSelection < totalItems) {
        currentSelection = newSelection;
        updateSelection();
        
        const selectedElement = gridItems[currentSelection];
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function updateSelection() {
    const items = currentView === 'catalog' 
        ? document.querySelectorAll('.catalog-item')
        : document.querySelectorAll('.pokemon-card');
    
    items.forEach(item => item.classList.remove('selected'));
    items[currentSelection]?.classList.add('selected');
}

async function selectType(type, index) {
    selectedType = type;
    currentView = 'pokemon';
    currentSelection = 0;
    
    catalogGrid.style.display = 'none';
    pokemonGrid.style.display = 'grid';
    
    const detailsView = document.querySelector('.pokemon-details');
    if (detailsView) {
        detailsView.remove();
    }
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type.name}`);
        const data = await response.json();
        pokemonData = data.pokemon.map(p => p.pokemon);
        
        await loadPokemonGrid();
    } catch (error) {
        console.error('Error loading Pokemon:', error);
    }
}

async function loadPokemonGrid() {
    pokemonGrid.innerHTML = '';
    
    for (let i = 0; i < Math.min(pokemonData.length, 30); i++) {
        const pokemon = pokemonData[i];
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon-card';
            pokemonCard.setAttribute('data-index', i);
            
            const sprite = document.createElement('img');
            sprite.className = 'pokemon-sprite';
            sprite.src = data.sprites.front_default;
            
            const name = document.createElement('div');
            name.textContent = data.name;
            
            const number = document.createElement('div');
            number.className = 'pokemon-number';
            number.textContent = `#${data.id}`;
            
            pokemonCard.appendChild(sprite);
            pokemonCard.appendChild(name);
            pokemonCard.appendChild(number);
            
            pokemonCard.addEventListener('click', () => showPokemonDetails(data));
            pokemonGrid.appendChild(pokemonCard);
        } catch (error) {
            console.error('Error loading Pokemon details:', error);
        }
    }
    
    updateSelection();
}

backButton.addEventListener('click', () => {
    const detailsView = document.querySelector('.pokemon-details');
    if (detailsView) {
        detailsView.remove();
        if (selectedType) {
            currentView = 'pokemon';
            pokemonGrid.style.display = 'grid';
        } else {
            currentView = 'catalog';
            catalogGrid.style.display = 'grid';
        }
    } else if (currentView === 'pokemon') {
        currentView = 'catalog';
        currentSelection = 0;
        catalogGrid.style.display = 'grid';
        pokemonGrid.style.display = 'none';
    }
    updateSelection();
});

homeButton.addEventListener('click', () => {
    currentView = 'catalog';
    currentSelection = 0;
    selectedType = null;
    catalogGrid.style.display = 'grid';
    pokemonGrid.style.display = 'none';
    
    const detailsView = document.querySelector('.pokemon-details');
    if (detailsView) {
        detailsView.remove();
    }
    
    updateSelection();
});

startButton.addEventListener('click', () => {
    const items = currentView === 'catalog' 
        ? document.querySelectorAll('.catalog-item')
        : document.querySelectorAll('.pokemon-card');
    
    items[currentSelection]?.click();
});

Object.entries(dPadButtons).forEach(([direction, button]) => {
    button.addEventListener('click', () => navigateGrid(direction));
});

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            navigateGrid('up');
            break;
        case 'ArrowDown':
            navigateGrid('down');
            break;
        case 'ArrowLeft':
            navigateGrid('left');
            break;
        case 'ArrowRight':
            navigateGrid('right');
            break;
        case 'Enter':
            startButton.click();
            break;
        case 'Escape':
            backButton.click();
            break;
        case 'Home':
            homeButton.click();
            break;
    }
});

// Llama a la función para obtener todos los Pokémon al iniciar
fetchAllPokemon().then(() => {
    initializeCatalog(); // Inicializa el catálogo después de obtener los Pokémon
});