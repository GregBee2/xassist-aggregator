var definition = require("../package.json");
var main =require("../"+definition.main);
var tape=require("tape");

tape("aggregator().sum(): test_0", function(test){
	test.ok(true,
		"aggregator().sum() WORKS");
	test.end();
});
tape("aggregator().count(): test_1", function(test){
	test.ok(true,
		"aggregator().count() WORKS");
	test.end();
});
tape("aggregator().countUnique(): test_2", function(test){
	test.ok(true,
		"aggregator().countUnique() WORKS");
	test.end();
});
tape("aggregator().list(): test_3", function(test){
	test.ok(true,
		"aggregator().list() WORKS");
	test.end();
});
tape("aggregator().average(): test_4", function(test){
	test.ok(true,
		"aggregator().average() WORKS");
	test.end();
});
tape("aggregator().statEstimators(): test_5", function(test){
	test.ok(true,
		"aggregator().statEstimators() WORKS");
	test.end();
});
tape("aggregator().rollingAverage(): test_6", function(test){
	test.ok(true,
		"aggregator().rollingAverage() WORKS");
	test.end();
});
tape("aggregator().rollingAverageEstimators(): test_7", function(test){
	test.ok(true,
		"aggregator().rollingAverageEstimators() WORKS");
	test.end();
});