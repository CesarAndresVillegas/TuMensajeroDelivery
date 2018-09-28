// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
  // $rootScope._host = "http://aliansap.com.co/bikenow_api/v1.0/";
  $rootScope._host = "http://bikenow.co/bikenow/bikenow_api/v1.0/";

  // Template para pantalla de carga.
  $rootScope.show = function() {
    $ionicLoading.show({
      template: 'Cargando...'
    });
  };

  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // OneSignal
    // Callback PN
    var notificationOpenedCallback = function(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    // Inicializar el Plugin de One Signal.
    window.plugins.OneSignal.init("18881815-0483-4c81-85d3-aaf17c718fd1",
      {googleProjectNumber: "125534148331"},
      notificationOpenedCallback);

    // Muestra alerta si una notificaation es recibida mientras el usuario tiene la app abierta.
    window.plugins.OneSignal.enableInAppAlertNotification(true);

    // Enviar Tag de repartidor.
    window.plugins.OneSignal.sendTag("_type", "delivery");
  });
})

.config(function($ionicConfigProvider){
  $ionicConfigProvider.views.swipeBackEnabled(false);
})
