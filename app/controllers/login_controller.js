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
          $('.login-error-alert').hide();
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
            _self.transitionToRoute('index');
          }
        },
        error: function(user, error) {
          // show the error message
          $('.login-error-alert').show();
          var message = (error.code === 101) ? "Wrong Username and password combination." : error.message;
          $('#login-error-message').html(message);
          _self.set('loggingIn', false);
        }
      });
    }
  }
});