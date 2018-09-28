angular.module('starter')
    .controller('pedidosPendientesCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.pedidosPendientes = [];

        $scope.init = function() {
            $scope.obtenerPedidosPendientes();
        };

        $scope.irAtras = function() {
            $state.go("menu");
        };
        $scope.irDetallesPedido = function(pos) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Desea tomar el pedido #' + $scope.pedidosPendientes[pos].id + ' ?, este será asignado a su usuario.',
                template: ''
            });

            confirmPopup.then(function(res) {
                if (res) {
                    SharedService.pedidoSeleccionado = $scope.pedidosPendientes[pos];
                    var data = {
                        id: SharedService.pedidoSeleccionado.id,
                        delivery_man_id: SharedService.datosUsuario.id
                    };

                    // Peticion para asignar el repartidor al pedido.
                    $http.put($rootScope._host + 'orders/updateDelivery', data)
                        .success(function(data) {
                            if (data.state == 1) {

                                // Petición para finalizar el pedido.
                                var data = {
                                    id: SharedService.pedidoSeleccionado.id,
                                    order_status_id: 3
                                };

                                $http.put($rootScope._host + 'orders/updateState', data)
                                    .success(function(data) {
                                        if (data.state == 1) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: '',
                                                template: data.message
                                            });
                                            $state.go("detallesPedido");
                                        }
                                    });
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: data.message
                                });
                                $scope.obtenerPedidosPendientes();
                            }
                        });
                }
            });
        };

        $scope.obtenerPedidosPendientes = function() {
            $http.get($rootScope._host + "delivery/pedidos_pendientes")
                .success(function(data) {
                    if (data.state == 1) {
                        $scope.pedidosPendientes = data.data;
                        for (var i = 0; i < $scope.pedidosPendientes.length; i++) {
                            var wtf = i;
                            $http.get($rootScope._host + "delivery/final_address/" + $scope.pedidosPendientes[i].id)
                                .success(function(data) {
                              		i = wtf;
                              		if (data.state == 1) {
                                    	$scope.pedidosPendientes[i].final_address = data.data[0].final_address;
                                    	$scope.pedidosPendientes[i].cant = data.data.length;
                                    }
                                })
                        }
                    } else {
                        $scope.pedidosPendientes = [];

                        var alertPopup = $ionicPopup.alert({
                            title: 'Informacion',
                            template: 'No se han encontrado pedidos pendientes.'
                        });

                        $state.go("menu");
                    }
                });
        };
    })
