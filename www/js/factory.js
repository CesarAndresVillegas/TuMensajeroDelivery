angular.module('starter')
.factory('SharedService', function() {
	var SharedService = {
		datosUsuario: {},
		trayectos: [],
		pedidoSeleccionado: {}
	};
	return SharedService;
});