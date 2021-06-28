const chai = require("chai");
const { GBooks } = require('../lib/index')

chai.should()

let ONE_PAGE_LENGTH
describe("Single Page Request to Google Books", () => {
	describe("Test All Function", () => {
		const google_books_find = new GBooks("Study From Home")

		it("Titles response should have correct datatype", async () => {
			async function try_GBooks_title() {
				const result = await google_books_find.get_title()
				return result
			}

			titles = await try_GBooks_title()
			titles.should.be.an('array')
			titles.should.have.lengthOf.above(5)
		})

		it("Descriptions response should have correct datatype", async () => {
			async function try_GBooks_desc() {
				const result = await google_books_find.get_desc()
				return result
			}

			descs = await try_GBooks_desc()
			descs.should.be.an('array')
			descs.should.have.lengthOf.above(5)
		})

		it("Links & Domains response should have correct datatype", async () => {
			async function try_GBooks_link() {
				const result = await google_books_find.get_domainNlink()
				return result
			}

			[domains, links] = await try_GBooks_link()
			domains.should.be.an('array')
			links.should.be.an('array')

			domains.should.have.lengthOf.above(5)
			links.should.have.lengthOf.above(5)
		})

		it("Result of GBooks must have correct datatype and property", async () => {
			async function try_GBooks_allfunc() {
				const result = await google_books_find.get_all()
				return result
			}

			allAttr = await try_GBooks_allfunc()
			allAttr.should.be.a('object')
			for (const entry in allAttr) {
				const entryVal = allAttr[entry]
				entryVal.should.be.a('object')
				entryVal.should.have.property('title')
				entryVal.should.have.property('description')
				entryVal.should.have.property('domain')
				entryVal.should.have.property('link')
			}

			ONE_PAGE_LENGTH = Object.keys(allAttr).length
		})
	})
})

let MULTIPLE_PAGE_LENGTH
describe("Multiple Page Request to Google Books", () => {
	const google_books_find = new GBooks("Study From Home", 1, 2)

	it("Result of GBooks must have correct datatype and property", async () => {
		async function try_GBooks_allfunc() {
			const result = await google_books_find.get_all()
			return result
		}

		allAttr = await try_GBooks_allfunc()
		allAttr.should.be.a('object')
		for (const entry in allAttr) {
			const entryVal = allAttr[entry]
			entryVal.should.be.a('object')
			entryVal.should.have.property('title')
			entryVal.should.have.property('description')
			entryVal.should.have.property('domain')
			entryVal.should.have.property('link')
		}

		MULTIPLE_PAGE_LENGTH = Object.keys(allAttr).length
	})

	it("Result of Multiple Page Request must be greater than Single Page Request", () => {
		MULTIPLE_PAGE_LENGTH.should.be.above(ONE_PAGE_LENGTH)
	})
}) 
