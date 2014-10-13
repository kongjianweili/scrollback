module.exports = function(self) {
	return function() {
		var room = arguments[0] || state.roomName;
		/*
			widget.following() returns true if the current user is following the current room, false otherwise.
			widget.following('hasgeek') returns if the current user is following the hasgeek room.
			widget.following(true, callback) makes the current user follow the current room and triggers the callback when confirmation is received from the server.
			widget.following('hasgeek', false) makes the current user unfollow the current room.
		*/		
		if(arguments.length<=1) return (self.membership.indexOf(room)>=0);
		
	};
};