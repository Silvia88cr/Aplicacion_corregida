// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])
.factory('musica', ['$firebaseArray', function($firebaseArray){
 var itemsRef = new Firebase('https://aplicacionsilvia.firebaseio.com/items');
 return $firebaseArray(itemsRef); 
}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('tabs',{
		url: '/tab',
		abstract: true,
		templateUrl:'templates/tabs.html'
	})

  .state('tabs.inicio',{
    url: '/inicio',
    views:{
      'inicio-tab':{
        templateUrl:'templates/inicio.html',
        
      }
    }
  })


	.state('tabs.lista',{
		url: '/lista',
		views:{
			'lista-tab':{
				templateUrl:'templates/lista.html',
				controller: 'ControladorLista'
			}
		}
	})

  .state('tabs.ficha',{
    url: '/lista/:fichaId',
    views:{
      'lista-tab':{
        templateUrl: 'templates/ficha.html',
        controller: 'ControladorLista'

      }
    }
  })



	$urlRouterProvider.otherwise('/tab/inicio');
})	

.controller('ControladorLista', ['$scope','$http', '$state',function($scope,$http, $state, musica) {
$scope.musica = musica;
$scope.addItem = function(){
  var name= prompt('Que deseas agregar?');
  if (album){
    $scope.items.$add({
      'album' : album
    });
  }
};
$scope.purchaseItem= function(item){
  var itemRef = Firebase('https://aplicacionsilvia.firebaseio.com/items/' + item.$id);
  itemRef.child('status').set('purchased');
  $ionicListDelegate.closeOptionButtons();
};


$http.get('js/data.json').success(function(data){
    $scope.musica = data;
    $scope.queAlbum = $state.params.fichaId;
    $scope.data = {showDelete: false, showReorder: false };

    $scope.toggleStar=function(item){
    	item.star = !item.star;
    }

    $scope.doRefresh = function(){
    $http.get('js/data.json').success(function(data){
     $scope.musica = data;
     $scope.$broadcast('scroll.refreshComplete');
    });
    }

    $scope.onItemDelete= function(item){
    	$scope.musica.splice($scope.musica.indexOf(item), 1);
    };

    $scope.moveItem = function(item,fromIndex,toIndex){
    	$scope.musica.splice(fromIndex, 1);
    	$scope.musica.splice(toIndex,0,item);

    };

});
}]);
