module.exports = {
	pages: {
		index: {
			entry: 'src/public/main.js',
			template: 'static/index.html',
			filename: 'index.html',
		},
		admin: {
			entry: 'src/admin/main.js',
			template: 'static/admin.html',
			filename: 'admin/index.html',
		},
	}
}