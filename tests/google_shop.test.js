const chai = require("chai");
const { GShop } = require('../lib/')

chai.should()

let ONE_PAGE_LENGTH
describe("Single Page Request to Google Shop", () => {
	describe("Test All Function", () => {
		const google_shop_find = new GShop("IKEA - BEKANT", 'Rp')

		it("Titles response should have correct datatype", async () => {
			async function try_GShop_title() {
				const result = await google_shop_find.get_title()
				return result
			}

			titles = await try_GShop_title()
			titles.should.be.an('array')
			titles.should.have.lengthOf.above(5)
		})

		it("Prices response should have correct datatype", async () => {
			async function try_GShop_price() {
				const result = await google_shop_find.get_price()
				return result
			}

			prices = await try_GShop_price()
			prices.should.be.an('array')
			prices.should.have.lengthOf.above(5)
		})

		it("E-Commerce response should have correct datatype", async () => {
			async function try_GShop_ecommerce() {
				const result = await google_shop_find.get_ecommerce()
				return result
			}

			ecommerces = await try_GShop_ecommerce()
			ecommerces.should.be.an('array')
			ecommerces.should.have.lengthOf.above(5)
		})

		it("Product source link response should have correct datatype", async () => {
			async function try_GShop_src_link() {
				const result = await google_shop_find.get_src_link()
				return result
			}

			src_links = await try_GShop_src_link()
			src_links.should.be.an('array')
			src_links.should.have.lengthOf.above(5)
		})

		it("Product image link response should have correct datatype", async () => {
			async function try_GShop_img_link() {
				const result = await google_shop_find.get_img_link()
				return result
			}

			img_links = await try_GShop_img_link()
			img_links.should.be.an('array')
			img_links.should.have.lengthOf.above(5)
		})

		it("Result of GShop must have correct datatype and property", async () => {
			async function try_GShop_allfunc() {
				const result = await google_shop_find.get_all()
				return result
			}

			allAttr = await try_GShop_allfunc()
			allAttr.should.be.a('object')
			for (const entry in allAttr) {
				const entryVal = allAttr[entry]
				entryVal.should.be.a('object')
				entryVal.should.have.property('title')
				entryVal.should.have.property('price')
				entryVal.should.have.property('e-commerce')
				entryVal.should.have.property('src-link')
				entryVal.should.have.property('img-link')
			}

			ONE_PAGE_LENGTH = Object.keys(allAttr).length
		})
	})
})

let MULTIPLE_PAGE_LENGTH
describe("Multiple Page Request to Google Shop", () => {
	const google_shop_find = new GShop("IKEA - BEKANT", 'Rp', 1, 2)

	it("Result of GShop must have correct datatype and property", async () => {
		async function try_GShop_allfunc() {
			const result = await google_shop_find.get_all()
			return result
		}

		allAttr = await try_GShop_allfunc()
		allAttr.should.be.a('object')
		for (const entry in allAttr) {
			const entryVal = allAttr[entry]
			entryVal.should.be.a('object')
			entryVal.should.have.property('title')
			entryVal.should.have.property('price')
			entryVal.should.have.property('e-commerce')
			entryVal.should.have.property('src-link')
			entryVal.should.have.property('img-link')
		}

		MULTIPLE_PAGE_LENGTH = Object.keys(allAttr).length
	})
}) 
