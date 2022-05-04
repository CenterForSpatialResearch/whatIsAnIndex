

//STEPS:
//draw basic map
//draw multiple axis graph for counties
//do highlights of counties

//highlight map on rollover of map
//highliht map on rollover of chart
//add addtioanl information
var lowColor = "#10B6A3"//"#84d957"
var midColor = "#cec243"
var highColor ="#FFF100"


// ["#10B6A3","#A2D352","#FFF100"]["#17DCFF","#7E6EFF","#E400FF"]

var color1 = "#f9784c"
var color2 = "#cec243"
var color3 = "#84d957"


 var numberToState = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}
 
 var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}
 
 var abbrDict = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH", "New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}

var indexDictionary={
	SVI:{column:"SPL_THEMES",columnLabel:"Combined Themes",indexLabel:"SVI - Social Vulnerability Index<br>",indexSource:"CDC",indexYear:"2018",indexDataYear:"2018",indexLink:""},
	
// responseRate:{column:"Census_Response_Rate_Social_Capital_Proxy",columnLabel:"Social Capital Proxy", indexLabel:"Census Return Rate Social Capital Proxy",indexSource:"",indexYear:"2010",indexDataYear:"2010",idnexLink:""},	//
	//
	 SoVI:{column:"CNTY_SoVI",columnLabel:"SoVI Percentile",indexLabel:"SoVI - Social Vulnerability Index<br>",indexSource:"University of South Carolina - Hazards & Vulnerability Research Institute (HVRI)",indexYear:"2014",indexDataYear:"2014",indexLink:""},
	
	NRI:{column:"NRI_RISK_SCORE",columnLabel:"Risk Score",indexLabel:"National Risk Index for Natural Hazards<br>",indexSource:"FEMA",indexYear:"2021",indexDataYear:"SoVI dependent",indexLink:""},
	//
	// OpportunityAtlas:{column:"Household_Income_at_Age_35_rP_gP_p25",columnLabel:"Income at 35",indexLabel:"The Opportunity Atlas",indexSource:"Harvard",indexYear:"2015",indexDataYear:"2015",indexLink:""},
	MDI:{column:"MDI rate",columnLabel:"MDI rate",indexLabel:"Multidimensional Deprivation Index<br>",indexSource:"Census",indexYear:"2017",indexDataYear:"2017",indexLink:""},
	
	CRE:{column:"CRE_PRED3_E", columnLabel:"Rate of individuals with three plus risk factors", indexLabel:"Community Resilience Estimates<br>", indexSource:"Census",indexYear:"2019",indexDataYear:"2017", indexLink:""},
	
	SDI:{column:"SDI_score",columnLabel:"Score",indexLabel:"Social Deprivation Index<br>",indexSource:"Robert Graham Center",indexYear:"2015",indexDataYear:"2015",indexLink:""},	//
	//
	// CHRFactors:{column:"CHR_Health Factors Rank",columnLabel:"County Health Factors Rank",indexLabel:"County Health Rankings Factors",indexSource:" University of Wisconsin Population Health Institute",indexYear:"2021",indexDataYear:"",indexLink:""},
	
	CHROutcomes:{column:"CHR_Health Outcomes Rank",columnLabel:"County Health Outcomes Rank",indexLabel:"County Health Rankings Outcomes<br>(including Years of Potential Life Lost)",indexSource:" University of Wisconsin Population Health Institute",indexYear:"2021",indexDataYear:"",indexLink:""},
	
	BRIC:{column:"BRIC",columnLabel:"BRIC",indexLabel:"Baseline Resilience Indicators for Communities<br>",indexSource:"University of South Carolina - Hazards & Vulnerability Research Institute (HVRI)",indexYear:"2015",indexDataYear:"",indexLink:""}}

	function toTitleCase(str) {
	  return str.toLowerCase().split(' ').map(function (word) {
	    return (word.charAt(0).toUpperCase() + word.slice(1));
	  }).join(' ');
	}

	var mapList = {}
var activeState = "AL"
var allCounties
var map 
var highlightColor = "magenta"
Promise.all([d3.csv("comparison_indices.csv"),d3.json("comparison_indices.geojson")])
.then(function(data){
	ready(data)
})

function ready(data){
	var indices = data[0]
	var counties = data[1]
	allCounties = data[1]
	//console.log(counties)
	
	
	
	var filteredData = counties.features.filter(function(d){ 
		return d.properties["ST_ABBR"] ==activeState
	})
	//console.log(counties)
	
	var oneState = {
		type:"FeatureCollection",
		name:"comparison_indices",
		crs:data[1].crs,
		features:filteredData
	}
		
	// var stateData = counties
// 	stateData.features = filteredData
	//console.log(counties)
	
	// d3.select("#currentState").html(activeState+": "+counties.features.length+" Counties")
	//properties.STATE
	var dataWithOrder = sortAndIndexForMap(oneState)
	
	var keyDiv = d3.select("#comparisonMaps").append("div").attr("id","key")
	
	drawKey(dataWithOrder)
	drawGridOfMaps(dataWithOrder)
	addDropdown()
}
function refilterMap(data){
	//console.log(mapList)
	//console.log(data)
	for(var i in indexDictionary){
		//var mapDiv = d3.select("#"+indexName+"_map")
		mapList[i].remove()
		drawMap(i+"_map",i,data)
		
	}
}

function addDropdown(){
	//console.log(allCounties)
	
	//var dropdown = d3.select("#currentState").append("select").attr("id","dropdownList")
	var stateSelection = document.getElementById("stateSelection")
	
	for(var i in abbrDict){
		var stateAbbr =abbrDict[i]
		//console.log(stateAbbr)
        var option = document.createElement("OPTION");
        option.value = stateAbbr
        option.id = stateAbbr
        option.innerHTML = toTitleCase(i)
		
        stateSelection.options.add(option);
	}
    $('#stateSelection').on("change",function(){
		activeState = this.value
		//console.log(this.value)
		
		var filteredData = allCounties.features.filter(function(d){ 
			//console.log(d.properties["ST_ABBR"]); 
			return d.properties["ST_ABBR"]==activeState
		})
		
		console.log(allCounties)
		
		var oneState = {
			type:"FeatureCollection",
			name:"comparison_indices",
			crs:allCounties.crs,
			features:filteredData
		}
		//console.log(oneState)
		
		var dataWithOrder = sortAndIndexForMap(oneState)
		d3.select("#key svg").remove()
		drawKey(dataWithOrder)
		refilterMap(dataWithOrder)
//		drawGridOfMaps(dataWithOrder)
	})
}

function drawGridOfMaps(dataWithOrder){
	for(var i in indexDictionary){
		console.log(indexDictionary[i]["indexYear"])
		var indexName = i
		var gridDiv = d3.select("#comparisonMaps").append("div").attr("id",indexName+"_grid")
		.style("width","300px").style("height","340px").style("display","inline-block").style("position","relative")
		
		var titleDiv = gridDiv.append("div").attr("id",indexName+"_title").html(indexDictionary[i].indexLabel+"  "+ indexDictionary[i]["indexYear"])
		.style("font-size","12px").style("font-weight",400).style("height","20px")//.style("z-index",9)
		
		
		var countyDiv = gridDiv.append("div").attr("id",indexName+"_county").html("").attr("class","county_label")
		.style("height","20px")//.style("border","1px solid")
		.style("position","absolute").style("top","20px")//.style("z-index",9)

		var mapDiv = gridDiv.append("div").attr("id",indexName+"_map").style("width","300px").style("height","300px")
		.style("position","absolute").style("top","40px")//.style("z-index",-1)
		drawMap(indexName+"_map",indexName,dataWithOrder)
	}
}


function drawKey(stateData){
	//console.log(stateData)
	var activeStateName = stateData.features[0].properties["STATE"]
	d3.select("#currentState").html("Ranking of "+toTitleCase(activeStateName)+"\'s "+stateData.features.length+" Counties across 8 indices")
	
	var countiesCount = stateData.features.length
	var keyRectWScale = d3.scaleLinear().domain([3,5,254]).range([30,20,3])
	var keyRectW = keyRectWScale(countiesCount)
	var keyRectH = 20
	var padding = 30
	
	var keyDiv = d3.select("#key")//.append("div").attr("id","key")//.html("key here with rollover")
	var keySvg = keyDiv.append("svg").attr("width",window.innerWidth)
	.attr("height",60).style("display","block").style('margin',"auto")
	var cScale = d3.scaleLinear().domain([0,countiesCount-1]).range([lowColor,highColor])
	
	var arr = new Array(countiesCount).fill(1);

	keySvg.append("text").text("Low").attr("x",2).attr("y",45)
	.style("text-anchor","start").style("font-weight",400)
	
	keySvg.append("text").text("High").attr("x",keyRectW*(countiesCount))
	.style("text-anchor","end")
	.attr("y",45).style("font-weight",400)
	
	keySvg.selectAll(".keyRect")
		.data(arr)
		.enter()
		.append("text")
		.attr("x",function(d,i){return i*keyRectW+keyRectW*.5})
		.attr("y",8)
		.text(function(d,i){ return countiesCount-i})
		.attr("id",function(d,i){ return "numberLabel_"+(countiesCount-i-1)})
	.style("text-anchor","middle")
		.style("font-size","11px").style("font-weight",400)
	.style("opacity",0)
	.style("font-size","center")
	
	keySvg.selectAll(".keyRect")
		.data(arr)
		.enter()
		.append("rect")
		.attr("class","keyRect")
		.attr("x",function(d,i){return i*keyRectW})
		.attr("y",10)
		.attr("id",function(d,i){return "key_"+(countiesCount-i-1)})
		.attr("width",keyRectW-1)
		.attr("height",keyRectH)
		.style("cursor","pointer")
		.attr("fill",function(d,i){
			return cScale(i)
		})
		.on("mouseover",function(d,i){

			var order = parseInt(d3.select(this).attr("id").split("_")[1])
			d3.selectAll("rect").attr("stroke","none")
			d3.select(this).attr("stroke","black")
			
			d3.selectAll("#numberLabel_"+order).style("opacity",1)
			var popupText = "<strong>Counties ranked "+(parseInt(order)+1)+"</strong><br>"
			
			var popupDictionary = {}
			
			for(var m in indexDictionary){
				mapList[m].setFilter(m+"_map_outline",["==",m+"_order",parseInt(order)])
				
				var filtered = stateData.features.filter(function(d){
					//console.log(d.properties)
					return d.properties[m+"_order"]==order
				})
				//console.log(filtered[0].properties)
				var filteredName = filtered[0].properties.COUNTY
				d3.select("#"+m+"_county")
				.html(filteredName+" County is ranked "+(parseInt(order)+1))//+" according to the "+m)
				//popupText+=m+": "+filteredName+" County<br>"
				if(Object.keys(popupDictionary).indexOf(filteredName)==-1){
					popupDictionary[filteredName]=[m]
				}else{
					popupDictionary[filteredName].push(m)
				}
			}
			for(var p in popupDictionary){
				
				popupText+="<strong>"+ popupDictionary[p].join(", ")+":</strong> "+p+" County<br>"
				
				// popupText+="<strong>"+p+" county</strong> is ranked <strong>"+order+"</strong> in <strong>"+ popupDictionary[p].join(", ")+"</strong><br><br>"
			}
			d3.select("#comparisonKeyPopup").html(popupText)
			.style("left",event.clientX+10+"px").style("top",event.clientY+10+"px")
			.style("visibility","visible")
		})
		.on("mouseout",function(d,i){
			d3.select(this).attr("stroke","none")
			var order = parseInt(d3.select(this).attr("id").split("_")[1])
			d3.selectAll("#numberLabel_"+order).style("opacity",0)
			
			d3.select("#comparisonKeyPopup").html("").style("visibility","hidden")
				
			for(var m in indexDictionary){
				mapList[m].setFilter(m+"_map_outline",["==",m+"_order",""])
				d3.select("#"+m+"_county").html("")
			}
				//d3.selectAll("#"+m+"_county").html("")
		})
	
}

function sortAndIndexForMap(indexData){
	  var sortedVersions = {}
	  for(var k in indexDictionary){
		 // console.log(dimensions[k])
		  // if(indexData!=undefined){
  // 		  	console.log(k)
  // 		  }
		  var key = indexDictionary[k].column
		  //console.log(key,indexData)

		  sortedVersions[k]={}
		  if(k=="BRIC" || k=="CHR"){
		 	 var sorted = indexData.features.sort(function(a,b){
				 return parseFloat(a[key])-parseFloat(b[key])
			 })
		  }else{
		  	var sorted = indexData.features.sort(function(a,b){
				return parseFloat(b.properties[key])-parseFloat(a.properties[key])
			})
		  }
		//  console.log(sorted)
		  for(var s in sorted){
		  	var FIPS = sorted[s].properties.FIPS
			  var order = s
			  sortedVersions[k][FIPS]=order
			//  sortedFIPS.push(FIPS)
		  }
	  }
	  
	  for(var i in indexData.features){
	  	var featureProperties = indexData.features[i].properties
		  var FIPS = indexData.features[i].properties.FIPS
		  var newProps = featureProperties
		  for(var d in indexDictionary){
		  	var indexName = d
			  var indexOrderForFIPS = sortedVersions[indexName][FIPS]
			  newProps[indexName+"_order"]=parseInt(indexOrderForFIPS)
		  }
		  indexData.features[i].properties=newProps
	  }
	  return indexData
}


function drawMap(divName,indexName,data){
	//console.log(divName)
//	console.log(data)
	var countiesCount = data.features.length
	//console.log(countiesCount)
	
	
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"

	var bounds = new mapboxgl.LngLatBounds();

	data.features.forEach(function(feature) {
		//console.log(feature.geometry.coordinates[0])
	    bounds.extend(feature.geometry.coordinates[0][0]);
	});

	//console.log(bounds)

    // var maxBounds = [
 //      [-74.635258, 40.2485374], // Southwest coordinates
 //      [-73.289334, 40.931799] // Northeast coordinates
 //    ];
   var map = new mapboxgl.Map({
        container: divName,
        style:"mapbox://styles/c4sr-gsapp/cl1qqth8n002u14qrc16lcys9",//,
       // maxZoom:15,
        zoom: 10,
		//center:[-75.711,42.619],
		interactive: false
    });
	
	map.fitBounds(bounds, {padding: 20, duration:0});	
	map.on("load",function(){
		//console.log(map)
		map.addSource('test', {
		'type': 'geojson',
		'data': data
		})
		
	    var matchString = {
	    property: indexName+"_order",
	    stops: [
			[0,highColor],
			[countiesCount,lowColor]
			]
	    }
		d3.selectAll(".mapboxgl-ctrl-bottom-left").remove()
		d3.selectAll(".mapboxgl-ctrl-bottom-right").remove()
		map.addLayer({
		'id': divName,
		'type': 'fill',
		'source': 'test', // reference the data source
		'layout': {},
		'paint': {
		'fill-color': matchString, // blue color fill
			'fill-opacity': 1,
			"fill-outline-color":"#fff"
		}
		},"water");
		
		map.addLayer({
		'id': divName+"_outline",
		'type': 'line',
		'source': 'test', // reference the data source
		'layout': {},
		'paint': {
		'line-color': "black", // blue color fill
			'line-width': 2
		}
		});
		
		var filter = ["==", "FIPS", ""]
		map.setFilter(divName+"_outline",filter)
		//console.log(map.getStyle().layers)
		//console.log(divName)
	
    map.on('mousemove',divName, function(e) {
		 var properties = e.features[0].properties
  	   	var FIPS = e.features[0].properties.FIPS

		 var gridMapPopupText = "<strong>"+e.features[0].properties.COUNTY+" County</strong> is ranked<br>"
		 
		 for(var m in indexDictionary){
			// console.log(m)
			mapList[m].setFilter(m+"_map_outline",["==","FIPS",FIPS])
			 var indexOrder = e.features[0].properties[m+"_order"]
			d3.select("#"+m+"_county")
			 .html(e.features[0].properties.COUNTY+" County is ranked "+indexOrder)
			 
			 gridMapPopupText+="<strong>"+indexOrder+"</strong> according to the <strong>"+m+"</strong><br>" 
			 			 //
			 // 	     	var caption =properties.NAME+" County<br>"+ gridName+" "+properties[gridName+"_order"]
			 // console.log(e.features[0].properties)
			 			 //
			 //  popupList[indexName] = new mapboxgl.Popup({ closeOnClick: false })
			 // .setLngLat([e.lngLat.lng, e.lngLat.lat])
			 // .setHTML(caption)
			 // .addTo(mapList[gridName]);
		 }
		 d3.select("#gridMapPopup").html(gridMapPopupText)
			.style("left",event.clientX+10+"px").style("top",event.clientY+10+"px")
		 .style("visibility","visible")
     })
	 
	 map.on('mouseleave', divName, () => {
		 for(var m in indexDictionary){
			mapList[m].setFilter(m+"_map_outline",["==","FIPS",""])
			 d3.select("#"+m+"_county").html("")
		 }
		 d3.select("#gridMapPopup").html("")
		 .style("visibility","hidden")
		 
	 })
		mapList[indexName]=map
	
	})

}


function drawParallAxis(data,dimensions){
  var margin = {top: 30, right: 10, bottom: 10, left: 20},
    width = 700 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
	
  // dimensions = d3.keys(data[0]).filter(function(d) { return d != "Species" })

    // For each dimension, I build a linear scale. I store all in a y object
    // var y = {}
  //   for (i in dimensions) {
  //     var dName = dimensions[i]
  //     y[dName] = d3.scaleLinear()
  //       .domain( d3.extent(data, function(d) {
  // 			return +d[dName];
  // 		}) )
  //       .range([height, 0])
  //   }
  y = d3.scaleLinear().domain([1,62]).range([0,height])
	var inverseY =  d3.scaleLinear().domain([1,62]).range([height,0])

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);
	  
	  var sortedVersions = {}
	  
	  for(var k in dimensions){
		 // console.log(dimensions[k])
		  var key = dimensions[k]
		  if(key=="BRIC" || key=="CHR"){
		 	 var sorted = data.sort(function(a,b){return parseFloat(a[key])-parseFloat(b[key])})
		  }else{
		  	var sorted = data.sort(function(a,b){return parseFloat(b[key])-parseFloat(a[key])})
		  }
		  var sortedFIPS = []
		  for(var s in sorted){
		  	var FIPS = sorted[s].FIPS
			  sortedFIPS.push(FIPS)
		  }
	  	sortedVersions[key]=sortedFIPS
	  }
	//  console.log(sortedVersions)
	  

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
		//console.log(d.FIPS)
        return d3.line().curve(d3.curveLinear)(dimensions.map(function(p) { 
		//	console.log(p);
			var version = sortedVersions[p]
		//	console.log(version)
			var index = version.indexOf(d.FIPS)
			//console.log(index)
			
			return [x(p), y(index+1)]; 
		}));
    }
	
	svg.selectAll("labels").data(data).enter()
	.append("text")
	.text(function(d){
		//console.log(d)
		return d.NAME
	})
	.attr("FIPS",function(d){return d.GEOID})
	.attr("id",function(d){
		return "FIPS_"+d.GEOID+"_label"
	})
	.attr("text-anchor","end")
	.attr("class","countyLabel")
      .style("opacity", 1)
      .style("fill", "#000000")
	.attr("x",70)
	.attr("y",function(d,i){
		var fips = d.FIPS
		var rankInSVI = sortedVersions["SVI_SPL_THEMES"].indexOf(fips)
		return y(rankInSVI)+12
	})
	.style("cursor","pointer")
	// .on("mouseover",function(){
	// 		map.setLayoutProperty("countiesHover","visibility", "visible")
	//
	// 		d3.selectAll(".countyLine").style("stroke","#000000")      .style("opacity", 0.1)
	// 		d3.selectAll(".countyLabel").style("fill","#000000")      .style("opacity", 0.5)
	// 		//d3.select(this).style("stroke-width",2).style("stroke","red")
	// 		var attrId = d3.select(this).attr("FIPS")
	// 		d3.selectAll("#FIPS_"+attrId+"_line").style("stroke",highlightColor)
	//       .style("opacity", 1)
	// 		d3.selectAll("#FIPS_"+attrId+"_label").style("fill",highlightColor)
	//       .style("opacity", 1)
	// 		// map.setLayoutProperty("countiesOutline","visibility", "visible")
	// 		 var filter = ["==", "FIPS",attrId]
	// 		map.setFilter("countiesHover",filter)
	// 	})
	// 	.on("mouseout",function(){
	// 		d3.selectAll(".countyLine").style("stroke","#000000").style("opacity", 0.1)
	// 		d3.selectAll(".countyLabel").style("fill","#000000").style("opacity", 0.5)
	// 		 var filter = ["==", "FIPS", ""]
	// 		map.setFilter("countiesHover",filter)
	// 	})

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", "#000000")
      .style("opacity", 0.1)
	.style("cursor","pointer")
	.style("stroke-width",1)
	.attr("FIPS",function(d){return d.GEOID})
	.attr("id",function(d){
		return "FIPS_"+d.GEOID+"_line"
	})
	.attr("class","countyLine")
	.on("mouseover",function(){
		map.setLayoutProperty("countiesHover","visibility", "visible")
		
		d3.selectAll(".countyLine").style("stroke","#000000")      .style("opacity", 0.1)
		d3.selectAll(".countyLabel").style("fill","#000000")      .style("opacity", 0.5)
		//d3.select(this).style("stroke-width",2).style("stroke","red")
		var attrId = d3.select(this).attr("FIPS")
		d3.selectAll("#FIPS_"+attrId+"_line").style("stroke",highlightColor)
      .style("opacity", 1)
		d3.selectAll("#FIPS_"+attrId+"_label").style("fill",highlightColor)
      .style("opacity", 1)		
		// map.setLayoutProperty("countiesOutline","visibility", "visible")
		 var filter = ["==", "FIPS",attrId]
		map.setFilter("countiesHover",filter)
	})
	.on("mouseout",function(){
		d3.selectAll(".countyLine").style("stroke","#000000").style("opacity", 0.1)
		d3.selectAll(".countyLabel").style("fill","#000000").style("opacity", 0.5)
		 var filter = ["==", "FIPS", ""]
		map.setFilter("countiesHover",filter)
	})
	// .on("mouseover",function(){
	// 		d3.selectAll(".countyLine").style("stroke","#aaaaaa")      .style("opacity", 0.2)
	// 		d3.selectAll(".countyLabel").style("fill","#aaa")      .style("opacity", 0.5)
	// 		//d3.select(this).style("stroke-width",2).style("stroke","red")
	// 		var attrId = d3.select(this).attr("FIPS")
	// 		d3.selectAll("#FIPS_"+attrId+"_line").style("stroke","red")
	//       .style("opacity", 1)
	// 		d3.selectAll("#FIPS_"+attrId+"_label").style("fill","red")
	//       .style("opacity", 1)
	// 	})
	// 	.attr("mouseout",function(){
	// 		d3.selectAll(".countyLine").style("stroke","#aaaaaa")      .style("opacity", 0.2)
	//
	// 		d3.selectAll(".countyLabel").style("fill","#aaa")      .style("opacity", 0.5)
	// 	})
    // Draw the axis:
    svg.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // And I build the axis with the call function
      .each(function(d) {
		 // console.log(d)
		  var index = d.split("_")[0]
		  if(index=="BRIC" || index=="CHR"){
		   	d3.select(this).call(d3.axisRight().scale(inverseY).tickValues([1,62]))//(2)); 
		   }else{
			   d3.select(this).call(d3.axisRight().scale(y).tickValues([1,62]));
		   }
	   })
      // Add axis title
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { 
			var indexName = d.split("_")[0]
			return indexName; })
        .style("fill", "#000")
			.style("font-size","18px")
}
