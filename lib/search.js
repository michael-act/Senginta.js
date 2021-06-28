const { XMLHttpRequest } = require('xmlhttprequest')

const { is_start_page_small } = require('./middleware')

String.prototype.format = function() {
	var args = arguments
	return this.replace(/\{(\d+)\}/g, function (m, i) {
		return args[i]
	})
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Search{
	constructor(search_word, start_page=1, max_page=1) {
		this.search_word = search_word
		this.start_page = start_page
		this.max_page = max_page

		this.sleep = []
		this.obj_of_td = {}
		this.htmlResponse = {}

		this.search_entries = {}
	}

	async get_result(url, page_num, max_page_num) {
		if (Object.keys(this.htmlResponse).length > 0) {
			return this.htmlResponse
		}

		let num = this.start_page
		await (async () => { 
			while (page_num <= max_page_num) {
				const search_url = url.format(this.search_word, page_num)

				const page = new XMLHttpRequest()
				page.open( "GET", search_url, false )
				await page.send()

				Object.assign(this.htmlResponse, {[num]: page.responseText})
				page_num += 10
				num += 1

				const msSleep = Math.random() * 2000
				await sleep(msSleep)
				this.sleep.push(msSleep)
			}
		})()

		return this.htmlResponse
	}

	to_obj(labels, ...datas) {
		if (Object.keys(this.search_entries).length > 0) { return this.search_entries }

		this.search_entries = {}
		for (let i=0; i < datas[0].length; i++) {
			const entry = {}

			let labelID = 0
			for (const data of datas) {
				const label = labels[labelID]
				const value = data[i]
				
				Object.assign(entry, { [label]: value })
				labelID++
			}

			Object.assign(this.search_entries, {[i]: entry})
		}

		return this.search_entries
	}
}

module.exports = Search