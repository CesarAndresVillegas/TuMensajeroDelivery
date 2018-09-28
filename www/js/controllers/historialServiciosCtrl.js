angular.module('myApp', ["ngCsv"])
angular.module('starter')
    .controller('historialServiciosCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.historialLista = [];
        $scope.consulta = {};

        $scope.CSVFilename = "Consulta_" + $scope.CurrentDate + ".csv";
        $scope.CSVSeparator = ",";

        $scope.flag30 = true;
        $scope.flag31 = true;

        $scope.dayList = [];

        $scope.irAtras = function() {
            $state.go("menu")
        };

        $scope.selectDayList = function() {
            if ($scope.consulta.month == 1 || $scope.consulta.month == 3 || $scope.consulta.month == 5 || $scope.consulta.month == 7 || $scope.consulta.month == 8 || $scope.consulta.month == 10 || $scope.consulta.month == 12) {
                $scope.flag30 = true;
                $scope.flag31 = true;
            } else if ($scope.consulta.month == 2) {
                $scope.flag30 = false;
                $scope.flag31 = false;
            } else {
                $scope.flag30 = true;
                $scope.flag31 = false;
            }
        };

        $scope.consultarOrdenes = function() {

            if (!$scope.consulta.monthInit) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el mes inicial'
                });
                return;
            }

            if (!$scope.consulta.monthFin) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el mes final'
                });
                return;
            }

            if (!$scope.consulta.dayInit) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el dia inicial'
                });
                return;
            }

            if (!$scope.consulta.dayFin) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el dia final'
                });
                return;
            }

            if (!$scope.consulta.yearInit) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el año inicial'
                });
                return;
            }

            if (!$scope.consulta.yearFin) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Seleccione el año final'
                });
                return;
            }

            var fechaInicio = $scope.consulta.yearInit + "-" + $scope.consulta.monthInit + "-" + $scope.consulta.dayInit;
            var fechaFinal = $scope.consulta.yearFin + "-" + $scope.consulta.monthFin + "-" + $scope.consulta.dayFin;

            // Consultar
            console.log(SharedService.datosUsuario);
            $http.get($rootScope._host + 'orders/reportOrdersDelivery/' + fechaInicio + '/' + fechaFinal + '/' + SharedService.datosUsuario.id)
                .success(function(data) {
                    if (data.state == "1") {
                        $scope.historialLista = data.data;
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: data.message
                        });
                    }
                });
        };
    })
