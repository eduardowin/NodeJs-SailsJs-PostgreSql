/**
 * PikpointController
 *
 * @description :: Server-side logic for managing pikpoints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	listar: function(req, res){
		Pikpoint
			.find(
			  {Est_PickPoint: 1},
        {
          select:[
            'PickPointId',
            'Cod_PickPoint',
            'Nombre',
            'Direccion',
            'Cnt_Bici_Disponible',
            'Cnt_Bici_Reservado',
            'Est_PickPoint',
            'Est_Registro',
            'Latitud',
            'Longitud',
            'cnt_bici_llegada'
          ]
        }
      )
			.sort({Nombre: "DESC"})
			.then(function(registros){
				res.json({registros: registros});
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},

	insertar: function(req, res){
		var data = req.allParams();
		Pikpoint
			.create(data)
			.then(function(registros){
				res.ok();
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},
	detalle: function(req, res)
	{
		var data = req.allParams();
		Pikpoint
			.find(
						{PickPointId: data.pikpointId, Est_Registro: 1},
						{select:['PickPointId','Nombre','Direccion','Cnt_Bici_Disponible','Latitud','Longitud']}
					 )
			.then(function(registros){
				if(registros.length>0)
				{
					res.json({pikpoint: registros});
				}
				else
				{
					res.send("no_data");
				}
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},
	listarSinOrigen: function(req, res){
		var data = req.allParams();
		Pikpoint
			.find(
						{Est_PickPoint: 1,
						PickPointId: {'!' : data.pOrigen}
						},
						{select:['PickPointId','Nombre','Direccion','Cnt_Bici_Disponible','Latitud','Longitud']}
					 )
			.sort({Latitud: "ASC"})
			.then(function(registros){
				res.json({PickPoints: registros});
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},
};
