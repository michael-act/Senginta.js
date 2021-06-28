const cheerio = require('cheerio');

const Search = require('../search')
const { GOOGLE_URLS: { GOOGLE_SHOP } } = require('./settings')

class GShop extends Search {
	constructor(search_word, currency, start_page=1, max_page=1) {
		super(search_word, start_page, max_page)
		this.currency = currency
		this.start_page_num = start_page * 10
		this.max_page_num = max_page * 10

		this.titles = []
		this.src_links = []
		this.img_links = []
		this.e_commerces = []
		this.prices = []

		this.URL = GShop.URL
	}

	async get_main(tag, attr=null) {
		await this.get_result(this.URL, this.start_page_num, this.max_page_num)

		const results = []
		for (const page_num in this.htmlResponse) {
			const page = this.htmlResponse[page_num]
			const $ = cheerio.load(page)

			if (attr === null) {
				$(tag).each((i, el) => {
					const val = $(el).text()
					results.push(val)
				}) 
			} else {
				$(tag).each((i, el) => {
					const val = $(el).attr(attr)
					results.push(val)
				})
			}
		}

		return results
	}

	async get_title() {
		if (this.titles.length > 0) { return this.titles }
		this.titles = await this.get_main("div[class='sh-np__product-title translate-content']")
		return this.titles
	}

	async get_price() {
		if (this.prices.length > 0) { return this.prices }
		const prices_tmp = await this.get_main("b")
		prices_tmp.forEach(el => {
			if (el.indexOf(this.currency) > -1) {
				this.prices.push(el)
			}
		})

		return this.prices
	}

	async get_ecommerce() {
		if (this.e_commerces.length > 0) { return this.e_commerces }
		this.e_commerces = await this.get_main("div[class='sh-np__seller-container']")
		return this.e_commerces
	}

	async get_src_link() {
		if (this.src_links.length > 0) { return this.src_links }
		this.src_links = await this.get_main("a[class='sh-np__click-target']", "href")
		return this.src_links
	}

	async get_img_link() {
		if (this.img_links.length > 0) { return this.img_links }
		this.img_links = await this.get_main("img[role='presentation']", "src")
		return this.img_links
	}

	async get_all() {
		await this.get_title()
		await this.get_price()
		await this.get_ecommerce()
		await this.get_src_link()
		await this.get_img_link()

		return this.to_obj(GShop.LABELS, this.titles, this.prices, 
						   				 this.e_commerces, this.src_links, this.img_links)
	}
}

GShop.URL = GOOGLE_SHOP
GShop.LABELS = ['title', 'price', 'e-commerce', 'src-link', 'img-link']

module.exports = GShop