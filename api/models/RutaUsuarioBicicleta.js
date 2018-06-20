/**
 * Ruta.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "ePB_RutaUsuarioBicicleta",
  attributes: {
  	RutaUsuarioBicicletaId: {
		primaryKey: true,
		unique: true,
		autoIncrement: true,
		type: "integer"
	  },
  	BicicletaId: "integer",
  	UsuarioId: "string",
  	PickPointId_Origen: "integer",
  	PickPointId_Destino: "integer",
  	Hora_Inicio: "datetime",
  	Hora_Fin: "datetime",
  	Fec_Registro: "datetime",
  	Calificacion: "float",
  	CategoriaRutaValId: "integer",
  	Comentario: "string",
  	Des_Ruta: "string",
  	Tot_Distancia: "float",
  	Prom_Llegada_Tiempo: "float",
  	Costo_Ruta: "float",
  	Costo_Reserva: "float",
  	Ini_Tiempo_Reserva: "datetime",
  	Cnt_Tiempo_Reserva: "float",
  	Cod_QR_Bloqueo: "string",
  	Cod_QR_Desbloqueo: "string",
  	Est_RutaUsuarioBicicleta: "integer",
  	Est_Registro: "integer",
    Fec_Actualizacion: "datetime",
    Fec_Reserva: "datetime",
  	Esc_Finaliza_Ruta: "string"
    },
  autoCreatedAt: false,
  autoUpdatedAt: false
};
