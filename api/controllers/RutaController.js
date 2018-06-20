/**
 * RutaController
 *
 * @description :: Server-side logic for managing Rutas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
 Number.prototype.padLeft = function(base,chr){
     var  len = (String(base || 10).length - String(this).length)+1;
     return len > 0? new Array(len).join(chr || '0')+this : this;
 };
 	function fc_UploadFile(file, res, pathDropBox, filename, tipo) {
	var request = require('request');
	var options = {
		method : 'POST',
		url: 'https://content.dropboxapi.com/2/files/upload',
		headers: {
			'Content-Type': 'application/octet-stream',
			'Authorization': 'Bearer DEXia0ey9iAAAAAAAAAABggvC3eYJY1inEEI2NXxF1aTkQ_vC3Rg-ckPeYcV5J8z',
			'Dropbox-API-Arg': '{"path": "'+ pathDropBox + filename + '","mode": "add"}',
		},
		body: file
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var dataBody = {
				path: info.path_lower,
				settings: {
					requested_visibility: 'public'
				}
			};
			var optionsShared = {
				method: 'POST',
				url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer DEXia0ey9iAAAAAAAAAAB2n0IG4LWhquzX8ZYC9cMlfdBYNj_8hsZ1vHt_VAnVZ-'
				},
				body: JSON.stringify(dataBody)
			}
			function callbackShared(errorShared, responseShared, bodyShared){
				if (!errorShared && responseShared.statusCode == 200){
					var infoShared = JSON.parse(bodyShared);
					infoShared['sharedUrl'] = 'https://dl.dropboxusercontent.com/s/' + infoShared.url.substring(26, infoShared.url.length);
					//return res.json(infoShared);
					fc_ObtenerQR_Online(infoShared,res);
				}else{
					console.log(errorShared);
					return res.json(errorShared);
				}
			}
			request(optionsShared, callbackShared);
		}else{
			console.log(error);
			return res.json(error);
		}
	}
	request(options, callback);
};

function fc_ObtenerQR_Online(pInfoShared, res){

	var api_QR = 'http://api.qrserver.com/v1/read-qr-code/?fileurl=_imgqr_'.replace('_imgqr_', pInfoShared['sharedUrl']);

	var request = require('request');

	request(api_QR, function (error, response, body) {

		var vJson_Template=
		{
		  "set_attributes": {
		      "dataqr": ""   
		    },
			"redirect_to_blocks": [""],
		    "messages": [
   							{
   								"text": "",
   								"quick_replies":[]
   							} 
 						]

		};
		
	 	if(response.statusCode == '200'){
			
			var vdata= JSON.parse(body)[0].symbol[0].data;
			vJson_Template.messages[0].text = "Información de QR detectada, espere un momento por favor";
			vJson_Template.set_attributes.dataqr = vdata;
			vJson_Template.redirect_to_blocks[0] = "QRSet";
			delete vJson_Template.messages[0]['quick_replies'];
			delete vJson_Template['messages'];
			//delete vJson_Template['set_attributes'];
			return res.json(vJson_Template);
	 	}
	 	else{
	 		delete vJson_Template['redirect_to_blocks'];
	 		vJson_Template.messages[0].text = "Lo siento, no he reconocido la imagen, por favor toma otra";
			vJson_Template.messages[0].quick_replies[i]= {
													          "title":"Usar QR de bici",
													          "block_names": ["LeerQR"]
													      };
	  		return res.json(vJson_Template);
	 	}
	});
};
function fc_NombreArchivo() {
    var d = new Date();
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    return h + m + s  + ms;
};
function addZero(x,n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
};
//var urlServidorNodeJs = "https://apppikbikprueba1.herokuapp.com/";
var urlServidorNodeJs = "http://104.236.84.68:8083/";
module.exports = {
	detalle: function(req, res)
	{
		var data = req.allParams();
		RutaUsuarioBicicleta
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
	actualizar: function (req, res) {
	    var data = req.allParams();
	    var filtro = {RutaUsuarioBicicletaId: data.RutaUsuarioBicicletaId};

	    RutaUsuarioBicicleta
	      .update(filtro, data)
	      .then(function (registros) {
	        res.ok("oK");
	      })
	      .catch(function (err) {
	        res.negotiate(err);
	      });
  },
	updaterutabici: function(req, res)
	{
    var data = req.allParams();

		var filtroUpdate = {
			"RutaUsuarioBicicletaId" : data.RutaUsuarioBicicletaId
		}
		var dataUpdate =
		{
      		"Hora_Inicio" : data.Hora_Inicio,
			"Est_RutaUsuarioBicicleta" : 2
		}
		RutaUsuarioBicicleta
		.update(filtroUpdate,
						dataUpdate)
	  .then(function (resul){

			var filtroUpdatePikpointLlegando = {
				"PickPointId" : resul[0].PickPointId_Origen
			};

			var dataLlegada = new Date(new Date().getTime() + data.tiempoLlegadaMinutos*60000),
					     dataLlegadaformat = [
								          dataLlegada.getFullYear(),
												  (dataLlegada.getMonth()+1).padLeft(),
					                dataLlegada.getDate().padLeft()].join('-') +' ' +
					               [dataLlegada.getHours().padLeft(),
					                dataLlegada.getMinutes().padLeft(),
					                dataLlegada.getSeconds().padLeft()].join(':');
			var dataUpdatePikpointLlegando = {
				"fec_est_llegada" : dataLlegadaformat
			};

			Pikpoint
				.update(filtroUpdatePikpointLlegando,
                dataUpdatePikpointLlegando)
				.then(function (result){
					res.json(result[0]);
				})
				.catch(function (err){
					console.log(err);
					return res.json({"RutaUsuarioBicicletaId2" : "0", "RPTA_SERVICIO" : err});
				});
		})
		.catch(function (err){
			console.log(err);
			return res.json({"RutaUsuarioBicicletaId1" : "0", "RPTA_SERVICIO" : err});
		});
	}
	,
	insertar: function(req, res){
		var data = req.allParams();
		RutaUsuarioBicicleta
			.create(data, function rutaCreated(err, resp){
				if(err){
					return res.json({"RPTA_SERVICIO" : err });
				}else{
					resp.save();
					//ACTUALIZAR EL ESTADO DE LA BICICLETA A RESERVADA EN LA TABLA BICICLETAPIKPOINT
					var dataUpdateBiciPikpoint = {
						"est_bicicleta" : 1
					};
					var filtroUpdateBiciPikpoint  = {
						"pickpointid" : resp.PickPointId_Origen,
						"bicicletaid": resp.BicicletaId,
						"est_bicicleta" : 0
					};
					BicicletaPikPoint
						.update(filtroUpdateBiciPikpoint,
								    dataUpdateBiciPikpoint)
						.then(function (registros)
						{
							if(registros.length > 0){
								//OBTENER EL NUMERO DE BICICLETAS DISPONIBLES ACTUAL DEL PIKPOINT
								var bicicletasDisponiblesPikPoint;
								Pikpoint
									.find(
												{PickPointId: resp.PickPointId_Origen, Est_Registro: 1},
												{select:['PickPointId','Cnt_Bici_Disponible']}
											 )
									.then(function (resPikPoint){
											bicicletasDisponiblesPikPoint = resPikPoint[0].Cnt_Bici_Disponible - 1;
											//ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES - 1 EN EL PIKPOINT
											var dataUpdatePikpoint = {
													"Cnt_Bici_Disponible" : bicicletasDisponiblesPikPoint
											};
											var filtroUpdatePikpoint = {
													"PickPointId" : resp.PickPointId_Origen,
											};
											Pikpoint
												.update(filtroUpdatePikpoint,
																dataUpdatePikpoint)
												.then(function (result){
													//--OBTENER EL NUMERO DE BICICLETAS EN CAMINO ACTUAL DEL PIKPOINT
													var bicicletasEnCaminoPikPoint;
													Pikpoint
														.find(
																	{PickPointId: resp.PickPointId_Destino, Est_Registro: 1},
																	{select:['PickPointId','cnt_bici_llegada']}
																 )
														.then(function (resPikPoint){
																bicicletasEnCaminoPikPoint = resPikPoint[0].cnt_bici_llegada + 1;
																//ACTUALIZAR EL NUMERO DE BICICLETAS EN CAMINO + 1 EN EL PIKPOINT
																var dataUpdatePikpointEnCamino = {
																		"cnt_bici_llegada" : bicicletasEnCaminoPikPoint
																};
																var filtroUpdatePikpointEnCamino = {
																		"PickPointId" : resp.PickPointId_Destino,
																};
																Pikpoint
																	.update(filtroUpdatePikpointEnCamino,
																					dataUpdatePikpointEnCamino)
																	.then(function (result){
																		res.json(resp);
																	})
																	.catch(function (err){
																		return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																				RutaUsuarioBicicleta
																					.destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
																					.then(function (res){
																						return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																					})
																					.catch(function (err){
																						return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																					});
																	});
																	//------------ END ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES - 1 EN EL PIKPOINT
														})
														.catch(function (err){
															return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																	RutaUsuarioBicicleta
																		.destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
																		.then(function (res){
																			return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																		})
																		.catch(function (err){
																			return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																		});
														});
													//------------END OBTENER EL NUMERO DE BICICLETAS EN CAMINO ACTUAL DEL PIKPOINT
												})
												.catch(function (err){
													return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
															RutaUsuarioBicicleta
																.destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
																.then(function (res){
																	return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																})
																.catch(function (err){
																	return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
																});
												});
												//------------ END ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES - 1 EN EL PIKPOINT
									})
									.catch(function (err){
										return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
												RutaUsuarioBicicleta
													.destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
													.then(function (res){
														return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
													})
													.catch(function (err){
														return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
													});
									});
								//------------END OBTENER EL NUMERO DE BICICLETAS DISPONIBLES ACTUAL DEL PIKPOINT
							}else{
								RutaUsuarioBicicleta
								  .destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
									.then(function (resDelete){
										return res.json({"RutaUsuarioBicicletaId" : "0"});
									})
									.catch(function (err){
										return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
									});
							} //-- END IF BUSQUEDA > 0
						})
						.catch(function (err){
							return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
									RutaUsuarioBicicleta
									  .destroy({RutaUsuarioBicicletaId: resp.RutaUsuarioBicicletaId})
										.then(function (res){
											return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
										})
										.catch(function (err){
											return res.json({"RutaUsuarioBicicletaId" : "0", "RPTA_SERVICIO" : err});
										});
						});
					//------------END ACTUALIZAR EL ESTADO DE LA BICICLETA A RESERVADA EN LA TABLA BICICLETAPIKPOINT
				} //-- END ELSE
		 });
	},
	actualizarrate: function (req, res) {
	    var data = req.allParams();
	    var filtro = {RutaUsuarioBicicletaId: data.RutaUsuarioBicicletaId};

	    RutaUsuarioBicicleta
	      .update(filtro, data)
	      .then(function (reg_RutaUsuarioBici) {

	    	var filtro_BiciPikPoint_Origen = {pickpointid: data.PickPointId_Origen,bicicletaid: data.BicicletaId,est_bicicleta:1};
	    	var oDataBiciPikPoint = {
	    		pickpointid: data.PickPointId_Origen,
	    		est_bicicleta : "3",
	    		fec_actualizacion : data.Fec_Actualizacion

	    	};
	      	BicicletaPikPoint
	      		.update(filtro_BiciPikPoint_Origen, oDataBiciPikPoint)
	      		.then(function (reg_BiciPikPoint) {

	      			//OBTENER EL NUMERO DE BICICLETAS DISPONIBLES ACTUAL DEL PIKPOINT
					var vBiciPikPoint_Dis_Des;
					Pikpoint
						.find(
									{PickPointId: data.PickPointId_Destino, Est_Registro: 1},
									{select:['PickPointId','Cnt_Bici_Disponible']}
								 )
						.then(function (resPikPoint){
								vBiciPikPoint_Dis_Des = resPikPoint[0].Cnt_Bici_Disponible + 1;

								//ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES + 1 Y - 1 EN LOS QUE ESTAN LLEGANDO EN EL PIKPOINT DESTINO

								var filtro_Pikpoint_Upd_Des= {
										PickPointId : data.PickPointId_Destino,
								};
								var data_Pikpoint_Upd_Des = {
										Cnt_Bici_Disponible : vBiciPikPoint_Dis_Des
								};
								Pikpoint
									.update(filtro_Pikpoint_Upd_Des,
													data_Pikpoint_Upd_Des)
									.then(function (result){

										//OBTENER EL NUMERO DE BICICLETAS LLEGANDO ACTUAL DEL PIKPOINT
										var vBiciPikPoint_Llegando_Des;
										Pikpoint
											.find(
														{PickPointId: data.PickPointId_Destino, Est_Registro: 1},
														{select:['PickPointId','cnt_bici_llegada']}
													 )
											.then(function (resPikPoint_Lle){
													vBiciPikPoint_Llegando_Des = resPikPoint_Lle[0].cnt_bici_llegada - 1;

													//ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES + 1 Y - 1 EN LOS QUE ESTAN LLEGANDO EN EL PIKPOINT DESTINO

													var filtro_Pikpoint_Lle_Upd_Des= {
															PickPointId : data.PickPointId_Destino,
													};
													var data_Pikpoint_Lle_Upd_Des = {
															cnt_bici_llegada : vBiciPikPoint_Llegando_Des
													};

													Pikpoint
														.update(filtro_Pikpoint_Lle_Upd_Des,
																		data_Pikpoint_Lle_Upd_Des)
														.then(function (result){

															var oDataBiciPikPoint_Ins = {
														 			pickpointid : data.PickPointId_Destino,
														 			bicicletaid  : data.BicicletaId,
														    		est_bicicleta : 0,

														    		est_registro : 1,
														    		fec_registro : data.Fec_Actualizacion
														    };
															BicicletaPikPoint
																.create(oDataBiciPikPoint_Ins, function rutaCreated(err, resp){
																	if(err){
																		return res.serverError(err, 'new');
																	}else{
																		res.json({"Resultado" : "¡Ruta finalizada, gracias por ayudar a mejorar la cuidad!"});
																	}
																});

														})
														.catch(function (err){
															res.negotiate(err);
														});


											})
											.catch(function (err){
												res.negotiate(err);
											});
										//------------ END ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES + 1 Y - 1 EN LOS QUE ESTAN LLEGANDO EN EL PIKPOINT DESTINO
									})
									.catch(function (err){
										res.negotiate(err);
									});


						})
						.catch(function (err){
							res.negotiate(err);
						});
					//------------ END ACTUALIZAR EL NUMERO DE BICICLETAS DIPONIBLES + 1 Y - 1 EN LOS QUE ESTAN LLEGANDO EN EL PIKPOINT DESTINO


	      			/*var filtro_BiciPikPoint_Destino = {pickpointid: data.PickPointId_Origen, bicicletaid:data.BicicletaId};
			    	var oDataBiciPikPoint_Destino = {
			    		pickpointid: data.PickPointId_Destino,
			    		est_bicicleta : "2",
			    		fec_actualizacion : data.Fec_Actualizacion

			    	};
			    	BicicletaPikPoint
			      		.update(filtro_BiciPikPoint_Destino, oDataBiciPikPoint_Destino)
			      		.then(function (reg_BiciPikPointDestino) {


			      			})
				      	.catch(function (err) {
						res.negotiate(err);
				    });*/

				 	//res.ok("oK");

				 	/*var oDataBiciPikPoint_Ins = {
				 			pickpointid : data.PickPointId_Origen,
				 			bicicletaid  : reg_BiciPikPoint.bicicletaid,
				    		est_bicicleta : 1,

				    		est_registro : 1,
				    		fec_registro : data.Fec_Actualizacion
				    };
					BicicletaPikPoint
						.create(oDataBiciPikPoint_Ins, function rutaCreated(err, resp){
							if(err){
								return res.serverError(err, 'new');
							}else{
								//resp.save();
								//res.json(resp);
								res.json({"Resultado" : "¡Ruta finalizada, gracias por ayudar a mejorar la cuidad!"});
							}
						});
						*/
		      	})
		      	.catch(function (err) {
				res.negotiate(err);
		      	});

	      })
	      .catch(function (err) {
		res.negotiate(err);
	      });
  },
  comprobar_enviaje: function(req, res)
	{
		try{

			var data = req.allParams();
			console.log(data);
			var myQuery = "select epb_fnc_ruta_enviaje_sel('"+ JSON.stringify(data)+"') as resultado";
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		return res.json(registros.rows[0]);
				};
			});
		}
		catch(err) {
			return res.json(err.message); 
		}
	},
	pb_pikpoint_set: function(req, res)
	{

		try{

			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			var v_esorigen = data.esorigen ;

			if(v_esorigen == 1){
				
				return res.json({
								  "set_attributes": 
								    {
								      "pp_origen": data.pickpointid, 
								      "pp_origen_nombre": data.nombrepp.replaceAll('_',' ') 

								    },
									"block_names": ["seleccionar bici"],
									"type": "show_block",
									"title": "Elegir Bici!" ,
									"redirect_to_blocks": ["seleccionar bici"]
								}
				);
			}
			if(v_esorigen == 2){
				return res.json({
								  "set_attributes": 
								    {
								      "pp_destino": data.pickpointid, 
								      "pp_destino_nombre": data.nombrepp.replaceAll('_',' ') , 
								      
								    },
									"block_names": ["Confirmar Ruta"],
									"type": "show_block",
									"title": "Confirmar Ruta!" ,
									"redirect_to_blocks": ["Confirmar Ruta"]
								}
				);
			}
		}
		catch(err) {

			var vJsonErr = {
							  "messages": [
							    			{
									       		"text":  err.message, 
							      			} 
							      		  ]
			      			};
			return res.json(vJsonErr); 
		}

		console.log(data);

	},
	
	template_lista_generica_pikpoint: function(req, res)
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			console.log(data);
			var v_esorigen = data.esorigen ;
			var v_MensajeBoton = "";
			var v_UrlPostBack = "";

			if(v_esorigen == 1){
				v_MensajeBoton = "Estoy aquí";
				v_UrlPostBack = urlServidorNodeJs+"ruta/pb_pikpoint_set/1/";
			}
			if(v_esorigen == 2){
				v_MensajeBoton = "Llegaré aquí";
				v_UrlPostBack = urlServidorNodeJs+"ruta/pb_pikpoint_set/2/";
			}

			var vJson_Template=
			{
				"set_attributes": 
			    {
			      "flg_exite_sucursal"	: "0"
			    } ,
				"messages":[
				 	{
				      "attachment":{
				        "type":"template",
				        "payload":{
				          "template_type":"generic",
				          "image_aspect_ratio": "horizontal",
				          "elements":[ ]
				        }
				      } 
				 	}
				]
			}

			var data = req.allParams();

			var myQuery = "select epb_fnc_template_lista_pikpoint_sel('"+ JSON.stringify(data)+"') as resultado";
			
			var vregistros_pikpoint = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_pikpoint = registros.rows[0].resultado; 

			    		for(var i= 0;i < vregistros_pikpoint.length; i++)
						{
							if(vregistros_pikpoint[0].PickPointId != '-1'){
				  				delete vJson_Template['block_names'];
				  				delete vJson_Template['type'];
				  				delete vJson_Template['redirect_to_blocks'];
				  				delete vJson_Template['title'];
				  				delete vJson_Template.messages[0]['text'];

				  				//vJson_Template.messages[0].text = "Ver los siguientes 10 PikPoints:" ;
				  				vJson_Template.set_attributes.flg_exite_sucursal = "1" ;

								var vNombre = vregistros_pikpoint[i].Nombre;
								console.log(vNombre);
							    vJson_Template.messages[0].attachment.payload.elements[i]= {
																				              "title":vregistros_pikpoint[i].Nombre,
																				              "image_url":vregistros_pikpoint[i].url_Imagen_ref,
																				              "subtitle": "Dirección: " + vregistros_pikpoint[i].Nombre + ".\n\nBICIS disponibles: "+ vregistros_pikpoint[i].Cnt_Bici_Disponible,
																				              // "buttons":[
																				              //   {
																				              //     "type":"json_plugin_url",
																				              //     "url": v_UrlPostBack + vregistros_pikpoint[i].PickPointId+ "/"+ vregistros_pikpoint[i].Nombre.replaceAll(' ','_'),
																				              //     "title":v_MensajeBoton,
																				              //     "block_names": ["seleccionar bici"]
																				              //   } 
																				              //]
																				            };
							}else{
								vJson_Template.block_names = "No Existe pp" ;
								vJson_Template.redirect_to_blocks = "No Existe pp" ;
								//vJson_Template.messages[0].text = "Lo siento no tengo más PikPoints ha mostrarte" ;
								vJson_Template.set_attributes.flg_exite_sucursal = "0" ;
								delete vJson_Template.messages[0]['attachment'];
								delete vJson_Template['block_names'];
				  				delete vJson_Template['type'];
				  				delete vJson_Template['redirect_to_blocks'];
				  				delete vJson_Template['title'];
				  				//delete vJson_Template['messages'];

							};
						};

						return res.json(vJson_Template);
				};
			});
		
		}
		catch(err) {
			return res.json(err.message); 
		}
	},
	replies_pb_bicicletaxpikpoint: function(req, res)
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			console.log(data);

			var vJson_Template=
			{
			  "messages": [
			    {
			      /*"attachment": {
			        "type": "template",
			        "payload": {
			          "template_type": "button",
			          "text": "Seleccionar una bibicleta a usar!",
			          "buttons": [  ]
			        }
			      },*/
			      "text":  "🚴🚴🚴🚴",
			      "quick_replies": [
							      	{
							          "title":"Not really...",
							          "url": "https://rockets.chatfuel.com/api/sad-match",
							          "type":"json_plugin_url"
							        }
			      ]

			    }
			  ],
			};
			//
			var myQuery = "select epb_fnc_template_btn_bicicleta_x_pikpoint_sel('"+ JSON.stringify(data)+"') as resultado";
			var vregistros_pikpoint = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_pikpoint = registros.rows[0].resultado; 

			    		for(var i= 0;i < vregistros_pikpoint.length; i++)
						{
							if(vregistros_pikpoint[0].bicicletaid == '-1'){
								vJson_Template.messages[0].text= "No existe bicicletas en este PikPoint, elige otro cercano a ti:"  ;
	     						vJson_Template.messages[0].quick_replies[i]= {
																	          "title":"Ver PikPoints Cerca",
																	          "block_names": ["Pikpoint Cerca"]
																	        };
							}else{
								vJson_Template.messages[0].text= "Es hora de tomar una bici (sólo podras tomar una).\n🚴🚴🚴 \n\nTe pido, antes que todo, REVISES BIEN LA BICI (altura, verificar que las llantas estén infladas, etc.) y estés segur@ de que la tomarás.\n🔧⚙️🔧⚙️ \n\nUna vez que selecciones tu pikpoint destino, no podrás cambiar de BICI. \n🚫🚫🚳🚳" ;
								vJson_Template.messages[0].quick_replies[i]= {
													                  "type":"json_plugin_url",
													                  "url":urlServidorNodeJs+"ruta/bot_pb_bicicletaxpikpoint_set/"+ vregistros_pikpoint[i].bicicletaid+"/"+vregistros_pikpoint[i].Serie.replaceAll(' ','_')+"/"+vregistros_pikpoint[i].clave_candado.replaceAll(' ','_')+"/{{Usuario_Esta_EnRuta}}",
													                  "title": vregistros_pikpoint[i].Serie 
													             } ;
							}

						};

						return res.json(vJson_Template);
				};
			});
		}
		catch(err) {
			return res.json(err.message); 
		}
	},//

	pb_bicicletaxpikpoint_set: function(req, res)
	{

		try{

			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};
			var data = req.allParams();
			console.log(data);

			return res.json(		{
				  "set_attributes": 
				    {
				      "bicicletaid_seleccionado"	: data.bicicletaid, 
				      "bicinombre_seleccionado"		: data.serie.replaceAll('_',' '), 
				      "clave_candado_seleccionado" 	: data.clave_candado.replaceAll('_',' '), 
				    } ,
				    //"block_names": ["PikPoint Destino"],
					//"type": "show_block",
					//"title": "seleccionar Pikpoint Destino!" ,
					//redirect_to_blocks": ["PikPoint Destino"]
					"block_names": ["Select Distrito Des"],
					"type": "show_block",
					"title": "Seleccionar distrito destino!" ,
					"redirect_to_blocks": ["Select Distrito Des"]
				}
			);
		}
		catch(err) {
			return res.json(err.message); 
		}

	},
	insertar_bot_set: function(req, res)
	{
		try{

			var vJson_Template=
			{
			  "messages": [
			    {
			    	"text":"",
			    	"quick_replies":[],
			      	"attachment": {
			        "type": "template",
			        "payload": {
						          "template_type": "button",
						          "text": "¡Enhorabuena, ya estás en ruta!. \nLuego de llegar al pikpoint, asegura y verifica que el candado esté bien cerrado para que otros usuarios puedan encontrar y tomar la bici para sus próximos viajes.\n\nFinalmente presiona el botón ¡YA LLEGUÉ! para confirmar tu llegada.\n\nAnte cualquier eventualidad, comunicate con nosotros por medio de Whatsapp" ,
						          "buttons": [{
								                  "type":"show_block",
								                  "title":"¡YA LLEGUÉ!",
								                  "block_names": ["Yallegue"]
							             }  ]
						        }
			      },

			    }
			  ],
			  "set_attributes": {
			      "RutaUsuarioBicicletaId": ""  ,
			      "Usuario_Esta_EnRuta": "0"  
			    } 
			};

			var data = req.allParams();
			console.log(data);
		
			var myQuery = "select epb_fnc_rutausuariobici_bot_ins('"+ JSON.stringify(data)+"') as resultado";
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			  			if(registros.rows[0].resultado[0].vRutaUsuarioBicicletaId != -1){  //Cuando todo esta bien
				  			delete vJson_Template.messages[0]['text'];
				  			delete vJson_Template.messages[0]['quick_replies'];

			  				console.log(JSON.stringify( registros.rows[0].resultado[0].vRutaUsuarioBicicletaId));
			  				vJson_Template.set_attributes.RutaUsuarioBicicletaId 	= registros.rows[0].resultado[0].vRutaUsuarioBicicletaId;
			  				vJson_Template.set_attributes.Usuario_Esta_EnRuta 		= "1";

			  			}
			  			else{
			  				if( parseInt(registros.rows[0].resultado[0].MsgResultado.split("|")[0]) != -5){ //Cuando hAy un error personalizado

			  					delete vJson_Template.messages[0]['attachment'];
				  				vJson_Template.messages[0].text 			= registros.rows[0].resultado[0].MsgResultado.split("|")[1];
				  				vJson_Template.messages[0].quick_replies[0] =  {
											          								"title"		 : "Iniciar Viaje", 
											          								"block_names": ["Iniciar Manejo"]
											    								};
				  				delete vJson_Template['set_attributes'];
			  				}
			  				if( parseInt(registros.rows[0].resultado[0].MsgResultado.split("|")[0]) == -5){ // Se verificó que esta en ruta

			  					delete vJson_Template.messages[0]['attachment'];
				  				vJson_Template.messages[0].text 						= registros.rows[0].resultado[0].MsgResultado.split("|")[1];
				  				vJson_Template.set_attributes.RutaUsuarioBicicletaId 	= registros.rows[0].resultado[0].MsgResultado.split("|")[2];
							  	vJson_Template.set_attributes.Usuario_Esta_EnRuta 		= "1";
							  	vJson_Template.messages[0].quick_replies[0] 			=  {
														          								"title"		 : "¡YA LLEGUÉ!", 
														          								"block_names": ["Yallegue"]
														    								}; //
				  				//vJson_Template.set_attributes.RutaUsuarioBicicletaId 	= registros.rows[0].resultado[0].vRutaUsuarioBicicletaId;
			  				}

			  			}
						
			    		return res.json(vJson_Template);
				};
			});
		}
		catch(err) {
			return res.json(err.message); 
		}
	},
	//
	categoria_ruta_bot_upd: function (req, res) { // Permite al Biker ingresar una categoria para la ruta seleccionada

		try{
			var vJson_Template=
			{
			  "set_attributes": {
			      "CategoriaRutaValId": ""   
			    },
			    "messages": [
	   							{
	   								"text": "Gracias",
	   								"quick_replies":[]
	   							}
	 						],
				"block_names": ["menu pikbik"],
				"type": "show_block",
				"title": "." ,
				"redirect_to_blocks": ["menu pikbik"]
			};

			var data = req.allParams();
			console.log(data);
			var myQuery = "select epb_fnc_RutaUsuarioBicicleta_bot_upd('"+ JSON.stringify(data)+"') as resultado";
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			  			 if(registros.rows[0].resultado[0].resultado.indexOf('AudioTexo') >=0 ){
			  			 	
			  			 	delete vJson_Template['block_names'];
			  			 	delete vJson_Template['type'];
			  			 	delete vJson_Template['title'];
			  			 	delete vJson_Template['redirect_to_blocks'];
			  			 	//delete vJson_Template['set_attributes'];
			  			 	vJson_Template.set_attributes.CategoriaRutaValId = data.categoriarutavalid;
			  				vJson_Template.messages[0].text = "Puedes escribirla aquí o enviarme un audio";
			  				vJson_Template.messages[0].quick_replies[0] =  {
										          								"title"		 : "Quiero Escribirte", 
										          								"block_names": ["Quiero escribirte"]
										    								};
			  				vJson_Template.messages[0].quick_replies[1] =  {
										          								"title"		 : "Te dejaré Audio", 
										          								"block_names": ["Te dejaré Audio"]
										    								};
			  			 }else{
			  			 	delete vJson_Template.messages[0]['quick_replies'];
			  				vJson_Template.messages[0].text = "Gracias";
			  			 }

			    		return res.json(vJson_Template);
				};
			});
	    }
		catch(err) {
			return res.json(err.message); 
		}
	},

	rutapikpoint_llegada_bot: function (req, res) {

		try{

		    var vJson_Template=
			{
			  	"set_attributes": {
			      "Usuario_Esta_EnRuta" : "1",
			      "RutaUsuarioBicicletaId" : "0" 
			    },
			    "messages": [
	   							{
	   								"text": "Gracias",
	   								"quick_replies":[]
	   							}
	 						],
	 		    //"block_names": ["menu pikbik"],
				// "type": "show_block",
				// "redirect_to_blocks": ["menu pikbik"]

			};

			var data = req.allParams();
			console.log(data);
		
			var myQuery = "select epb_fnc_rutausuariobici_llegada_bot_ins('"+ JSON.stringify(data)+"') as resultado";
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			  			var vResultado = registros.rows[0].resultado[0].MsgResultado;

			  			if( parseInt(vResultado.split("|")[0]) >= 0){
				  			delete vJson_Template['block_names'];
				  			delete vJson_Template['type'];
				  			delete vJson_Template['redirect_to_blocks'];

							vJson_Template.set_attributes.Usuario_Esta_EnRuta = "0";
							vJson_Template.set_attributes.RutaUsuarioBicicletaId = "0";

			    			return res.json(vJson_Template);
			  			}
			  			else {

			  				//if(data.flg_ruta_incompleta == 0){

			  					// delete vJson_Template['block_names'];
				  				// delete vJson_Template['type'];
				  				// delete vJson_Template['redirect_to_blocks'];

				  				if(parseInt(vResultado.split("|")[0]) = -5){ //
									vJson_Template.set_attributes.Usuario_Esta_EnRuta = "0";
									vJson_Template.set_attributes.RutaUsuarioBicicletaId = "0";

				  					vJson_Template.messages[0].text 			= vResultado.split("|")[1];
				  					delete vJson_Template.messages[0]['quick_replies'];
									return res.json(vJson_Template);
				  				}
				  				else{

									vJson_Template.set_attributes.Usuario_Esta_EnRuta = "1";
									delete vJson_Template.set_attributes["RutaUsuarioBicicletaId"]  ;

				  					vJson_Template.messages[0].text 			= vResultado.split("|")[1];
				  					vJson_Template.messages[0].quick_replies[0] =  {
											          								"title"		 : "¡YA LLEGUÉ!", 
											          								"block_names": ["Yallegue"]
											    								};
				  					//delete vJson_Template['set_attributes'];
									return res.json(vJson_Template);
					  				//vJson_Template.set_attributes.RutaUsuarioBicicletaId 	= registros.rows[0].resultado[0].vRutaUsuarioBicicletaId;
				  				}
			  			// 	}else{
			  			// 		delete vJson_Template['block_names'];
				  		// 		delete vJson_Template['type'];
				  		// 		delete vJson_Template['redirect_to_blocks'];
			  			// 		vJson_Template.set_attributes.Usuario_Esta_EnRuta = "0";
								// vJson_Template.set_attributes.RutaUsuarioBicicletaId = "0";
								// vJson_Template.messages[0].text 			= "Gracias, todos somos participes en este cambio";
				  		// 		delete vJson_Template.messages[0]['quick_replies'];
								// return res.json(vJson_Template);
			  			// 	}
		  				}
			  			
				};
			});
	    }
		catch(err) {
			return res.json(err.message); 
		}
  	},//
	template_lista_generica_distrito_pp: function(req, res)
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};
			var data = req.allParams();
			console.log(data);
			var v_esorigen = data.esorigen ;
			var v_MensajeBoton = "";
			var v_UrlPostBack = "";

			var vJson_Template=
			{
			  	"messages": [
			    {
			      /*"attachment": {
			        "type": "template",
			        "payload": {
			          "template_type": "button",
			          "text": "Seleccionar una bibicleta a usar!",
			          "buttons": [  ]
			        }
			      },*/
			      
			      "text":  "Seleccionar Distrito ",
			      "quick_replies": [
							      	{
							          "title":"Not really...",
							          "url": "https://rockets.chatfuel.com/api/sad-match",
							          "type":"json_plugin_url"
							        }
			      ]

			    }
			  ],
			};
			//
			if(v_esorigen == 1){
				vJson_Template.messages[0].text= "Seleccionar distrito a consultar" ;
			}
			if(v_esorigen == 2){
				vJson_Template.messages[0].text= "Seleccionar Distrito de Llegada" ;
			}
			//
			var myQuery = "select epb_fnc_template_lista_distrito_pp_sel() as resultado";
			var vregistros_distritos = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_distritos = registros.rows[0].resultado; 

			    		for(var i= 0;i < vregistros_distritos.length; i++)
						{
							if(vregistros_distritos[0].bicicletaid == '-1'){

								vJson_Template.set_attributes.url_paginacion_distrito = ""  ;
	     						vJson_Template.messages[0].quick_replies[i]= {
																	          "title":"Regresar Menu",
																	          "block_names": ["menu pikbik"]
																	        };
							}else{
									if(v_esorigen == 1){

										vJson_Template.messages[0].quick_replies[i]= {
																	                  "title":vregistros_distritos[i].Des_Distrito,
																	                  "type":"json_plugin_url",
																	                  "url": urlServidorNodeJs+"ruta/pb_distrito_pp_set/1/"+vregistros_distritos[i].Des_Distrito.replaceAll(' ','_'),
																	             	} ;
									}
									if(v_esorigen == 2){

										vJson_Template.messages[0].quick_replies[i]= {
																	                  "type":"json_plugin_url",
																	                  "url": urlServidorNodeJs+"ruta/pb_distrito_pp_set/2/"+vregistros_distritos[i].Des_Distrito.replaceAll(' ','_'),
																	                  "title":vregistros_distritos[i].Des_Distrito
																	             	} ;
									}

							}

						};

						return res.json(vJson_Template);
				};
			});
		
		}
		catch(err) {
			return res.json(err.message); 
		}
	},

	pb_distrito_pp_set: function(req, res)
	{

		try
		{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};
			var data = req.allParams();
			var v_esorigen = data.esorigen ;

			if(v_esorigen == 1){
				
				return res.json({
								  	"set_attributes": 
								    { 
								      "pp_distrito_origen_nombre": data.nombredistritopp.replaceAll('_',' ') ,
								      "pp_distrito_origen_nombre_set": data.nombredistritopp,

								    },
									"block_names": ["Seleccionar PikPoint"],
									"type": "show_block",
									"title": "Elegir PikPoint!" ,
									"redirect_to_blocks": ["Seleccionar PikPoint"]
								}
				);
			}
			if(v_esorigen == 2){
				return res.json({
								  "set_attributes": 
								    { 
								      "pp_distrito_destino_nombre": data.nombredistritopp.replaceAll('_',' ') , 
								      "pp_distrito_destino_nombre_set": data.nombredistritopp
								      
								    },
									"block_names": ["PikPoint Destino"],
									"type": "show_block",
									"title": "Elegir Pikpoint Destino!" ,
									"redirect_to_blocks": ["PikPoint Destino"]
								}
				);
			}
		}
		catch(err) {
			return res.json(err.message); 
		}
		console.log(data);

	},

	bot_lista_pikpoint_x_geodistancia: function(req, res)
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			console.log(data);
			var v_esorigen = data.esorigen ;
			var v_MensajeBoton = "";
			var v_UrlPostBack = "";

			if(v_esorigen == 1){
				v_MensajeBoton = "Estoy aquí";
				v_UrlPostBack = urlServidorNodeJs+"ruta/bot_pikpoint_set/1/";
			}
			if(v_esorigen == 2){
				v_MensajeBoton = "Llegaré aquí";
				v_UrlPostBack = urlServidorNodeJs+"ruta/bot_pikpoint_set/2/";
			}

			var vJson_Template=
			{
			  "messages":[
			    { 
			      "text": "",
			      "quick_replies":[],
			      "attachment":{
			        "type":"template",
			        "text":"What do you want to do next?",
			        "payload":{
			          "template_type":"generic",
			          "image_aspect_ratio": "horizontal",
			          "elements":[ ]
			        }
			      } 
			    }
			  ]
			};

			var data = req.allParams();

			var myQuery = "select epb_fnc_bot_lista_pikpoint_geoposicion_sel('"+ JSON.stringify(data)+"') as resultado";
			
			var vregistros_pikpoint = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_pikpoint = registros.rows[0].resultado; 

			    		for(var i= 0;i < vregistros_pikpoint.length; i++)
						{
							if(vregistros_pikpoint[0].PickPointId != '-1'){

								var vNombre = vregistros_pikpoint[i].Nombre;
								console.log( JSON.stringify(vregistros_pikpoint[i]));
								delete vJson_Template.messages[0]['quick_replies'];
								delete vJson_Template.messages[0]['text'];
								//vJson_Template.messages[0].text= "{{first name}}, en un radio de 1.5 Km tenemos estos pikpoints que cuentan con al menos con 1 bicicleta disponible. /n Por favor, dirigete hacia el pikpoint de donde deseas tomar una bici./n  Luego de que hayas llegado, indicanos que ya estás ahí. /n 👇👇"
							    vJson_Template.messages[0].attachment.payload.elements[i]= {
																				              "title":vregistros_pikpoint[i].Nombre,
																				              "image_url":vregistros_pikpoint[i].url_Imagen_ref,
																				              "subtitle": "Dir.: " + vregistros_pikpoint[i].Nombre + ".\n\nBICIS: "+ vregistros_pikpoint[i].Cnt_Bici_Disponible + ".\n\nCercanía: "+vregistros_pikpoint[i].cercaniametros+ " metros.",
																				              "buttons":[
																				                {
																				                  "type":"json_plugin_url",
																				                  "url": v_UrlPostBack + vregistros_pikpoint[i].PickPointId+ "/"+ vregistros_pikpoint[i].Nombre.replaceAll(' ','_')+ "/{{Usuario_Esta_EnRuta}}",
																				                  "title":v_MensajeBoton,
																				                  "block_names": ["seleccionar bici"]
																				                } 
																				              ]
																				            };
							}
							else{
								vJson_Template.messages[0].text= "No existe PikPoint Cercanos para ubicacion enviada, ¿Qué deseas Hacer?"  ;
								delete vJson_Template.messages[0]['attachment'];
								//delete vJson_Template.messages[0]['quick_replies'];
								vJson_Template.messages[0].quick_replies[0] =  {
											          								"title":"Elegir Ubicación", 
											          								"block_names": ["Enviar Ubicación"]
											    								};
								vJson_Template.messages[0].quick_replies[1] =  {
																			       "title":"Regresar Menu",
																			       "block_names": ["menu pikbik"]
																			    };
							}
							;
						};

						return res.json(vJson_Template);
				};
			});
		
		}
		catch(err) {
			var vJsonErr = {
				  "messages": [
				    			{
						       		"text":  err.message
				      			} 
				      		  ]
	  			};
			return res.json(err.message); 
		}
	},

	bot_pikpoint_set: function(req, res)
	{

		try{

			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			var v_esorigen = data.esorigen ;

			if(data.usuario_esta_enruta == 1){

				return res.json({
					"block_names": ["YaEstaEnRuta"],
					"type": "show_block", 
					"redirect_to_blocks": ["YaEstaEnRuta"]
				});
			}
			else{

				if(v_esorigen == 1){
					
					return res.json({
									  "set_attributes": 
									    {
									      "pp_origen": data.pickpointid, 
									      "pp_origen_nombre": data.nombrepp.replaceAll('_',' ') 

									    },
										"block_names": ["seleccionar bici"],
										"type": "show_block", 
										"redirect_to_blocks": ["seleccionar bici"]
									}
					);
				}
				if(v_esorigen == 2){
					return res.json({
									  "set_attributes": 
									    {
									      "pp_destino": data.pickpointid, 
									      "pp_destino_nombre": data.nombrepp.replaceAll('_',' ') , 
									      
									    },
										"block_names": ["Confirmar Ruta"],
										"type": "show_block",
										"title": "Confirmar Ruta!" ,
										"redirect_to_blocks": ["Confirmar Ruta"]
									}
					);
				};
			};
		}
		catch(err) {
			var vJsonErr = {
				  "messages": [
				    			{
						       		"text":  err.message, 
				      			} 
				      		  ]
	  			};
			return res.json(vJsonErr); 
		}

		console.log(data);

	},
	bot_pb_bicicletaxpikpoint_set: function(req, res)
	{
		try{

			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};
			var data = req.allParams();
			console.log(data);

			if(data.usuario_esta_enruta == 1){

				return res.json({
					"block_names": ["YaEstaEnRuta"],
					"type": "show_block", 
					"redirect_to_blocks": ["YaEstaEnRuta"]
				});

			}else{

				return res.json(		{
					  "set_attributes": 
					    {
					      "bicicletaid_seleccionado": data.bicicletaid, 
					      "bicinombre_seleccionado": data.serie.replaceAll('_',' '), 
					      "clave_candado_seleccionado" :data.clave_candado.replaceAll('_',' '), 
					    } ,
					    //"block_names": ["PikPoint Destino"],
						//"type": "show_block",
						//"title": "seleccionar Pikpoint Destino!" ,
						//redirect_to_blocks": ["PikPoint Destino"]
						"block_names": ["Ubicación Destino"],
						"type": "show_block",
						//"title": "seleccionar Distrito Destino!" ,
						"redirect_to_blocks": ["Ubicación Destino"]
					}
				);
			}


		}
		catch(err) {
			return res.json(err.message); 
		}

	},

	bot_lista_pikpoint_x_geodistancia_val: function(req, res)
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			console.log(data);
			var v_esorigen = data.esorigen ;
 
			var vJson_Template=
			{
				"messages":[
				    { 
				      "text": "",
				      "quick_replies":[]
				       
				    }
				  ]
			    ,
				"block_names": ["Pikpoint Cerca"],
				"type": "show_block",
				"redirect_to_blocks": ["Pikpoint Cerca"]
			};

			var data = req.allParams();

			var myQuery = "select epb_fnc_bot_lista_pikpoint_geoposicion_sel('"+ JSON.stringify(data)+"') as resultado";
			
			var vregistros_pikpoint = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_pikpoint = registros.rows[0].resultado; 

			    		for(var i= 0;i < vregistros_pikpoint.length; i++)
						{
							if(vregistros_pikpoint[0].PickPointId != '-1'){

								delete vJson_Template['messages'];
								vJson_Template.block_names[0]  = "Pikpoint Cerca";
								vJson_Template.redirect_to_blocks[0]  = "Pikpoint Cerca";
								 
							}
							else{

								vJson_Template.messages[0].text= "No existe PikPoint Cercanos para ubicacion enviada, ¿Qué deseas Hacer?"  ;
								delete vJson_Template['block_names'];
								delete vJson_Template['type'];
								delete vJson_Template['redirect_to_blocks'];
								vJson_Template.messages[0].quick_replies[0] =  {
											          								"title":"Elegir Ubicación", 
											          								"block_names": ["Ubicación Origen"]
											    								};
								vJson_Template.messages[0].quick_replies[1] =  {
																			       "title":"Regresar Menu",
																			       "block_names": ["menu pikbik"]
																			    }; 
							}
							;
						};

						return res.json(vJson_Template);
				};
			});
		
		}
		catch(err) {
			var vJsonErr = {
				  "messages": [
				    			{
						       		"text":  err.message
				      			} 
				      		  ]
	  			};
			return res.json(err.message); 
		}
	},
	bot_leerQR: function (req, res) { // Permite al Biker ingresar una categoria para la ruta seleccionada

  		var path = require("path");
		var pdata = req.allParams();

		console.log(pdata); 

		var fs = require('fs'),
		request = require('request'),
		http = require('http'),
		https = require('https');

		var Stream = require('stream').Transform;

		var vFilename = 'qr_'+ pdata.UsuarioId+ '_' +fc_NombreArchivo()+'.jpg';
		var vPath = 'assets/images/';
		var vPathDropBox = '/QRFiles/';

		downloadImageToUrl = (url, filename, callback) => {

		    var client = http;
		    if (url.toString().indexOf("https") === 0){
		      client = https;
		     }

		     try {
			    
			    client.request(url, function(response) {                                        
			      var data = new Stream();                                                    

			      response.on('data', function(chunk) {                                       
			         data.push(chunk);                                                         
			      });                                                                         

			      response.on('end', function() {     

			        fc_UploadFile(data.read(), res,vPathDropBox + vFilename,0);                                       

			        //fs.writeFileSync(filename, data.read());   


			        //fs.readFile(vPath + vFilename, function read(err, datastream) {
						//     if (err) {
						//       throw err;
						//       }
					 //      	console.log(datastream);
					 //    	fc_UploadFile(datastream, res,vPathDropBox + vFilename,0);
					 // });                            
			    });  


			   }).end();
			}
			catch(err) {
				return res.json(err.message); 
			}

		};

		downloadImageToUrl(pdata.imgQR, vPath+vFilename);

	},

	bot_verificar_enruta_set: function(req, res) 
	{

		try{
			String.prototype.replaceAll = function (find, replace) {
			    var str = this;
			    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
			};

			var data = req.allParams();
			console.log(data);
			var v_esorigen = data.esorigen ;
 
			var vJson_Template=
			{
			  "set_attributes": {
			      "Usuario_Esta_EnRuta": "0"   
			    },
			    "messages": [
	   							{
	   								"text": "",
	   								"quick_replies":[]
	   							} 
	 						]
			};

			var data = req.allParams();

			var myQuery = "select epb_fnc_ruta_enviaje_sel('"+ JSON.stringify(data)+"') as resultado";
			
			var vregistros_pikpoint = [];
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
			    		vregistros_pikpoint = registros.rows[0].resultado; 

			    		if(vregistros_pikpoint.vRutaUsuarioBicicletaId != '-1'){

								vJson_Template.set_attributes.Usuario_Esta_EnRuta  = "1"; //Si esta en ruta
								delete vJson_Template['messages'];

								//vJson_Template.messages[0].text = "{{first name}} ya estás en viaje, no te olvides avisarnos al llegar a tu destino presionando el boton !YA LLEGUE!|";
								//vJson_Template.messages[0].quick_replies = {
								//								                  "type":"show_block",
								//								                  "title":"¡YA LLEGUE!",
								//								                  "block_names": ["Yallegue"]
								//							             };
						}
						else{

							delete vJson_Template['messages'];
							vJson_Template.set_attributes.Usuario_Esta_EnRuta  = "2";
						}
						;

						return res.json(vJson_Template);
				};
			});
		
		}
		catch(err) {
			var vJsonErr = {
				  "messages": [
				    			{
						       		"text":  err.message
				      			} 
				      		  ]
	  			};
			return res.json(err.message); 
		}
	},
	bot_QR_Set: function (req, res) { // Permite al Biker ingresar una categoria para la ruta seleccionada

  		var path = require("path");
  		
  		try
  		{
			var vJson_Template=
			{
				  "set_attributes": 
				    {
				      "bicicletaid_seleccionado": "", 
				      "bicinombre_seleccionado": "", 
				      "clave_candado_seleccionado" :"", 
				      "pp_origen" :"", 
				      "pp_origen_nombre" : ""
				    } ,
				    "messages": [
		   							{
		   								"text": "" 
		   							} 
	 				],
					"block_names": ["Ubi Destino QR"],
					"type": "show_block",
					"redirect_to_blocks": ["Ubi Destino QR"]
			};


			var pdata = req.allParams();

			var myQuery = "select epb_fnc_qr_bicipikpoint_sel('"+ JSON.stringify(pdata)+"') as resultado";

			var vregistros = [];
				Usuario.query(myQuery, function (err, registros){
					if(err){
							res.json({resultado:"Sin data"});
				    		return res.json(err);
				  	}
				  	else{
				    		vregistros = registros.rows[0].resultado; 

				    		for(var i= 0;i < vregistros.length; i++)
							{
								if(vregistros[0].pickpointid != '-1'){

								vJson_Template.set_attributes.bicicletaid_seleccionado  = vregistros[0].bicicletaid;  
								vJson_Template.set_attributes.bicinombre_seleccionado  = vregistros[0].Serie;    
								vJson_Template.set_attributes.clave_candado_seleccionado  = vregistros[0].clave_candado;   
								vJson_Template.set_attributes.pp_origen  =  vregistros[0].pickpointid;    
								vJson_Template.set_attributes.pp_origen_nombre  =  vregistros[0].Nombre;    
								vJson_Template.messages[0].text  = "Has seleccionado a " + vregistros[0].Serie + " \n\n🔥🔥🔥🤩🤩🤩🔥🔥🔥";   
 
								}
								else{

								    vJson_Template.messages[0].text  = "Lo siento 😞😞, no he reconocido la imagen, por favor toma otra";  
									vJson_Template.redirect_to_blocks  = "LeerQR";
									vJson_Template.block_names[0]  = "LeerQR";
									//delete vJson_Template['messages'];

								}
								;
							}

							return res.json(vJson_Template);
					};
				});
 
		}
		catch(err) {
			var vJsonErr = {
				  "messages": [
				    			{
						       		"text":  err.message
				      			} 
				      		  ]
	  			};
			return res.json(err.message); 
		}
	},

};

