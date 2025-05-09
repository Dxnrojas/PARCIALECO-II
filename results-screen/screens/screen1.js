import { navigateTo, socket } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="screen1">
      <h2>Resultados en Tiempo Real</h2>
      <ul id="scores-list">
        <li>Cargando jugadores...</li>
      </ul>
    </div>
  `;

  const scoresList = document.getElementById("scores-list");

  // Escucha el evento que enviará el backend con los puntajes
  socket.on("updateScores", (players) => {
    if (!players || players.length === 0) {
      scoresList.innerHTML = `<li>No hay jugadores activos</li>`;
      return;
    }

    // Limpia la lista
    scoresList.innerHTML = "";

    // Recorre los jugadores y muestra su nombre y puntaje
    players.forEach((player) => {
      const li = document.createElement("li");
      li.textContent = `${player.nickname}: ${player.score} puntos`;
      scoresList.appendChild(li); //por cada jugar anadir el score 
    });
  });

  // Evento opcional: pasar a la pantalla final si se emite desde el backend
  socket.on("showFinalScreen", (rankingData) => { //Si se emite desde el backend, se navega a la pantalla 2
    navigateTo("/screen2", { players: rankingData }); 
  });
}
