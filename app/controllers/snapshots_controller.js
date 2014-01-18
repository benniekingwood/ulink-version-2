App.SnapshotsController = Ember.ArrayController.extend({
	needs: ['application'],
	caption: null,
	tags: null,
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
			if(this.get("caption") == null || "" == this.get("caption").trim()) {
				$('#caption-group').addClass('has-error');
				this.send('showRequiredAlert');
				valid = false;
			} else {
				$('#caption-group').removeClass('has-error');
			}
			
			if(valid) {
				this.send('createSnapshot');
			} else {
				window.scrollTo(0, 0);
			}
		},
    createSnapshot: function() { 
      var _self = this;
			this.set('creating', true);
			var user = Parse.User.current();
			// create the snapshot 
			var Snapshot = Parse.Object.extend("Snapshot");
			var newSnapshot = new Snapshot();
			// add the required data for the snapshot
			newSnapshot.set("caption", this.get("caption").trim());
			newSnapshot.set("user", user);
			var School = Parse.Object.extend("School"); 
			var parseSchool = new School();
			parseSchool.set("objectId", user.attributes.school.id);
			newSnapshot.set("school", parseSchool);
			
			// build the ACL for the snapshot
			var acl = new Parse.ACL();
			acl.setWriteAccess(user.id, true);
			acl.setPublicReadAccess(true);
			newSnapshot.set("ACL",acl);
 
			// add the optional fields for the snapshot object
			var tags = this.get("tags");
			if(tags != null && tags.trim() != "") {
				newSnapshot.set("tags",tags.trim());
			}
			
      newSnapshot.save(null, {
        success: function(snapshot) {
					_self.send('hideRequiredAlert');
					$('#snapshot-alert-danger').hide();
          $('#snapshot-error-message').html('');
					$('#snapshot-alert-success').show();
					$('#snapshot-form').hide();
					_self.set('creating', false);
					// reset the form values
					_self.set('caption', null);
					_self.set('tags', null);
					// scroll the page back to the top
					window.scrollTo(0, 0);
					// reload the user's snapshots
					_self.get('controllers.application').send('getCurrentUserSnaps', user);
        },
        error: function(snapshot, error) {
					console.log("Error: " + error.code + " " + error.message);
          // show the error message
          $('#snapshot-alert-danger').show();
          $('#snapshot-error-message').html(error.message);
          _self.set('creating', false);
					// scroll the page back to the top
					window.scrollTo(0, 0);
        }
      });
    }
	}
});