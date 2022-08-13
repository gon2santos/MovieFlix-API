/// =========================================================================== ///
/// =============================== HENRY-FLIX ================================ ///
/// =========================================================================== ///

'use strict'

const categories = ['regular', 'premium']

let users = []
let series = []

module.exports = {

  reset: function () {
    // No es necesario modificar esta función. La usamos para "limpiar" los arreglos entre test y test.

    users = []
    series = []
  },

  // ==== COMPLETAR LAS SIGUIENTES FUNCIONES (vean los test de `model.js`) =====

  addUser: function (email, name) {
    // Agrega un nuevo usuario, verificando que no exista anteriormente en base a su email.
    // En caso de existir, no se agrega y debe arrojar el Error ('El usuario ya existe') >> ver JS throw Error
    // Debe tener una propiedad <plan> que inicialmente debe ser 'regular'.
    // Debe tener una propiedad <watched> que inicialmente es un array vacío.
    // El usuario debe guardarse como un objeto con el siguiente formato:
    // {  email: email, name: name,  plan: 'regular' , watched: []}
    // En caso exitoso debe retornar el string 'Usuario <email_del_usuario> creado correctamente'.
    const usr = { email: email, name: name, plan: 'regular', watched: [] };
    if (users.filter(u => u.email === usr.email).length === 0) {
      users.push(usr);
      return `Usuario ${email} creado correctamente`;
    }
    else throw new Error('El usuario ya existe');
  },

  listUsers: function (plan) {
    // Si no recibe parámetro, devuelve un arreglo con todos los usuarios.
    // En caso de recibir el parámetro <plan>, devuelve sólo los usuarios correspondientes a dicho plan ('regular' o 'premium').
    if (plan === undefined)
      return users;
    else {
      return users.filter(u => u.plan === plan);
    }
  },

  switchPlan: function (email) {
    // Alterna el plan del usuario: si es 'regular' lo convierte a 'premium' y viceversa.
    // Retorna el mensaje '<Nombre_de_usuario>, ahora tienes el plan <nuevo_plan>'
    // Ej: 'Martu, ahora tienes el plan premium'
    // Si el usuario no existe, arroja el Error ('Usuario inexistente')
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        if (users[i].plan === 'regular') {
          users[i].plan = 'premium';
          return `${users[i].name}, ahora tienes el plan ${users[i].plan}`;
        }
        else if (users[i].plan === 'premium') {
          users[i].plan = 'regular';
          return `${users[i].name}, ahora tienes el plan ${users[i].plan}`;
        }
      }
    }
    throw new Error('Usuario inexistente');
  },

  addSerie: function (name, seasons, category, year) {
    // Agrega una nueva serie al catálogo.
    // Si la serie ya existe, no la agrega y arroja un Error ('La serie <nombre_de_la_serie> ya existe')
    // Si la categoría no existe, arroja un Error ('La categoría <nombre_de_la_categoría> no existe') y no agrega la serie.
    // Debe devolver el mensaje 'La serie <nombre de la serie> fue agregada correctamente'
    // Debe guardar la propiedad <category> de la serie (regular o premium)
    // Debe guardar la propiedade <rating> inicializada 0
    // Debe guardar la propiedade <reviews> que incialmente es un array vacío.
    const ser = { name: name, seasons: seasons, category: category, year: year, rating: 0, reviews: [] };
    if ((category === 'regular') || (category === 'premium')) {
      if (series.filter(s => s.name === ser.name).length === 0) {
        {
          series.push(ser);
          return `La serie ${name} fue agregada correctamente`;
        }
      }
      else {
        const e1 = new Error(`La serie ${name} ya existe`);
        e1.name = 'existError';
        throw e1;
      }
    }
    else{
      const e2 = new Error(`La categoría ${category} no existe`);
        e2.name = 'categoryError';
        throw e2;
    }
  },

  listSeries: function (category) {
    // Devuelve un arreglo con todas las series.
    // Si recibe una categoría como parámetro, debe filtrar sólo las series pertenecientes a la misma (regular o premium).
    // Si la categoría no existe, arroja un Error ('La categoría <nombre_de_la_categoría> no existe') y no agrega la serie.
    if (category === undefined)
      return series;
    else {
      const filteredSeries = series.filter(s => s.category === category);
      if (filteredSeries.length === 0) {
        throw new Error(`La categoría ${category} no existe`);
      }
      else {
        return filteredSeries;
      }
    }
  },

  play: function (serie, email) {
    // Con esta función, se emula que el usuario comienza a reproducir una serie.
    // Si el usuario no existe, arroja el Error ('Usuario inexistente')
    // Si la serie no existe, arroja el Error ('Serie inexistente')
    // Debe validar que la serie esté disponible según su plan. Usuarios con plan regular sólo pueden reproducir series de dicha categoría, usuario premium puede reproducir todo.
    // En caso de contrario arrojar el Error ('Contenido no disponible, contrata ahora HenryFlix Premium!')
    // En caso exitoso, añadir el nombre (solo el nombre) de la serie a la propiedad <watched> del usuario.
    // Devuelve un mensaje con el formato: 'Reproduciendo <nombre de serie>'
    const usr = users.filter(u => u.email === email);
    const ser = series.filter(s => s.name === serie);
    if (usr.length === 0){
        const e1 = new Error('Usuario inexistente');
        e1.name = 'usrExistError';
        throw e1;
    } /* throw new Error('Usuario inexistente'); */
    if (ser.length === 0){
        const e2 = new Error('Serie inexistente');
        e2.name = 'serExistError';
        throw e2;
    }
    if ((usr[0].plan === 'regular') && (ser[0].category === 'premium')){
        const e3 = new Error('Contenido no disponible, contrata ahora HenryFlix Premium!');
        e3.name = 'contentUnavailableError';
        throw e3;
    }
    else {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          users[i].watched.push(serie);
          return `Reproduciendo ${serie}`;
        }
      }
    }
  },

  watchAgain: function (email) {
    // Devuelve sólo las series ya vistas por el usuario
    // Si el usuario no existe, arroja el Error ('Usuario inexistente')
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email)
        return users[i].watched;
    }
    throw new Error('Usuario inexistente');
  },

  rateSerie: function (serie, email, score) {
    //DONE Asigna un puntaje de un usuario para una serie:
    //DONE Actualiza la propiedad <reviews> de la serie, guardando en dicho arreglo un objeto con el formato { email : email, score : score } (ver examples.json)
    // Actualiza la propiedad <rating> de la serie, que debe ser un promedio de todos los puntajes recibidos.
    //DONE Devuelve el mensaje 'Le has dado <puntaje> puntos a la serie <nombre_de_la_serie>'
    //DONE Si el usuario no existe, arroja el Error ('Usuario inexistente') y no actualiza el puntaje.
    //DONE Si la serie no existe, arroja el Error ('Serie inexistente') y no actualiza el puntaje.
    //DONE Debe recibir un puntaje entre 1 y 5 inclusive. En caso contrario arroja el Error ('Puntaje inválido') y no actualiza el puntaje.
    //DONE Si el usuario no reprodujo la serie, arroja el Error ('Debes reproducir el contenido para poder puntuarlo') y no actualiza el puntaje. >> Hint: pueden usar la función anterior
    if ((score < 0) || (score > 5)){
      const e = new Error('Puntaje inválido');
      e.name = 'scoreError';
      throw e;
    }

    const usr = users.filter(u => u.email === email);
    const ser = series.filter(s => s.name === serie);
    if (usr.length === 0){
      const e = new Error('Usuario inexistente');
      e.name = 'usrError';
      throw e;
    }
    if (ser.length === 0){
      const e = new Error('Serie inexistente');
      e.name = 'serError';
      throw e;
    }

    if (usr[0].watched.filter(s => s === serie).length === 0){
      const e = new Error('Debes reproducir el contenido para poder puntuarlo');
      e.name = 'ratingError';
      throw e;
    }

    const review = { email: email, score: score };

    for (let i = 0; i < series.length; i++) {
      if (series[i].name === serie) {
          series[i].reviews.push(review);
          let totalScore = 0;

          for(let e = 0; e < series[i].reviews.length; e++){
            totalScore = totalScore + series[i].reviews[e].score;
          }

          series[i].rating = totalScore / series[i].reviews.length;

          return `Le has dado ${score} puntos a la serie ${serie}`;
      }
    }
  }

}