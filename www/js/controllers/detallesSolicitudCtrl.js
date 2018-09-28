angular.module('starter')
    .controller('detallesSolicitudCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {

        $scope.detalleSeleccionado;
        $scope.pedidoSeleccionado;
        $scope.habilitarCambioEstado = true;
        $scope.cancelacion = {};

        $scope.init = function() {
            $scope.cargarDatos();
        };

        $scope.irAtras = function() {
            $state.go("detallesPedido");
        };

        $scope.cargarDatos = function() {
            $scope.detalleSeleccionado = SharedService.detallePedidoSeleccionado;
            $scope.pedidoSeleccionado = SharedService.pedidoSeleccionado;

            if ($scope.detalleSeleccionado.status == "1" || $scope.detalleSeleccionado.status == "2") {
                $scope.habilitarCambioEstado = false;
            } else {
                $scope.habilitarCambioEstado = true;
            }
        };

        $scope.cambiarEstadoDetalle = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Desea finalizar la solicitud ?',
                template: ''
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var data = {
                        id: $scope.detalleSeleccionado.id,
                        status: 1,
                        observations: $scope.detalleSeleccionado.observations
                    };

                    $http.put($rootScope._host + 'orders/updateStateDetail', data)
                        .success(function(data) {
                            if (data.state == 1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Exito',
                                    template: data.message
                                });
                                $state.go("detallesPedido");
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

        $scope.lanzarWazeInicio = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Desea lanzar Waze para ir a la dirección de inicio ?',
                template: ''
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var latDestino = $scope.detalleSeleccionado.initial_lat;
                    var lngDestino = $scope.detalleSeleccionado.initial_lng;

                    if (!latDestino || !lngDestino) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: "El usuario no ha registrado coordenadas de inicio."
                        });
                        return;
                    }

                    launchnavigator.navigate([latDestino, lngDestino], {
                        app: launchnavigator.APP.WAZE
                    });
                }
            });
        };

        $scope.lanzarWazeDestino = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Desea lanzar Waze para ir a la dirección destino ?',
                template: ''
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var latDestino = $scope.detalleSeleccionado.final_lat;
                    var lngDestino = $scope.detalleSeleccionado.final_lng;

                    if (!latDestino || !lngDestino) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: "El usuario no ha registrado las coordenadas del destino."
                        });
                        return;
                    }

                    launchnavigator.navigate([latDestino, lngDestino], {
                        app: launchnavigator.APP.WAZE
                    });
                }
            });
        };

        $scope.noViable = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'No viable?',
                template: 'Desea confirmar que esta petición no cumplirá?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var myPopup = $ionicPopup.show({
                        template: '<input type="text" ng-model="cancelacion.motivo">',
                        title: 'No Viable',
                        subTitle: 'Ingrese el motivo de no viabilidad',
                        scope: $scope,
                        // cssClass: 'popup-cancel',
                        buttons: [{
                            text: 'Cancelar'
                                //close popup and do nothing
                        }, {
                            text: 'No Cobrar',
                            type: 'button-assertive',
                            onTap: function(e) {
                                return {
                                    text: $scope.cancelacion.motivo,
                                    discount: "aplica"
                                };
                            }
                        }, {
                            text: 'Cobrar',
                            type: 'button-balanced',
                            onTap: function(e) {
                                return {
                                    text: $scope.cancelacion.motivo,
                                    discount: "no aplica"
                                };
                            }
                        }]
                    });
                    myPopup.then(function(userinput) {
                        var reasonText = userinput.text;
                        var reasonDiscount = userinput.discount;

                        console.log(reasonDiscount);

                        var observaciones = "CANCELADO - NO VIABLE *** Motivo de Cancelación: " + reasonText + " *** " + $scope.detalleSeleccionado.observations;

                        var data = {
                            id: $scope.detalleSeleccionado.id,
                            status: 2,
                            observations: observaciones,
                            discount: reasonDiscount
                        };

                        $http.put($rootScope._host + 'orders/updateStateDetail', data)
                            .success(function(data) {
                                if (data.state == 1) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Exito',
                                        template: 'Trayecto cancelado con éxito'
                                    });
                                    $scope.detalleSeleccionado.observations = "CANCELADO - NO VIABLE *** Motivo de Cancelación: " + res + " *** " + $scope.detalleSeleccionado.observations;
                                    $state.go("detallesPedido");
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: data.message
                                    });
                                }
                            });

                    });

                    // $ionicPopup.prompt({
                    //     title: 'No Viable',
                    //     template: 'Ingrese el motivo de no viabilidad',
                    //     inputType: 'text',
                    //     inputPlaceholder: 'Motivo'
                    // }).then(function(res) {
                    //     if (res.length > 0) {
                    //         var observaciones = "CANCELADO - NO VIABLE *** Motivo de Cancelación: " + res + " *** " + $scope.detalleSeleccionado.observations;

                    //         var data = {
                    //             id: $scope.detalleSeleccionado.id,
                    //             status: 2,
                    //             observations: observaciones
                    //         };

                    //         $http.put($rootScope._host + 'orders/updateStateDetail', data)
                    //             .success(function(data) {
                    //                 if (data.state == 1) {
                    //                     var alertPopup = $ionicPopup.alert({
                    //                         title: 'Exito',
                    //                         template: 'Trayecto cancelado con éxito'
                    //                     });
                    //                     $scope.detalleSeleccionado.observations = "CANCELADO - NO VIABLE *** Motivo de Cancelación: " + res + " *** " + $scope.detalleSeleccionado.observations;
                    //                     $state.go("detallesPedido");
                    //                 } else {
                    //                     var alertPopup = $ionicPopup.alert({
                    //                         title: 'Error',
                    //                         template: data.message
                    //                     });
                    //                 }
                    //             });
                    //     }
                    // });
                }
            });
        };
    })
