const express = require("express");
const path = require("path");
const { createServer } = require("http");

//Se importan las rutas y servicios 
const playersRouter = require("./server/routes/players.router"); //rutas relacionadas con jugadores (por ejemplo, unirse).
const gameRouter = require("./server/routes/game.router"); //rutas relacionadas con el juego.(gritar, selecionar polo)
const { initSocketInstance } = require("./server/services/socket.service"); // Funcion que inicia el socket

const PORT = 5050;

const app = express(); //Se crea la app de Express.
const httpServer = createServer(app); //Se combinan (expres y http) para crear un servidor HTTP.

// Middlewares
app.use(express.json()); //Permite que Express entienda datos en formato JSON enviados desde el frontend.
app.use("/game", express.static(path.join(__dirname, "game"))); //muestra la app principal del juego.
app.use("/results", express.static(path.join(__dirname, "results-screen"))); //muestra el cliente de resultados.
//Esto es lo que permite que accedas al HTML y JS del juego directamente por URL.

// Routes
app.use("/api", playersRouter);
app.use("/api/game", gameRouter);

// Services
initSocketInstance(httpServer); //Se inicializa socket.io sobre el mismo servidor HTTP. Esto da la comunicacion en tiempo real con todos los clientes que se conecten

httpServer.listen(PORT, () => //Se inicia el servidor HTTP en el puerto 5050.
  console.log(`Server running at http://localhost:${PORT}`)
);
