
Promise.all([d3.csv("indices_agencies.csv")])
.then(function(agencies){
	agenciesLoaded(agencies)
})

function agenciesLoaded(agencies){
	//console.log(agencies)
	var list = agencies[0]
	list = list.sort(function(a,b){
		var textA = a["Institution"].toUpperCase();
		    var textB = b["Institution"].toUpperCase();
	    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		
	})
	//console.log(list)
	
	var table = d3.select("#indices_agencies").append("table")

		var row = table.append("tr")
		row.append("th").html("INDEX")
		row.append("th").html("AGENCY/INSITUTION")
		row.append("th").html("LINKS")
		row.append("th").html("")
	
	for(var i in list){
		//console.log(list[i])
		if(list[i]["Index Name"]!=undefined){
			var entry = list[i]
			var row = table.append("tr")
			row.append("td").html(entry["Index Name"])
			row.append("td").html("<strong>"+entry["Institution"]+"</strong>")
			row.append("td").html("<a href="+entry["URL"]+" target=\"blank\">Index</a>")
			row.append("td").html("<a href="+entry["Data and Methods"]+" target=\"blank\">Method</a>")
		}
		
	}
	
}
