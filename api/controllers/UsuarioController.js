/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing Usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	insertar: function(req, res){

		var data = req.allParams();
		Usuario
			.create(data)
			.then(function(registros){

				try
				{
		        	var helper = require('../util_modules/lib/util');

			        //Correo a Usuario Nuevo
			        var body = "\<p>Estimado (a) <strong> " + data.Pri_Nombre + " \</strong></p>" +
			          "\<p> Agradecemos su gentil preferencia.</p>" ;

			        helper.sendMail('PIKBIK@gmail.com', data.email, 'PIKBIK', body);

			        //Correo a Peluka
			        body = "\<p>¡Hay un nuevo USUARIO!</p><br>"
			          + "\<br> Usuario: " + data.Pri_Nombre + " " + data.Appe_Paterno
			          + "\<br> Correo: " + data.email;

			        helper.sendMail('PIKBIK@gmail.com', 'a.nelsoncn@gmail.com', 'PIKBIK - Usuario Nuevo', body);

		        }
		        catch(e)
		        {
		        	
		        }
				
				res.json({usuario: [{ UsuarioId: registros.UsuarioId,
										email:registros.email,
										Pri_Nombre: registros.Pri_Nombre,
										Appe_Paterno:registros.Appe_Paterno,
										Appe_Materno:registros.Appe_Materno,
										TipDoc_Identidad: registros.TipDoc_Identidad,
										NumDoc_Identidad: registros.NumDoc_Identidad,
										Fec_Registro: registros.Fec_Registro}]} );
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},
	usuarioxEmail: function(req, res)
	{
		var data = req.allParams();
		Usuario
			.find(
						{email: data.pEmail, Est_Registro: 1},
						{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

					 )
			.then(function(registros){
				if(registros.length>0)
				{
					res.json({usuario: registros});
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
	usuarioxPrueba: function(req, res)
	{
		var data = req.allParams();

			var myQuery = "select ePB_Fnc_PikBik_Prueba_Sel() as Pri_Nombre3";

			Usuario.query(myQuery, function (err, registros){
				if(err){
			    		return res.json(err);
			  	}
			  	else{
			    		return res.json(registros.rows[0]);
			};
		});
	},
	autentificacion: function (req, res) {
	    var data = req.allParams(); 

	    Usuario
			.find(
					{
						email  			: data.email, 
						Est_Registro	: 1
					},
					{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

				 )
			.then(function(registros){
				
				if(registros.length>0)
				{
					Usuario
						.find(
								{
									email  			: data.email,
			    					password		: data.password,
			    					Est_Registro	: 1
			    				},
								{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

							 )
						.then(function(registros2){

							if(registros2.length>0)
							{
								res.json({resultado:"OK",usuario: registros2});
							}
							else
							{
								res.json({resultado:"Autenticación erronea"});
							}

						})
						.catch(function(err){
							res.negotiate(err);
						});	
				}
				else
				{
					res.json({resultado:"No existe este usuario"});
				}

			})
			.catch(function(err){
				res.negotiate(err);
			});	

	    		

	},
	insertarValidacion: function(req, res)
	{
		var data = req.allParams();

		var myQuery = "select ePB_Fnc_Usuario_Ins_Val('"+ JSON.stringify(data)+"') as resultado";
		Usuario.query(myQuery, function (err, registros){
			if(err){
					res.json({Resultado:"No existe este usuario"});
		    		return res.json(err);
		  	}
		  	else{
		    		return res.json(registros.rows[0]);
			};
		});
	},
	autentificacionencriptado: function (req, res) {
	    var data = req.allParams(); 

	    Usuario
			.find(
					{
						email  			: data.email, 
						Est_Registro	: 1
					},
					{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

				 )
			.then(function(registros){
				
				if(registros.length>0)
				{
					Usuario
						.find(
								{
									email  			: data.email,
			    					password		: data.password,
			    					Est_Registro	: 1
			    				},
								{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

							 )
						.then(function(registros2){

							if(registros2.length>0)
							{
								res.json({resultado:"OK",usuario: registros2});
							}
							else
							{
								res.json({resultado:"Autenticación erronea"});
							}

						})
						.catch(function(err){
							res.negotiate(err);
						});	
				}
				else
				{
					res.json({resultado:"No existe este usuario"});
				}

			})
			.catch(function(err){
				res.negotiate(err);
			});	
	},

	autentificacion_bot: function (req, res) {

		var vResultado= "";
		var vJson_Template=
		{
		  "messages": [
		    {"text": ""},
		  ],
		  "set_attributes": {
		      "UsuarioId": "0"   
		    },
		    "block_names": ["PikPoint Destino"], 
			"redirect_to_blocks": ["PikPoint Destino"]
		};


	    var data = req.allParams(); 

	    Usuario
			.find(
					{
						email  			: data.usuario_email, 
						Est_Registro	: 1
					},
					{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

				 )
			.then(function(registros){
				
				if(registros.length>0)
				{
					Usuario
						.find(
								{
									email  			: data.usuario_email,
			    					password		: data.usuario_pass,
			    					Est_Registro	: 1
			    				},
								{select:['UsuarioId','email','Pri_Nombre','Appe_Paterno','Appe_Materno','TipDoc_Identidad','NumDoc_Identidad','Fec_Registro']}

							 )
						.then(function(registros2){

							if(registros2.length>0)
							{
								vResultado = "OK";
								vJson_Template.messages[0].text = "";
								vJson_Template.set_attributes.UsuarioId = registros2[0].UsuarioId;
								vJson_Template.redirect_to_blocks[0]  = "Antes Iniciar PikBik";

								res.json(vJson_Template);
							}
							else
							{
								vResultado = "Autenticación erronea";
								vJson_Template.set_attributes.UsuarioId = "0";
								vJson_Template.messages[0].text = vResultado;
								vJson_Template.redirect_to_blocks[0] = "No autentificado";
								res.json(vJson_Template);
							}

						})
						.catch(function(err){
							res.negotiate(err);
						});	
				}
				else
				{
					if(data.usuario_email!= "" || data.usuario_email != "0"){
						vResultado = "No existe este email"; 
					}
					else{
						vResultado = ""; 
					}
					//vResultado = "No existe este email"; 
					vJson_Template.messages[0].text = vResultado;
					vJson_Template.set_attributes.UsuarioId = "0";
					vJson_Template.redirect_to_blocks[0]  = "No autentificado";
					res.json(vJson_Template);
				}

			})
			.catch(function(err){
				res.negotiate(err);
			});	

	    		

	},
};

