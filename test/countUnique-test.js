var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

var countUnique=aggregate.countUnique();
var obj={b:1}
var a=Array(10)
a[0]=1
a[1]=0
a[2]=1
a[3]=undefined
a[4]=false
a[5]={a:1}
a[6]={a:1}
a[7]=obj
a[8]=obj
var a2=Array(10)
a2[0]={t:1                 }
a2[1]={t:0                 }
a2[2]={t:1                 }
a2[3]={t:undefined     }
a2[4]={t:false           }
a2[5]={t:{a:1}          }
a2[6]={t:{a:1}          }
a2[7]={t:obj              }
a2[8]={t:obj              }
a2[9]={}

tape("aggregate.countUnique(): counts unique occurences", function(test){
	countUnique.addArray(a)
	var t1=[].concat(countUnique.value.result).filter(x=>typeof x[0]==="undefined")[0][1];
	var t2=countUnique.getValue()
	var t3=countUnique.removeArray(a.slice(6,8)).getValue()
	var t4=countUnique.remove(undefined).remove(undefined).remove(true).remove(true).getValue()
	test.ok(t1===2,
		"aggregate.countUnique() handles empty slots in array like undefined");

	test.ok(t2===7,
		"aggregate.countUnique() handles objects, booleans, ... like it should differentiating when it must");
	test.ok(t3===6 &&t4==5,
		"aggregate.countUnique().removeArray() removes elements when encountered");
	test.end();
});
tape("aggregate.countUnique(attr): counts unique occurences for attribute of object in array", function(test){
	countUnique=aggregate.countUnique("t");
	countUnique.addArray(a2)
	var t1=[].concat(countUnique.value.result).filter(x=>typeof x[0]==="undefined")[0][1];
	var t2=countUnique.getValue()
	var t3=countUnique.removeArray(a2.slice(6,8)).getValue()
	var t4=countUnique.remove({t:undefined}).remove({}).remove({t:true}).remove({t:true}).getValue()
	test.ok(t1===2,
		"aggregate.countUnique(attr) handles record without attribute as undefined");

	test.ok(t2===7,
		"aggregate.countUnique(attr) handles objects, booleans, ... like it should differentiating when it must");
	test.ok(t3===6 &&t4==5,
		"aggregate.countUnique(attr).removeArray() removes elements when encountered");
	test.end();
});

