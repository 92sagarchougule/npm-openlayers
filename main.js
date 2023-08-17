var params_geoserver;
var cropsap1;
var params;
var Filter_tal;
var geojson;
var divison_geojson;
var district_geojson;
var taluka_geojson;

  


document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
     document.querySelector("body").style.visibility = "hidden";
     document.getElementById("loading_indicator").style.visibility = "visible";
  } else {
     setTimeout(() => {
        document.getElementById("loading_indicator").style.display ="none";
        document.querySelector("body").style.visibility = "visible";
     }, 3000)
  }
};


// Onclick Function for submit query---------------------------------------------------------------------------------------------------------------------

  document.getElementById("submit").onclick = function () {

  document.getElementById('clear').onclick = function(){

    // map.removeLayer(cropsap);
    // map.removeLayer(vectorCropsap);

    window.location.reload();

  };

    var taluka = document.querySelector("#taluka");
    var value_taluka = taluka.value;
    var text_taluka = taluka.options[taluka.selectedIndex].text;
    console.log("Selected Taluka Code :" + value_taluka);
    
    var crop_name = document.querySelector("#crop_name");
    var text_crop_name = crop_name.value;

    // console.log("Selected Crop Name :" + text_crop_name);
    
    var from_date = document.querySelector("#from-date");
    var value_from_date = from_date.value;
    console.log("Selected From Date :" + value_from_date);
    
    var to_date = document.querySelector("#to-date");
    // var value_to_date = to_date.value;
    // console.log("Selected To Date :" + value_to_date);

    let Taluka_zoom = `tah_name ='${text_taluka}'`; 
    let Taluka_name = `taluka ='${text_taluka}'`; 
    var taluka_zoom = Taluka_zoom.toString();
    console.log(taluka_zoom);


// ------------zoom Feature--------------------------------------------------------------

    // let url = "http:///geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'Taluka' + "&CQL_FILTER=" +taluka_zoom+ "&outputFormat=application/json";  //"tah_name='Ausa'"


    // // Assuming you have defined the variables 'cropsap' and 'topo' elsewhere

    // const geojson = new ol.layer.Vector({
    //   title: 'cropsap', // Title should be a string enclosed in quotes
    //   source: new ol.source.Vector({
    //     url: url,
    //     format: new ol.format.GeoJSON(),
    //   }),
    //   style: function (feature) {
    //     // Define the base style for your vector features
    //     const baseStyle = new ol.style.Style({
    //       fill: new ol.style.Fill({
    //         color: [255, 255, 255, 0.1], // Adjust the color and opacity as needed (10% opacity)
    //       }),
    //       stroke: new ol.style.Stroke({
    //         color: [255, 0, 0,1], // Black stroke color with full opacity
    //         width: 3, // Stroke width in pixels
    //         lineDash: [6, 6],
    //       }),
          
    //       // Define your existing style properties here
    //     });
    
    //     // Create a mask style for overlay
    //     const maskStyle = new ol.style.Style({
    //       fill: new ol.style.Fill({
    //         color: [255, 255, 255, 0], // Adjust the color and opacity as needed
    //       }),
    //       stroke: new ol.style.Stroke({
    //         color: [255, 0, 0,1], // Black stroke color with full opacity
    //         width: 3, // Stroke width in pixels
    //         lineDash: [6, 6],
    //       }),
    //     });
    
    //     // Apply the mask style over the base style
    //     return [baseStyle, maskStyle];
    //   },
    // });

    // geojson.getSource().on('addfeature', function () {
    //   const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
    //   map.getView().fit(
    //     geojson.getSource().getExtent(),
    //     { duration: 1590, size: containerSize, padding: [40, 40, 40, 40] }
    //   );
    // });

    let url = "http:///geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'Taluka' + "&CQL_FILTER=" + taluka_zoom + "&outputFormat=application/json";

// Assuming you have defined the variables 'cropsap' and 'topo' elsewhere

      const geojson = new ol.layer.Vector({
        title: 'cropsap',
        source: new ol.source.Vector({
          url: url,
          format: new ol.format.GeoJSON(),
        }),
        style: function (feature) {
          // Define the base style for your vector features
          const baseStyle = new ol.style.Style({
            fill: new ol.style.Fill({
              color: [255, 255, 0, 0.1], // Adjust the color and opacity as needed (10% opacity)
            }),
            stroke: new ol.style.Stroke({
              color: [255, 0, 0, 1], // Black stroke color with full opacity
              width: 3, // Stroke width in pixels
              lineDash: [6, 6],
            }),
            // Define your existing style properties here
          });

          // Create a mask style for overlay
          const maskStyle = new ol.style.Style({
            fill: new ol.style.Fill({
              color: [255, 255, 255, 0], // 100% transparent color
            }),
            stroke: new ol.style.Stroke({
              color: [255, 0, 0, 0], // Transparent stroke color
              width: 0, // No stroke
            }),
          });

          // Apply the mask style over the base style
          return [maskStyle, baseStyle]; // Reversed order to put maskStyle on top
        },
      });

      geojson.getSource().on('addfeature', function () {
        const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
        map.getView().fit(
          geojson.getSource().getExtent(),
          { duration: 90, size: containerSize, padding: [80, 80, 80, 80] }
        );
      });



    // var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
    // base.addFilter(mask);

// ------------zoom Feature--------------------------------------------------------------

map.addLayer(geojson);

    let from_Date = value_from_date.toString();
    // let to_Date = value_to_date.toString();
  
    // let date = 'observation_date BETWEEN '+from_Date +' AND '+ to_Date;


    let Taluka_Filter = `taluka='${text_taluka}'`; 
    Filter_tal = Taluka_Filter.toString() //+ date;
    console.log(Filter_tal);

    let crop_name1 = `crop_name='${text_crop_name}'`+' and ';
    let params_geoserver1 = crop_name1 + Filter_tal
    console.log(params_geoserver1);

    // params_geoserver = {
    //   LAYERS: "cropsap:cropsap_view", 
    //   TILED: true,
    //   //env:'taluka:Hingoli',      //{'LAYERS': 'vector:District', 'TILED': true}
    //   //viewparams: "taluka:Hingoli",
    //   CQL_FILTER:"taluka='Hingoli'"//Taluka_Filter//"taluka='Hingoli'"  //"taluka="+ taluka +""  //
    // };
    // params = params_geoserver



    

  // ---------------------------------------------------------Popup------------------------------------------------------------------------------------------

  if (cropsap) {
    map.removeLayer(cropsap);
    map.removeLayer(vectorCropsap); 
   
  }

  else{
    var cropsap = new ol.layer.Tile({
      title: "CropSap",
      source: new ol.source.TileWMS({
        url: "http:///geoserver/cropsap/wms",
        crossOrigin: "Anonymous",
        serverType: "geoserver",
        visible: true,
        params: {
          LAYERS:"cropsap:cropsap_view",
          CQL_FILTER:params_geoserver1
        },
      }),
    });



// Onclick Attribute------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //let tal = "taluka='Georai'"
    //http://
    /geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap_view&CQL_FILTER=taluka=%27Nevasa%27&outputFormat=application/json
    const cropsap_json = "http:///geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'cropsap_view' + "&CQL_FILTER=" + params_geoserver1 + "&outputFormat=application/json";

    const vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: cropsap_json,
    });

    const vectorCropsap = new ol.layer.Vector({
      source: vectorSource,
      //style: null,
    });

   


// Onclick Attribute------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    map.addLayer(vectorCropsap); 
    map.addLayer(cropsap);

  }

};


   
//-------- Submit Onclick Function Complete-------------------------------------------------------------------------------

      var districtLayer = new ol.layer.Tile({
          title: "District",
          source: new ol.source.TileWMS({
            url: "http:///geoserver/vector/wms",
            crossOrigin: "Anonymous",
            serverType: "geoserver",
            visible: true,
            params: {
              LAYERS: "vector:District",
              TILED: true,
            },
          }),
        });
          

        const fullScreen = new ol.control.FullScreen({});

        var map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          interactions: ol.interaction.defaults({mouseWheelZoom:false}),
          view: new ol.View({
            center: [8505824.58455327, 2132622.0303739905],
            zoom: 7.5
          }),
          controls: ol.control.defaults().extend([fullScreen ]) //MousePosition
        });

 
// ----------------------------------------------    // Get List of Taluka and Taluka Code  --------------------------------------------------------


    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };

    //   fetch("http:///geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap%3Acropsap_view&maxFeatures=50&outputFormat=application%2Fjson", requestOptions)
    //   .then(response => {
    //     // Check if the response is successful
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     // Parse the response as JSON and return the data
    //     return response.json();
    //   })
    //   .then(data => {

    //     var taluka = data

    //     var select = document.getElementById("taluka");
          

    //       // Function to check if an option with a given text already exists in the select element
    //       function textExists(text) {
    //         return Array.from(select.options).some(option => option.text === text);
    //       }

    //       // Loop through the features and append unique options
    //       data.features.forEach(e => {
    //         if (!textExists(e.properties.taluka)) {
    //             var option = document.createElement("option");
    //             option.value = e.properties.tah_code;
    //             option.text = e.properties.taluka;
    //             select.appendChild(option);
    //         }
    //       });

    //   })
    //   .catch(error => {
    //     // Handle any errors that occurred during the fetch request or data processing
    //     console.error('Error:', error);
    //   });

    //   const mapView = map.getView();

    //     // map.on('click',function(e){
    //     //     console.log(e.coordinate);

    //     // });


   // ----------------------------------------------    // Get List of Cropsap and Cropsap Code  --------------------------------------------------------


    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    fetch("http:///geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap%3Acropsap_view&maxFeatures=50&outputFormat=application%2Fjson", requestOptions)
    .then(response => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse the response as JSON and return the data
      return response.json();
    })
    .then(data => {

      var taluka = data
      // console.log(taluka)
      //var taluka = data.features //[0].properties //.properties  .adiv_name   .dist_name  .tah_name
      let crop_name = document.getElementById("crop_name");

      function textExists(text) {
          return Array.from(crop_name.options).some(option => option.text === text);
      }

      // Loop through the features and append unique options
      data.features.forEach(e => {
          if (!textExists(e.properties.crop_name)) {
              var option = document.createElement("option");
              option.text = e.properties.crop_name;
              crop_name.appendChild(option);
          }
      });
        
    })
    .catch(error => {
      // Handle any errors that occurred during the fetch request or data processing
      console.error('Error:', error);
    });


// Legend-----------------------------------------------------------------------------------------------

        var legend_crop = document.getElementById("legend");
        let Legend_url = "http:///geoserver/cropsap/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=cropsap:cropsap_view";
        var imagem = document.createElement("img");
        imagem.src = Legend_url;
        //legend_crop.appendChild(<h3>Legend :</h3>);
        legend_crop.appendChild(imagem);

// -----------------------------------------------------------------------------------------------


    
  



// ---------------------------------------------------------Popup------------------------------------------------------------------------------------------

  








  
var closer = document.getElementById("popup-closer");

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};




  map.on('click', function(event) {
   // Get the clicked coordinate
   var clickedCoordinate = event.coordinate;
 
   // Get the features at the clicked coordinate
   var features = map.getFeaturesAtPixel(event.pixel);
 
   // If features are found at the clicked coordinate
   if (features && features.length > 1) {
     // Get the properties of the first feature
 
     let properties = features[0].getProperties();

     console.log(properties);

     //popup.setPosition(undefined);
 
     var name = 
     
    //  "Farmer Name : <b>" + properties.farmer_name + "</b> / " + "Crop Season : <b> " + properties.crop_season +" "+properties.farm_unique_code+"<b/>";

     '<table class="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >CropSap Attribute Information</td></tr><tr><td style="text-align: left">District </td><td style="text-align: left">' +
          properties.district +
          '</td></tr><tr><td style="text-align: left">Taluka </td><td style="text-align: left">' +
          properties.taluka +
          '</td></tr><tr><td style="text-align: left">Village Name </td><td style="text-align: left">' +
          properties.village_name +
          '</td></tr><tr><td style="text-align: left">Area in Hectare </td><td style="text-align: left">' +
         properties.area +
          '</td></tr><tr><td style="text-align: left">Farmer Name  </td><td style="text-align: left ">' +
          properties.farmer_name +
          '</td></tr><tr><td style="text-align: left">Seven Twelve  </td><td style="text-align: left">' +
          properties.seven_twelve +
          '</td></tr><tr><td style="text-align: left">Crop Season </td><td style="text-align: left">' +
          properties.crop_season +
          '</td></tr><tr><td style="text-align: left">Crop Name</td><td style="text-align: left">' +
          properties.crop_name +
          '</td></tr><tr><td style="text-align: left">Crop Spacing </td><td style="text-align: left">' +
          properties.crop_spacing +
          '</td></tr><tr><td style="text-align: left">Crop Growth Stage</td><td style="text-align: left">' +
          properties.crop_growth_stage +
          '</td></tr><tr><td style="text-align: left">Crop Condition</td><td style="text-align: left">' +
          properties.crop_condition +
          '</td></tr><tr><td style="text-align: left">Observation Date</td><td style="text-align: left">' +
          properties.observation_date +
          '</td></tr><tr><td style="text-align: left">Soil Type</td><td style="text-align: left">' +
          properties.soil_type +
          '</td></tr><tr><td style="text-align: left">Irrigated or Rainfed</td><td style="text-align: left">' +
          properties.irrigated_rainfed +
      "</td></tr><tr></table>";
      

 
     //let name = "<table> <tr> <th> District </th> " + "<th>Taluka</th> </tr> "+ "<tr><td><b>"+properties.dist_name + "</b></td>  "  + "<td><b>"+properties.tah_name +"</b> </td></tr> <table>";
     
 
     //document.getElementById("District").innerHTML = name;
 
     var content = document.getElementById('popup-content');

     var popup = new ol.Overlay({
       element: content
     });

     var coor = event.coordinate


     popup.setPosition(coor);

     map.addOverlay(popup);

     
     content.innerHTML = name;

 }
 // else{
 //   document.getElementById("District").innerHTML = 'Please click inside of Maharashtra state boundary';
 // }

});

  //console.log('I am here afer cropsap');
 
      let Mouse = new ol.control.MousePosition({
        
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
          return ol.coordinate.format(coordinate, '{y}, {x}', 3);
        },
        // className: 'custom-mouse-position'
      });

      map.addControl(Mouse);

      





    let Scale_Line = new ol.control.ScaleLine({
      units: 'metric', // or 'imperial'
      bar: true,       // Show a visual bar alongside the scale
      steps: 4,        // Number of steps in the scale bar
      //text: true,      // Show text indicating the scale
      minWidth: 100
    });

    //map.addLayer(vectorLayer);
    map.addControl(Scale_Line);

    map.addLayer(districtLayer);




// ------------------------------------------- API from Select Agri Division----------------------------------------------

document.getElementById('division').onchange = function(){


  map.removeLayer(divison_geojson);


  let div_value = document.getElementById('division').value;

  let division_value = 'ADIV_CODE=' + div_value 

  console.log( division_value);

  let divison_json = "http:///geoserver/vector/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'Agri_Division_boundary' + "&CQL_FILTER=" +division_value+ "&outputFormat=application/json";

  divison_geojson = new ol.layer.Vector({
    title: 'cropsap',
    source: new ol.source.Vector({
      url: divison_json,
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      // Define the base style for your vector features
      const baseStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 0, 0.1], // Adjust the color and opacity as needed (10% opacity)
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 1], // Black stroke color with full opacity
          width: 3, // Stroke width in pixels
          lineDash: [6, 6],
        }),
        // Define your existing style properties here
      });

      // Create a mask style for overlay
      const maskStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0], // 100% transparent color
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 0], // Transparent stroke color
          width: 0, // No stroke
        }),
      });

      // Apply the mask style over the base style
      return [maskStyle, baseStyle]; // Reversed order to put maskStyle on top
    },
  });

  divison_geojson.getSource().on('addfeature', function () {
    const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
    map.getView().fit(
      divison_geojson.getSource().getExtent(),
      { duration: 90, size: containerSize, padding: [80, 80, 80, 80] }
    );
  });

  //   district  API ----------------------------------------------

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://uatapi_mat.mahaitgov.in/districtlist/"+ div_value, requestOptions)
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the response as JSON and return the data
    return response.json();
  })
  .then(data => {

    var taluka = data

    var select = document.getElementById("district");

    //console.log(data[0].dist_name);
      

      // Function to check if an option with a given text already exists in the select element
      function textExists(text) {
        return Array.from(select.options).some(option => option.text === text);
      }

      // Loop through the features and append unique options
      data.forEach(e => {
        if (!textExists(e.dist_name)) {
            var option = document.createElement("option");
            option.value = e.dist_code;
            option.text = e.dist_name;
            select.appendChild(option);
        }
      });

  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request or data processing
    console.error('Error:', error);
  });

//   district  API ----------------------------------------------


  map.addLayer(divison_geojson);

  document.getElementById('clear').onclick = function(){

    //map.removeLayer(divison_geojson);
    // map.removeLayer(vectorCropsap);

    window.location.reload();

  };

}






// ------------------------------------------- API from Select District----------------------------------------------

document.getElementById('district').onchange = function(){

  map.removeLayer(divison_geojson);

  map.removeLayer(district_geojson);


  let dist_value = document.getElementById('district').value;

  let district_value = 'DIST_CODE=' + dist_value 

  console.log( district_value);

  let district_json = "http:///geoserver/vector/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'District' + "&CQL_FILTER=" +district_value+ "&outputFormat=application/json";

  district_geojson = new ol.layer.Vector({
    title: 'cropsap',
    source: new ol.source.Vector({
      url: district_json,
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      // Define the base style for your vector features
      const baseStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 0, 0.1], // Adjust the color and opacity as needed (10% opacity)
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 1], // Black stroke color with full opacity
          width: 3, // Stroke width in pixels
          lineDash: [6, 6],
        }),
        // Define your existing style properties here
      });

      // Create a mask style for overlay
      const maskStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0], // 100% transparent color
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 0], // Transparent stroke color
          width: 0, // No stroke
        }),
      });

      // Apply the mask style over the base style
      return [maskStyle, baseStyle]; // Reversed order to put maskStyle on top
    },
  });

  district_geojson.getSource().on('addfeature', function () {
    const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
    map.getView().fit(
      district_geojson.getSource().getExtent(),
      { duration: 90, size: containerSize, padding: [80, 80, 80, 80] }
    );
  });


  //   Taluka  API ----------------------------------------------

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://uatapi_mat.mahaitgov.in/talukalist/"+ dist_value, requestOptions)
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the response as JSON and return the data
    return response.json();
  })
  .then(data => {

    //var taluka = data

    var select = document.getElementById("taluka");

    //console.log(select);

    //console.log(data[0].dist_name);
      

      // Function to check if an option with a given text already exists in the select element
      function textExists(text) {
        return Array.from(select.options).some(option => option.text === text);
      }

      // Loop through the features and append unique options

      //console.log(data);

      data.forEach(e => {
        if (!textExists(e.tah_name)) {
            var option = document.createElement("option");
            option.value = e.tah_code;
            option.text = e.tah_name;
            select.appendChild(option);
        }
      });

  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request or data processing
    console.error('Error:', error);
  });

//   district  API ----------------------------------------------




  

  map.addLayer(district_geojson);

  document.getElementById('clear').onclick = function(){

    
    // map.removeLayer(vectorCropsap);

    window.location.reload();

  };

}
    

// ------------------------------------------- API from Select Taluka----------------------------------------------

document.getElementById('taluka').onchange = function(){

  map.removeLayer(district_geojson);
  map.removeLayer(taluka_geojson);


  let tal_value = document.getElementById('taluka').value;

  let taluka_value = 'TAH_CODE=' + tal_value 

  console.log( taluka_value);

  let taluka_json = "http:///geoserver/vector/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'Taluka' + "&CQL_FILTER=" +taluka_value+ "&outputFormat=application/json";

  taluka_geojson = new ol.layer.Vector({
    title: 'cropsap',
    source: new ol.source.Vector({
      url: taluka_json,
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      // Define the base style for your vector features
      const baseStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 0, 0.1], // Adjust the color and opacity as needed (10% opacity)
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 1], // Black stroke color with full opacity
          width: 3, // Stroke width in pixels
          lineDash: [6, 6],
        }),
        // Define your existing style properties here
      });

      // Create a mask style for overlay
      const maskStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 255, 0], // 100% transparent color
        }),
        stroke: new ol.style.Stroke({
          color: [255, 0, 0, 0], // Transparent stroke color
          width: 0, // No stroke
        }),
      });

      // Apply the mask style over the base style
      return [maskStyle, baseStyle]; // Reversed order to put maskStyle on top
    },
  });

  taluka_geojson.getSource().on('addfeature', function () {
    const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
    map.getView().fit(
      taluka_geojson.getSource().getExtent(),
      { duration: 90, size: containerSize, padding: [80, 80, 80, 80] }
    );
  });


//   //   Taluka  API ----------------------------------------------

//   var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
//   };
  
//   fetch("http://uatapi_mat.mahaitgov.in/talukalist/"+ district_value, requestOptions)
//   .then(response => {
//     // Check if the response is successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     // Parse the response as JSON and return the data
//     return response.json();
//   })
//   .then(data => {

//     //var taluka = data

//     var select = document.getElementById("district");

//     //console.log(data[0].dist_name);
      

//       // Function to check if an option with a given text already exists in the select element
//       function textExists(text) {
//         return Array.from(select.options).some(option => option.text === text);
//       }

//       // Loop through the features and append unique options
//       data.forEach(e => {
//         if (!textExists(e.tah_name)) {
//             var option = document.createElement("option");
//             option.value = e.tah_code;
//             option.text = e.tah_name;
//             select.appendChild(option);
//         }
//       });

//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch request or data processing
//     console.error('Error:', error);
//   });

// //   district  API ----------------------------------------------





  map.addLayer(taluka_geojson);

  document.getElementById('clear').onclick = function(){

    
    // map.removeLayer(vectorCropsap);

    window.location.reload();

  };

}
