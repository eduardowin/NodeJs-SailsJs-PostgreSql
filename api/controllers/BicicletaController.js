/**
 * BicicletaController
 *
 * @description :: Server-side logic for managing Bicicletas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	insertar: function(req, res){
		var data = req.allParams();
		Bicicleta
			.create(data)
			.then(function(registros){
				res.ok();
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},

	listar: function(req, res){
		Bicicleta
			.find({Est_Registro: 1})
			.sort({Serie: "DESC"})
			.then(function(registros){
				res.json({registros: registros});
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},

	detalle: function(req, res)
	{
		var data = req.allParams();
		Bicicleta
			.find(
						{BicicletaId: data.bici, Est_Registro: 1},
						{select:['clave_candado','Cod_Bicicleta','BicicletaId']}
					 )
			.then(function(registros){
				res.json({bicicleta: registros});
			})
			.catch(function(err){
				res.negotiate(err);
			});
	}
};
