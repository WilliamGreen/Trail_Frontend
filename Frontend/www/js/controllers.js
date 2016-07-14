angular.module('starter.controllers', [])

// CONTROLLER FOR DISPLAYING POSTS
.controller('DashCtrl', function($scope, $http, IonicService, $ionicPlatform, $ionicPopup, $ionicLoading) {

   $ionicPlatform.ready(function() { // HAVE TO WAIT FOR PLATFORM TO BE READY TO ASK FOR LOCATION
      IonicService.checkLocation(callback); // need to use a callback because reading location takes time
  });

  $scope.formatTime = function(time){ // FORMAT TIME TO SHOW (1M AGO)

    	var now = new Date();
    	var postTime = new Date(Date.parse(time));
    	postTime = now.getTime() - postTime.getTime();

    	var timeAgo = Math.ceil(postTime/1000/60);

    	if ( timeAgo > 1440 ){ // DAYS
    		return "" + Math.ceil(timeAgo/60/24) + " days" ;
    	}
    	else if (timeAgo > 59){
    		return "" + Math.ceil(timeAgo/60) + " hrs" ;
    	}
    	else {return timeAgo + " min" ;}
  }

  $scope.$on('$ionicView.enter', function(e) { // WILL EXECUTE ON ENTERING THE VIEW
      $scope.posts = {} ;
      $scope.noPosts = true ;
      $scope.showLoading = true ;

      IonicService.checkLocation(callback); // CHECK LOCATION EVERY TIME USER OPENS THE VIEW
  });

  function callback(){ // will get called once the location is ready
      $scope.location = IonicService.getPosition();

      $scope.doRefresh();
  }

  $scope.decodeString = function(value){ // DECODE THE USER POST STRING
      return decodeURI(value);
  }

  $scope.doRefresh = function (){ // GET NEW POSTS

       var location = IonicService.getPosition() ;

          if (location == null || location == undefined ) return ;

           $http.post("https://trailbackend.herokuapp.com/getPosts",
              { params: { "latitude": location[0], "longitude": location[1] }})
                .success(function(response) {

                   $scope.$broadcast('scroll.refreshComplete'); // CLOSE THE LOADING INDICATOR
                   $scope.$apply();

                   $scope.showLoading = false ;

                    $scope.posts = response ; // SAVE THE POSTS

                      if ( $scope.posts.length > 0) // IF THERE ARE NO POSTS SHOW THE MESSAGE
                        $scope.noPosts = false ;
                    else  $scope.noPosts = true ;

                 })
                .error(function(response) { // THERE WAS AN ERROR GETTING A RESPONSE

                       $ionicPopup.alert({
                           title: 'Top',
                           template: 'Service unavailable, make sure you are online.'
                       });

                       $scope.showLoading = false ;
                });
    }
})

// CONTROLLER FOR MAKING POSTS
.controller('PostCtrl', function($scope, $state, IonicService, $ionicLoading, $http, $ionicPopup) {

    $scope.data = {} ;
    $scope.postText = {value: ""} ;


   $scope.$on('$ionicView.enter', function(e) { // CHECK LOCATION ON ENTERING THE VIEW
        IonicService.checkLocation(callback);
  });

  function callback(){ // will get called once the location is ready
     $scope.location = IonicService.getPosition();
  }

  $scope.makePost = function(){ // MAKE NEW POST

      $ionicLoading.show({
            template: 'Publishing...'
        });

    var arrayPosition = IonicService.getPosition();
    var encodedData= encodeURI($scope.postText.value);

     $http.post("https://trailbackend.herokuapp.com/makePost", { params:
              { "content": encodedData,
                 "latitude" : arrayPosition[0],
                 "longitude": arrayPosition[1],
                 "altitude" : arrayPosition[2]
               }
            })
        .success(function(data) {

               $ionicLoading.hide();

               $scope.postText.value = "" ;
               $state.go('tab.dash'); // GO BACK TO DASH VIEW AFTER POSTING
        })
        .error(function(data) { // HANDLE POST ERRORS
            $ionicLoading.hide();
            alert('Uh oh. Looks like we screwed up. Unable to post right now.');
        });
    }
});
