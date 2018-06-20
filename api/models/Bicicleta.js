/**
 * Bicicleta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_Bicicleta",
  attributes: {
    BicicletaId: {
                		primaryKey: true,
                		unique: true,
                		autoIncrement: true,
                		type: "integer",
                },
  	Cod_Bicicleta: "string",
  	Serie: "string",
  	Tip_Bicicleta: "integer",
  	Est_Bicicleta: "integer",
  	Est_Registro: "integer",
  	Fec_Registro: "datetime",
  	Fec_Actualiza: "datetime",
  	DuenhoId: "integer",
  	Tipo_DuenhoId: "integer",
  	clave_candado: "string"
  },
  autoCreatedAt: false,
  autoUpdatedAt: false
};
