// This example uses a GroundOverlay to place an image on the map
// showing an antique map of Newark, NJ.
let historicalOverlay;
data_ready = {}

/*
scales = {
  "Republican": [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
  "UpperPlatte": [0.4,0.5,0.6,0.7,0.8,0.9,0.1,0.2,0.3,],
  "LittleBlue": [0.7,0.8,0.9,0.1,0.2,0.3,0.4,0.5,0.6,],
  "BigBlue": [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.1],
  "LowerPlatte": [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
  "Elkhorn": [0.9,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8],
  "Loup": [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
  "Niobrara": [0.8,0.9,0.1,0.2,0.3,0.4,0.5,0.6,0.7],
  "MissouriTributaries" : [0.5,0.6,0.7,0.8,0.9,0.1,0.2,0.3,0.4]
}*/
scales = {
}
min_scale = 0.1;
data_type = "PrecipitationVolume_Annual";

//image height/width ratio
aspect_ratio = 1.522;
lat_shift = 0;
lng_shift = 0.9;
base_scale = 1;
year = 1988%9;
map = null;

//central coordinates of images for each basin.
image_coordinates={"Republican":[40.190+lat_shift,-101.288+lng_shift], "UpperPlatte":[40.65+lat_shift,-101.80+lng_shift], "LittleBlue" : [40.176+lat_shift,-98.690+lng_shift], "BigBlue" : [40.581+lat_shift,-98.180+lng_shift],"LowerPlatte":[41.351+lat_shift,-98.08+lng_shift],"Elkhorn": [42.050+lat_shift,-98.66+lng_shift], "Loup":[41.938+lat_shift,-100.42+lng_shift],"Niobrara":[42.935+lat_shift,-101.58+lng_shift],"MissouriTributaries":[42.455+lat_shift,-97.90+lng_shift]}; 
image_widths = {"Republican": 5.8,"UpperPlatte": 7.90, "LittleBlue": 2.1 , "BigBlue": 2.1, "LowerPlatte": 2.75, "Elkhorn": 3.36, "Loup" : 4.47, "Niobrara":6.5,"MissouriTributaries" : 4};
overlays = {};
//basin_scale = {"Republican":1 * scale,"UpperPlatte": 1 * scale, "LittleBlue" : 1* scale, "BigBlue": 1* scale, "LowerPlatte":1* scale, "Elkhorn": 1* scale,"Loup" :1* scale,"Niobrara":1* scale,"MissouriTributaries":1* scale};



function initMap() {
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat: 40.74, lng: -99.18}
  });
    for(basin in image_coordinates){
    const imageBounds = {
      north: image_coordinates[basin][0] + image_widths[basin]*aspect_ratio*0.5 ,
      south: image_coordinates[basin][0] - image_widths[basin]*aspect_ratio*0.5,
      east: image_coordinates[basin][1] + image_widths[basin]*0.5,
      west: image_coordinates[basin][1] - image_widths[basin]*0.5,
    };
    overlay = new google.maps.GroundOverlay(
      "BasinPNGs/"+basin+".png",
      imageBounds,
      {opacity: 0.8}
    );

    overlay.setMap(map);
    overlays[basin] = overlay;
 }

 
}

function draw_basins(year){
   for(basin in image_coordinates){
      overlays[basin].setMap(null);
      basin_name = basin.toUpperCase();
      //ßoverlays[basin] = null;
     current_scale =  Math.max(scales[data_type][basin_name][year]*base_scale, min_scale);
    const imageBounds = {
      north: image_coordinates[basin][0] + image_widths[basin]*aspect_ratio*0.5 * current_scale,
      south: image_coordinates[basin][0] - image_widths[basin]*aspect_ratio*0.5* current_scale,
      east: image_coordinates[basin][1] + image_widths[basin]*0.5* current_scale,
      west: image_coordinates[basin][1]-image_widths[basin]*0.5* current_scale,
    };
    overlay = new google.maps.GroundOverlay(
      "BasinPNGs/"+basin+".png",
      imageBounds,
      {opacity: 0.8}
    );

    overlay.setMap(map);
    overlays[basin] = overlay;
 }




}


function query_data(){

  for(basin in image_coordinates){
    data_ready[basin] = false;
  }

  if (!("PrecipitationVolume_Annual" in scales)){
    scales["PrecipitationVolume_Annual"] = {};
  }
  if (!("PrecipitationRate_Annual" in scales)){
    scales["PrecipitationRate_Annual"] = {};
  }

  for(var i =1; i<=11;i++){
    precipitationRatesVolumesRequest(i, scales,data_ready);
  }

}

function ui_setup(){

  var years = document.getElementById('years');

  noUiSlider.create(years, {

      range: {
          'min': 1988,
          'max': 2012
      },

      step: 1,

      // Handles start at ...
      start: [1988],



      // Move handle on tap, bars are draggable
      behaviour: 'tap-drag',
      tooltips: true,

      // Show a scale with the slider
      pips: {
          mode: 'steps',
          //stepped: true,
          density: 1
      },
      format: {
        to: function(value){
          return Math.floor(value);
        },
        from: function(value){
          return value;
        }


      }
  });


  // When the slider value changes, update the input and span
  years.noUiSlider.on('update', function (values, handle) {
    if(!map) return;

    for(basin in image_coordinates){
      basin_name = basin.toUpperCase();
      if(!data_ready[basin_name])
        return;
    }
    year = Math.floor(values[handle]);
    draw_basins(year);
    console.info(Math.floor(year));
    

  });


var button1 = document.getElementById('type-1');
var button2 = document.getElementById('type-2');

button1.addEventListener('click', function () {
   data_type = "PrecipitationVolume_Annual";
   document.getElementById('type-1').style.backgroundColor= "#a6f8ff";
   document.getElementById('type-2').style.backgroundColor= "#a6c8ff";
});

button2.addEventListener('click', function () {
   data_type = "PrecipitationRate_Annual";
   document.getElementById('type-2').style.backgroundColor= "#a6f8ff";
   document.getElementById('type-1').style.backgroundColor= "#a6c8ff";

});


}

query_data();
ui_setup();