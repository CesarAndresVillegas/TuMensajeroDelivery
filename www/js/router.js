angular.module('starter')
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  });

  $stateProvider
  .state('historialServicios', {
    url: '/historialServicios',
    templateUrl: 'templates/historialServicios.html',
    controller: 'historialServiciosCtrl'
  });

  $stateProvider
  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  });

  $stateProvider
  .state('pedidosPendientes', {
    url: '/pedidosPendientes',
    templateUrl: 'templates/pedidosPendientes.html',
    controller: 'pedidosPendientesCtrl'
  });

  $stateProvider
  .state('pedidosAsignados', {
    url: '/pedidosAsignados',
    templateUrl: 'templates/pedidosAsignados.html',
    controller: 'pedidosAsignadosCtrl'
  });

  $stateProvider
  .state('detallesPedido', {
    url: '/detallesPedido',
    templateUrl: 'templates/detallesPedido.html',
    controller: 'detallesPedidoCtrl'
  });

  $stateProvider
  .state('detallesSolicitud', {
    url: '/detallesSolicitud',
    templateUrl: 'templates/detallesSolicitud.html',
    controller: 'detallesSolicitudCtrl'
  });

  $stateProvider
  .state('recuperarPass', {
    url: '/recuperarPass',
    templateUrl: 'templates/recuperarPass.html',
    controller: 'recuperarPassCtrl'
  });

  $urlRouterProvider.otherwise('/login');
})