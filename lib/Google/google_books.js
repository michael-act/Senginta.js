const cheerio = require('cheerio');

const GSearch = require('./google_search')
const { GOOGLE_URLS: { GOOGLE_BOOKS } } = require('./settings')

class GBooks extends GSearch {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.titles = []
		this.descs = []
		this.domains = []
		this.links = []

		this.URL = GBooks.URL
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
							let desc=''
							$(el)
								.find('div > div > div > div')
									.each((i, el) => {
										if (i === 3) {
											desc = $(el).text()
										}
									})
							this.descs.push(desc)
							})
					})
			}

		return this.descs
	}

	async get_domainNlink() {
		if (this.domains > 0) { return this.domains, this.links }
		const links = await this.get_main('a', 'href')
		links.forEach(url => {
			url = unescape(decodeURI(url))
			const notUsefulParam = url.indexOf('&')

			url = url.slice(0, notUsefulParam)
			this.links.push(url)

			const domainRegex = /(?:^https?:\/\/([^\/]+)(?:[\/,]|$)|^(.*)$)/
			this.domains.push(url.match(domainRegex)[1])
		})

		return [this.domains, this.links]
	}

	async get_all() {
		await this.get_title()
		await this.get_desc()
		await this.get_domainNlink()

		return this.to_obj(GBooks.LABELS, this.titles, this.descs, 
						   this.domains, this.links)
	}
}

GBooks.URL = GOOGLE_BOOKS
GBooks.LABELS = ['title', 'description', 'domain', 'link']

module.exports = GBooks