var name = module.exports.name = 'proxyvator-git'

var execCP = require('child_process').exec
	, which = require('which')
	, Q = require('q')

var check, clear, exec, setup

check = module.exports.check = function () {
	var deferred

	deferred = Q.defer()

	// Checking git program
	which('git', function (error, fullpath) {
		if (error) {
			deferred.reject(new Error(error))
		} else {
			deferred.resolve(fullpath)
		}
	})

	return deferred.promise
}

clear = module.exports.clear = function (options) {
	console.log(name + '::clear')

	check()
		.then(function (fullpath) {
			return exec('git config --global --unset http.proxy')
		})
		.then(function () {
			return exec('git config --global --unset https.proxy')
		})
		.then(function () {
			console.log(name + '::clear# SUCCESS')
		})
		.catch(function (error) {
			console.log(name + '::clear# ERROR:', error)
		})
		.finally()
}

exec = module.exports.exec = function (cmd) {
	var deferred

	deferred = Q.defer()

	// Checking git program
	execCP(cmd, function (error) {
		if (error) {
			deferred.reject(new Error(error))
		} else {
			deferred.resolve()
		}
	})

	return deferred.promise
}

setup = module.exports.setup = function (options) {
	console.log(name + '::setup')

	check()
		.then(function (fullpath) {
			return exec('git config --global http.proxy ' + options.http)
		})
		.then(function () {
			if (options.https) {
				return exec('git config --global https.proxy ' + options.https)
			}
		})
		.then(function () {
			console.log(name + '::setup# SUCCESS')
		})
		.catch(function (error) {
			console.log(name + '::setup# ERROR:', error)
		})
		.finally()
}
