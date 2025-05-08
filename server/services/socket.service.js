const { Server } = require("socket.io"); //Importa el constructor de la clase Server desde socket.io. Lo usaremos para crear una instancia de WebSocket.

let io; //Declara una variable global dentro de este módulo que almacenará la instancia de io.

const initSocketInstance = (httpServer) => {
  io = new Server(httpServer, { //Crea un nuevo servidor WebSocket encima del HTTP.
    path: "/real-time", //canal de conexión para los sockets.
    cors: {
      origin: "*", //permite conexiones desde cualquier origen (útil para desarrollo con múltiples clientes).
    },
  });
};

const emitToSpecificClient = (socketId, eventName, data) => { //Notifica un evento con datos(los de los paraametros) a un solo cliente, identificado por su socketId.
  if (!io) {
    throw new Error("Socket.io instance is not initialized");
  }
  io.to(socketId).emit(eventName, data); //Usa io.to(socketId) para enviar el evento solo al cliente con ese socketId. 
};

const emitEvent = (eventName, data) => { //Notifica algo a todos los clientes conectados.
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

//Porque evita que crees múltiples instancias de WebSocket 
// en distintas partes del backend. Define una sola fuente de verdad y mantiene la conexión ordenada y reutilizable.