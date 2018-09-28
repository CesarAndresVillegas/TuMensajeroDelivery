angular.module('starter')
    .controller('detallesPedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.pedidoSeleccionado;
        $scope.detallesPedido = [];

        $scope.total = 0;

        $scope.init = function() {
            $scope.obtenerDetallesPedido();
        };

        $scope.llamar = function() {
            var phonenumber = $scope.pedidoSeleccionado.phone_user;
            var call = "tel:" + phonenumber;
            window.open(call, '_system');
        };

        $scope.irAtras = function() {
            $state.go("menu");
        };

        $scope.irDetallesSolicitud = function(pos) {
            var detalleSeleccionado = $scope.detallesPedido[pos];
            SharedService.detallePedidoSeleccionado = detalleSeleccionado;

            $state.go("detallesSolicitud");
        };

        $scope.obtenerDetallesPedido = function() {
            $scope.pedidoSeleccionado = SharedService.pedidoSeleccionado;
            $http.get($rootScope._host + "delivery/detalles_pedido/" + $scope.pedidoSeleccionado.id)
                .success(function(data) {
                    if (data.state == 1) {
                        $scope.detallesPedido = data.data;

                        for (var i = 0; i < $scope.detallesPedido.length; i++) {
                            $scope.total = $scope.total + Number($scope.detallesPedido[i].cost);
                        }
                    } else {
                        $scope.detallesPedido = [];
                    }
                });
        };

        $scope.finalizarPedido = function() {
            var mensajeConfirmPendientes = "Desea finalizar el pedido ?, tenga en cuenta que no todas las solicitudes estan finalizadas.";
            var mensajeConfirm = "Desea finalizar el pedido ?";
            var confirmPopup;

            // Decidir el mensaje del confirm popup
            if ($scope.verificarStatusSolicitudes()) {
                confirmPopup = $ionicPopup.confirm({
                    title: mensajeConfirm,
                    template: ''
                });
            } else {
                confirmPopup = $ionicPopup.confirm({
                    title: mensajeConfirmPendientes,
                    template: ''
                });
            }

            confirmPopup.then(function(res) {
                if (res) {
                    // Petición para finalizar el pedido.
                    var data = {
                        id: $scope.pedidoSeleccionado.id,
                        order_status_id: 4
                    };

                    $http.put($rootScope._host + 'orders/updateState', data)
                        .success(function(data) {
                            if (data.state == 1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Exito',
                                    template: data.message
                                });

                                $state.go("menu");
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Exito',
                                    template: data.message
                                });
                            }
                        });
                }
            });
        };

        $scope.verificarStatusSolicitudes = function() {
            var i = 0;
            var retorno = true;
            for (i = 0; i < $scope.detallesPedido.length; i++) {
                if ($scope.detallesPedido[i].status == 0) {
                    retorno = false;
                    break;
                }
            }

            return retorno;
        };
    })
