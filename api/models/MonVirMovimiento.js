/**
 * MonVirMovimiento.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_MonVirMovimiento",
  attributes: {
  	Mon_Vir_MovimientoId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	}
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};