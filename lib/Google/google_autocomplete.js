const { XMLHttpRequest } = require('xmlhttprequest')
const { GOOGLE_URLS: { GOOGLE_AUTOCOMPLETE } } = require('./settings')

String.prototype.format = function() {
	var args = arguments
	return this.replace(/\{(\d+)\}/g, function (m, i) {
		return args[i]
	})
}

class GAutoComplete {
	constructor(search_word){
		this.search_word = search_word
		this.result = []
		this.URL = GAutoComplete.URL
	}

	get_all(){
		let search_url = this.URL.format(this.search_word)
		const page = new XMLHttpRequest()
			  page.open( "GET", search_url, false)
			  page.send()
		let rawresult = JSON.parse(page.responseText)
		let result = rawresult[0].map(arr => arr[0].replace(new RegExp('<[^>]*>', 'g'), ''))

		return {
			search_word : this.search_word,
			result,
		}
	}
}

GAutoComplete.URL = GOOGLE_AUTOCOMPLETE
module.exports = GAutoComplete
