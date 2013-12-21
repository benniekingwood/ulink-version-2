App.SignupController = Ember.Controller.extend({
  needs: ['application'],
  schoolStatuses: ['Current Student', 'Alumni'],
  schools: [],
  signingUp: false,
  username: '', 
  password: '',
  email: '',
  schoolStatus: '',
  init: function() {
    var schools = this.get('controllers.application').get('schools');
    this.set('schools', schools);
  },
  actions: {   
    signup: function() {
      var _self = this;
      _self.set('signingUp', true);
      Parse.User.signup(this.get('username'), this.get('password'), {
        success: function(user) {
          $('.signup-error-alert').hide();
          $('#signup-error-message').html('');
          // navigate to the ulink app
          window.location = '/app'
        },
        error: function(user, error) {
          // show the error message
          $('.signup-error-alert').show();
          var message = (error.code === 101) ? "Wrong Username and password combination." : error.message;
          $('#signup-error-message').html(message);
          _self.set('signingUp', false);
        }
      });
    }
  }
});