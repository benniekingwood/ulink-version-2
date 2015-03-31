App.ProfileController = Ember.ObjectController.extend({
	needs: ["application"],
	updating: false,
	actions: {
		showRequiredAlert: function() {
			$('#required-alert-danger').show();
		},
		hideRequiredAlert: function() {
			$('#required-alert-danger').hide();
		},
    editEvent: function(event) {
		  this.transitionTo("events.edit", event);
    },
		update: function(type) {
			if("password" == type) {
				if(this.get("password") === undefined || "" == this.get("password").trim()) {
					$('#password-group').addClass('has-error');
					this.send('showRequiredAlert');
					window.scrollTo(0, 0);
				} else {
					$('#password-group').removeClass('has-error');
					this.send('updateProfile', type);
				}
			} else if ("profile" == type) {
				if(this.get("name") === undefined || "" == this.get("name").trim()) {
					$('#name-group').addClass('has-error');
					this.send('showRequiredAlert');
					window.scrollTo(0, 0);
				} else {
					$('#name-group').removeClass('has-error');
					this.send('updateProfile', type);
				}
			}
		},
		updateProfile: function(type) { 
			_self = this;
			_self.send('hideRequiredAlert');
			_self.set('updating', true);
			// grab the current user PFObject from Parse
			var parseUser = Parse.User.current();
			if(type=="password") {
				parseUser.set("password", this.get("password"));
			} else {
	 		  // set the updated attributes on the user
				parseUser.set("name", this.get("name"));
	 			parseUser.set("bio", this.get("bio"));
	 			parseUser.set("year", this.get("year"));
			}

			parseUser.save(null, {
		    success: function(user) {
					user.fetch({
					  success: function(fetchedUser) {
							 _self.set('updating', false);
		          // set the logged in user on the application controller
		           _self.get('controllers.application').send('setCurrentUser', fetchedUser);
							$('#'+type+'-alert-success').show();
							$('#'+type+'-alert-danger').hide();
							setTimeout(function(){$('#'+type+'-alert-success').hide();},5000);
							window.scrollTo(0, 0);
					  },
					  error: function(myObject, error) {
							 _self.set('updating', false);
							console.log(error.message);
							$('#'+type+'-alert-danger').show();
							window.scrollTo(0, 0);
					  }
					});
		    },
		    error: function(user, error) {
					 _self.set('updating', false);
					console.log(error.message);
					$('#'+type+'-alert-danger').show();
					window.scrollTo(0, 0);
		    }
		  });
		}
	}
});