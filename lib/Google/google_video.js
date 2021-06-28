const cheerio = require('cheerio');

const GSearch = require('./google_search')
const { GOOGLE_URLS: { GOOGLE_VIDEO } } = require('./settings')

class GVideo extends GSearch {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.dates = []
		this.titles = []
		this.descs = []
		this.durs = []
		this.domains = []
		this.links = []

		this.URL = GVideo.URL
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
							let date='', desc='', duration=''
							$(el)
								.find('div > div > div > div')
									.each((i, el) => {
										if (i === 3) {
											[date, desc] = escape($(el).text()).split('%uFFFD')

											desc = unescape(desc)
											duration = desc.match(/([0-9]+)?(:)?([0-5]?[0-9]):([0-5]?[0-9])/)[0]

											const duration_id = desc.indexOf(duration)
											desc = desc.slice(0, duration_id)
										}
									})
							this.descs.push(desc)
							this.dates.push(unescape(date))
							this.durs.push(unescape(duration))
							})
					})
			}

		return this.descs
	}

	async get_dur() {
		if (this.durs.length > 0) { return this.durs }
		await this.get_desc()
		return this.durs
	}

	async get_all() {
		await this.get_title()
		await this.get_desc()
		await this.get_date()
		await this.get_dur()
		await this.get_domainNlink()

		return this.to_obj(GVideo.LABELS, this.dates, this.titles, 
						   this.descs, this.durs, this.domains, this.links)
	}
}

GVideo.URL = GOOGLE_VIDEO
GVideo.LABELS = ['date', 'title', 'description', 'duration', 'domain', 'link']

module.exports = GVideo