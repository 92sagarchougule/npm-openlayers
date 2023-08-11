var params_geoserver;
var cropsap1;
var params;
var Filter_tal;
var geojson;

  


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

    map.removeLayer(cropsap);
    map.removeLayer(vectorCropsap); 

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
    var value_to_date = to_date.value;
    console.log("Selected To Date :" + value_to_date);

    let Taluka_zoom = `tah_name ='${text_taluka}'`; 
    let Taluka_name = `taluka ='${text_taluka}'`; 
    var taluka_zoom = Taluka_zoom.toString();
    console.log(taluka_zoom);


// ------------zoom Feature--------------------------------------------------------------

    let url = "http://20.219.130.223:8080/geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'Taluka' + "&CQL_FILTER=" +taluka_zoom+ "&outputFormat=application/json";  //"tah_name='Ausa'"


    // Assuming you have defined the variables 'cropsap' and 'topo' elsewhere

    const geojson = new ol.layer.Vector({
      title: 'cropsap', // Title should be a string enclosed in quotes
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      style: function (feature) {
        // Define the base style for your vector features
        const baseStyle = new ol.style.Style({

          color: [255, 255, 255, 0.8]
          
          // Define your existing style properties here
        });
    
        // Create a mask style for overlay
        const maskStyle = new ol.style.Style({
          fill: new ol.style.Fill({
            color: [255, 255, 255, 0], // Adjust the color and opacity as needed
          }),
          stroke: new ol.style.Stroke({
            color: [255, 0, 0,1], // Black stroke color with full opacity
            width: 3, // Stroke width in pixels
            lineDash: [6, 6],
          }),
        });
    
        // Apply the mask style over the base style
        return [baseStyle, maskStyle];
      },
    });

    geojson.getSource().on('addfeature', function () {
      const containerSize = [document.getElementById('map').clientWidth, document.getElementById('map').clientHeight];
      map.getView().fit(
        geojson.getSource().getExtent(),
        { duration: 1590, size: containerSize, padding: [40, 40, 40, 40]} //, 
      );
    });

    // var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
    // base.addFilter(mask);

// ------------zoom Feature--------------------------------------------------------------

map.addLayer(geojson);

    let from_Date = value_from_date.toString();
    let to_Date = value_to_date.toString();
  
    let date = 'observation_date BETWEEN '+from_Date +' AND '+ to_Date;


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
        url: "http://20.219.130.223:8080/geoserver/cropsap/wms",
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
    //http://20.219.130.223:8080/geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap_view&CQL_FILTER=taluka=%27Nevasa%27&outputFormat=application/json
    const cropsap_json = "http://20.219.130.223:8080/geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + 'cropsap_view' + "&CQL_FILTER=" + Taluka_name + "&outputFormat=application/json";

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
            url: "http://20.219.130.223:8080/geoserver/vector/wms",
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


    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("http://20.219.130.223:8080/geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap%3Acropsap_view&maxFeatures=50&outputFormat=application%2Fjson", requestOptions)
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

        var select = document.getElementById("taluka");
          

          // Function to check if an option with a given text already exists in the select element
          function textExists(text) {
            return Array.from(select.options).some(option => option.text === text);
          }

          // Loop through the features and append unique options
          data.features.forEach(e => {
            if (!textExists(e.properties.taluka)) {
                var option = document.createElement("option");
                option.value = e.properties.tah_code;
                option.text = e.properties.taluka;
                select.appendChild(option);
            }
          });

      })
      .catch(error => {
        // Handle any errors that occurred during the fetch request or data processing
        console.error('Error:', error);
      });

      const mapView = map.getView();

        map.on('click',function(e){
            console.log(e.coordinate);

        });


   // ----------------------------------------------    // Get List of Cropsap and Cropsap Code  --------------------------------------------------------


    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    fetch("http://20.219.130.223:8080/geoserver/cropsap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cropsap%3Acropsap_view&maxFeatures=50&outputFormat=application%2Fjson", requestOptions)
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
        let Legend_url = "http://20.219.130.223:8080/geoserver/cropsap/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=cropsap:cropsap_view";
        var imagem = document.createElement("img");
        imagem.src = Legend_url;
        //legend_crop.appendChild(<h3>Legend :</h3>);
        legend_crop.appendChild(imagem);

// -----------------------------------------------------------------------------------------------


    
  



// ---------------------------------------------------------Popup------------------------------------------------------------------------------------------

  








  
//

  map.on('click', function(event) {
   // Get the clicked coordinate
   var clickedCoordinate = event.coordinate;
 
   // Get the features at the clicked coordinate
   var features = map.getFeaturesAtPixel(event.pixel);
 
   // If features are found at the clicked coordinate
   if (features && features.length > 0) {
     // Get the properties of the first feature
 
     let properties = features[0].getProperties();

     console.log(properties);
 
     var name = "Farmer Name : <b>" + properties.farmer_name + "</b> / " + "Crop Season : <b> " + properties.crop_season +" "+properties.farm_unique_code+"<b/>";
 
     //let name = "<table> <tr> <th> District </th> " + "<th>Taluka</th> </tr> "+ "<tr><td><b>"+properties.dist_name + "</b></td>  "  + "<td><b>"+properties.tah_name +"</b> </td></tr> <table>";
     
 
     //document.getElementById("District").innerHTML = name;
 
       var content = document.getElementById('popup');

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
        //className:'MousePosition',
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
          return ol.coordinate.format(coordinate, '{y}, {x}', 3);
        },
        
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




     // ------------------------------------------- API from Database----------------------------------------------
 
 
     // const url = "http://uatapi_mat.mahaitgov.in/district_advisory_data/"+ properties.tah_code ;
 
     //   var req_imd_Data = new XMLHttpRequest();
     //   req_imd_Data.overrideMimeType("application/json");
     //   req_imd_Data.open('GET', url, true);
     //   req_imd_Data.onload  = function() {
     //     var jsonResponse = JSON.parse(req_imd_Data.responseText);
     //     // do something with jsonResponse
     //     //console.log(jsonResponse);
 
     //     jsonResponse.forEach(myFunction);
 
     //     function myFunction(item) {
     //       //console.log(jsonResponse[item].crop_name);
     //     }
     //   };
     //   req_imd_Data.send(null);
 
       // -----------------------------------------------------------------------------------------------------------


    