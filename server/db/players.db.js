/**
 * Database service for player-related operations
 */

const { assignRoles } = require("../utils/helpers");

const players = []; //Guarda los jugadores. Cada objeto dentro e este array cuenta con su socketId, nickname y ol.

/**
 * Get all players
 * @returns {Array} Array of player objects
 */
const getAllPlayers = () => { //Devuelve tidoi los jugadores y es util para ver cuantos hay conectados
  return players;
};

/**
 * Add a new player
 * @param {string} nickname - Player's nickname
 * @param {string} socketId - Player's socket ID
 * @returns {Object} The created player
 */
const addPlayer = (nickname, socketId) => {
  const newPlayer = { id: socketId, nickname }; //Crea un nuevo objeto jugador con su nickname y socketId.
  players.push(newPlayer); // Lo guarda en el array players.
  return newPlayer; // Lo devuelve por si lo necesitas en otra función.
};

/**
 * Buscar un jugador por ID
 * @param {string} socketId - Player's socket ID
 * @returns {Object|null} Player object or null if not found
 */
const findPlayerById = (socketId) => { 
  return players.find((player) => player.id === socketId) || null; //Busca dentro de players el que tenga el socketId igual al buscado.
}; //Si lo encuentra, lo devuelve; si no, devuelve null.

/**
 * Asigna roles a los jugadores
 * @returns {Array} Array of players with assigned roles
 */
const assignPlayerRoles = () => { //Llama a una función externa assignRoles(players) que asigna roles 
  const playersWithRoles = assignRoles(players); //Se asignan los roles y se devuelve el array con los jugadores y sus roles.
  // Update the players array with the new values
  players.splice(0, players.length, ...playersWithRoles);
  return players;
};

/**
 * Encontrar jugadores por rol
 * @param {string|Array} role - Role or array of roles to find
 * @returns {Array} Array of players with the specified role(s)
 */
const findPlayersByRole = (role) => { //Esta funcion permite buscar jugadores por un solo rol o varios roles.
  if (Array.isArray(role)) {
    return players.filter((player) => role.includes(player.role));
  }
  return players.filter((player) => player.role === role);
};

/**
 * Obtener todos los datos del juego, incluyendo los jugadores
 * @returns {Object} Object containing players array
 */
const getGameData = () => { //Empaqueta los jugadores dentro de un objeto, útil para enviarlos a los clientes.
  return { players };
};

/**
 * Reset game data
 * @returns {void}
 */
const resetGame = () => { //Borra todos los jugadores conectados.
  players.splice(0, players.length);
};

module.exports = {
  getAllPlayers,
  addPlayer,
  findPlayerById,
  assignPlayerRoles,
  findPlayersByRole,
  getGameData,
  resetGame,
};
