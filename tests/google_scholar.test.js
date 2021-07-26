const chai = require("chai");
const { GScholar } = require('../lib/index')

chai.should()

GScholar.URL += "ANOTHER+URL+PARAMETER+TO+PASS+BOT"

let ONE_PAGE_LENGTH
describe("Single Page Request to Google Scholar", () => {
	describe("Test All Function", () => {
		const google_scholar_find = new GScholar("Naive Bayes Classifier")

		it("Titles response should have correct datatype", async () => {
			async function try_GScholar_title() {
				const result = await google_scholar_find.get_title()
				return result
			}

			titles = await try_GScholar_title()
			titles.should.be.an('array')
			titles.should.have.lengthOf.above(5)
		})

		it("Descriptions response should have correct datatype", async () => {
			async function try_GScholar_desc() {
				const result = await google_scholar_find.get_desc()
				return result
			}

			descs = await try_GScholar_desc()
			descs.should.be.an('array')
			descs.should.have.lengthOf.above(5)
		})

		it("Authors response should have correct datatype", async () => {
			async function try_GScholar_author() {
				const result = await google_scholar_find.get_author()
				return result
			}

			authors = await try_GScholar_author()
			authors.should.be.an('array')
			authors.should.have.lengthOf.above(5)
		})

		it("Year response should have correct datatype", async () => {
			async function try_GScholar_year() {
				const result = await google_scholar_find.get_year()
				return result
			}

			years = await try_GScholar_year()
			years.should.be.an('array')
			years.should.have.lengthOf.above(5)
		})

		it("Article version response should have correct datatype", async () => {
			async function try_GScholar_many_version() {
				const result = await google_scholar_find.get_many_version()
				return result
			}

			versions = await try_GScholar_many_version()
			versions.should.be.an('array')
			versions.should.have.lengthOf.above(5)
		})

		it("Article link response should have correct datatype", async () => {
			async function try_GScholar_link() {
				const result = await google_scholar_find.get_link()
				return result
			}

			links = await try_GScholar_link()
			links.should.be.an('array')
			links.should.have.lengthOf.above(5)
		})

		it("Article PDF link response should have correct datatype", async () => {
			async function try_GScholar_pdflink() {
				const result = await google_scholar_find.get_pdflink()
				return result
			}

			pdflinks = await try_GScholar_pdflink()
			pdflinks.should.be.an('array')
			pdflinks.should.have.lengthOf.above(5)
		})

		it("Article link domain response should have correct datatype", async () => {
			async function try_GScholar_domain() {
				const result = await google_scholar_find.get_domain()
				return result
			}

			domains = await try_GScholar_domain()
			domains.should.be.an('array')
			domains.should.have.lengthOf.above(5)
		})

		it("Journal link domain response should have correct datatype", async () => {
			async function try_GScholar_Jdomain() {
				const result = await google_scholar_find.get_journal_domain()
				return result
			}

			domains = await try_GScholar_Jdomain()
			domains.should.have.lengthOf.above(5)
		})

		it("Result of GScholar must have correct datatype and property", async () => {
			async function try_GScholar_allfunc() {
				const result = await google_scholar_find.get_all()
				return result
			}

			allAttr = await try_GScholar_allfunc()
			allAttr.should.be.a('object')
			for (const entry in allAttr) {
				const entryVal = allAttr[entry]
				entryVal.should.be.a('object')
				entryVal.should.have.property('year')
				entryVal.should.have.property('title')
				entryVal.should.have.property('description')
				entryVal.should.have.property('authors')
				entryVal.should.have.property('link')
				entryVal.should.have.property('pdf-link')
				entryVal.should.have.property('journal-domain')
				entryVal.should.have.property('domain')
				entryVal.should.have.property('many-version')
			}

			ONE_PAGE_LENGTH = Object.keys(allAttr).length
		})
	})
})

let MULTIPLE_PAGE_LENGTH
describe("Multiple Page Request to Google Scholar", () => {
	const google_scholar_find = new GScholar("Naive Bayes Classifier", 1, 2)

	it("Result of GScholar must have correct datatype and property", async () => {
		async function try_GScholar_allfunc() {
			const result = await google_scholar_find.get_all()
			return result
		}

		allAttr = await try_GScholar_allfunc()
		allAttr.should.be.a('object')
		for (const entry in allAttr) {
			const entryVal = allAttr[entry]
			entryVal.should.be.a('object')
			entryVal.should.have.property('year')
			entryVal.should.have.property('title')
			entryVal.should.have.property('description')
			entryVal.should.have.property('authors')
			entryVal.should.have.property('link')
			entryVal.should.have.property('pdf-link')
			entryVal.should.have.property('journal-domain')
			entryVal.should.have.property('domain')
			entryVal.should.have.property('many-version')
		}

		MULTIPLE_PAGE_LENGTH = Object.keys(allAttr).length
	})

	it("Result of Multiple Page Request must be greater than Single Page Request", () => {
		MULTIPLE_PAGE_LENGTH.should.be.above(ONE_PAGE_LENGTH)
	})
}) 
