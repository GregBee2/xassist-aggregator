import { default as XaAggregator } from "./aggregator.js"
export default function sum(attr){
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