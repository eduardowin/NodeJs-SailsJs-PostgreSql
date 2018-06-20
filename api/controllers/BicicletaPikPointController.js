/**
 * BicicletaPikPointController
 *
 * @description :: Server-side logic for managing Bicicletapikpoints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	bicidisp: function(req, res){
		var data = req.allParams();
		var query = 'SELECT bp.bicicletaid, bp.pickpointid, '+
								'bp.est_bicicleta, bp.est_registro, b."Serie" '+
								'FROM epb_bicicletapikpoint as bp JOIN "ePB_Bicicleta" as b '+
								'on bp.bicicletaid = b."BicicletaId" '+
								'WHERE bp.est_bicicleta = 0 and bp.pickpointid = '+data.pikpointId;
		BicicletaPikPoint.query(query, function(err, result){
														if(err){
															return res.serverError(err);
														}
														  res.json({registros: result.rows});
													});
	},
};
