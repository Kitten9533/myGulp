var common = require('./apis/common');
var task = require('./apis/tasks');
var config = require('./apis/config');
var gulp = require('gulp');

// common.getDir(task.start());


gulp.task('default', () => {
	common.getDir(function(list) {
		task.startAll(list);
	});
});