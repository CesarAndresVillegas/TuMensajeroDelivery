angular.module('starter')
.controller('recuperarPassCtrl', function($scope, $rootScope, $ionicPopup, $state, $http) {
	$scope.controlDisabled = false;
	$scope.recuperar = {};

	$scope.init = function(){
    	$scope.controlDisabled = false;
  	};

    $scope.irAtras=function(){
        $scope.controlDisabled = true;
        $state.go("login")
    };

    $scope.recuperarPass = function(){
		$scope.controlDisabled = false;
		$http.get($rootScope._host + 'users/recuperarPass/' + $scope.recuperar.mail)
		.success(function(data){
			if(data.state == "1"){
				var alertPopup = $ionicPopup.alert({
					title: 'INFO',
					template: data.message
				});

				$state.go("login");
			}
			else{
				var alertPopup = $ionicPopup.alert({
					title: 'INFO',
					template: data.message
				});
			}
		});
	};
})