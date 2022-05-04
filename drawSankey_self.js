var colors = ["#6f7bca",
"#68b854",
"#b05cc6",
"#bca947",
"#c65b8f",
"#4eb8b0",
"#d14343",
"#617f3e",
"#c07162",
"#c77631"]

 var cats = ["Gender", "Race", "Age", "Language", "Family", "Insurance", "Disability", "Housing", "Income", "Unemployment","Mobility","Occupation","Education","Transportation"]

var lineHeight = 11

var color1 = "#f9784c"
var color2 = "#cec243"
var color3 = "#84d957"
var catColor = 
{"Gender":color1, "Race":color1, "Age":color1, "Language":color1, "Family":color1, "Insurance":color1, "Disability":color1, "Housing":color2, "Income":color3, "Employment":color3,"Mobility":color2,"Occupation":color3,"Education":color3,"Transportation":color2}

function cleanString(string){
	var string = string.replace(/[^\w\s]/gi, '')
	return string.split(" ").join("").split("%").join("")
}

var indexNameLabels={
SVI:"Social Vulnerability Index",
	ADI:"area deprivation index",
CHR:"County Health Rankings",
	"Hard to Count":"Hard to count index(California)",
"NIH PVI":"Pandemic Vulnerability Index",
HDI:"The Human Development Index",
MDI: "Multidimensional Deprivation 2017",
	NRI:"National Risk Index for Natural Hazards",
	RAPT:"community resilience index",
	SoVI:"Social Vulnerability Index",
	BRIC:"Baseline Resilience Indicators for Communities",
"CVI San Mateo":"Community Vulnerability Index(San Mateo)",
	DCI:"Distressed Community Index",
WBI:"Community Well-Being Index",
	SDI:"Social Deprivation Index",
CRE:"Community Resilience Estimates",
	CNI:"Community Need Index",
NSES:"Socoeconomic Status 2011-2015",
"Fourth Economy":"Fourth Economy Community Index ",
"Opportunity":"Opportunity Atlas",
SES:"Socioeconomic Status (SES)",
EJScreen:"Environmental Justice Screening and Mapping",
"Food Environment Atlas":"Map the Meal Gap"	,
	CRI:"City Resilience Index"
}
var colorDictionary = {}
for(var c in cats){
	var cat = cats[c]
	colorDictionary[cat]=colors[c%colors.length]
}
//console.log(colorDictionary)
// set the dimensions and margins of the graph
var margin = {top: 40, right: 200, bottom: 10, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 1100 - margin.top - margin.bottom;  

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory10);
  
// append the svg object to the body of the page
var svg = d3.select("#sankeyChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

//svg.append("text").text("Census factors that go into each index").attr("x",-80).attr("y",-60).style("font-size","24px")

svg.append("text").text("Census Measure").attr("x",60).attr("y",-20).style("font-size","18px")
	.attr("text-anchor","end")
		  //
// svg.append("text").text("Census Measure").attr("x",280).attr("y",-20).style("font-size","18px")
// 	.attr("text-anchor","end")
svg.append("text").text("Index Name").attr("x",700).attr("y",-20).style("font-size","18px")
// Set the sankey diagram properties
// load the data
Promise.all([d3.csv("structure_data_clean_1.csv")])
.then(function(data) {
	var csvdata =data[0]
	
	//steps:
	//place cat nodes
	//place measure nodes acoording to cat nodes
	//place index nodes according to #factors they take
	//place links between measures and indices
	//place rectangle brackets between cat and measures
	var catNodes = []
	var measureNodes = []
	var catLinks = []
	var indexLinks = []
	
	var measureToCatDictionary = {}
	//cat y is the cumulative count
	for(var i in csvdata){
		var catName = csvdata[i].source
		catNodes.push(catName)
		var measureName = csvdata[i].target
		if(measureName!=undefined){
			 measureNodes.push({name:measureName,cat:catName,order:i})
			catLinks.push({source:catName,target:measureName})
		
			measureToCatDictionary[cleanString(measureName)]=catName
		
			for(var indexName in csvdata[i]){
				if(indexName!="source" && indexName!="target"){
					if(csvdata[i][indexName]=="1"){
						indexLinks.push({source:measureName,target:indexName})
					}
				}
			}
		}
		
	}
	var indexNodes = {}
	for(var l in indexLinks){
		if(Object.keys(indexNodes).indexOf(indexLinks[l].target)==-1){
			indexNodes[indexLinks[l].target]={count:0}
		}else{
			indexNodes[indexLinks[l].target]["count"]+=1
		}
	}
//	console.log(measureToCatDictionary)
	
	var sortedIndexKeys = Object.keys(indexNodes).sort(function(a,b){
		return indexNodes[b].count-indexNodes[a].count})
	
	var sortedIndexNodes = []
		var indexOrder = 0
	for(var si in sortedIndexKeys){
		var indexName = sortedIndexKeys[si]
		sortedIndexNodes.push({name:indexName,count:indexNodes[indexName].count})
	}
	//console.log(sortedIndexNodes)
	
	
	var catNodesU = []
	var catNodesDict = {}
	for(var c in catNodes){
		var nodeName = catNodes[c]
		if(nodeName!=undefined){
			if(Object.keys(catNodesDict).indexOf(nodeName)==-1){
				catNodesDict[nodeName] = {count:1}
			}else{
				catNodesDict[nodeName]["count"]+=1
			}
		}
	}
	var order = 0
	var catNodesList = []
	for(var c in catNodesDict){
		catNodesDict[c]["order"]=order
		catNodesList.push({name:c,order:order,count:catNodesDict[c]["count"]})
		order+=catNodesDict[c]["count"]+1
	}
	svg.selectAll(".cat")
	.data(catNodesList)
	.enter()
	.append("text")
	.text(function(d){return d.name})
	.attr("x",55)
		.attr("class","cat")
	.style("font-size","14px")
	.attr("y",function(d){
		//console.log(d)
		return d.order*lineHeight+10+d.count*lineHeight/2-5
	})
	.attr("cat",function(d){return d.name})
	.attr("text-anchor","end")
	.attr("fill",function(d){return "#000";catColor[d.name]})
	.attr("cursor","pointer")
	.on("mouseover",function(){
		var catName = d3.select(this).attr("cat")
		d3.selectAll(".indexLinks").style("opacity",.0)
		d3.selectAll("."+catName).style("opacity",.4)
		d3.selectAll(".cat").style("opacity",.1)
		d3.select(this).style("opacity",1)
	})
	.on("mouseout",function(){
		d3.selectAll(".indexLinks").style("opacity",.01)
		d3.selectAll(".cat").style("opacity",1)
	})
	
	
	measureNodes=measureNodes.sort(function(a,b){
		return a.cat+"_"+a.name-b.cat+"_"+b.name
		})
	//console.log(measureNodes)
		
	var measureNodesPlacement = {}
	var currentCat = measureNodes[0].cat
	var offset = 0
	svg.selectAll(".measures")
	.data(measureNodes)
	.enter()
	.append("text")
	.text(function(d){return ""})
	.attr("measure",function(d){
		if(d.name!=undefined){
			return cleanString(d.name)
		}
	})
	.attr("cursor","pointer")
	.attr("x",function(d,i){return 400})
		.style("text-anchor","start")
	.attr("y",function(d,i){
		//console.log(d.cat,currentCat)
		if(d.cat!=currentCat){
			offset+=1
			currentCat=d.cat
		}
		measureNodesPlacement[d.name]={y:i*lineHeight+offset*lineHeight+10,index:i,offset:offset}
		return i*lineHeight+offset*lineHeight+10
	})
	.on("mouseover",function(d){
		//var measure = d3.select(this).attr("measure")
		//console.log(d)
		//d3.selectAll("."+measure).style("opacity",1)
	})
	
	var indexLinkPath = d3.line().curve(d3.curveBasis)	
	svg.selectAll(".indexLinks")
	.data(indexLinks)
	.enter()
	.append("path")
	.attr('stroke', function(d){
		var cat = measureToCatDictionary[cleanString(d.source)]
		return catColor[cat]
	})
	.style('fill', 'none')
	.style("stroke-width",lineHeight-2)
	.style("opacity",.01)
	.attr("class",function(d){
		var catName = measureToCatDictionary[cleanString(d.source)]
 	   return "indexLinks "+cleanString(d.source)+" "+cleanString(d.target)+" "+catName
	})
	.attr("d",function(d,i){
 		var sourceY = 	measureNodesPlacement[d.source].y
		//console.log(measureNodesPlacement[d.source])
		var sourceXOffset =5// measureNodesPlacement[d.source].index*2
 		var targetY = sortedIndexKeys.indexOf(d.target)*40//sortedIndexNodes.indexOf(d.target)
 		
		var catName = measureToCatDictionary[cleanString(d.source)]
		var catPlaceY = (catNodesDict[catName].order+catNodesDict[catName].count/2)*lineHeight
		var middleXOffset = catNodesDict[catName].order*2//measureNodesPlacement[d.source].y%20//sourceY%10*15//sortedIndexKeys.indexOf(d.target)*5
	//	console.log(catNodesDict[catName].order)
 		var lineData = [[60,catPlaceY],
			[90,catPlaceY],[90,catPlaceY],
			[100,sourceY-sourceXOffset],[100,sourceY-sourceXOffset],
			[200-sourceXOffset,sourceY-5],
			[200-sourceXOffset,sourceY-5],
			[200-sourceXOffset,sourceY-5],
			[400+middleXOffset ,sourceY-5],
			[400+middleXOffset ,sourceY-5],
			[400+middleXOffset ,targetY-5+60],
			[400+middleXOffset ,targetY-5+60],
			[700-20,targetY-5+60],[700,targetY-5+60]
		]
 		//console.log(lineData)
 		return indexLinkPath(lineData)
 	})

	
	
	
	svg.selectAll(".indexNodes")
	.data(sortedIndexNodes)
	.enter()
	.append('text')
	.attr("class","indexNodes")
	.text(function(d){return indexNameLabels[d.name]})
	.attr("x",705)
	.attr("y",function(d,i){return i*40+60})
	.attr("id",function(d){return cleanString(d.name)})
	.style("font-size","14px")
	.on("mouseover",function(d){
		d3.selectAll(".indexLinks").style("opacity",.0)
		//d3.select(this).style("fill","black")
		var indexName = d3.select(this).attr("id")
		d3.selectAll(".indexNodes").style("opacity",.1)
		d3.select(this).style("opacity",1)
		//console.log(indexName)
		d3.selectAll("."+indexName).style("opacity",.4)
	})
	.attr("cursor","pointer")
	.on("mouseout",function(){
		d3.selectAll(".indexLinks").style("opacity",.01)
		d3.selectAll(".indexNodes").style("opacity",1)
	})
	
	svg.selectAll(".measures")
	.data(measureNodes)
	.enter()
	.append("text")
	.attr("cursor","pointer")
	.attr("class","measures")
	.text(function(d){return d.name})
		.attr("measure",function(d){
			if(d.name!=undefined){
			return cleanString(d.name)
			}
		})
	.attr("x",function(d,i){return 110})
		.attr("text-anchor","start")
		.attr("id",function(d){
			if(d.name!=undefined){
				return cleanString(d.name)
			}
		})
	.attr("y",function(d,i){
	//	console.log(d.name)
		return i*lineHeight+measureNodesPlacement[d.name].offset*lineHeight+10
		// //console.log(d.cat,currentCat)
	// 	if(d.cat!=currentCat){
	// 		offset+=1
	// 		currentCat=d.cat
	// 	}
	//	measureNodesPlacement[d.name]={y:i*lineHeight+offset*lineHeight+10,index:i,offset:offset}
		//return i*lineHeight+offset*lineHeight+10
	})
	.on("mouseover",function(d){
		d3.selectAll(".indexLinks").style("opacity",.0)
		d3.selectAll("."+d3.select(this).attr("measure")).style("opacity",.4)
		d3.selectAll(".measures").style("opacity",.1)
		d3.selectAll("#"+d3.select(this).attr("measure")).style("opacity",1)
		
	})
	.on("mouseout",function(){
		d3.selectAll(".indexLinks").style("opacity",.01)
		d3.selectAll(".measures").style("opacity",1)
	})

});