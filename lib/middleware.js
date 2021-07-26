function is_start_page_small(start_page, max_page) {
	if (start_page <= max_page) {	
		return true
	}

	throw new Error("Start page must not greater than max page.")
}

module.exports = { is_start_page_small }
