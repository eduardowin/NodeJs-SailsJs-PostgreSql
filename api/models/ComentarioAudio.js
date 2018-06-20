/**
 * ComentarioAudio.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_ComentarioAudio",
  attributes: {
    ComentarioAudioId: {
                		primaryKey: true,
                		unique: true,
                		autoIncrement: true,
                		type: "integer",
                },
  	Comentario: "string",
  	Nom_ArchivoAudio: "string",
  	RutaUsuarioBicicletaId: "integer",
  	CategoriaRutaValId: "integer",
    Est_Registro: "integer" ,
  	Fec_Registro: "datetime" 
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};
