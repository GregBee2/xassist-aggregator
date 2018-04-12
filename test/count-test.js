var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

var count=aggregate.count();
var a=Array(10);
tape("aggregate.count(): counts elements in array", function(test){
	var t1=count.addArray(a).getValue();
	var t2=count.add(1).getValue();
	var t3=count.remove(157).getValue();
	var t4=count.removeArray(a).getValue();
	test.ok(t1===10&&t2==11&&t3==10&&t4==0,
		"aggregate.count() counts elements in array");
	test.end();
});

