const { Server } = require("socket.io");
const { resetGame } = require("../db/players.db"); //  nuevo: importar función para borrar jugadores

let io;

const initSocketInstance = (httpServer) => {
  io = new Server(httpServer, {
    path: "/real-time",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🎮 Nuevo cliente conectado al juego");

    // NUEVO: manejar reinicio del juego
    socket.on("resetGame", () => {
      console.log("🔁 Reiniciando juego...");
      resetGame(); // limpiar jugadores
      io.emit("gameReset"); // notificar a todos los clientes
    });
  });
};

//Emite un evento a un cliente específico por medio del socketId
const emitToSpecificClient = (socketId, eventName, data) => { //Funcion que me devuleve el evento y la data
  if (!io) {
    throw new Error("Socket.io instance is not initialized");
  }
  io.to(socketId).emit(eventName, data);
};

//Funciones que permite manipular el servidor
//Emitir una funcion para el servidor
const emitEvent = (eventName, data) => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized");
  }
  io.emit(eventName, data);
};

module.exports = {
  emitEvent,
  initSocketInstance,
  emitToSpecificClient,
};
