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
	var map = null;
    var infowindow = new google.maps.InfoWindow;
    var marcador = null;
    var geocoder = new google.maps.Geocoder;
    var ubicacion = {};
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
		$("#btn-show-maps").on('click',showMaps);
		$("#btn-search-maps").on('click',searchMaps);
		$("#btn-acept-maps").on('click',aceptarUbicacion);
		$("#btn-registro-denuncia").on('click',function(){
			location.href="denuncias/registro_denuncia"
		});
		listarGruposUsuario();
		listarIncidencias(false);

		socket.on('nueva incidencia' , showIncidencia);
	};

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

	    /* A través del DOM obtenemos el div que va a contener el mapa */
	    var contenedor = document.getElementById("maps_div");

	    /* Posicionamos un punto en el mapa con las coordenadas que nos ha proporcionado la API*/
	    var centro = new google.maps.LatLng(latitud,longitud);

	    /* Definimos las propiedades del mapa */
	    var propiedades =
	    {
	        zoom: 15,
	        center: centro,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    map = new google.maps.Map(contenedor, propiedades);
	    infoWindow = new google.maps.InfoWindow();

	    /* Un servicio que proporciona la API de GM es colocar marcadores sobre el mapa */
	    marcador = new google.maps.Marker({
	        position: centro,
	        map: map,
	        draggable:true,
	        title: "Tu localizacion",
	        animation: google.maps.Animation.DROP
	    });

	    geocoderLatLng();

	    google.maps.event.addListener(marcador, 'mouseover', function(){
	        openInfoWindow();
	        google.maps.event.addListener(marcador, 'mouseout', function(){
	            infowindow.close();
	        });
	    });

	    google.maps.event.addListener(marcador, 'mouseup',mouseUpMark);

	    google.maps.event.addListener(map, 'click', clickMap);
	};

	var mouseUpMark =  function(){
		console.log('mouseupmark');
	    geocoderLatLng();
	};

	var clickMap = function(e){
		console.log('click');
		var latlng = e.latLng;
		marcador.setPosition(latlng);
	    geocoderLatLng();
	};

	var geocoderLatLng = function(){
		var latlng = marcador.getPosition();
	    geocoder.geocode({'location': latlng}, function(results, status) {
	        if (status === google.maps.GeocoderStatus.OK) {
	          	if (results[0]) {
	          		ubicación = {
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
		console.log('marcador');
	    var latlng = marcador.getPosition();
    	var content = '<div>';
    	content = content + '<div><strong>' + ubicación.direccion + '</strong></div>';
    	content = content + '<div>Latitud : ' + latlng.lat() + '</div>';
    	content = content + '<div>Longitud : ' + latlng.lng() + '</div>';
    	content = content + '</div>';
	    infowindow.setContent(content);
	    infowindow.open(map, marcador);
	};

	var searchMaps = function(){
		var address = $('#input-search-maps').val();
	    // Creamos el Objeto Geocoder
	    var geocoder = new google.maps.Geocoder();
	    // Hacemos la petición indicando la dirección e invocamos la función
	    // geocodeResult enviando todo el resultado obtenido
	    geocoder.geocode({ 'address': address}, geocodeResult);
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
	        map = new google.maps.Map($("#maps_div").get(0), mapOptions);
	        // fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
	        map.fitBounds(results[0].geometry.viewport);
	        // Dibujamos un marcador con la ubicación del primer resultado obtenido
	        var markerOptions = { 
	        	position: results[0].geometry.location,
	        	map: map,
		        draggable:true,
		        title: "Tu localizacion",
		        animation: google.maps.Animation.DROP
	        };
	        marcador = new google.maps.Marker(markerOptions);

	        geocoderLatLng();

    	    google.maps.event.addListener(marcador, 'mouseover', function(){
    	        openInfoWindow();
    	        google.maps.event.addListener(marcador, 'mouseout', function(){
    	            infowindow.close();
    	        });
    	    });

    	    google.maps.event.addListener(marcador, 'mouseup',mouseUpMark);

    	    google.maps.event.addListener(map, 'click', clickMap);
	    } else {
	        // En caso de no haber resultados o que haya ocurrido un error
	        // lanzamos un mensaje con el error
	        alert("Geocoding no tuvo éxito debido a: " + status);
	    }
	};

	/* Gestion de errores */
	var error_maps = function(errorCode)
	{
	    if(errorCode.code == 1)
	        alert("No has permitido buscar tu localizacion")
	    else if (errorCode.code==2)
	        alert("Posicion no disponible");
	    else
	        alert("Ha ocurrido un error");
	};

	var aceptarUbicacion = function(){
	    $("#lbl-ubicacion").text(ubicación.direccion);
	    $("#modal_maps").modal('hide');
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
			data:{'descripcion':descripcion,'tipo':tipo,'modoUsuario':modoUsuario,'lat':ubicación.lat,'lng':ubicación.lng,'direccion':ubicación.direccion},
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
