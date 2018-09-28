angular.module('starter')
    .controller('pedidosAsignadosCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.pedidosAsignados = [];

        $scope.init = function() {
            $scope.obtenerPedidosAsignados();
        };

        $scope.irAtras = function() {
            $state.go("menu");
        };

        $scope.irDetallesPedido = function(pos) {
            SharedService.pedidoSeleccionado = $scope.pedidosAsignados[pos];
            $state.go("detallesPedido");
        };

        $scope.obtenerPedidosAsignados = function() {
            $http.get($rootScope._host + "delivery/pedidos_asignados/" + SharedService.datosUsuario.id)
                .success(function(data) {
                    if (data.state == 1) {
                        $scope.pedidosAsignados = data.data;
                        for (var i = 0; i < $scope.pedidosAsignados.length; i++) {
                            var wtf = i;
                            $http.get($rootScope._host + "delivery/final_address/" + $scope.pedidosAsignados[i].id)
                                .success(function(data) {
                                    i = wtf;
                                    if (data.state == 1) {
                                        $scope.pedidosAsignados[i].final_address = data.data[0].final_address;
                                        $scope.pedidosAsignados[i].cant = data.data.length;
                                    }
                                })
                        }
                    } else {
                        $scope.pedidosAsignados = [];

                        var alertPopup = $ionicPopup.alert({
                            title: 'Informacion',
                            template: 'No se han encontrado pedidos asignados.'
                        });

                        $state.go("menu");
                    }
                });
        };
    })
