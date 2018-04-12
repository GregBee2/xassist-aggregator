"use strict"


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
}
XaAggregator.prototype.remove=function(record){
	//maybe other parameters like index fro rolling average
	this.value=this.removeFn(this.value,record);
	return this;
}
XaAggregator.prototype.reset=function(){
	this.value=this.initialFn();
	return this;
}
XaAggregator.prototype.addArray=function(array){
	for(var i=0,len=array.length;i<len;i++){
		this.add(array[i]);
	}
	return this;
}
XaAggregator.prototype.removeArray=function(array){
	for(var i=0,len=array.length;i<len;i++){
		this.remove(array[i]);
	}
	return this;
}


export default XaAggregator