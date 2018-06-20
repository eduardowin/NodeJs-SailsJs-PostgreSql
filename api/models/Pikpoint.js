/**
 * Pikpoint.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_PickPoint",
  attributes: {
  	PickPointId: {
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      type: "integer"
    },
    Cod_PickPoint: "string",
    Nombre: "string",
    Direccion: "string",
    Cnt_Bici_Disponible: "integer",
    Cnt_Bici_Reservado: "integer",
    Est_PickPoint: "integer",
    Est_Registro: "integer",
    Fec_Registro: "datetime",
	  Fec_Actualiza: "datetime",
	  Flg_Bloqueado: "integer",
	  Latitud: "float",
	  Longitud: "float",
    cnt_bici_llegada: "integer",
    fec_est_llegada: "string",
    url_Imagen_ref: "string"
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};
