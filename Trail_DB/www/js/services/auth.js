angular.module('App').factory('Auth', function(FURL, $firebaseAuth, $firebaseArray, $firebaseObject, Utils) {

	//var ref = new Firebase(FURL);

  firebase.initializeApp(FURL);
	//var auth = $firebaseAuth(ref);
  var ref = firebase.database().ref();
  //var auth = $firebaseObject(ref);
  var auth = $firebaseAuth();

	var Auth = {
		user: {},

    login: function(user) {
      return auth.$signInWithEmailAndPassword(
        user.email, user.password
      );
    },

    register: function(user) {
      return auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(firebaseUser) {
          console.log("User created with uid: " + firebaseUser.uid);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    logout: function() {
      auth.$signOut();
			console.log("Usuario Sale.");
    },

		resetpassword: function(email) {
			return auth.$sendPasswordResetEmail(
				  email
				).then(function() {
					Utils.alertshow("Exito.","La clave fue enviada a su correo.");
				  //console.log("Password reset email sent successfully!");
				}).catch(function(error) {
					Utils.errMessage(error);
				  //console.error("Error: ", error.message);
				});
    },

		changePassword: function(user) {
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},

    signInWithProvider: function(provider) {
      return Auth.signInWithPopup('google');
    }
	};
	return Auth;

});
