App.SignupController = Ember.Controller.extend({
  needs: ['application'],
  schoolStatuses: ['Current Student', 'Alumni'],
	schools: null,
  signingUp: false,
  username: null, 
  password: null,
  email: null,
  selectedStatus: null,
	selectedSchool: null,
  init: function() {
		this._super();
    var schools = this.get('controllers.application').get('schools');
    this.set('schools', schools);
  },
  actions: {  
		showRequiredAlert: function() {
			$('#required-alert-danger').show();
		},
		hideRequiredAlert: function() {
			$('#required-alert-danger').hide();
		},
		signup: function() {
			var valid = true;
			// validate the username
			if(this.get("username") == null || "" == this.get("username").trim()) {
				$('#username-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				$('#username-group').removeClass('has-error');
			}
			
			// validate the password
			if(this.get("password") == null || "" == this.get("password").trim()) {
				$('#password-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				$('#password-group').removeClass('has-error');
			}
			
			// validate the email
			if(this.get("email") == null || "" == this.get("email").trim()) {
				$('#email-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				// if the school status is "Current Student", make sure 
				// the user has a valid email domain
				if("Current Student" == this.get("selectedStatus")) {
					// get the selected school
					var domains = this.get("selectedSchool").get("domains");
					var userDomain = this.get("email").split("@")[1];
					if(!domains.contains(userDomain.toLowerCase())) {
						$('#email-group').addClass('has-error');
	          $('#signup-alert-danger').show();
	          $('#signup-error-message').html("Current students must have an email address with one the following extensions: <strong>" + domains.toString() + "</strong>." );
						valid = false;
					} else {
						$('#email-group').removeClass('has-error');
						$('#signup-error-message').html('');
						$('#signup-alert-danger').hide();
					}
				}
			}

			if(valid) {
				this.send('signupNewUser');
			}
		},
    signupNewUser: function() { 
      var _self = this;
			this.set('signingUp', true);
			var user = new Parse.User();
			user.set("username", this.get("username").trim());
			user.set("password", this.get("password").trim());
			user.set("email", this.get("email").trim());
 
			// other fields for the user object
			// Simple syntax to create a new subclass of Parse.Object.
			var School = Parse.Object.extend("School");
 
			// Create a new instance of that class.
			var parseSchool = new School();
			parseSchool.set("objectId", this.get("selectedSchool").get("id"));
			user.set("school", parseSchool);
			user.set("schoolStatus", this.get('selectedStatus'));
			user.set("ACL",new Parse.ACL());

      user.signUp(null, {
        success: function(user) {
					_self.send('hideRequiredAlert');
					$('#signup-alert-danger').hide();
          $('#signup-error-message').html('');
					$('#signup-alert-success').show();
					$('#signup-form').hide();
					_self.set('signingUp', false);
					// log the new user out so that they can verify their email first
					Parse.User.logOut();
        },
        error: function(user, error) {
					console.log("Error: " + error.code + " " + error.message);
          // show the error message
          $('#signup-alert-danger').show();
          $('#signup-error-message').html(error.message);
          _self.set('signingUp', false);
        }
      });
    }
  }
});