const cheerio = require('cheerio');

const GSearch = require('./google_search')
const { GOOGLE_URLS: { GOOGLE_NEWS } } = require('./settings')

class GNews extends GSearch {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.titles = []
		this.descs = []
		this.dates = []
		this.domains = []
		this.links = []

		this.URL = GNews.URL
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
										if (i === 1) {
											[date, desc] = $(el).text().split('�')
										}
									})
							this.dates.push(date)
							this.descs.push(desc)
							})
					})
			}

		return this.descs
	}

	async get_all() {
		await this.get_title()
		await this.get_date()
		await this.get_desc()
		await this.get_domainNlink()

		return this.to_obj(GNews.LABELS, this.dates, this.titles, 
						   this.descs, this.domains, this.links)
	}
}

GNews.URL = GOOGLE_NEWS
GNews.LABELS = ['date', 'title', 'description', 'domain', 'link']

module.exports = GNews
