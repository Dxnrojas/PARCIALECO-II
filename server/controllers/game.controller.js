const playersDb = require("../db/players.db"); 
const { 
  emitEvent,
  emitToSpecificClient,
} = require("../services/socket.service");

const joinGame = async (req, res) => { //Este endpoint se activa cuando un jugador se une.
  try {
    const { nickname, socketId } = req.body;
    playersDb.addPlayer(nickname, socketId); //Agrega un nuevo jugador a la base de datos, asociando su nombre con su socket.id.

    const gameData = playersDb.getGameData(); //Recupera el estado actual del juego (jugadores activos).
    emitEvent("userJoined", gameData); //Notifica a todos los clientes que un jugador se unió.

    res.status(200).json({ success: true, players: gameData.players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const startGame = async (req, res) => { 
  try {
    const playersWithRoles = playersDb.assignPlayerRoles(); //Asigna roles a los jugadores (marco, polo, polo-especial).

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role); //A cada jugador se le envía un evento personalizado indicándole su rol.`
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyMarco = async (req, res) => { // Llamado cuando un Marco grita.
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole([ // Se buscan todos los jugadores con rol polo o polo-especial.
      "polo",
      "polo-especial",
    ]);

    rolesToNotify.forEach((player) => { //A cada uno se le envía una notificación con el mensaje "Marco!!!" y el id de quien lo dijo (Marco)
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyPolo = async (req, res) => { //Igual que el anterior, pero en sentido contrario: un Polo gritó → se notifica a Marco.
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco");

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPolo = async (req, res) => { // Este endpoint es llamado cuando Marco hace clic en un botón para seleccionar a un Polo.
  try {
    const { socketId, poloId } = req.body;

    const myUser = playersDb.findPlayerById(socketId);
    const poloSelected = playersDb.findPlayerById(poloId);
    const allPlayers = playersDb.getAllPlayers();

    if (poloSelected.role === "polo-especial") {
      // Notifica a todos los jugadores que el juego ha terminado
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`, //Se notifica que marco ha ganado, con su nickname
        });
      });
    } else {
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", { // Se notifica que marco ha perdido con su respectivo nickname
          message: `El marco ${myUser.nickname} ha perdido`,
        });
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
};

//Lo que este controller hace es manejar las peticiones de los clientes y comunicarse con la base de datos para gestionar los jugadores y el estado del juego.
//Administra la entrada de jugadores y asignación de roles.
//Notifica a los jugadores cuando alguien grita.
//Determina si Marco gana o pierde y emite el resultado.
//Usa WebSocket para comunicación en tiempo real, y HTTP para acciones desde el frontend.
