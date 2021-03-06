var options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12:"false"};

var index = function(){

	var login = function(e){
		e.preventDefault();
		$.ajax({
			type:'POST',
			url:'usuarios/login',
			data:$("#form-login").serialize(),
			dataType: 'json',
			success:function(respJson){
				if(respJson.rpt){
					location.href="home";
				}
				else{
					$("#form-login .callout-danger p").html(respJson.data);
					$("#form-login .callout-danger").show();
					$("#form-login input").val('');
					$("#form-login input[type=text]").focus();
				}
			},
			error : function(jqXHR,status,error){
				console.log(error);
			}
		});
	};

	var enviar=function(){
		$.ajax({
			type:'POST',
			url:'usuarios/add',
			data:$("#form-registro").serialize(),
			dataType:'json',
			success:function(respJson){
				if(respJson!==null){
					if(respJson){
						location.href="usuarios/registro_exitoso"
					}
				}
			},
			error:function(jqXHR,status,error){
				console.log(error);
			}
		});
	};

	(function(){
		$("#btn-login").on('click',login);
		$("#btn-enviar").on('click',enviar);
	})();


};


var home = function(){

	var archivos = [];
	var _ubicacion = {};
	
    var socket = io();

	var init = function(){
		//iCheck for checkbox and radio inputs
		$('input[type="radio"].minimal-red').iCheck({
		  radioClass: 'iradio_square-red'
		});
		$('input[type="radio"].minimal-green').iCheck({
		  radioClass: 'iradio_square-green'
		});
		$('input[type="radio"].minimal-yellow').iCheck({
		  radioClass: 'iradio_square-yellow'
		});

		$("input[type=radio].minimal").on('ifChanged',changeRadioTipoIncidencia);

		$("#form-registro-grupo").on('submit',registroGrupo);
		$("#btn-registro-grupo").on('click',function(){
			$("#form-registro-grupo").submit();
		});
		$("#link-upload").on('click',function(){
			$("input[name=files-evidencias]").trigger('click');
		});
		$("input[name=files-evidencias]").on('change',previewFoto);
		$("#btn-publicar").on('click',publicarIncidencia);
		$("#select-modoUsuario a").on('click',changeModoUsuario);
		
		$("#btn-registro-denuncia").on('click',function(){
			location.href="denuncias/registro_denuncia"
		});

		var content = document.getElementById("maps_content");
		var search = document.getElementById("maps_search");
		mapsSearch({content : content , search : search}, function(err, ubicacion){
			if(err) alert(err);
			_ubicacion = ubicacion;
			$("#lbl-ubicacion").text(ubicacion.direccion);
			$("#modal_maps").modal('hide');
		});

		listarGruposUsuario();
		listarIncidencias(false);

		socket.on('nueva incidencia' , showIncidencia);
	};

	
	var registroGrupo = function(e){
		e.preventDefault();
		$.ajax({
			type : 'POST',
			url : 'grupos/registro',
			data:$("#form-registro-grupo").serialize(),
			dataType:'json',
			success: function(respJson){
				if(respJson){
					$("#modal_registro_grupo").modal('hide')
											  .find('form input').val('');
					listarGruposUsuario();
				}
			},
			error: function(jqXHR, status, error){
				console.log(error);
			}
		});
	};

	var listarGruposUsuario = function(){
		$.ajax({
			type:'get',
			url:'grupos/grupos_usuario',
			dataType:'json',
			success : function(respJson){
				var str = "";
				if(respJson!==null){
					$("#list-grupos-usuario .item-grupo").remove();
					$.each(respJson,function(i,v){
						str+='<li class="item-grupo"><a href="#"><i class="fa fa-circle-o"></i> '+v.nombre+'</a></li>'
					});
					$("#list-grupos-usuario").prepend(str);
				}
			},
			error : function(jqXHR, status, error){
				console.log(error);
			}
		});
	};

	var changeRadioTipoIncidencia = function(e){
		var value = $(this).val();
		console.log($(this));
		$(".group-descripcion").removeClass('has-error');
		$(".group-descripcion").removeClass('has-success');
		$(".group-descripcion").removeClass('has-warning');
		$("input[name=tipo-incidencia]").removeAttr('data-checked');
		if(value=='ALERTA'){
			$("input[name=tipo-incidencia].minimal-red").attr('data-checked',true);
			$(".group-descripcion").addClass('has-error');
		}
		else if(value=='AVISO'){
			$("input[name=tipo-incidencia].minimal-green").attr('data-checked',true);
			$(".group-descripcion").addClass('has-success');
		}
		else{
			$("input[name=tipo-incidencia].minimal-yellow").attr('data-checked',true);
			$(".group-descripcion").addClass('has-warning');
		}

	};

	var mostrarImagenSubida=function(source){
		var templateEvidencia = $("#template-file-evidencia").clone();
		$(templateEvidencia).css('display','block');
		$(templateEvidencia).find('img').attr('src',source);
		$(templateEvidencia).removeAttr('id');
	    $("#list-evidencias").prepend(templateEvidencia);
	};

	var previewFoto=function(){
	    files=this.files
	    for (var i = 0; i < files.length; i++) {
	        var file=files[i];
	        if(!!file.type.match(/image.*|audio.*|video.*/)){
	            //Si el navegador soporta el objeto FileReader
	            if(window.FileReader){
	                reader = new FileReader();
	                archivos.push(file);
	                //Llamamos a este evento cuando la lectura del archivo es completa
	                //Después agregamos la imagen en una lista
	                reader.onloadend = function(e){
	                    mostrarImagenSubida(e.target.result);
	                };
	                //Comienza a leer el archivo
	                //Cuando termina, el evento onloadend es llamado
	                reader.readAsDataURL(file);
	            }
	        }
	    };
	};

	var publicarIncidencia = function(){
		$("#box-widget-publicacion .overlay").css('display','block');
		var descripcion = $("#inc-descripcion").val();
		var tipo = $("input[name=tipo-incidencia][data-checked=true]").val();
		var modoUsuario = $("#btn-modo-usuario").html();
		$.ajax({
			type:'POST',
			url:'incidencias/publicar',
			data:{'descripcion':descripcion,'tipo':tipo,'modoUsuario':modoUsuario,'lat':_ubicacion.lat,'lng':_ubicacion.lng,'direccion':_ubicacion.direccion},
			dataType:'json',
			success:function(respJson){
				if(respJson!=null){
					if(respJson){
						var formData = new FormData();
						for(var i=0 ; i < archivos.length ; i++){
							formData.append('files',archivos[i]);
						}
						$.ajax({
							type:'POST',
							url:'incidencias/upload-evidencias',
							data : formData,
							dataType : 'json',
							cache: false,
							contentType: false,
							processData: false,
							success : function(respJson){
								if(respJson.rpt){
									console.log('emit');
									socket.emit('nueva incidencia', respJson.incidencia);
									setTimeout(function(){
										limpiarIncidencia();
										$("#box-widget-publicacion .overlay").css('display','none');
									},1000)
								}
							},
							error : function(jqXHR,status,error){
								console.log(error);
							}
						});
					}
				}
			},
			error : function(jqXHR,status,error){
				console.log(error);
			}
		});
	};

	var limpiarIncidencia = function(){
		archivos = [];
		$("#inc-descripcion").val('');
		$("#btn-modo-usuario").html('Privado');
		$("input[type=radio].minimal-red").iCheck('check');
		$("#lbl-ubicacion").text('');
		$("#list-evidencias .item-evidencia").remove();
	};


	var changeModoUsuario = function(){
		var perfil = $(this).data().perfil;
		if(perfil=='PUBLICO'){
			$("#btn-modo-usuario").html('Público');
		}
		else{
			$("#btn-modo-usuario").html('Privado');
		}
	};

	var listarIncidencias = function(masResultados){
		$.ajax({
			type:'GET',
			url:'incidencias/listar',
			data:{'masResultados' : masResultados},
			dataType:'json',
			success : function(respJson){
				if(respJson){
					$.each(respJson,function(i,v){
						showIncidencia(v);
					});
				}
			},
			error: function(jqXHR,status,error){
				console.log(error);
			}
		});
	};

	var showIncidencia = function(incidencia){
		console.log(incidencia);
		var cloneTemplate = $("#template-item-incidencia").clone();
		$(cloneTemplate).removeAttr('id');
		var usuario = incidencia.usuario.nombre + " " + incidencia.usuario.apePaterno + " " + incidencia.usuario.apeMaterno;
		$(cloneTemplate).find('.box-header .user-block .username a').html(usuario);
		$(cloneTemplate).find('.box-body p').html(incidencia.descripcion);
		var tipo = incidencia.tipo;
		var fecha = new Date(incidencia.fechaRegistro);
		var strFecha = fecha.toLocaleString("es-ES" , options);
		if(tipo==='ALERTA'){
			$(cloneTemplate).find(".box-header .user-block .description").html('<span class="label label-danger">ALERTA</span> ' + strFecha);
		}
		else if(tipo==='AVISO'){
			$(cloneTemplate).find(".box-header .user-block .description").html('<span class="label label-success">AVISO</span> ' + strFecha);
		}
		else{
			$(cloneTemplate).find(".box-header .user-block .description").html('<span class="label label-warning">PRECAUCION</span> ' + strFecha);
		}
		var evidencias=incidencia.evidencias;
		for(var i = 0 ; i < evidencias.length ; i++){
			var newCol = $('<div class="col-md-6"><img class="img-responsive pad" src="" alt="Photo"></div>');
			$(newCol).find('img').attr('src' , 'archivosEvidencias/'+evidencias[i].name);
			$(cloneTemplate).find('.box-body #content-fotos').append(newCol);
		}
		$("#content-incidencias").prepend(cloneTemplate);
		$(cloneTemplate).css('display','block');
	};


	init();

};


var mapsSearch = function(options , callback){
	var _map = null;
    var _infowindow = null;
    var _marcador = null;
    var _geocoder = null;
    var _ubicacion = {};
	var _content,_search;
	if(options){
		_content = options.content;
		_search = options.search;
	}
	else{
		_content = $("#maps_div");
		_search = $("#maps_search");
	}
	if(!(_content && _search)){
		throw new Error("Debe existir el contenedor del mapa y el buscador del mapa." );
	}

	var showMaps = function(){
		/* Si se puede obtener la localización */
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(loadMapa,error_maps);
            }
            /* Si el navegador no soporta la recuperación de la geolocalización */
            else
            {
                alert('¡Oops! Tu navegador no soporta geolocalización.');
            }
	};

	var loadMapa = function(pos)
	{
	    /* Obtenemos los parámetros de la API de geolocalización HTML*/
	    var latitud = pos.coords.latitude;
	    var longitud = pos.coords.longitude;
	    var precision = pos.coords.accuracy;


	    /* Posicionamos un punto en el mapa con las coordenadas que nos ha proporcionado la API*/
	    var centro = new google.maps.LatLng(latitud,longitud);

	    /* Definimos las propiedades del mapa */
	    var propiedades =
	    {
	        zoom: 15,
	        center: centro,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    _geocoder =  new google.maps.Geocoder();
	    _map = new google.maps.Map(_content, propiedades);
	    _infowindow = new google.maps.InfoWindow();

	    /* Un servicio que proporciona la API de GM es colocar marcadores sobre el mapa */
	    _marcador = new google.maps.Marker({
	        position: centro,
	        map: _map,
	        draggable:true,
	        title: "Tu localizacion",
	        animation: google.maps.Animation.DROP
	    });

	    geocoderLatLng();

	    google.maps.event.addListener(_marcador, 'mouseover', function(){
	        openInfoWindow();
	        google.maps.event.addListener(_marcador, 'mouseout', function(){
	            _infowindow.close();
	        });
	    });

	    google.maps.event.addListener(_marcador, 'mouseup',mouseUpMark);

	    google.maps.event.addListener(_map, 'click', clickMap);
	};

	var mouseUpMark =  function(){
		console.log('mouseupmark');
	    geocoderLatLng();
	};

	var clickMap = function(e){
		var latlng = e.latLng;
		_marcador.setPosition(latlng);
	    geocoderLatLng();
	};

	var geocoderLatLng = function(){
		var latlng = _marcador.getPosition();
	    _geocoder.geocode({'location': latlng}, function(results, status) {
	        if (status === google.maps.GeocoderStatus.OK) {
	          	if (results[0]) {
	          		_ubicación = {
	          			lat : latlng.lat,
	          			lng : latlng.lng,
	          			direccion : results[0].formatted_address
	          		}
	          	} 
	          	else {
	            	window.alert('No results found');
	          	}
	        } else {
	          window.alert('Geocoder failed due to: ' + status);
	        }
      	});
	}

	var openInfoWindow=function() {
	    var latlng = _marcador.getPosition();
    	var content = '<div>';
    	content = content + '<div><strong>' + _ubicación.direccion + '</strong></div>';
    	content = content + '<div>Latitud : ' + latlng.lat() + '</div>';
    	content = content + '<div>Longitud : ' + latlng.lng() + '</div>';
    	content = content + '</div>';
	    _infowindow.setContent(content);
	    _infowindow.open(_map, _marcador);
	};

	var searchMaps = function(){
		var address = $(_search).val();
	    // Hacemos la petición indicando la dirección e invocamos la función
	    // geocodeResult enviando todo el resultado obtenido
	    _geocoder.geocode({ 'address': address}, geocodeResult);
	};

	var geocodeResult = function(results, status) {
	    // Verificamos el estatus
	    if (status == 'OK') {
	        // Si hay resultados encontrados, centramos y repintamos el mapa
	        // esto para eliminar cualquier pin antes puesto
	        var mapOptions = {
	            center: results[0].geometry.location,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	        _map = new google.maps.Map($(_content).get(0), mapOptions);
	        // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
	        _map.fitBounds(results[0].geometry.viewport);
	        // Dibujamos un marcador con la ubicación del primer resultado obtenido
	        var markerOptions = { 
	        	position: results[0].geometry.location,
	        	map: _map,
		        draggable:true,
		        title: "Tu localizacion",
		        animation: google.maps.Animation.DROP
	        };
	        _marcador = new google.maps.Marker(markerOptions);

	        geocoderLatLng();

    	    google.maps.event.addListener(_marcador, 'mouseover', function(){
    	        openInfoWindow();
    	        google.maps.event.addListener(_marcador, 'mouseout', function(){
    	            _infowindow.close();
    	        });
    	    });

    	    google.maps.event.addListener(_marcador, 'mouseup',mouseUpMark);

    	    google.maps.event.addListener(_map, 'click', clickMap);
	    } else {
	        // En caso de no haber resultados o que haya ocurrido un error
	        // lanzamos un mensaje con el error
	        callback("Geocoding no tuvo éxito debido a: " + status);
	    }
	};

	/* Gestion de errores */
	var error_maps = function(errorCode)
	{
	    if(errorCode.code == 1)
	        callback("No has permitido buscar tu localizacion");
	    else if (errorCode.code==2)
	        callback("Posicion no disponible");
	    else
	        callback("Ha ocurrido un error");
	};

	var aceptarUbicacion =  function(){
		callback(false, _ubicación);
	};


	var init = function(){
		var data = $(_content).data();
		var btn_show_maps = $(data['target_show']);
		var btn_search_maps = $(data['target_search']);
		var btn_acept_maps = $(data['target_acept']);
		console.log(btn_show_maps);
		console.log(btn_search_maps);
		console.log(btn_acept_maps);
		$(btn_show_maps).on('click',showMaps);
		$(btn_search_maps).on('click',searchMaps);
		$(btn_acept_maps).on('click',aceptarUbicacion);
	};

	init();

};
