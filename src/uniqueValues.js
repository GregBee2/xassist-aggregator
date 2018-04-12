import { default as XaAggregator } from "./aggregator.js"
function addCountUnique(c,v){
	var i=c.seen.get(v);
	if(typeof i!=="undefined"){
		c.result[i][1]++;
	}
	else{
		//push returns length, so we set the index of the resultarray in the map
		c.seen.set(v,c.result.push([v,1])-1);
	}
	return c;
}
function removeCountUnique(c,v){
	var i=c.seen.get(v);
	if(typeof i!=="undefined"){
		c.result[i][1]--;
		if(c.result[i][1]<1){
			c.seen.delete(v);
			c.result.splice(i, 1);
			c.seen.forEach(function(value,key){
				//reset indices for all elements in map
				if(value>=i){
					c.seen.set(key,value-1);
				}
			});
		}
	}
	else{
		//element was not added so no remove!
	}
	return c;
}
function initCountUnique(){
	return {
		seen:new Map(), //map with indexes to result [value,result.indexOf(value)]
		result:[] //result array  with as element [value, count]
	}
}
export function countUnique(attr){
	var add,remove;
	if(!attr){
		add=addCountUnique;
		remove=removeCountUnique;
	}
	else{
		add=function(c,r){return addCountUnique(c,r[attr]);};
		remove=function(c,r){return removeCountUnique(c,r[attr]);};
	}
	return new XaAggregator(
		add,
		remove,
		initCountUnique,
		function(){
			return this.value.result.length;
		}
	);
}

export function listValues(attr,options){
	var add,
		remove,
		sep=', ',
		undefVal="[[undefined]]",
		emptyVal="[[empty]]";
	if(arguments.length===0||typeof attr==="object"){
		add=addCountUnique;
		remove=removeCountUnique;
		options=(typeof attr==="object"?attr:{});
	}
	else{
		add=function(c,r){return addCountUnique(c,r[attr]);};
		remove=function(c,r){return removeCountUnique(c,r[attr]);};
		options=options||{};
	}
	sep=options.seperator||sep;
	undefVal=options.undefinedValue||undefVal;
	emptyVal=options.emptyValue||emptyVal;
	return new XaAggregator(
		add,
		remove,
		initCountUnique,
		function(){
			return this.value.result.map(function(x){
				if(typeof x[0]==="undefined"){
					return undefVal;
				}
				else if(x[0]===""){
					return emptyVal;
				}
				else{
					return x[0];
				}
			}).join(sep);
		}
	);
}