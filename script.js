const WORDS = [
  "playa",
  "hospital",
  "guitarra",
  "helado",
  "café",
  "profesor",
  "chocolate",
  "aeropuerto",
  "biblioteca",
  "Canadá",
  "Batman",
  "cumpleaños",
  "castillo",
  "dinosaurio",
  "Barcelona",
  "discoteca",
  "fútbol",
  "hamburguesa",
  "montaña",
  "Nueva York",
  "película",
  "pirata",
  "pizza",
  "restaurante",
  "supermercado",
  "buenos aires",
  "navidad",
  "vacaciones",
  "zoológico",
  "sushi",
  "astronauta",
  "parque",
  "dentista",
  "concierto",
  "camping",
  "videojuego",
  "tiburón",
  "karaoke",
  "museo",
  "tren",
  "Ricky Martin",
  "boda",
  "fantasma",
  "taco",
  "detective",
  "volcán",
  "queso",
  "escuela",
  "bombero",
  "piloto",
  "chef",
  "bicicleta",
  "paraguas",
  "cepillo de dientes",
  "violín",
  "metro",
];

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

const state = {
  playerCount: 4,
  currentPlayer: 0,
  impostorIndex: 0,
  word: "",
};

const elements = {
  setupScreen: document.querySelector("#setup-screen"),
  gameScreen: document.querySelector("#game-screen"),
  readyScreen: document.querySelector("#ready-screen"),
  playerCount: document.querySelector("#player-count"),
  decreasePlayers: document.querySelector("#decrease-players"),
  increasePlayers: document.querySelector("#increase-players"),
  startGame: document.querySelector("#start-game"),
  showRules: document.querySelector("#show-rules"),
  rulesDialog: document.querySelector("#rules-dialog"),
  closeRules: document.querySelector("#close-rules"),
  quitGame: document.querySelector("#quit-game"),
  progressDots: document.querySelector("#progress-dots"),
  progressCount: document.querySelector("#progress-count"),
  handoffView: document.querySelector("#handoff-view"),
  playerHeading: document.querySelector("#player-heading"),
  privacyNumber: document.querySelector(".privacy-symbol span"),
  readyButton: document.querySelector("#ready-button"),
  cardView: document.querySelector("#card-view"),
  cardPlayerNumber: document.querySelector("#card-player-number"),
  secretCard: document.querySelector("#secret-card"),
  cardFront: document.querySelector(".card-front"),
  roleLabel: document.querySelector("#role-label"),
  secretWord: document.querySelector("#secret-word"),
  roleHint: document.querySelector("#role-hint"),
  nextPlayer: document.querySelector("#next-player"),
  newRound: document.querySelector("#new-round"),
  changePlayers: document.querySelector("#change-players"),
};

function randomIndex(length) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }

  return Math.floor(Math.random() * length);
}

function updatePlayerCount(amount) {
  state.playerCount = Math.min(
    MAX_PLAYERS,
    Math.max(MIN_PLAYERS, state.playerCount + amount),
  );
  elements.playerCount.textContent = state.playerCount;
  elements.decreasePlayers.disabled = state.playerCount === MIN_PLAYERS;
  elements.increasePlayers.disabled = state.playerCount === MAX_PLAYERS;
}

function showScreen(screen) {
  [elements.setupScreen, elements.gameScreen, elements.readyScreen].forEach(
    (item) => {
      item.hidden = item !== screen;
    },
  );
}

function buildProgress() {
  elements.progressDots.replaceChildren();

  for (let index = 0; index < state.playerCount; index += 1) {
    const dot = document.createElement("span");
    dot.className = "progress-dot";
    if (index < state.currentPlayer) dot.classList.add("done");
    if (index === state.currentPlayer) dot.classList.add("current");
    elements.progressDots.append(dot);
  }

  elements.progressCount.textContent = `${state.currentPlayer + 1} / ${state.playerCount}`;
}

function preparePlayer() {
  const playerNumber = state.currentPlayer + 1;
  elements.playerHeading.textContent = `Jugador ${playerNumber}`;
  elements.privacyNumber.textContent = playerNumber;
  elements.cardPlayerNumber.textContent = playerNumber;
  elements.handoffView.hidden = false;
  elements.cardView.hidden = true;
  elements.secretCard.classList.remove("is-flipped");
  elements.nextPlayer.textContent =
    state.currentPlayer === state.playerCount - 1
      ? "Ocultar y empezar"
      : `Ocultar y pasar al jugador ${playerNumber + 1}`;
  buildProgress();
}

function setCardContent() {
  const isImpostor = state.currentPlayer === state.impostorIndex;
  elements.cardFront.classList.toggle("impostor", isImpostor);
  elements.roleLabel.textContent = isImpostor ? "Tu rol es" : "Tu palabra es";
  elements.secretWord.textContent = isImpostor
    ? "IMPOSTOR"
    : state.word.toLocaleUpperCase("es");
  elements.roleHint.textContent = isImpostor
    ? "Finge que conoces la palabra"
    : "Memorízala bien";
}

function startRound() {
  state.currentPlayer = 0;
  state.impostorIndex = randomIndex(state.playerCount);
  state.word = WORDS[randomIndex(WORDS.length)];
  showScreen(elements.gameScreen);
  preparePlayer();
}

function showPlayerCard() {
  setCardContent();
  elements.handoffView.hidden = true;
  elements.cardView.hidden = false;
  void elements.secretCard.offsetWidth;
  elements.secretCard.classList.add("is-flipped");
  elements.nextPlayer.focus();
}

function advancePlayer() {
  elements.secretCard.classList.remove("is-flipped");

  if (state.currentPlayer === state.playerCount - 1) {
    showScreen(elements.readyScreen);
    return;
  }

  state.currentPlayer += 1;
  preparePlayer();
}

elements.decreasePlayers.addEventListener("click", () => updatePlayerCount(-1));
elements.increasePlayers.addEventListener("click", () => updatePlayerCount(1));
elements.startGame.addEventListener("click", startRound);
elements.showRules.addEventListener("click", () =>
  elements.rulesDialog.showModal(),
);
elements.closeRules.addEventListener("click", () =>
  elements.rulesDialog.close(),
);
elements.rulesDialog.addEventListener("click", (event) => {
  if (event.target === elements.rulesDialog) elements.rulesDialog.close();
});
elements.readyButton.addEventListener("click", showPlayerCard);
elements.nextPlayer.addEventListener("click", advancePlayer);
elements.newRound.addEventListener("click", startRound);
elements.changePlayers.addEventListener("click", () =>
  showScreen(elements.setupScreen),
);
elements.quitGame.addEventListener("click", () =>
  showScreen(elements.setupScreen),
);

updatePlayerCount(0);
