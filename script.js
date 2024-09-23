const gameArea = document.getElementById("gameArea");
const apple = document.getElementById("apple");
const scoreElement = document.getElementById("score");
const milestoneGif = document.getElementById("milestone-gif");
const eatSound = document.getElementById("eat-sound");
let pokemons = [{ x: 185, y: 385 }];
let dx = 1.0;
let dy = 0;
let step = 1.0;
let score = 0;
let applesEaten = 0;
let isGamePaused = false;
let currentDirection = "right";
const pokemonSpacing = 40;

function createPokemonElement(x, y) {
  const pokemon = document.createElement("div");
  pokemon.className = "pokemon right";
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

  // Ajustar posición si sale de los límites
  if (newX < 0) newX = gameArea.clientWidth - 30;
  if (newX > gameArea.clientWidth - 30) newX = 0;
  if (newY < 0) newY = gameArea.clientHeight - 30;
  if (newY > gameArea.clientHeight - 30) newY = 0;

  for (let i = pokemons.length - 1; i > 0; i--) {
    pokemons[i].x = pokemons[i - 1].x - (dx * pokemonSpacing) / step;
    pokemons[i].y = pokemons[i - 1].y - (dy * pokemonSpacing) / step;
  }

  pokemons[0].x = newX;
  pokemons[0].y = newY;

  if (dx > 0) currentDirection = "right";
  else if (dx < 0) currentDirection = "left";
  else if (dy < 0) currentDirection = "up";
  else if (dy > 0) currentDirection = "down";

  pokemonElements.forEach((element, index) => {
    element.style.left = `${pokemons[index].x}px`;
    element.style.top = `${pokemons[index].y}px`;
    element.className = `pokemon ${currentDirection}`;
  });
}

function generateApple() {
  const appleSize = 70; // Increased size
  const maxX = gameArea.clientWidth - appleSize;
  const maxY = gameArea.clientHeight - appleSize;
  const appleX = Math.floor(Math.random() * maxX);
  const appleY = Math.floor(Math.random() * maxY);
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
    applesEaten++;
    scoreElement.textContent = `Puntuación: ${score}`;
    generateApple();
    growPokemon();
    playEatSound();

    // Increase speed based on apples eaten
    if (
      applesEaten === 2 ||
      applesEaten === 5 ||
      applesEaten === 10 ||
      applesEaten === 20
    ) {
      increaseSpeed();
    }

    if (score === 25 || score === 50) {
      showMilestoneGif();
    }
  }
}

function increaseSpeed() {
  const speedIncrease = 2.0;
  dx *= speedIncrease;
  dy *= speedIncrease;
  step *= speedIncrease;
}

function growPokemon() {
  const lastPokemon = pokemons[pokemons.length - 1];
  const newX = lastPokemon.x - (dx * pokemonSpacing) / step;
  const newY = lastPokemon.y - (dy * pokemonSpacing) / step;
  pokemons.push({ x: newX, y: newY });
  const newElement = createPokemonElement(newX, newY);
  pokemonElements.push(newElement);
}

function showMilestoneGif() {
  isGamePaused = true;
  if (score === 25) {
    milestoneGif.style.backgroundImage =
      "url('https://i.gifer.com/origin/53/53911e498c1ab46abd93e86eac057770_w200.gif')";
  } else if (score === 50) {
    milestoneGif.style.backgroundImage =
      "url('https://media.tenor.com/o2WNfXdy6bsAAAAM/draco-malfoy.gif')";
  }
  milestoneGif.style.display = "block";
  milestoneGif.onclick = () => {
    milestoneGif.style.display = "none";
    isGamePaused = false;
  };
}

function changeDirection(newDx, newDy, newDirection) {
  dx = newDx * step;
  dy = newDy * step;
  currentDirection = newDirection;
}

function playEatSound() {
  eatSound.currentTime = 0;
  eatSound.play();
}

document
  .getElementById("up-button")
  .addEventListener("click", () => changeDirection(0, -1, "up"));
document
  .getElementById("down-button")
  .addEventListener("click", () => changeDirection(0, 1, "down"));
document
  .getElementById("left-button")
  .addEventListener("click", () => changeDirection(-1, 0, "left"));
document
  .getElementById("right-button")
  .addEventListener("click", () => changeDirection(1, 0, "right"));

function resetGame() {
  alert(`Juego terminado. Puntuación: ${score}`);
  pokemons = [{ x: 185, y: 385 }];
  dx = 0.5;
  dy = 0;
  step = 0.5;
  score = 0;
  applesEaten = 0;
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
  currentDirection = "right";
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
      changeDirection(0, -1, "up");
      break;
    case "ArrowDown":
      changeDirection(0, 1, "down");
      break;
    case "ArrowLeft":
      changeDirection(-1, 0, "left");
      break;
    case "ArrowRight":
      changeDirection(1, 0, "right");
      break;
  }
});

// Adjust game size when window size changes
window.addEventListener("resize", adjustGameSize);

function adjustGameSize() {
  const containerWidth = gameArea.clientWidth;
  const containerHeight = gameArea.clientHeight;
  const scaleFactor = Math.min(containerWidth / 400, containerHeight / 600, 1);

  gameArea.style.transform = `scale(${scaleFactor})`;
  gameArea.style.transformOrigin = "center";
}

// Call adjustGameSize initially and whenever the window size changes
adjustGameSize();
