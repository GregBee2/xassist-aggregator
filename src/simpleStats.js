import { default as XaAggregator } from "./aggregator.js"
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

export default function simpleStats(attr){
	//problem with calculation of variance (sumSquared-(sum*sum)/n)/(n-1)
	//this can lead to cancellation working with small values (sumSquared almost equals sum*sum/n)
	//so we use Welfords Method
	var add,remove;
	remove=function(){throw new Error("not yet implemented");};
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