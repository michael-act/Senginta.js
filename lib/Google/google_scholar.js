const cheerio = require('cheerio');

const Search = require('../search')
const { GOOGLE_URLS: { GOOGLE_SCHOLAR } } = require('./settings')

class GScholar extends Search {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.years = []
		this.titles = []
		this.descs = []
		this.authors = []
		this.links = []
		this.pdf_links = []
		this.journal_domains = []
		this.domains = []
		this.many_versions = []

		this.URL = GScholar.URL
	}

	async get_main(tag, attr=null) {
		await this.get_result(this.URL, this.start_page_num, this.max_page_num)

		const results = []
		for (const page_num in this.htmlResponse) {
			const page = this.htmlResponse[page_num]
			const $ = cheerio.load(page)

			const search_entry = $("div[class='gs_r gs_or gs_scl']")

			if (attr === null) {
				search_entry.each((i, el) => {
					const val = $(el).find(tag).text()
					results.push(val)
				}) 
			} else {
				search_entry.each((i, el) => {
					const val = $(el).find(tag).attr(attr)
					results.push(val)
				})
			}
		}

		return results
	}

	async get_year() {
		if (this.years.length > 0) { return this.years }
		const headArticle = await this.get_main("div[class='gs_a']")
		for (const head of headArticle) {
			const year = head.match(/\d{4}/)[0]
			const author = head.slice(0, head.indexOf('-'))

			const jdomain_regex = /([a-z0-9][a-z0-9\-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9\-]*[a-z0-9]/
			const catch_jdomain = head.match(jdomain_regex)
			const journal_domain = catch_jdomain ? catch_jdomain[0] : null

			this.years.push(year)
			this.authors.push(author)
			this.journal_domains.push(journal_domain)
		}

		return this.years
	}

	async get_title() {
		if (this.titles.length > 0) { return this.titles }
		this.titles = await this.get_main("h3[class='gs_rt']")
		return this.titles
	}

	async get_desc() {
		if (this.descs.length > 0) { return this.descs }
		this.descs = await this.get_main("div[class='gs_rs']")
		return this.descs	
	}

	async get_author() {
		if (this.authors.length > 0) { return this.authors }
		await this.get_year()
		return this.authors	
	}

	async get_link() {
		if (this.links.length > 0) { return this.links }
		this.links = await this.get_main("h3[class='gs_rt'] > a", "href")
		return this.links		
	}

	async get_pdflink() {
		if (this.pdf_links.length > 0) { return this.pdf_links }
		this.pdf_links = await this.get_main("div[class='gs_or_ggsm'] > a", "href")
		return this.pdf_links		
	}

	async get_journal_domain() {
		if (this.journal_domains.length > 0) { return this.journal_domains }
		await this.get_year()
		return this.journal_domains
	}

	async get_domain() {
		if (this.domains.length > 0) { return this.domains }
		await this.get_journal_domain()

		this.journal_domains.forEach(el => {
			let domain
			if (el !== null) {
				const domain_regex = /(\w{2,}\.\w{2,3}\.\w{2,3}|\w{2,}\.\w{2,3})$/
				domain = el.match(domain_regex)[1]
			}

			this.domains.push(domain)
		})

		return this.domains
	}

	async get_many_version() {
		if (this.many_versions.length > 0) { return this.many_versions }
		this.many_versions = await this.get_main("a[class='gs_nph']")
		return this.many_versions
	}

	async get_all() {
		await this.get_year()
		await this.get_title()
		await this.get_desc()
		await this.get_author()
		await this.get_link()
		await this.get_pdflink()
		await this.get_journal_domain()
		await this.get_domain()
		await this.get_many_version()

		return this.to_obj(GScholar.LABELS, this.years, this.titles, this.descs, 
						   this.authors, this.links, this.pdf_links, this.journal_domains, 
						   this.domains, this.many_versions)
	}
}

GScholar.URL = GOOGLE_SCHOLAR
GScholar.LABELS = ['year', 'title', 'description', 'authors', 'link', 
									 'pdf-link', 'journal-domain', 'domain', 'many-version']

module.exports = GScholar