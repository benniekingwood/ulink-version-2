App.EventsController = Ember.ArrayController.extend({
	needs: ['application'],
	title: null,
	description: null,
	date: null,
	location: null,
	time: null,
	creating: false,
	actions: {
		showRequiredAlert: function() {
			$('#required-alert-danger').show();
		},
		hideRequiredAlert: function() {
			$('#required-alert-danger').hide();
		},
		create: function() {
			var valid = true;
			// validate the title
			if(this.get("title") == null || "" == this.get("title").trim()) {
				$('#title-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				$('#title-group').removeClass('has-error');
			}
			
			// validate the description
			if(this.get("description") == null || "" == this.get("description").trim()) {
				$('#description-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				$('#description-group').removeClass('has-error');
			}

			if(valid) {
				this.send('createEvent');
			} else {
				window.scrollTo(0, 0);
			}
		},
    createEvent: function() { 
      var _self = this;
			this.set('creating', true);
			var user = Parse.User.current();
			// create the event 
			var Event = Parse.Object.extend("Event");
			var newEvent = new Event();
			// add the required data for the event
			newEvent.set("title", this.get("title").trim());
			newEvent.set("description", this.get("description").trim());
			newEvent.set("user", user);
			newEvent.set("active", false);
			var School = Parse.Object.extend("School"); 
			var parseSchool = new School();
			parseSchool.set("objectId", user.attributes.school.id);
			newEvent.set("school", parseSchool);
			
			// build the ACL for the event
			var acl = new Parse.ACL();
			acl.setWriteAccess(user.id, true);
			acl.setPublicReadAccess(true);
			newEvent.set("ACL",acl);
 
			// add the optional fields for the event object
			var location = this.get("location");
			if(location != null && location.trim() != "") {
				newEvent.set("location",location.trim());
			}
			var time = this.get("time");
			if(time != null && time.trim() != "") {
				newEvent.set("time",time.trim());
			}	
			var date = this.get("date");
			if(date != null && date.trim() != "") {
				newEvent.set("date",date.trim());
			}	

      newEvent.save(null, {
        success: function(event) {
					_self.send('hideRequiredAlert');
					$('#event-alert-danger').hide();
          $('#event-error-message').html('');
					$('#event-alert-success').show();
					$('#event-form').hide();
					_self.set('creating', false);
					// scroll the page back to the top
					window.scrollTo(0, 0);
					// reload the user's events
					_self.get('controllers.application').send('getCurrentUserEvents', user);
        },
        error: function(event, error) {
					console.log("Error: " + error.code + " " + error.message);
          // show the error message
          $('#event-alert-danger').show();
          $('#event-error-message').html(error.message);
          _self.set('creating', false);
					// scroll the page back to the top
					window.scrollTo(0, 0);
        }
      });
    }
	}
});