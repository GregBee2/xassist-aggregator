var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

var listValues=aggregate.listValues();
var obj={b:1}
var a=Array(10)
a[0]=1
a[1]=0
a[2]=1
a[3]=undefined
a[4]=false
a[5]={a:1}
a[6]=""
a[7]=obj
a[8]=obj
var a2=Array(10)
a2[0]={t:1                 }
a2[1]={t:0                 }
a2[2]={t:1                 }
a2[3]={t:undefined     }
a2[4]={t:false           }
a2[5]={t:{a:1}          }
a2[6]={t:""		          }
a2[7]={t:obj              }
a2[8]={t:obj              }
a2[9]={}

tape("aggregate.listValues(): lists unique occurences", function(test){
	listValues.addArray(a)
	var t2=listValues.getValue()
	var t3=listValues.removeArray(a.slice(6,8)).getValue()
	var t4=listValues.remove(undefined).remove(undefined).remove(true).remove(true).getValue()
	console.log(t2)
	test.ok(t2==="1, 0, [[undefined]], false, [object Object], [[empty]], [object Object]",
		"aggregate.listValues() handles objects, booleans, ... like it should differentiating when it must");
	test.ok(t3==="1, 0, [[undefined]], false, [object Object], [object Object]" &&t4=="1, 0, false, [object Object], [object Object]",
		"aggregate.listValues().removeArray() removes elements when encountered");
	test.end();
});
tape("aggregate.listValues(options): lists unique occurences", function(test){
	listValues=aggregate.listValues({seperator:"-",undefinedValue:"u",emptyValue:"e"});
	listValues.addArray(a)
	var t2=listValues.getValue()
	var t3=listValues.removeArray(a.slice(6,8)).getValue()
	var t4=listValues.remove(undefined).remove(undefined).remove(true).remove(true).getValue()
	console.log(t2)
	test.ok(t2==="1-0-u-false-[object Object]-e-[object Object]",
		"aggregate.listValues() handles objects, booleans, ... like it should differentiating when it must");
	test.ok(t3==="1-0-u-false-[object Object]-[object Object]" &&t4=="1-0-false-[object Object]-[object Object]",
		"aggregate.listValues().removeArray() removes elements when encountered");
	test.end();
});
tape("aggregate.listValues(attr): counts unique occurences for attribute of object in array", function(test){
	listValues=aggregate.listValues("t");
	listValues.addArray(a2)
	var t2=listValues.getValue()
	var t3=listValues.removeArray(a2.slice(6,8)).getValue()
	var t4=listValues.remove({t:undefined}).remove({}).remove({t:true}).remove({t:true}).getValue()

	test.ok(t2==="1, 0, [[undefined]], false, [object Object], [[empty]], [object Object]",
		"aggregate.listValues() handles objects, booleans, ... like it should differentiating when it must");
		test.ok(t3==="1, 0, [[undefined]], false, [object Object], [object Object]" &&t4=="1, 0, false, [object Object], [object Object]",
		"aggregate.listValues().removeArray() removes elements when encountered");
	test.end();
});
tape("aggregate.listValues(attr,options): counts unique occurences for attribute of object in array", function(test){
	listValues=aggregate.listValues("t",{seperator:"-",undefinedValue:"u",emptyValue:"e"});
	listValues.addArray(a2)
	var t2=listValues.getValue()
	var t3=listValues.removeArray(a2.slice(6,8)).getValue()
	var t4=listValues.remove({t:undefined}).remove({}).remove({t:true}).remove({t:true}).getValue()

	test.ok(t2==="1-0-u-false-[object Object]-e-[object Object]",
		"aggregate.listValues(attr,options) handles objects, booleans, ... like it should differentiating when it must");
		test.ok(t3==="1-0-u-false-[object Object]-[object Object]" &&t4=="1-0-false-[object Object]-[object Object]",
		"aggregate.listValues(attr,options).removeArray() removes elements when encountered");
	test.end();
});

