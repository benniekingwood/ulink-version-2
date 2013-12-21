/**
 * User Model.  
 */
App.User = Ember.Object.extend({
	originalImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.original + this.get("imageURL");
	}.property("imageURL"),
	mediumImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.medium + this.get("imageURL");
	}.property("imageURL"),
	thumbImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.thumb  + this.get("imageURL");
	}.property("imageURL")
});