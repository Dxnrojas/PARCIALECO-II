const express = require('express');
const playersController = require('../controllers/players.controller'); //Importa el controlador de jugadores. Aquí se encuentra la lógica real que se ejecuta cuando alguien consulta jugadores.
const router = express.Router(); //Crea una instancia de Router, una herramienta de Express para definir rutas de forma modular.
//Define una ruta GET en /api/players (recuerda que en index.js dijimos app.use("/api", playersRouter)).
//Cuando un cliente hace un GET a esa ruta, se ejecuta la función getPlayers del controlador players.controller.js.

// Define routes and link them to controller methods
router.get('/players', playersController.getPlayers);

module.exports = router;