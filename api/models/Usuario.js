/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_Usuario",
  attributes: {
  	UsuarioId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	},
	email: "string",
	password: "string",
	Pri_Nombre: "string",
	Seg_Nombre: "string",
	Appe_Paterno: "string",
	Appe_Materno: "string",
	TipDoc_Identidad: "integer",
	NumDoc_Identidad: "string",
	Est_Registro: "integer",
	Fec_Registro: "datetime",
	Fec_Actualiza: "datetime"
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};