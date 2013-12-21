/*********************************************************************************
 * Copyright (C) 2013 uLink, Inc. All Rights Reserved.
 *
 * Created On: 12/13/13
 * Description: This file will contain all of the environment specific
 *              configuration variables
 ********************************************************************************/
(function( window, undefined ) {
	var Config = {};
	Config.development = {
		image: {
			urls: {
	  		base: "http://localhost:8888/img/", 
	  		defaults: { 
	  			user: "defaults/default_user.jpg", 
	  			event: "defaults/default_campus_event.png", 
	  			snapshot: "defaults/default_snap.png", 
	  			featuredEvent: "defaults/default_featured_event.png"
	  		}, 
	  		snapshot: {
	  			original: "files/snaps/", 
	  			medium: "files/snaps/medium/", 
	  			thumb: "files/snaps/thumbs/"
	  		}, 
	  		event: {
	  			original: "files/events/", 
	  			medium: "files/events/medium/", 
	  			thumb: "files/events/thumbs/"
	  		}, 
	  		user: {
	  			original: "files/users/", 
	  			medium: "files/users/medium/", 
	  			thumb: "files/users/thumbs/"
	  		}, 
	  		school: {
	  			original: "files/schools/"
	  		}
			}
		}
	};

	Config.production = {
	    image: {
	    		urls: {
		    		base: "https://s3.amazonaws.com/ulink_images/img/", 
		    		defaults: { 
		    			user: "defaults/default_user.jpg", 
		    			event: "defaults/default_campus_event.png", 
		    			snapshot: "defaults/default_snap.png", 
		    			featuredEvent: "defaults/default_featured_event.png"
		    		}, 
		    		snapshot: {
		    			original: "files/snaps/", 
		    			medium: "files/snaps/medium/", 
		    			thumb: "files/snaps/thumbs/"
		    		}, 
		    		event: {
		    			original: "files/events/", 
		    			medium: "files/events/medium/", 
		    			thumb: "files/events/thumbs/"
		    		}, 
		    		user: {
		    			original: "files/users/", 
		    			medium: "files/users/medium/", 
		    			thumb: "files/users/thumbs/"
		    		}, 
		    		school: {
		    			original: "files/schools/"
		    		}
	    		}
	    	}
	};
	// If there is a window object, that at least has a document property,
	// define Config
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.Config = ("DEVELOPMENT" === window.App.env) ? Config.development : Config.production;
	}

})( window );