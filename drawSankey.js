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
	 
var colorDictionary = {}
for(var c in cats){
	var cat = cats[c]
	colorDictionary[cat]=colors[c%colors.length]
}
console.log(colorDictionary)
// set the dimensions and margins of the graph
var margin = {top: 60, right: 150, bottom: 10, left: 220},
    width = 900 - margin.left - margin.right,
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

svg.append("text").text("Census factors that go into each index").attr("x",-80).attr("y",-30).style("font-size","24px")

svg.append("text").text("Category").attr("x",-60).attr("y",-10).style("font-size","14px")
svg.append("text").text("Measure").attr("x",270).attr("y",-10).style("font-size","14px")
svg.append("text").text("Index").attr("x",660).attr("y",-10).style("font-size","14px")
// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(0)
    .nodePadding(10)
  .size([width, height]);

var path = sankey.links();


function formatLinks(data){
	var links = []
	var nodes = []
	var nodesIdList = []
	var linksIdList =[]
	for(var i in data){
		//console.log(data[i])
		var measure = data[i]["MEASURE"]
		if(measure!=undefined){
			var measure = measure.split(" ").join("_")
			
		if(nodesIdList.indexOf(measure)==-1){
			nodes.push({node:measure,name:measure,id:measure})
			nodesIdList.push(measure)
		}
		
		
		for(var j in data[i]){
			var indexName = j
			var indexValue = data[i][j]
			//console.log(indexValue)
			if(indexName!="MEASURE" &&indexName!="BROAD CATEGORY"){
				if(indexValue=="1"){
						var linksId = measure+"_"+indexName
					if(linksIdList.indexOf(linksId)==-1){
						var link = {source:measure,target:indexName,value:1,id:measure}
						links.push(link)
						
						linksIdList.push(linksId)
					}
					if(nodesIdList.indexOf(indexName)==-1){
						nodes.push({node:indexName,name:indexName,id:indexName})
						nodesIdList.push(indexName)
					
					}
	
				}
			}
		}
	}
	}
	//console.log(links)
	//console.log(nodes)
	
	var formatted = {nodes:nodes,links:links}
	//console.log(formatted)
	return formatted
}

// load the data
Promise.all([d3.csv("structure_data_clean_1.csv"),d3.csv("structure_data_clean_1.csv")])
.then(function(data) {
	var csvdata =data[0]
	
	
  //set up graph in same style as original example but empty
    sankeydata = {"nodes" : [], "links" : []};

    csvdata.forEach(function (d) {		
      sankeydata.nodes.push({ "name": d.source });
      sankeydata.nodes.push({ "name": d.target });
      sankeydata.links.push({ "source": d.source,
                         "target": d.target,
                         "value": 1 });
		 for(var index in d){
			 if(index!="source" && index!="target" && index!="value"){
				 if(d[index]=="1"){
				  sankeydata.links.push({ "source": d.target,
				                     "target": index,
				                     "value": 1});
		         sankeydata.nodes.push({ "name": index });
									
				 }
			 }
		 }
     });

//console.log(sankeydata)
    // return only the distinct / unique nodes
   sankeydata.nodes = Array.from(
      d3.group(sankeydata.nodes, d => d.name),
  	  ([value]) => (value)
    );

    // loop through each link replacing the text with its index from node
    sankeydata.links.forEach(function (d, i) {
		
      sankeydata.links[i].source = sankeydata.nodes
        .indexOf(sankeydata.links[i].source);
		
      sankeydata.links[i].target = sankeydata.nodes
        .indexOf(sankeydata.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    sankeydata.nodes.forEach(function (d, i) {
      sankeydata.nodes[i] = { "name": d };
    });
	sankeydata.links = sankeydata.links.sort(function(a,b){
		return a.source.name-b.source.name
	})
	
	console.log(sankeydata)
    graph = sankey(sankeydata);

	console.log(graph)
  // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
      .enter().append("path")
        .attr("class",function(d){
			//console.log(d)
        	return "link "+d.target.name.split(" ").join("")+" "+d.source.name.split(" ").join("")
        })
        .attr("d", d3.sankeyLinkHorizontal())
		.style("stroke","black")
		.style("opacity",.2)
		.style("fill","none")
	.style("stroke",function(d){
		if(d.source.layer==0){
			return colorDictionary[d.source.name]
		}else{
			return colorDictionary[d.source.targetLinks[0].source.name]
		}
		return "red"
	})
        .attr("stroke-width", function(d) { return 1; });  

  // add the link titles
    link.append("title")
          .text(function(d) {
      		    return d.source.name + " → " + 
                  d.target.name + "\n"; });

  // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node");

  // add the rectangles for the nodes
    node.append("rect")
        .attr("x", function(d) { return d.x0-d.name.length*5 })
        .attr("y", function(d) { return d.y0; })
        .attr("dy", "0.35em")
        .attr("height", function(d) { return 10})//d.y1 - d.y0; })
        .attr("width", function(d){
			return 0
			return d.name.length*5
        	return sankey.nodeWidth()
        }
		)
		.style('fill',"gold")
        // .style("fill", function(d) {
       //   		      return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
			return "none"
  		  return d3.rgb(d.color).darker(2); 
	  })
  	  .append("title")
        .text(function(d) { 
  		  return d.name + "\n"; });

  // add in the title for the nodes		  
		  
		  
    node.append("text")
       // .attr("x", function(d) { return d.x0-5; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", function(d){
			if(d.x0>500){
				return "start"
			}else if(d.x0>200){
				return "end"
			}
			return "end"
        })
		.style("fill",function(d){
			if(d.layer==0){
			//console.log(d.name)
				return colorDictionary[d.name]
			}else{
				return "black"
			}
		})
        .text(function(d) { return d.name; })
      // .filter(function(d) { return d.x0 > width-200; })
         .attr("x", function(d) { 
 			if(d.x0>500){
   			 return d.x1 + 5; 
 			}
			return d.x0-5
		 
		 })
		 .style("font-size", function(d) { 
 			if(d.x0>500){
   			 return "18px"; 
 			}else if(d.x0<120){
 				return "16px"
 			}
  			 return "11px"; 
		 
		 })
		 .on("mouseover",function(e,d){
			 console.log(d.name)
		 	d3.selectAll("path").style("opacity",0.1)
		 	d3.selectAll("."+d.name).style("opacity",1)
		 })
//         .attr("text-anchor", "start")
// 		.on("mouseover",function(d){
// 			console.log(d)
// 		});
		

});