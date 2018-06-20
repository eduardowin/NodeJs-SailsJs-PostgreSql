/**
 * Usuario.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_CategoriaRutaVal",
  attributes: {
  	CategoriaRutaValId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	},
	Des_CategoriaRuta: "string",
	Est_Registro: "integer" 
 
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};