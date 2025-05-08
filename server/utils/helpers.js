const assignRoles = (players) => { //Define una funcion que recibe de parametro a los jugadores, el arreglo, y se les asigna e rol
  let shuffled = players.sort(() => 0.5 - Math.random()) //Aqui se mezclan aleaotriamente los roles. Se guarda en shuffled
  shuffled[0].role = "marco"
  shuffled[1].role = "polo-especial" //Se le asigna al primero y al segundo jugador estos roles para garantizzar que siempre haya un amnrco y un polo-especial
  for (let i = 2; i < shuffled.length; i++) { //A todos los demás jugadores (desde el índice 2 en adelante) se les asigna el rol de polo normal.
    shuffled[i].role = "polo" //Devuelve el array ya modificado, con los roles asignados.
  }
  return shuffled
}

//Exporta la función para poder usarla en otros archivos como players.db.js.
module.exports = { assignRoles }
