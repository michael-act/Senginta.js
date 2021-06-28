const cheerio = require('cheerio');

const Search = require('../search')
const { GOOGLE_URLS: { GOOGLE } } = require('./settings')

class GSearch extends Search {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.titles = []
		this.descs = []
		this.dates = []
		this.domains = []
		this.links = []

		this.URL = GSearch.URL
	}

	async get_main(tag, attr=null) {
		await this.get_result(this.URL, this.start_page_num, this.max_page_num)

		let results = tag === undefined && attr === null ? {} : []
		for (const page_num in this.htmlResponse) {
			const page = this.htmlResponse[page_num]
			const $ = cheerio.load(page)

			const search_entry = $('div')
				.filter((i, el) => {
					const val = $(el).attr('class')
					if (typeof(val) === 'string') {
						return val.split(' ').length === 4
					}
				})

			if (tag !== undefined && attr === null) {
				search_entry
					.each((i, el) => {
						const val = $(el).find(tag).text()
						results.push(val)
					})
			} else if (tag !== undefined && attr !== null) {
				search_entry
					.each((i, el) => {
						const val = $(el).find(tag).attr(attr)
						results.push(val)
				})
			} else {
				Object.assign(results, {[page_num]: []})
				search_entry
					.each((i, el) => {
						results[page_num].push(el)
					})
			}
		}

		return results
	}

	async get_title() {
		if (this.titles.length > 0) { return this.titles }

		this.titles = await this.get_main('h3')
		return this.titles
	}

	async get_desc() {
		if (this.descs.length > 0) { return this.descs }

		const search_entry = await this.get_main()
		for (const page_num in this.htmlResponse) {
			const page = this.htmlResponse[page_num]
			const $ = cheerio.load(page)
			const entry = search_entry[page_num]

			entry
				.forEach(sey => {
					$(sey)
						.each((i, el) => { 
							let date=null, desc=null
							$(el)
								.find('div > div > div > div')
									.each((i, el) => {
										if (i === 2) {
											const date_regex = /(([1-2][0-9])|([1-9])|(3[0-1]))\s[a-z]*\s[\d]{4}/gi
											const body = $(el).text()
											const match_date = body.match(date_regex)
											if (match_date) {
												date = match_date[0]
												desc = body.slice(body.indexOf(date)+date.length, body.length)
											} else {
												desc = body
											}
										}
									})
							this.dates.push(date)
							this.descs.push(desc)
							})
					})
			}

		return this.descs
	}

	async get_date() {
		if (this.dates.length > 0) { return this.dates }
		await this.get_desc()
		return this.dates
	}

	async get_domainNlink() {
		if (this.domains.length > 0) { return this.domains, this.links }
		const links = await this.get_main('a', 'href')
		links.forEach(url => {
			url = unescape(decodeURI(url))

			const google_p1 = url.indexOf('=') + 1
			const google_p2 = url.indexOf('&sa=')

			url = url.slice(google_p1, google_p2)
			this.links.push(url)

			const domainRegex = /(?:^https?:\/\/([^\/]+)(?:[\/,]|$)|^(.*)$)/
			this.domains.push(url.match(domainRegex)[1])
		})

		return [this.domains, this.links]
	}

	async get_all() {
		await this.get_title()
		await this.get_date()
		await this.get_desc()
		await this.get_domainNlink()

		return this.to_obj(GSearch.LABELS, this.dates, this.titles, 
						   				 this.descs, this.domains, this.links)
	}
}

GSearch.URL = GOOGLE
GSearch.LABELS = ['date', 'title', 'description', 'domain', 'link']

module.exports = GSearch
