/* jshint browser: true */

module.exports = function(core, config, store) {
	var React = require("react"),
		browserSupports = require("../../lib/browser-supports.js"),
		ChatItem = require("./chat-item.jsx")(core, config, store),
		Compose = require("./compose.jsx")(core, config, store),
		Endless = require("../../bower_components/endless/endless.js"),
		ChatArea;

	ChatArea = React.createClass({
		onScroll: function (key, before, after) {
			var time;

			if (key === "top") {
				time = 1;
			} else if (key === "bottom") {
				time = null;
			} else {
				time = parseInt(key.split("-").pop());
				if(isNaN(time)) time = null;
			}

			core.emit("setstate", {
				nav: {
					textRange: {
						time: time,
						before: before,
						after: after
					}
				}
			});
		},

		render: function() {
			var chatitems = [], atTop = false, atBottom = true,
				nav = store.getNav(),
				classNames = "main-content-chat chat-area",
				content, before, after, beforeItems, afterItems, beforeTime;

			// Don"t show
			if (store.getNav().mode !== "chat") {
				return <div />;
			}

			// Enhance chat area layout in modern browsers
			if (browserSupports.CSS("display", "flex")) {
				classNames += " chat-area-enhanced";
			}

			before = (nav.textRange.before || 0) + 11; /* one item will get removed */
			after = (nav.textRange.after || 0) + 10;

			beforeItems = store.getTexts(nav.room, nav.thread, nav.textRange.time || null, -before);
			afterItems = store.getTexts(nav.room, nav.thread, nav.textRange.time || null, after);

			atTop = (beforeItems.length < before && beforeItems[0] !== "missing");
			atBottom = (afterItems.length < after && afterItems[afterItems.length-1] !== "missing");

			if(beforeItems[0] === "missing") beforeItems.shift();
			if(afterItems[afterItems.length-1] == 'missing') afterItems.pop();

			if(beforeItems[beforeItems.length-1] && afterItems[0] &&
			   beforeItems[beforeItems.length-1].id === afterItems[0].id) {
				beforeItems.pop();
			} else if(beforeItems.length > before) {
				beforeItems.shift();
			}

			(beforeItems.concat(afterItems)).forEach(function(text, i, items) {
				var key, showtime;

				if (typeof text === "object") {
					showtime = (beforeTime && ((text.time - beforeTime) > 180000)) || (i === (items.length - 1));

					key = "chat-list-" + nav.room + "-" + nav.thread + "-" + text.id + "-" + text.time;

					chatitems.push(<ChatItem text={text} key={key} showtime={showtime} />);

					beforeTime = text.time;
				}
			});

			if (chatitems.length) {
				content = (
							<div className="chat-area-messages">
								<div className="chat-area-messages-list">
									<Endless key={'chat-area-' + nav.room + '-' + nav.thread} items={chatitems} onScroll={this.onScroll} atTop={atTop} atBottom={atBottom} />
								</div>
							</div>
				);
			} else {
				content = <div className="chat-area-empty">There are no messages yet :-(</div>;
			}

			return (
					<div className={classNames} data-mode="chat">
						{content}

						<Compose />
					</div>
			);
		}
	});

	return ChatArea;
};
