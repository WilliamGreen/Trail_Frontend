'Use Strict';
angular.module('App').controller('loginController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$firebaseAuth , $firebaseObject,$log, Auth, FURL, Utils) {
  //var ref = new Firebase(FURL);
  var auth = $firebaseAuth();
  //firebase.initializeApp(FURL);
  var ref = firebase.database().ref();
  var userkey = "";
  $scope.signIn = function (user) {
    $log.log("Enviado");
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function(authData) {
      
      $log.log("id del usuario:" + authData);
       Utils.hide();
      $state.go('home');
      $log.log("Starter page","Home");

      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
    }
  };
  
  $scope.loginWithGoogle =  function(){
    //TODO Google
  };
  
  $scope.loginWithFacebook =  function(){
    //TODO facebook
  };
  
  $scope.loginWithTwitter =  function(){
    //TODO twitter
  };


});
