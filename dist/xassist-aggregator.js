/**
* @preserve
* https://github.com/GregBee2/xassist-aggregator.git Version 0.0.1.
*  Copyright 2018 Gregory Beirens.
*  Created on Thu, 12 Apr 2018 11:54:20 GMT.
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.xa = global.xa || {})));
}(this, (function (exports) { 'use strict';

function XaAggregator(add,remove,initial,get){
	this.addFn=add||function(currentValue,record){return ++currentValue;};
	this.removeFn=remove||function(currentValue,record){return --currentValue;};
	this.initialFn=initial||function(){return 0;};
	this.getValue=get||function(){return this.value;};
	//init value
	this.reset();
}
XaAggregator.prototype.add=function(record){
	this.value=this.addFn(this.value,record);
	return this;
};
XaAggregator.prototype.remove=function(record){
	//maybe other parameters like index fro rolling average
	this.value=this.removeFn(this.value,record);
	return this;
};
XaAggregator.prototype.reset=function(){
	this.value=this.initialFn();
	return this;
};
XaAggregator.prototype.addArray=function(array){
	for(var i=0,len=array.length;i<len;i++){
		this.add(array[i]);
	}
	return this;
};
XaAggregator.prototype.removeArray=function(array){
	for(var i=0,len=array.length;i<len;i++){
		this.remove(array[i]);
	}
	return this;
};

function count(){
	return new XaAggregator();
}

function sum(attr){
	var add,remove;
	if(!attr){
		add=function(c,r){return c+(+r||0);};
		remove=function(c,r){return c-(+r||0);};
	}
	else{
		add=function(c,r){return c+(+r[attr]||0);};
		remove=function(c,r){return c-(+r[attr]||0);};
	}
	return new XaAggregator(add,remove);
}

/**
 *  we do not check if the element removed was really part of the original elements added
 *  this means that the average may be infinity!!
 */

function average(attr){
	var add,remove;
	if(!attr){
		add=function(c,r){return {sum:c.sum+(+r||0),len:++c.len};};
		remove=function(c,r){return {sum:c.sum-(+r||0),len:--c.len};};
	}
	else{
		add=function(c,r){return {sum:c.sum+(+r[attr]||0),len:++c.len};};
		remove=function(c,r){return {sum:c.sum-(+r[attr]||0),len:--c.len};};
	}
	return new XaAggregator(add,remove,
		function(){
			return {
				sum:0,
				len:0
			}
		},
		function(){return this.value.sum/this.value.len}
	);
}

function wellford(wPrevious,currentvalue){
	var d=currentvalue-wPrevious.mean;
	wPrevious.sum+=currentvalue;
	wPrevious.len++;
	wPrevious.mean+=(d)/(wPrevious.len);
	wPrevious.s+=d*(currentvalue-wPrevious.mean);
	return wPrevious;
}
function getEstimatorsWelford(w){
	var n,avg,s,v,se;
	n=w.len;
	avg=w.mean;
	//v=sample variance=> divide by n-1 (bessels correction)
	v=w.s/(n-1);
	s=Math.sqrt(v);
	se=s/Math.sqrt(n);
	return {
		standardDeviation:s,
		average:avg,
		length:n,
		variance:v,
		standardError:se,
		sum:w.sum
	};
}

function simpleStats(attr){
	//problem with calculation of variance (sumSquared-(sum*sum)/n)/(n-1)
	//this can lead to cancellation working with small values (sumSquared almost equals sum*sum/n)
	//so we use Welfords Method
	var add,remove;
	remove=function(c,r){throw new Error("not yet implemented");};
	if(!attr){
		add=function(c,r){return wellford(c,(+r||0));};
	}
	else{
		add=function(c,r){return wellford(c,(+r[attr]||0));};
	}
	return new XaAggregator(add,remove,
		function(){
			return {
				sum:0,
				len:0,
				mean:0,
				s:0
			}
		},
		function(){return getEstimatorsWelford(this.value)}
	);
}

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
function countUnique(attr){
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

function listValues(attr,options){
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

function createAggregator(add,remove,initial,get){
	return new XaAggregator(add,remove,initial,get);
}

var aggregate=createAggregator;
aggregate.create=createAggregator;
aggregate.count=count;
aggregate.countUnique=countUnique;
aggregate.listValues=listValues;
aggregate.sum=sum;
aggregate.average=average;
aggregate.standardDeviation=simpleStats;

exports.aggregate = aggregate;

Object.defineProperty(exports, '__esModule', { value: true });

})));
