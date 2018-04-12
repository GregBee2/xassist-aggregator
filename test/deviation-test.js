var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

var standardDeviation=aggregate.standardDeviation();
var obj={t:1}
var a=[]
a[0]=5
a[1]=0
a[2]="7"
a[3]=-6
a[4]=-1
var a2=[]
a2[0]={t:5         }
a2[1]={t:0         }
a2[2]={t:"7"       }
a2[3]={t:-6        }
a2[4]={t:-1        }
var resultExpected1={
		standardDeviation:Math.sqrt(26.5),
		average:1,
		length:5,
		variance:26.5,
		standardError:Math.sqrt(26.5)/Math.sqrt(5),
		sum:5
	}
	var resultExpected2={
		standardDeviation:Math.sqrt(21.2),
		average:1,
		length:6,
		variance:21.2,
		standardError:Math.sqrt(21.2)/Math.sqrt(6),
		sum:6
	}
tape("aggregate.standardDeviation(): return statistics about array given", function(test){
	var t1=standardDeviation.addArray(a).getValue();
	var t2=standardDeviation.add(1).getValue();
	console.log(Math.sqrt)
	

	test.deepEqual(t1,resultExpected1,
		"aggregate.standardDeviation() calculates statistics as it should");
	test.deepEqual(t2,resultExpected2,
		"aggregate.standardDeviation().add() adds extra value and recalculates");
	test.end();
});
tape("aggregate.standardDeviation(attr): return statistics about attr in object in array given", function(test){
	standardDeviation=aggregate.standardDeviation("t");
	var t1=standardDeviation.addArray(a2).getValue();
	var t2=standardDeviation.add({t:1}).getValue();
	test.deepEqual(t1,resultExpected1,
		"aggregate.standardDeviation(attr) calculates statistics as it should");
	test.deepEqual(t2,resultExpected2,
		"aggregate.standardDeviation(attr).add() adds extra value and recalculates");
	test.end();
});

