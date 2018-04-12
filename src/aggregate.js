import { default as XaAggregator } from "./aggregator.js"
import { default as count } from "./count.js"
import { default as sum } from "./sum.js"
import { default as average } from "./average.js"
import { default as simpleStat } from "./simpleStats.js"
import { countUnique,listValues } from "./uniqueValues.js"

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
aggregate.standardDeviation=simpleStat;

export default aggregate;