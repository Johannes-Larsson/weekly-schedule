module.exports = {
	getData: function (db, cb) {
		db.all('select * from schedule order by day asc', function (err, res) {
			cb(res);
		});
	},

	getTodaysData: function (db, cb) {
		var today = new Date().getDay();
		console.log('day: ' + today);
		db.get('select * from schedule where day = ?', today, function (err, res) {
			console.log('today: ' + res);
			cb(res);
		});
	},
}
