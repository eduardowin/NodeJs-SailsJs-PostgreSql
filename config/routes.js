/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  // Bicicleta
  "post /insertarBicicleta": {
    controller: "BicicletaController",
    action: "insertar"
  },

  "get /listarBicicleta": {
    controller: "BicicletaController",
    action: "listar"
  },

  "get /detBicicleta/:bici": {
    controller: "BicicletaController",
    action: "detalle"
  },

  //BicicletaPikPointController
  "get /bicipikpoint/biciDisp/:pikpointId": {
    controller: "BicicletaPikPointController",
    action: "bicidisp"
  },

  //Pikpoint
  "get /pikpoint/listarSinOrigen/:pOrigen": {
    controller: "PikpointController",
    action: "listarSinOrigen"
  },

  "get /pikpoint/detalle/:pikpointId": {
    controller: "PikpointController",
    action: "detalle"
  },
  "get /pikpoint/listar": {
    controller: "PikpointController",
    action: "listar"
  },


  //RutaUsuarioBicicleta
  "get /ruta/detalle/:RutaUsuarioBicicletaId": {
    controller: "RutaController",
    action: "detalle"
  },
  "post /ruta/actualizar": {
    controller: "RutaController",
    action: "actualizar"
  },
  "post /ruta/insertar": {
    controller: "RutaController",
    action: "insertar"
  },
  "post /ruta/actualizarrate": {
    controller: "RutaController",
    action: "actualizarrate"
  },
  "post /ruta/actualizaestadorutallegada": {
    controller: "RutaController",
    action: "updaterutabici"
  },
  //CategoriaRu

  "get /CategoriaRutaVal/listar": {
    controller: "CategoriaRutaValController",
    action: "listar"
  },

    //Usuario

  "post /usuario/insertar": {
    controller: "UsuarioController",
    action: "insertar"
  },
  "get /usuario/usuarioxEmail/:pEmail": {
    controller: "UsuarioController",
    action: "usuarioxEmail"
  },
  "get /usuario/usuarioxPrueba/:pUsuario": {
    controller: "UsuarioController",
    action: "usuarioxPrueba"
  },
  "post /usuario/autentificacion": {
    controller: "UsuarioController",
    action: "autentificacion"
  },
    "get /usuario/insertarValidacion/:email": {
    controller: "UsuarioController",
    action: "insertarValidacion"
  },
  "post /usuario/autentificacionencriptado": {
    controller: "UsuarioController",
    action: "autentificacionencriptado"
  },
    "post /ruta/comprobar_enviaje": {
    controller: "RutaController",
    action: "comprobar_enviaje"
  },
    "get /ruta/pb_pikpoint_set/:esorigen/:pickpointid/:nombrepp": {
    controller: "RutaController",
    action: "pb_pikpoint_set"
  },
 
  "get /ruta/template_lista_generica_pikpoint/:esorigen/:pickpointid/:nombredistritopp/:pagina": {
    controller: "RutaController",
    action: "template_lista_generica_pikpoint"
  },
  "get /ruta/replies_pb_bicicletaxpikpoint/:pikpointId": {
    controller: "RutaController",
    action: "replies_pb_bicicletaxpikpoint"
  },
  "get /ruta/pb_bicicletaxpikpoint_set/:bicicletaid/:serie/:clave_candado": {
    controller: "RutaController",
    action: "pb_bicicletaxpikpoint_set"
  },
    "post /ruta/insertar_bot_set": {
    controller: "RutaController",
    action: "insertar_bot_set"
  },

    //CategoriaRu

  "get /CategoriaRutaVal/listar_bot/:rutaUsuariobicicletaid": {
    controller: "CategoriaRutaValController",
    action: "listar_bot"
  },
  "get /ruta/categoria_ruta_bot_upd/:rutaUsuariobicicletaid/:categoriarutavalid": {
    controller: "RutaController",
    action: "categoria_ruta_bot_upd"
  }, 
  "post /usuario/autentificacion_bot": {
    controller: "UsuarioController",
    action: "autentificacion_bot"
  },
  "post /ruta/rutapikpoint_llegada_bot": {
    controller: "RutaController",
    action: "rutapikpoint_llegada_bot"
  },

  "get /ruta/template_lista_generica_distrito_pp/:esorigen": {
    controller: "RutaController",
    action: "template_lista_generica_distrito_pp"
  },
  "get /ruta/pb_distrito_pp_set/:esorigen/:nombredistritopp": {
    controller: "RutaController",
    action: "pb_distrito_pp_set"
  },

  "get /ruta/bot_lista_pikpoint_x_geodistancia/:esorigen/:latitude/:longitude/:pickpointid": {
    controller: "RutaController",
    action: "bot_lista_pikpoint_x_geodistancia"
  },

  "get /ruta/bot_pikpoint_set/:esorigen/:pickpointid/:nombrepp/:usuario_esta_enruta": {
    controller: "RutaController",
    action: "bot_pikpoint_set"
  },
  "get /ruta/bot_pb_bicicletaxpikpoint_set/:bicicletaid/:serie/:clave_candado/:usuario_esta_enruta": {
    controller: "RutaController",
    action: "bot_pb_bicicletaxpikpoint_set"
  },
  "get /ruta/bot_lista_pikpoint_x_geodistancia_val/:esorigen/:latitude/:longitude": {
    controller: "RutaController",
    action: "bot_lista_pikpoint_x_geodistancia_val"
  },
  "post /ComentarioAudio/bot_registro_comentario_audio": {
    controller: "ComentarioAudioController",
    action: "bot_registro_comentario_audio"
  },
  "post /ComentarioAudio/bot_UpLoad_Audio_Recomendacion": {
    controller: "ComentarioAudioController",
    action: "bot_UpLoad_Audio_Recomendacion"
  },
  "get /ruta/bot_verificar_enruta_set/:vEscenario/:UsuarioId/:email": {
    controller: "RutaController",
    action: "bot_verificar_enruta_set"
  },
  "post /ruta/bot_leerQR": {
    controller: "RutaController",
    action: "bot_leerQR"
  },
  "get /ruta/bot_QR_Set/:dataqr": {
    controller: "RutaController",
    action: "bot_QR_Set"
  },
  
};
