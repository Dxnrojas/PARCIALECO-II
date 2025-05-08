const express = require('express');
const gameController = require('../controllers/game.controller'); // Importa el controlador del juego, que contiene la lógica cuando los jugadores gritan, se asignan roles o se selecciona un Polo.
const router = express.Router(); // Crea una nueva instancia de Router. Esto nos permite definir rutas separadas sin mezclar todo en index.js.

// Define game-related routes and link them to controller methods
router.post('/join', gameController.joinGame); //Cuando un jugador se une al juego → llama a joinGame().
router.post('/start', gameController.startGame); //Cuando se inicia el juego (se asignan roles) → llama a startGame().
router.post('/marco', gameController.notifyMarco); // Cuando Marco grita → llama a notifyMarco() para notificar a los Polos.
router.post('/polo', gameController.notifyPolo); // Cuando un Polo grita → llama a notifyPolo() para notificar a Marco.
router.post('/select-polo', gameController.selectPolo); // Cuando Marco hace clic en un Polo para atraparlo → llama a selectPolo() para determinar si gana o pierde.

module.exports = router;