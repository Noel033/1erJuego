const gameArea = document.getElementById("gameArea");
const apple = document.getElementById("apple");
const scoreElement = document.getElementById("score");
const milestoneGif = document.getElementById("milestone-gif");
let pokemons = [{ x: 185, y: 385 }];
let dx = 2;
let dy = 0;
const step = 2;
let score = 0;
let isGamePaused = false;

function createPokemonElement(x, y) {
  const pokemon = document.createElement("div");
  pokemon.className = "pokemon";
  pokemon.style.left = `${x}px`;
  pokemon.style.top = `${y}px`;
  gameArea.appendChild(pokemon);
  return pokemon;
}

let pokemonElements = [createPokemonElement(pokemons[0].x, pokemons[0].y)];

function updatePositions() {
  if (isGamePaused) return;

  let newX = pokemons[0].x + dx;
  let newY = pokemons[0].y + dy;

  if (
    newX < 0 ||
    newX > gameArea.clientWidth - 30 ||
    newY < 0 ||
    newY > gameArea.clientHeight - 30
  ) {
    resetGame();
    return;
  }

  for (let i = pokemons.length - 1; i > 0; i--) {
    pokemons[i].x = pokemons[i - 1].x - 30;
    pokemons[i].y = pokemons[i - 1].y;
  }

  pokemons[0].x = newX;
  pokemons[0].y = newY;

  pokemonElements.forEach((element, index) => {
    element.style.left = `${pokemons[index].x}px`;
    element.style.top = `${pokemons[index].y}px`;
  });
}

function generateApple() {
  const appleX = Math.floor(Math.random() * (gameArea.clientWidth - 25));
  const appleY = Math.floor(Math.random() * (gameArea.clientHeight - 25));
  apple.style.left = appleX + "px";
  apple.style.top = appleY + "px";
}

function checkCollision() {
  const headRect = pokemonElements[0].getBoundingClientRect();
  const appleRect = apple.getBoundingClientRect();

  if (
    headRect.left < appleRect.right &&
    headRect.right > appleRect.left &&
    headRect.top < appleRect.bottom &&
    headRect.bottom > appleRect.top
  ) {
    score++;
    scoreElement.textContent = `Puntuación: ${score}`;
    generateApple();
    growPokemon();

    if (score === 50) {
      showMilestoneGif();
    }
  }
}

function growPokemon() {
  const lastPokemon = pokemons[pokemons.length - 1];
  const newX = lastPokemon.x - 30;
  const newY = lastPokemon.y;
  pokemons.push({ x: newX, y: newY });
  const newElement = createPokemonElement(newX, newY);
  pokemonElements.push(newElement);
}

function showMilestoneGif() {
  isGamePaused = true;
  milestoneGif.style.backgroundImage =
    "url('https://media.tenor.com/o2WNfXdy6bsAAAAM/draco-malfoy.gif')";
  milestoneGif.style.display = "block";
  milestoneGif.onclick = () => {
    milestoneGif.style.display = "none";
    isGamePaused = false;
  };
}

document.getElementById("up-button").addEventListener("click", () => {
  dx = 0;
  dy = -step;
});
document.getElementById("down-button").addEventListener("click", () => {
  dx = 0;
  dy = step;
});
document.getElementById("left-button").addEventListener("click", () => {
  dx = -step;
  dy = 0;
});
document.getElementById("right-button").addEventListener("click", () => {
  dx = step;
  dy = 0;
});

function resetGame() {
  alert(`Juego terminado. Puntuación: ${score}`);
  pokemons = [{ x: 185, y: 385 }];
  dx = 2;
  dy = 0;
  score = 0;
  scoreElement.textContent = "Puntuación: 0";

  pokemonElements.forEach((element, index) => {
    if (index !== 0) element.remove();
  });
  pokemonElements = [pokemonElements[0]];

  pokemonElements[0].style.left = `${pokemons[0].x}px`;
  pokemonElements[0].style.top = `${pokemons[0].y}px`;

  generateApple();
  isGamePaused = false;
  milestoneGif.style.display = "none";
}

function gameLoop() {
  updatePositions();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

generateApple();
gameLoop();

document.addEventListener("keydown", (event) => {
  if (isGamePaused) return;
  switch (event.key) {
    case "ArrowUp":
      dx = 0;
      dy = -step;
      break;
    case "ArrowDown":
      dx = 0;
      dy = step;
      break;
    case "ArrowLeft":
      dx = -step;
      dy = 0;
      break;
    case "ArrowRight":
      dx = step;
      dy = 0;
      break;
  }
});
