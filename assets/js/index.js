const musicAPI = new iTunesAPI();

const domLookup = {
	elementResultPane: $("#artist-search-results"),
	elementSearchButton: $("#artist-search-form button"),
	elementSearchForm: $("#artist-search-form"),
	elementSearchText: $("#artist-search-form input[type='text']"),
	elementSearchWarnings: $("#artist-search-form .search-form__warning")
}

let displayCount;

function extractArtists(data) {
	const searchTerm = domLookup.elementSearchText.val().toLowerCase();

	return data.results
		.map(album => album.artistName) // Get artist names
		.filter((artist, index, self) => { return ((self.indexOf(artist) === index) &&  // Distinct
													(artist.toLowerCase() !== searchTerm)); }); // Not exact match to our search term.
}

function doArtistSearch(e, count) {
	e?.preventDefault();
	
	const artist = domLookup.elementSearchText.val();

	if (artist) {
		setSearchControls(true);
		showWarning("");

		musicAPI.searchArtist(artist, () => {
			displayCount = count || 10;
			localStorage.setItem("lastSearch", artist);
			localStorage.setItem("lastSearchCount", displayCount);
			setSearchControls(false);
			render(domLookup.elementResultPane,
				generateAlbumSearchResults(artist, musicAPI.data));
		}, () => {
			setSearchControls(false);
			showAPIError();
		});

		showLoadingSpinner();
	} else {
		showWarning("empty");
	}
}

function setSearchControls(freeze) {
	domLookup.elementSearchText.disable(freeze);
	domLookup.elementSearchButton.disable(freeze);
}

function showWarning(key) {
	domLookup.elementSearchWarnings.forEach(element => {
		const current = $(element);

		if (current.data("key") === key) {
			current.show();
		} else {
			current.hide();
		}
	});
}

function searchResultsClick(e) {
	const target = $(e.target);

	switch (target.tag()) {
		case "BUTTON":
			if (target.data("artist")) {
				domLookup.elementSearchText.val(target.data("artist"));
				doArtistSearch();
			} else if (target.data("action") === "load-more") {
				displayCount += 10;
				localStorage.setItem("lastSearchCount", displayCount);
				render(domLookup.elementResultPane,
					generateAlbumSearchResults(domLookup.elementSearchText.val(), musicAPI.data));
			}
			break;
	}
}

/* ---- CONTENT GENERATION ---- */
function showLoadingSpinner() {
	// From https://loading.io/css/
	render(domLookup.elementResultPane,
		`<div class="simple-center">
			<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
		</div>`);
}

function showAPIError() {
	render(domLookup.elementResultPane,
		`<h2>An error has occurred.  Please try again later.</h2>`);
}

function generateArtistOptionHtml(artist) {
	return `<button type="button" class="btn--simple" title="${artist}" data-artist="${artist}">${artist}</button>`;
}

function generateArtistOptions(artists) {
	if (artists.length) {
		const artistButtons = artists.map(artist => generateArtistOptionHtml(artist));

		return `<div class="option-results">
			<h3>Narrow Your Search</h3>
			<div class="option-results__display">
				${artistButtons.join("")}
			</div>
		</div>`
	} else {
		return "";
	}
}

function generateAlbumCardHtml(album) {
	return `<a class="album-card" href="${album.collectionViewUrl}" target="_blank">
		<img src="${album.artworkUrl100}" title="Album Art" />
		<h3>${album.collectionCensoredName}</h3>
		<h4>${album.artistName}</h4>
	</a>`;
}

function generateAlbumSearchResults(searchTerm, data) {
	const cards = data.results.map(item => generateAlbumCardHtml(item)).slice(0, displayCount);
	const artists = extractArtists(data);

	return `<h2>${data.resultCount} result${(data.resultCount !== 1) ? "s" : ""} for "${searchTerm}"</h2>
	${generateArtistOptions(artists)}
	<div class="album-results">
		${cards.join("")}
	</div>
	${(displayCount < data.results.length) ? `<button class="btn--simple" data-action="load-more">Load More</button>` : ""}`;
}

/* ---- DOM MANIPULATION ---- */
function render(element, content) {
	element.html(content);
}

function bindDomEvents() {
	domLookup.elementSearchForm.on("submit", doArtistSearch);
	domLookup.elementResultPane.on("click", searchResultsClick);
}

bindDomEvents();

domLookup.elementSearchText.val(localStorage.getItem("lastSearch"));

if (domLookup.elementSearchText.val()) {
	doArtistSearch(null, localStorage.getItem("lastSearchCount"));
}