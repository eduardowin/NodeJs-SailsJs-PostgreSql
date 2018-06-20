/**
 * MonederoVirtual.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_MonederoVirtual",
  attributes: {
  	MonederoVirtualId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	},
	UsuarioId: "integer",
	Mto_Disponible: "float",
	Est_Registro: "integer"
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};