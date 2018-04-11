var csv2readme = require('csv2readme');

var options={
	input:{
		base:"../../helpData/csv/base.csv",
		functionParam:"../../helpData/csv/functionParameters.csv",
		classDef:"../../helpData/csv/classDefinition.csv"
	},
	moduleName:"xassist-aggregator",
	globalTOC:false,
	header:{
		title:"@xassist/xassist-aggregator",
		explanation:"Add aggregatefunctions for arrays to javascript"
	},
	headerFiles:["../../helpData/markdown/installationModule.md"],
	includeDependencies:true,
	includeLicense:true,
	footerFiles:[],
	subTitle:"API",
	output:{
		file:"README.md"
	},
	baseLevel:3,
	headerTemplates:{
		moduleName:"xassist-aggregator",
		moduleUrl:"https://github.com/GregBee2/xassist-aggregator.git",
		libraryName:"@xassist",
		libraryUrl:"https://github.com/GregBee2/xassist",
		moduleTest:"aggregator()"
	},
	footerTemplates:{
	}
};
csv2readme.init(options);