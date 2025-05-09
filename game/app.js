import renderHomeScreen from "./screens/homeScreen.js";
import renderLobbyScreen from "./screens/lobbyScreen.js";
import renderGameGround from "./screens/gameGround.js";
import renderGameOverScreen from "./screens/gameOverScreen.js";

const socket = io("/", { path: "/real-time" });

function clearScripts() { // Clear all scripts from the page
  document.getElementById("app").innerHTML = "";
}

let route = { path: "/", data: {} }; //Inicializa el objeto de ruta
renderRoute(route);

function renderRoute(currentRoute) { //Renderiza cada caso de cada pantalla segun notifique
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderHomeScreen(currentRoute?.data);
      break;
    case "/lobby":
      clearScripts();
      renderLobbyScreen(currentRoute?.data);
      break;
    case "/game":
      clearScripts();
      renderGameGround(currentRoute?.data);
      break;
    case "/gameOver":
      clearScripts();
      renderGameOverScreen(currentRoute?.data);
      break;
    default:
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

function navigateTo(path, data) { //Navega a la ruta especificada
  route = { path, data };
  renderRoute(route);
}

async function makeRequest(url, method, body) { //Es una función genérica que te permite hacer peticiones HTTP (fetch) al backend, de forma reutilizable.
  try {
    const BASE_URL = "http://localhost:5050";
    let response = await fetch(`${BASE_URL}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    return { success: false, error: error.message };
  }
}

// NUEVO: escuchar reinicio del juego desde socket
socket.on("gameReset", () => {
  navigateTo("/", {});
});

export { navigateTo, socket, makeRequest };
