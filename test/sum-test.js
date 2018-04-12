var definition = require("../package.json");
var { aggregate } =require("../"+definition.main);
var tape=require("tape");

var sum=aggregate.sum();
var obj={t:1}
var a=Array(10)
a[0]=2
a[1]=0
a[2]="3"
a[3]=undefined
a[4]=false
a[5]={t:1}
a[6]=true
a[7]=-1
a[8]=obj
var a2=Array(10)
a2[0]={t:2                 }
a2[1]={t:0                 }
a2[2]={t:"3"                 }
a2[3]={t:undefined     }
a2[4]={t:false           }
a2[5]={t:{t:1}          }
a2[6]={t:true          }
a2[7]={t:obj              }
a2[8]={t:-1             }
a2[9]={}
tape("aggregate.sum(): sums integers in array", function(test){
	var t1=sum.addArray(a).getValue();
	var t2=sum.add(1).getValue();
	var t3=sum.remove(157).getValue();
	var t4=sum.removeArray(a).getValue();
	test.ok(t1===5&&t2==6&&t3==-151&&t4==-156,
		"aggregate.sum() sums elements in array if nonNumeric it adds 0, it tries to convert non numeric values to numbers");
	test.end();
});
tape("aggregate.sum(attr): sums integers in array", function(test){
	sum=aggregate.sum("t");
	var t1=sum.addArray(a2).getValue();
	var t2=sum.add({t:1}).getValue();
	var t3=sum.remove({t:157}).getValue();
	var t4=sum.removeArray(a2).getValue();
	test.ok(t1===5&&t2==6&&t3==-151&&t4==-156,
		"aggregate.sum(attr) sums elements in array if nonNumeric it adds 0, it tries to convert non numeric values to numbers");
	test.end();
});

