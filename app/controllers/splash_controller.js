App.SplashController = Ember.Controller.extend({
  needs: ['application'],
  schools: [], 
	suggestion: null,
	submitting: false,
	init: function() { 
		this.send('getSchools');
  },
	actions: {
		showRequiredAlert: function() {
			$('#required-alert-danger').show();
		},
		hideRequiredAlert: function() {
			$('#required-alert-danger').hide();
		},
		// retrieve all schools 
		getSchools: function() {
			var _self = this;
			App.School.find(undefined, function(results, error) {
	        if (!error) { 
						if(results && results.length > 0) {
							_self.set('schools', results);
						}
	        }
	      }
			);
		}, 
		suggest: function() {
			if(this.get("suggestion") === null || "" == this.get("suggestion").trim()) {
				$('#suggestion-group').addClass('has-error');
				this.send('showRequiredAlert');
			} else {
				$('#suggestion-group').removeClass('has-error');
				this.send('submitSuggestion');
			}
		}, 
		submitSuggestion: function() {
      var _self = this;
			this.set('submitting', true);
			// create the suggestion 
			var Suggestion = Parse.Object.extend("Suggestion");
			var newSuggestion = new Suggestion();
			// add the required data for the snapshot
			newSuggestion.set("name", this.get("suggestion").trim());
			
			// build the ACL for the suggestion
			var acl = new Parse.ACL();
			acl.setPublicReadAccess(false);
			acl.setPublicWriteAccess(false);
			newSuggestion.set("ACL",acl);
 
      newSuggestion.save(null, {
        success: function(suggestion) {
					_self.send('hideRequiredAlert');
					$('#general-alert-danger').hide();
          $('#general-error-message').html('');
					$('#suggestion-alert-success').show();
					_self.set('submitting', false);
					// reset the form values
					_self.set('suggestion', null);
					setTimeout(function() {$('#suggestion-alert-success').hide();}, 5000);
        },
        error: function(suggestion, error) {
					console.error("Error: " + error.code + " " + error.message);
          // show the error message
          $('#general-alert-danger').show();
          $('#general-error-message').html("There was a problem submitting your suggestion, please try again later or contact help@ulink.io");
          _self.set('submitting', false);
        }
      });
		}
	}
});