import { default as XaAggregator } from "./aggregator.js"
/**
 *  we do not check if the element removed was really part of the original elements added
 *  this means that the average may be infinity!!
 */

export default function average(attr){
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