class iTunesAPI {
	constructor () {
		this._data = [];
		this._endpoint = "https://itunes.apple.com";
	}
	get data() {
		return this._data;
	}
	searchArtist(searchItem, success, failure) {
		const succeedMe = (data) => {
			this._data = data;
			success(data);
		}

		$.ajax({ url: `${this._endpoint}/search?term=${encodeURI(searchItem)}&media=music&entity=album&attribute=artistTerm&limit=200`,
				success: succeedMe,
				failure });
	}
}