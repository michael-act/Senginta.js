const chai = require("chai");
const { GVideo } = require('../lib/index')

chai.should()

let ONE_PAGE_LENGTH
describe("Single Page Request to Google Video", () => {
	describe("Test All Function", () => {
		const google_video_find = new GVideo("FAANG Companies")

		it("Titles response should have correct datatype", async () => {
			async function try_GVideo_title() {
				const result = await google_video_find.get_title()
				return result
			}

			titles = await try_GVideo_title()
			titles.should.be.an('array')
			titles.should.have.lengthOf.above(5)
		})

		it("Descriptions response should have correct datatype", async () => {
			async function try_GVideo_desc() {
				const result = await google_video_find.get_desc()
				return result
			}

			descs = await try_GVideo_desc()
			descs.should.be.an('array')
			descs.should.have.lengthOf.above(5)
		})

		it("Dates response should have correct datatype", async () => {
			async function try_GVideo_date() {
				const result = await google_video_find.get_date()
				return result
			}

			dates = await try_GVideo_date()
			dates.should.be.an('array')
			dates.should.have.lengthOf.above(5)
		})

		it("Durations response should have correct datatype", async () => {
			async function try_GVideo_dur() {
				const result = await google_video_find.get_dur()
				return result
			}

			durations = await try_GVideo_dur()
			durations.should.be.an('array')
			durations.should.have.lengthOf.above(5)
		})

		it("Links & Domains response should have correct datatype", async () => {
			async function try_GVideo_link() {
				const result = await google_video_find.get_domainNlink()
				return result
			}

			[domains, links] = await try_GVideo_link()
			domains.should.be.an('array')
			links.should.be.an('array')

			domains.should.have.lengthOf.above(5)
			links.should.have.lengthOf.above(5)
		})

		it("Result of GVideo must have correct datatype and property", async () => {
			async function try_GVideo_allfunc() {
				const result = await google_video_find.get_all()
				return result
			}

			allAttr = await try_GVideo_allfunc()
			allAttr.should.be.a('object')
			for (const entry in allAttr) {
				const entryVal = allAttr[entry]
				entryVal.should.be.a('object')
				entryVal.should.have.property('date')
				entryVal.should.have.property('title')
				entryVal.should.have.property('description')
				entryVal.should.have.property('duration')
				entryVal.should.have.property('domain')
				entryVal.should.have.property('link')
			}

			ONE_PAGE_LENGTH = Object.keys(allAttr).length
		})
	})
})

let MULTIPLE_PAGE_LENGTH
describe("Multiple Page Request to Google Video", () => {
	const google_video_find = new GVideo("FAANG Companies", 1, 2)

	it("Result of GVideo must have correct datatype and property", async () => {
		async function try_GVideo_allfunc() {
			const result = await google_video_find.get_all()
			return result
		}

		allAttr = await try_GVideo_allfunc()
		allAttr.should.be.a('object')
		for (const entry in allAttr) {
			const entryVal = allAttr[entry]
			entryVal.should.be.a('object')
			entryVal.should.have.property('date')
			entryVal.should.have.property('title')
			entryVal.should.have.property('description')
			entryVal.should.have.property('duration')
			entryVal.should.have.property('domain')
			entryVal.should.have.property('link')
		}

		MULTIPLE_PAGE_LENGTH = Object.keys(allAttr).length
	})

	it("Result of Multiple Page Request must be greater than Single Page Request", () => {
		MULTIPLE_PAGE_LENGTH.should.be.above(ONE_PAGE_LENGTH)
	})
}) 
