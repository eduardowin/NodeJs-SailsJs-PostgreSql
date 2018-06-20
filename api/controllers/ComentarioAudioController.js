/**
 * ComentarioAudioController
 *
 * @description :: Server-side logic for managing 
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 	function fc_UploadFile(file, res,pathDropBox, filename, tipo) {
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
						if(tipo == 2 ){
							var vJson_Template=
								{
								  "set_attributes": {
								      "Nom_ArchivoAudio": infoShared['sharedUrl']  
								    } 
								};
							return res.json(vJson_Template);
						}
						else{
							//fc_ObtenerQR_Online(infoShared,res);
						};

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
	 
	bot_registro_comentario_audio: function (req, res) {

		try{

		    var vJson_Template=
			{
			  	 
			    "messages": [
	   							{
	   								"text": "{{first name}} Gracias!,\npara usar de nuevo el sistema Pikbik, click en botón 'Volver a Inicio'",
	   								"quick_replies":[
	   													{
					          								"title":"Volver a Inicio", 
					          								"block_names": ["menu pikbik"]
					    								}

	   								], 
	   							}
	 						],

			};

			var data = req.allParams();
			console.log(data);
		
			var myQuery = "select epb_fnc_ComentarioAudio_ins('"+ JSON.stringify(data)+"') as resultado";
			Usuario.query(myQuery, function (err, registros){
				if(err){
						res.json({resultado:"Sin data"});
			    		return res.json(err);
			  	}
			  	else{
				  		return res.json(vJson_Template);
				};
			});
	    }
		catch(err) {
			return res.json(err.message); 
		}
  	},
  	bot_UpLoad_Audio_Recomendacion: function (req, res) { // Permite al Biker ingresar una categoria para la ruta seleccionada

  		var path = require("path");
  		
		var vJson_Template=
		{
		  "set_attributes": {
		      "Nom_ArchivoAudio": ""   
		    },
		    "messages": [
   							{"text": " "} 
 						]
		};


		var pdata = req.allParams();

		console.log(pdata); 

		var fs = require('fs'),
		request = require('request'),
		http = require('http'),
		https = require('https');

		var Stream = require('stream').Transform;

		var vFilename ='audio'+ '_' + pdata.UsuarioId+ '_' + fc_NombreArchivo()+'.mp4';
		var vPath = 'assets/images/';
		var vPathDropBox = '/AudiosFiles/';

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
			         fs.writeFileSync(filename, data.read());   


			         fs.readFile(vPath + vFilename, function read(err, datastream) {
						    if (err) {
						      throw err;
						      }
					      	console.log(datastream);
					    	fc_UploadFile(datastream, res,vPathDropBox , vFilename,2);
					  });                            
			      });  


			   }).end();
			}
			catch(err) {
				return res.json(err.message); 
			}

		};

		downloadImageToUrl(pdata.Rec_Audio, vPath+vFilename);
 
		//downloadImageToUrl(pdata.imgQR, 'assets/images/qr_2142.jpg');

		 //return res.json(nombre);

	},
	 
};
