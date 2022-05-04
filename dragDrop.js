
//copy over the which index has what sankey data, 
//use that to fill in the new data with formulas
//merge with geojson
//make dictionary of on and off categories, recalculate each click
//recreate sort into percentile, add percentile and sort again

var numberToState = {'01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI'}

var stateToNumber = {'WA': '53', 'DE': '10', 'DC': '11', 'WI': '55', 'WV': '54', 'HI': '15', 'FL': '12', 'WY': '56', 'NH': '33', 'NJ': '34', 'NM': '35', 'TX': '48', 'LA': '22', 'NC': '37', 'ND': '38', 'NE': '31', 'TN': '47', 'NY': '36', 'PA': '42', 'CA': '06', 'NV': '32', 'VA': '51', 'GU': '66', 'CO': '08', 'VI': '78', 'AK': '02', 'AL': '01', 'AS': '60', 'AR': '05', 'VT': '50', 'IL': '17', 'GA': '13', 'IN': '18', 'IA': '19', 'OK': '40', 'AZ': '04', 'ID': '16', 'CT': '09', 'ME': '23', 'MD': '24', 'MA': '25', 'OH': '39', 'UT': '49', 'MO': '29', 'MN': '27', 'MI': '26', 'RI': '44', 'KS': '20', 'MT': '30', 'MP': '69', 'MS': '28', 'PR': '72', 'SC': '45', 'KY': '21', 'OR': '41', 'SD': '46'}

var abbrDict = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH", "New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}

var combinationCensusCats = {over65:{columns:["SE_A01001_011","SE_A01001_012","SE_A01001_013"],totalColumn:"SE_A01001_001"},
minority:{columns:["SE_A03001_003","SE_A03001_004","SE_A03001_005","SE_A03001_006","SE_A03001_007","SE_A03001_008"],totalColumn:"SE_A03001_001"},
under18:{columns:["SE_A01001_002","SE_A01001_003","SE_A01001_004","SE_A01001_005"],totalColumn:"SE_A01001_001"},
multiUnit:{columns:["ACS20_5yr_B25024007","ACS20_5yr_B25024008","ACS20_5yr_B25024009"],totalColumn:"ACS20_5yr_B25024001"}
}
var singleCensusCats = ["SE_A00002_002","SE_A01001_002","SE_A02001_003","SE_A09005_003","SE_A09005_009","SE_A10003_001","SE_A10008_002","SE_A10008_003","SE_A10008_006","SE_A10008_007","SE_A10017_002","SE_A10030_002","SE_A10065_002","SE_A12002_002","SE_A13002_002","SE_A13003A_002","SE_A13003C_002","SE_A14006_001","SE_A14024_001","SE_A17005_003","SE_A19001_002","SE_A20001_002","ACS20_5yr_B25047003","ACS20_5yr_B25051003","ACS20_5yr_B05001005","ACS20_5yr_B25024007","ACS20_5yr_B25024008","ACS20_5yr_B25024009","ACS20_5yr_B25024010","ACS20_5yr_B25034011","ACS20_5yr_B25077001","ACS20_5yr_B28008009","ACS20_5yr_B28008010","ACS20_5yr_B28008004","ACS20_5yr_C24050029"]
//
// var highColor = "#E400FF"
// var lowColor = "#17DCFF"

var lowColor = "#10B6A3"//"#84d957"
var midColor = "#cec243"
var highColor ="#FFF100"

var censusKeys
var cPrefix = "ACS20_5yr_"
// var sePrefix = "SE_"
var onOffDragDrop = {}
var processedGeojson
var totalCats = singleCensusCats.length+Object.keys(combinationCensusCats).length
var dragDropMap
var activeCats=[]
var dragDropActiveState = "AK"
var currentStateData = null
var inverseCategories = ["SE_A14024_001"]

var SVIPreset = ["SE_A13002_002"," SE_A10030_002","SE_A17005_003","SE_A12002_002","SE_A14024_001","over65","minority","SE_A10065_002","under18","ACS20_5yr_B25024010","multiUnit","SE_A19001_002","SE_A14024_001","SE_A20001_002"
]

function makeOnOffDictionary(){
	
	for(var i in singleCensusCats){
		onOffDragDrop[singleCensusCats[i]]=false
	}
	for(var j in combinationCensusCats){
		onOffDragDrop[j]=false
	}
}

Promise.all([d3.json("countiesShapfile.geojson"),d3.csv("R13120292_SL050.csv"),d3.csv("censusKeys.csv")])
.then(function(dragDropDataFile){
    dragDropMain(dragDropDataFile)
})

function addDragDropDropdown(){
	var stateSelection = document.getElementById("dragDropStateSelection")
	
	for(var i in abbrDict){
		var stateAbbr =abbrDict[i]
		//console.log(stateAbbr)
        var option = document.createElement("OPTION");
        option.value = stateAbbr
        option.id = stateAbbr
        option.innerHTML = toTitleCase(i)
		
        stateSelection.options.add(option);
	}
    $("#dragDropStateSelection").on("change",function(){
	//console.log("change")
		
		dragDropActiveState = this.value
		// console.log(this.value)
	// 	console.log(stateToNumber[dragDropActiveState])
	//
	//
		
		var filteredData = processedGeojson.features.filter(function(d){ 
			//console.log(d.properties["ST_ABBR"]); 
			return d.properties["STATEFP"]==stateToNumber[dragDropActiveState]
		})
		
		
		currentStateData = {
			type:"FeatureCollection",
			name:"comparison_indices",
			crs:processedGeojson.crs,
			features:filteredData
		}
		//console.log(currentStateData)
		
		var dataWithOrder = sortAndIndexForMap(currentStateData)
		//d3.select("#key svg").remove()
		dragDropMap.remove()
		
		drawDragDropMap(currentStateData)
		
		// drawKey(dataWithOrder)
		// refilterMap(dataWithOrder)
//		drawGridOfMaps(dataWithOrder)
	})
}


function dragDropMain(dragDropData){
	//console.log(dragDropData)
	addDragDropDropdown()
	makeOnOffDictionary()
//	console.log(onOffDragDrop){
	
	censusKeys = makeCensusKeysDictionary(dragDropData[2])	
	
	//calculate everything according to guide
	var formattedData = formatCensusDataSingle(dragDropData[1])
	formattedData = formatCenssuDataCombo(dragDropData[1],formattedData)
	//console.log(formattedData)

	//calculate perentile
	
	var dataWithPercentiles = formateCensusPercentiles(formattedData)
	
	processedGeojson = addDataToGeojson(dataWithPercentiles,dragDropData[0])
	

		
		var filteredData = processedGeojson.features.filter(function(d){ 
			//console.log(d.properties["ST_ABBR"]); 
			return d.properties["STATEFP"]==stateToNumber[activeState]
		})
		
		
		currentStateData = {
			type:"FeatureCollection",
			name:"comparison_indices",
			crs:processedGeojson.crs,
			features:filteredData
		}
		
		
	drawDragDropMap(currentStateData)
	
	for(var i in singleCensusCats){
		var cat = singleCensusCats[i]
		if(censusKeys[singleCensusCats[i]].columnType=="percent"){
			var catName = "% "+censusKeys[singleCensusCats[i]].label
		}else{
			var catName = censusKeys[singleCensusCats[i]].label
		}
		if(SVIPreset.indexOf(cat)==-1){
			d3.select("#inactive").append("div").html(catName).attr("id",singleCensusCats[i])
			.style("border","1px solid black").style("padding","2px").style("margin","2px")
			.style("display","inline-block").style("font-size","11px")
			.style("font-weight",400)
			.attr("draggable",true)
			.attr("class","metric")
			.attr("ondragstart","drag(event)")
			.style("cursor","pointer")
		}else{
			if(inverseCategories.indexOf(cat)>-1){
				d3.select("#green").append("div").html(catName).attr("id",singleCensusCats[i])
				.style("border","1px solid black").style("padding","2px").style("margin","2px")
				.style("display","inline-block").style("font-size","11px")
				.style("font-weight",400)
				.attr("draggable",true)
				.attr("class","metric")
				.attr("ondragstart","drag(event)")
				.style("cursor","pointer")
			}else{
				d3.select("#red").append("div").html(catName).attr("id",singleCensusCats[i])
				.style("border","1px solid black").style("padding","2px").style("margin","2px")
				.style("display","inline-block").style("font-size","11px")
				.style("font-weight",400)
				.attr("draggable",true)
				.attr("class","metric")
				.attr("ondragstart","drag(event)")
					.style("cursor","pointer")
				}
			
		}
	}
	for(var c in combinationCensusCats){
		console.log(c)
		var cat = c
		var catName = c
		if(SVIPreset.indexOf(cat)==-1){
			d3.select("#inactive").append("div").html(catName).attr("id",catName)
			.style("border","1px solid black").style("padding","2px").style("margin","2px")
			.style("display","inline-block").style("font-size","11px")
			.style("font-weight",400)
			.attr("draggable",true)
			.attr("class","metric")
			.attr("ondragstart","drag(event)")
			.style("cursor","pointer")
		}else{
			d3.select("#red").append("div").html(catName).attr("id",catName)
			.style("border","1px solid black").style("padding","2px").style("margin","2px")
			.style("display","inline-block").style("font-size","11px")
			.style("font-weight",400)
			.attr("draggable",true)
			.attr("class","metric")
			.attr("ondragstart","drag(event)")
			.style("cursor","pointer")
		}
		
	}
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	//console.log(ev)
    var _target = $("#" + ev.target.id);
    var data = ev.dataTransfer.getData("text");
    if ($(_target).hasClass("metric")) {
	    //console.log("no transfer");
	    ev.preventDefault();
	  } else {
	    ev.preventDefault();
	    ev.target.appendChild(document.getElementById(data));
	  }
	  	//
	//   ev.preventDefault();
	//   var data = ev.dataTransfer.getData("text");
	// //console.log(data)
	//    ev.target.appendChild(document.getElementById(data));
   
   
   getListAndMap()
  
}
function getListAndMap(stateGeojson){
    var reds = document.getElementById("red").childNodes;
    var greens = document.getElementById("green").childNodes;
  // console.log(children)
  
   // for(var t in toggleDictionary){
   // //	console.log(t)
   // 	  toggleDictionary[t]=false
   // }
   //d3.selectAll(".measureLabel").style("background-color","white")
   var greensList = []
   var redsList = []
   greens.forEach(li => {
    if(li.id!=undefined && li.id!=""){
 	    greensList.push(li.id)
 	  }
   });
  
   reds.forEach(li => {
 	   if(li.id!=undefined && li.id!=""){
 	    redsList.push(li.id)
  	  }
   });
  
   // console.log(redsList, greensList)
  
   if(redsList.length>0 || greensList.length>0){
 	  var redGreenTallyData = reTallyRedGreen(redsList, greensList)
 	  activeCats = redsList.concat(greensList)
 		  //
 	  // console.log(redGreenTallyData.features[0].properties["tally_percentile"],redGreenTallyData.features[0].properties["currentTally"])
 	  // console.log(redGreenTallyData.features[3232].properties["tally_percentile"])
 		reColor(redGreenTallyData)
   }else{

   	dragDropMap.setPaintProperty("countiesFill", 'fill-color',"#FFFFFF")
   }
}

function reTallyRedGreen(listOfReds, listOfGreens){
	var gids=[]
	for(var i in currentStateData.features){
		var featureTally = 0
		var feature = currentStateData.features[i].properties
		var gid = feature["GEOID"]
		gids.push(gid)
		
		
		for(var r in listOfReds){
			var catName = listOfReds[r]
	
				featureTally+=parseFloat(feature[catName+"_percentile"])
		}
		for(var g in listOfGreens){
			var catName = listOfGreens[g]
				featureTally+=(1-parseFloat(feature[catName+"_percentile"]))
		}
		// console.log(featureTally)
		
		currentStateData.features[i].properties["currentTally"]=featureTally
	}	
	var sortedFeatures = currentStateData.features.sort(function(a,b){
		//console.log(a)
		return a.properties["currentTally"]-b.properties["currentTally"]
	})
	
	for(var k in sortedFeatures){
 		sortedFeatures[k].properties["tally_order"]=k
 		sortedFeatures[k].properties["tally_percentile"]=k/sortedFeatures.length
 	}
	currentStateData.features = sortedFeatures
	return currentStateData
}


function reColor(newData){
	newData.features.sort(function(a,b){
		return a.properties["tally_percentile"]-b.properties["tally_percentile"]
	})
	// console.log(newData.features[0])
	// console.log(newData.features[0].properties.GEOID,newData.features[0].properties["tally_percentile"],newData.features[0].properties["currentTally"])
	// console.log(newData.features[3232].properties.GEOID,newData.features[3232].properties["tally_percentile"],newData.features[3232].properties["currentTally"])
	dragDropMap.getSource("dragDropCounties").setData(newData)
	
    var currentColor= {
    property:"tally_percentile",// "currentTally",
    stops: [
			[0,lowColor],
			//[.5,midColor],
			[1, highColor]
		]
    }
	
//var colors = ["#17DCFF","#7E6EFF","#E400FF"]
//var colors = ["#2D7FB8","#7FCDBB","#2D7FB8"]
	

	dragDropMap.setPaintProperty("countiesFill", 'fill-color',currentColor)
}

function reTally(){
	activeCats=[]
	var gids = []
	for(var i in processedGeojson.features){
		var featureTally = 0
		var feature = processedGeojson.features[i].properties
		var gid = feature["GEOID"]
		gids.push(gid)
		for(var c in onOffDragDrop){
			if(onOffDragDrop[c]==true){
				if(activeCats.indexOf(c)==-1){
					activeCats.push(c)
				}
				featureTally+=parseFloat(feature[c+"_percentile"])
			}
		}
	//	console.log(featureTally)
		processedGeojson.features[i].properties["currentTally"]=featureTally
	}

	//sort by current tally
	var sortedFeatures = processedGeojson.features.sort(function(a,b){
		//console.log(a)
		return a.properties["currentTally"]-b.properties["currentTally"]
	})
	
	for(var k in sortedFeatures){
 		sortedFeatures[k].properties["tally_order"]=k
 		sortedFeatures[k].properties["tally_percentile"]=k/sortedFeatures.length
 	}
	processedGeojson.features = sortedFeatures
	return processedGeojson
}

function addDataToGeojson(dataWithPercentiles,geojson){
	//console.log(geojson)
	for(var i in geojson.features){
		var fips = geojson.features[i].properties.GEOID
		var data = dataWithPercentiles["_"+fips]
		var geojsonProperties = geojson.features[i].properties
		var combined =  deepMergeFlatten(data,geojsonProperties)
		
		geojson.features[i].properties = combined
	}
	return geojson
}

//https://atomizedobjects.com/blog/javascript/how-to-merge-two-objects-in-javascript/
function deepMergeFlatten(obj1, obj2) {
  const keys = Object.keys(obj2)
  let nextObj = { ...obj1 }

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    const value = obj2[key]
    if (typeof value === "object" && value !== null) {
      nextObj = { ...nextObj, ...deepMergeFlatten(nextObj, value) }
    } else {
      nextObj = { ...nextObj, [key]: value }
    }
  }

  return nextObj
}



function formateCensusPercentiles(formattedData){
	var keys = Object.keys(formattedData[Object.keys(formattedData)[0]])
	var orderDictionary = {}
	for(var i in keys){
		var keyName = keys[i]
		var gids = Object.keys(formattedData)
		gids.sort(function(a,b){return formattedData[a][keyName]-formattedData[b][keyName]})
		orderDictionary[keyName]=gids
		
		for(var c in formattedData){
			//console.log(c)
			formattedData[c][keyName+"_order"]=gids.indexOf(c)
			formattedData[c][keyName+"_percentile"]=gids.indexOf(c)/gids.length
		}
	}
//	console.log(formattedData)
	
	for(var j in formattedData){
		var percentileSum = 0
	//	console.log(formattedData[j])
		for(var k in keys){
			var keyName = keys[k]
			percentileSum+=formattedData[j][keyName+"_percentile"]
		}
		formattedData[j]["currentTally"]=percentileSum
	}
	
	var gids = Object.keys(formattedData)
	gids.sort(function(a,b){
		//console.log(a)
		return formattedData[a]["currentTally"]-formattedData[b]["currentTally"]
	})
	
	for(var k in formattedData){
		formattedData[k]["tally_order"]=gids.indexOf(k)
		formattedData[k]["tally_percentile"]=.5//gids.indexOf(k)/gids.length
	}
//	console.log(formattedData)
	return formattedData
}

function makeCensusKeysDictionary(unformatted){
	var formatted ={}
	for(var k in unformatted){
		var key = unformatted[k].column
		var value = unformatted[k]
		formatted[key]=value
	}
	return formatted
}

function formatCenssuDataCombo(censusData,formattedData){
	//console.log(combinationCensusCats)
	for(var c in censusData){
		var countyDataEntry = censusData[c]
		var fips = "_"+countyDataEntry["Geo_FIPS"]
		for(var i in combinationCensusCats){
			var catNames = combinationCensusCats[i].columns
			var sum = 0
			var totalKey = combinationCensusCats[i].totalColumn
			var total = parseInt(countyDataEntry[totalKey])
			for(var d in catNames){
				var catName = catNames[d]
				var value = parseInt(countyDataEntry[catName])
				sum+=value
			}
			var percent = sum/total
			//console.log(i, percent)
			formattedData[fips][i]=percent
		}
	}
	return formattedData
}

function formatCensusDataSingle(censusData){
	var formattedByGid = {}
	
	for(var c in censusData){
		
		var countyDataEntry = censusData[c]
		var fips = "_"+countyDataEntry["Geo_FIPS"]
		formattedByGid[fips]={}
		formattedByGid[fips]["label"]=countyDataEntry["Geo_QName"]
		
		for(var i in singleCensusCats){
			var catName = singleCensusCats[i]
		//	console.log(catName)
			var mode = censusKeys[catName].columnType
			var value = parseFloat(countyDataEntry[catName])
			
			if(isNaN(value)==true){
				value=parseFloat(countyDataEntry[catName])
			}
			formattedByGid[fips][catName]=value
			
			if(mode=="percent"){
				var totalKey = censusKeys[catName].totalColumn
				var totalValue = parseFloat(countyDataEntry[totalKey])
				var percentValue = value/totalValue
				formattedByGid[fips][catName]=percentValue
			}
			
		}
//		console.log(formattedByGid)
		//censusKey[catName]=
	}
	return formattedByGid
}



function drawDragDropMap(countiesOutlineData){
	
	console.log(countiesOutlineData)
    mapboxgl.accessToken = "pk.eyJ1IjoiYzRzci1nc2FwcCIsImEiOiJja2J0ajRtNzMwOHBnMnNvNnM3Ymw5MnJzIn0.fsTNczOFZG8Ik3EtO9LdNQ"

    // var maxBounds = [
    //   [-74.635258, 40.2485374], // Southwest coordinates
    //   [-73.289334, 40.931799] // Northeast coordinates
    // ];
   dragDropMap = new mapboxgl.Map({
        container: "dragDropMap",
       style:"mapbox://styles/c4sr-gsapp/cl1qqth8n002u14qrc16lcys9",//,
       // maxZoom:15,
        zoom: 3.5,
		minZoom:3.5,
		center:[-95,38],
		interactive: false
    });
	
	var dragDropBounds = new mapboxgl.LngLatBounds();

	countiesOutlineData.features.forEach(function(feature) {
			// console.log(feature.geometry)
// 			console.log(feature.geometry.coordinates[0][0][0][0])
// 		console.log(parseFloat(feature.geometry.coordinates[0][0][0][1]))
		//if(isNaN(feature.geometry.coordinates[0][0][0][0])==false){
			try {
			    dragDropBounds.extend(feature.geometry.coordinates[0][0]);
			}catch(error){
				//console.log(error)
			}
			//}
	});

	
	
	dragDropMap.fitBounds(dragDropBounds, {padding: 40, duration:0});	
	
	
	
	 dragDropMap.on("load",function(){
		
		 dragDropMap.addSource('dragDropCounties', {
		'type': 'geojson',
		'data': countiesOutlineData
		})
	
	
			// 	    var matchString = {
			// 	    property: "tally_percentile",
			// 	    stops: [
			// [0,"green"],
			// [.5,"yellow"],
			// [1,"red"]
			// ]
			// 	    }
	 
		 dragDropMap.addLayer({
		'id': "countiesFill",
		'type': 'fill',
		'source': 'dragDropCounties', // reference the data source
		'layout': {},
		'paint': {
			'fill-color': "white",//matchString, // blue color fill
			'fill-opacity': 1,
			"fill-outline-color":"white"
		}
		
		});
	getListAndMap(countiesOutlineData)
		
		
         dragDropMap.on('mousemove',"countiesFill", function(e) {
		 var properties = e.features[0].properties//["ACS20_5yr_B05001005_percentile"]
			 console.log(properties)
			 var displayString = "<strong>"+properties.label+"</strong><br>"
			 //+"Ranked: "+properties["tally_order"]+" | Percentile: "+Math.round(properties["tally_percentile"]*100)/100+"<br>"+"<br>"
			// console.log(activeCats)
			 for(var c in activeCats){
				 if(censusKeys[activeCats[c]].columnType=="percent"){
				 	displayString+="<strong>"+censusKeys[activeCats[c]].label+":</strong> "+Math.round(properties[activeCats[c]]*10000)/100+"% "
					 // | ranked   "+properties[activeCats[c]+"_order"]+" | Percentile "+Math.round(properties[activeCats[c]+"_percentile"]*10000)/10000+"<br>"
				 }
			 }
			 d3.select("#dragDropPopup").html(displayString)			
			.style("left",event.clientX+10+"px").style("top",event.clientY+10+"px")
			.style("visibility","visible") 
//				console.log(properties)
		})
		
		.on("mouseout",function(d,i){
			d3.select("#dragDropPopup").html("").style("visibility","hidden")
				
		})
	})
}