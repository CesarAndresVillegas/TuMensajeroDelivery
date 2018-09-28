angular.module('starter')
.controller('menuCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
    $scope.irPendientes = function(){
        $state.go("pedidosPendientes");
    };

    $scope.irAsignados = function(){
        $state.go("pedidosAsignados");
    };

    $scope.historialServicios = function(){
        $state.go("historialServicios");
    };

    $scope.irAtras = function(){
        $scope.controlDisabled = true;
        // A confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: 'Salir de BikeNow',
            template: 'Desea salir de la aplicación?'
        });

        confirmPopup.then(function(res) {
         if(res) {
            $window.localStorage.removeItem('user');
            $window.localStorage.removeItem('pwd');
            $state.go("login");
        } else {
           $scope.controlDisabled = false;
       }
   });
    };
})