angular.module('starter')
.controller('loginCtrl', function($scope, $rootScope, $ionicPopup, $state, $interval, $http, SharedService, $window) {
    // Objeto de usuario.
    $scope.usuario = {};
    $scope.isProcessing = false;

    $scope.init = function(){
        $scope.controlDisabled = false;
        if ($window.localStorage.getItem('user') && $window.localStorage.getItem('pwd')) {
            $scope.usuario.user = $window.localStorage.getItem('user');
            $scope.usuario.pwd = $window.localStorage.getItem('pwd');
            $scope.login();
        }
    };

    $scope.login=function(){
        // Validar que se tengan las credenciales de acceso.
        if(!$scope.usuario.user && !$scope.usuario.pwd){
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Por favor introduzca las credenciales.'
            });
            return;
        }

        $scope.isProcessing = true;

        // Realizar petición de login
        $http.get($rootScope._host + 'users/login/' + $scope.usuario.user + '/' + $scope.usuario.pwd)
        .success(function(data) {
            $scope.isProcessing = false;
            if(data.state == 1 && data.data.rol_id == 2){
                SharedService.datosUsuario = data.data;
                $scope.iniciarVerificacionPedidos();
                $state.go("menu");
                $window.localStorage.setItem('user',$scope.usuario.user);
                $window.localStorage.setItem('pwd',$scope.usuario.pwd);

                //obtener posicion y obtener permisos
                navigator.geolocation.getCurrentPosition(function(dataG) {
                    var dataRequest = {
                        delivery_id: data.data.id,
                        lat:dataG.coords.latitude,
                        lng: dataG.coords.longitude
                    };

                    $http.put($rootScope._host + '/positions/update_position', dataRequest);
                },
                function(err){ console.log(err)},
                {timeout:7000}
                );

                window.plugins.OneSignal.sendTag("_id", data.data.id);
            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Ha ocurrido un error al iniciar sesión',
                    template: 'Por favor verifique usuario / contraseña'
                });
            }
        });
    };

    $scope.iniciarVerificacionPedidos = function(){
        var functionVerificarPedidos = function(){
            $http.get($rootScope._host + "delivery/pedidos_asignados/" + SharedService.datosUsuario.id)
            .success(function(data) {
                if(data.state == 1){
                    if(data.data.length > 0){
                        // Enviar posicion actual.
                        navigator.geolocation.getCurrentPosition(function(data) {
                            var data = {
                                delivery_id: SharedService.datosUsuario.id,
                                lat:data.coords.latitude,
                                lng: data.coords.longitude
                            };

                            $http.put($rootScope._host + '/positions/update_position', data);
                        },
                        function(err){ console.log(err)},
                        {timeout:7000}
                        );
                    }
                }
            });
        };

        // Set Interval
        $interval(functionVerificarPedidos, 15000); // PRD
    };

    $scope.irRecuperarContrasena=function(){
        $state.go("recuperarPass");
    }
})