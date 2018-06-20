/**
 * CategoriaRutaValController
 *
 * @description :: Server-side logic for managing Bicicletas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//lServidorNodeJs = "https://apppikbikprueba1.herokuapp.com/";
var urlServidorNodeJs = "http://104.236.84.68:8083/";
module.exports = {
	 
	listar: function(req, res){
		CategoriaRutaVal
			.find({Est_Registro: 1})
			.sort({Des_CategoriaRuta: "ASC"})
			.then(function(registros){
				res.json({registros: registros});
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},
	listar_bot: function(req, res){

		var data = req.allParams();

		var vJson_Template={
		  "messages":[
		    {
		      "attachment":{
		        "type":"template",
		        "payload":{
		          "template_type":"generic",
		          "elements":[
		             
		          ]
		        }
		      }
		    }
		  ]
		}
 
		CategoriaRutaVal
			.find({Est_Registro: 1})
			.sort({Des_CategoriaRuta: "ASC"})
			.then(function(registros){

					// console.log(registros);
					for(var i= 0;i < registros.length; i++)
					{
					      vJson_Template.messages[0].attachment.payload.elements[i]= { 
					      																  "title": registros[i].Des_CategoriaRuta ,
					 													                  "image_url": "",
					 													                  "subtitle":"",
					 													                  "image_aspect_ratio": "square",
					 													                  "buttons":[
																			                {
																			                  "type":"json_plugin_url",
																			                  "url": urlServidorNodeJs+"ruta/categoria_ruta_bot_upd/"+ data.rutaUsuariobicicletaid+"/"+ registros[i].CategoriaRutaValId  ,
																			                  "title": "Seleccionar"
																			                } 
																			              ]
																		             } ;
					};

				res.json(vJson_Template);
			})
			.catch(function(err){
				res.negotiate(err);
			});
	},

	 
};
