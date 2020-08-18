var jsonBasin = "https://nednr.nebraska.gov/InsightAPI/api/Values/basin/";

function precipitationRatesVolumesRequest(basinId,scales,data_ready) {
    var url;
    url = jsonBasin + basinId;
    
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var json = JSON.parse(xmlhttp.responseText);
            for (var i = 0; i < json.length; i++) {

                 
                 Year = json[i].Year;
                 Basin = json[i].Basin.replace(/ /g,'');
                 PrecipitationVolume_Annual = json[i].PrecipitationVolume_Annual;
                 PrecipitationRate_Annual = json[i].PrecipitationRate_Annual;
                 
                 
                 if(! (Basin in scales["PrecipitationVolume_Annual"]))
                    scales["PrecipitationVolume_Annual"][Basin] = {};
                 if(! (Basin in scales["PrecipitationRate_Annual"]))
                    scales["PrecipitationRate_Annual"][Basin] = {};
                 scales["PrecipitationVolume_Annual"][Basin][Year] = PrecipitationVolume_Annual/20000000;
                 scales["PrecipitationRate_Annual"][Basin][Year] = PrecipitationRate_Annual/30;
               
            }
            data_ready[Basin] = true;
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}