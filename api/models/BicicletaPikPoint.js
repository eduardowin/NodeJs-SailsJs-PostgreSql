/**
 * BicicletaPikPoint.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {
   tableName: "epb_bicicletapikpoint",
   attributes: {
   	bicipikpointid: {
                 		primaryKey: true,
                 		unique: true,
                 		autoIncrement: true,
                 		type: "integer"
                   	},
   	pickpointid: {
                  type: "integer"
                 },
   	bicicletaid: {
                  type: "integer"
                 },
   	est_bicicleta: "integer",
   	est_registro: "integer",
   	fec_registro: "datetime",
   	fec_actualizacion: "datetime"
   },
   autoCreatedAt: false,
   autoUpdatedAt: false
 };
