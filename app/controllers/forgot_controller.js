App.ForgotController = Ember.Controller.extend({
	email: '',
	resetting: false,
	actions: {
		reset: function() {
			_self = this;
			_self.set('resetting', true);
			var email = this.get("email");
			if(email === undefined || "" == email.trim()) {
				$('#email-group').addClass('has-error');
				$('#required-alert-danger').show();
				_self.set('resetting', false);
				return;
			} else {
				$('#email-group').removeClass('has-error');
			}
			$('#required-alert-danger').hide();

			// now update the reset the password in Parse
      Parse.User.requestPasswordReset(email, {
          success:function() {
              $('#reset-alert-success').show();
							_self.set('resetting', false);
          },
          error:function(error) {
              console.log(error.message);
							$('#reset-alert-danger').show();
							_self.set('resetting', false);
          }
      });
		}
	}
});