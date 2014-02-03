App.LoginController = Ember.Controller.extend({
  needs: ['application'],
  username: '', 
  password: '',
  loggingIn: false,
  actions: {   
    login: function() {
      var _self = this;
      _self.set('loggingIn', true);
      Parse.User.logIn(this.get('username'), this.get('password'), {
        success: function(user) {
					
					// if the user has not verified their email, log them out and send them to the login page
					// explaining that they need to verify their email first.  Note skip legacy emails (===undefined).
					if(!user.attributes.emailVerified && user.attributes.emailVerified !== undefined) {
          	$('#login-alert-danger').show();
	          $('#login-error-message').html("Whoa! You still need to verify your email address ("+user.attributes.email+") to access the sweetness that is ulink.");
  					_self.set('loggingIn', false);
						Parse.User.logOut();
						return;
					}
					
          $('#login-alert-danger').hide();
          $('#login-error-message').html('');
          _self.set('loggingIn', false);
          // set the logged in user on the application controller
          _self.get('controllers.application').send('setCurrentUser', user);
           // Log the user in, then reattempt previous transition if it exists.
          var previousTransition = _self.get('previousTransition');
          if (previousTransition) {
            _self.set('previousTransition', null);
            previousTransition.retry();
          } else {
            // Default back to homepage
            _self.transitionToRoute('events');
          }
        },
        error: function(user, error) {
          // show the error message
          $('#login-alert-danger').show();
          var message = (error.code === 101) ? "Wrong Username and password combination." : error.message;
          $('#login-error-message').html(message);
          _self.set('loggingIn', false);
        }
      });
    }
  }
});