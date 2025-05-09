import { navigateTo, socket } from "../app.js";

export default function renderScreen2(data) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="screen2">
      <h2>🏆 Pantalla Final - Ranking</h2>
      <ul id="ranking-list"></ul>
      <div style="margin-top: 1rem;">
        <button id="sort-alpha">Ordenar alfabéticamente</button>
        <button id="restart-game">Reiniciar juego</button>
      </div>
    </div>
  `;

  const rankingList = document.getElementById("ranking-list");
  const sortAlphaBtn = document.getElementById("sort-alpha");
  const restartBtn = document.getElementById("restart-game");

  let currentData = [...data.players];

  // Función para renderizar el ranking
  function renderList(players) {
    rankingList.innerHTML = "";
    players.forEach((player, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${player.nickname} - ${player.score} pts`;
      rankingList.appendChild(li);
    });
  }

  // Orden por defecto (puntaje descendente)
  currentData.sort((a, b) => b.score - a.score);
  renderList(currentData);

  // Botón: ordenar alfabéticamente
  sortAlphaBtn.addEventListener("click", () => {
    const sorted = [...currentData].sort((a, b) =>
      a.nickname.localeCompare(b.nickname)
    );
    renderList(sorted);
  });

  // Botón: reiniciar juego
  restartBtn.addEventListener("click", () => {
    socket.emit("resetGame");
  });

  // Al recibir confirmación de reinicio → volver a pantalla 1
  socket.on("gameReset", () => {
    navigateTo("/");
  });
}
