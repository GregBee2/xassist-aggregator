var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

tape("aggregate(): creates new aggregator", function(test){
	test.ok(aggregate().constructor.name==="XaAggregator",
		"aggregate() creates new aggregator");
	test.end();
});
tape("aggregate.create(): creates new aggregator", function(test){
	test.ok(aggregate.create().constructor.name==="XaAggregator",
		"aggregate.create() creates new aggregator");
	test.end();
});
