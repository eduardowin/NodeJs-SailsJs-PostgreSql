/**
 * Parametro.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_Parametro",
  attributes: {
  	ParametroId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	},
	Cod_Tabla: "integer",
	Cod_Elemento: "integer",
	Val_Cad_Largo: "string",
	Val_Cad_Corto: "string",
	Val_Num_Largo: "integer",
	Val_Num_Corto: "integer",
	Est_Registro: "integer",
	Fec_Registro: "datetime",
	Fec_Actualiza: "datetime"
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};