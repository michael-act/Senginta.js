const cheerio = require('cheerio')

const Search = require('../search')
const {BAIDU_URLS: { BAIDU_SEARCH }} = require('./settings')

class BASearch extends Search {
	constructor(search_word, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.start_page_num = (start_page-1) * 10
		this.max_page_num = (max_page-1) * 10

		this.titles = []
		this.descs = []
		this.authors = []
		this.authors_link = []
		this.domains = []
		this.links = []

		this.URL = BASearch.URL
	}

	async get_main(tag, attr=null) {
		await this.get_result(this.URL, this.start_page_num, this.max_page_num)

		const results = []
		for (const page_num in this.htmlResponse) {
			const page = this.htmlResponse[page_num]
			const $ = cheerio.load(page)

			console.log(page)
			const search_entry = $("div[class='result-op c-container new-pmd xpath-log'], div[class='result c-container new-pmd']")

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

	async get_title() {
		if (this.titles.length > 0) { return this.titles }
		this.titles = await this.get_main("h3")
		return this.titles
	}

	async get_desc() {
		if (this.descs.length > 0) { return this.descs }
		this.descs = await this.get_main("div[class^='c-abstract']")
		return this.descs
	}

	async get_author() {
		if (this.authors.length > 0) { return this.authors }
		this.authors = await this.get_main("a[class='c-gray']")
		return this.authors
	}

	async get_author_link() {
		if (this.authors_link.length > 0) { return this.authors_link }
		this.authors_link = await this.get_main("a[class='c-gray']", 'href')
		return this.authors_link
	}	

	async get_domainNlink() {
		if (this.domains.length > 0) { return this.domains }
		const links_tmp = await this.get_main("a", 'href')
		links_tmp.forEach(el => {
			this.links.push(el)

			const domain_regex = /(\w{2,}\.\w{2,3}\.\w{2,3}|\w{2,}\.\w{2,3})$/
			this.domains.push(el.match(domain_regex)[1])
		})

		return this.domains, this.links
	}

	async get_all() {
		await this.get_title()
		await this.get_desc()
		await this.get_author()
		await this.get_author_link()
		await this.get_domainNlink()

		return this.to_obj(BASearch.LABELS, this.titles, this.descs, this.authors, 
											 this.authors_link, this.domains, this.links)
	}
}

BASearch.URL = BAIDU_SEARCH
BASearch.LABELS = ['title', 'description', 'author', 'author_link', 'domain', 'link']

module.exports = BASearch
