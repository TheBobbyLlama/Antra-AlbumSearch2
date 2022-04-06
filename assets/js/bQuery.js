class BQuery {
	constructor(selector) {
		// Create a NodeList from a single passed element.
		if (selector.tagName) {
			selector.dataset.bQueryChooseMe = "true";
			this.elements = document.querySelectorAll("*[data-b-query-choose-me = 'true']");
			selector.dataset.qQueryChooseMe = "";
		// Passed a NodeList directly?
		} else if (selector.item) {
			this.elements = selector;
		// Passed a CSS selector, so find it.
		} else {
			this.elements = document.querySelectorAll(selector);
		}
	}
	data(key, value) {
		if (value !== undefined) {
			this.elements.forEach(element => {
				element.dataset[key] = value;
			});

			return this; // Return 'this' whenever possible for jQuery-style chaining.
		} else if (this.elements.length) {
			return this.elements[0].dataset[key];
		}
	}
	disable(shouldDisable = true) {
		this.elements.forEach(element => {
			element.disabled = shouldDisable;
		});

		return this;
	}
	forEach(cb) {
		this.elements.forEach((element, index, self) => {
			cb(element, index, self);
		});

		return this;
	}
	hide() {
		this.elements.forEach(element => {
			element.dataset.bQueryDisplay = element.style.display;
			element.style.setProperty("display", "none");
		});

		return this;
	}
	html(markup) {
		if (typeof markup === "string") {
			this.elements.forEach(element => {
				element.innerHTML = markup;
			});

			return this;
		} else if (this.elements.length) {
			return this.elements[0].innerHTML;
		}
	}
	on(eventType, cb) {
		this.elements.forEach(element => {
			element.addEventListener(eventType, cb);
		});

		return this;
	}
	show() {
		this.elements.forEach(element => {
			element.style.setProperty("display", element.dataset.bQueryDisplay || "");
		});

		return this;
	}
	tag() {
		if (this.elements.length) {
			return this.elements[0].tagName;
		}
	}
	val(value) {
		if (value !== undefined) {
			this.elements.forEach(element => {
				element.value = value;
			});

			return this;
		} else if (this.elements.length) {
			return this.elements[0].value;
		}
	}
}

function $(selector) {
	return new BQuery(selector);
}

$.ajax = function({ url, success, failure }) {
	fetchJsonp(url)
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			failure(false)
		}
	}, failure)
	.then(json => {
		success(json);
	}, failure);
}