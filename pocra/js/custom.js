var district, geojson, geojson1, geojsonm, geojson1m;
getDisdrict();
getDisdrictm();
// Attribution Control
var attributionControl = new ol.control.Attribution({
        collapsible: true
    })
    // Map object

var extentforLayer;
// =============================== Base Layers ===============================
var osm = new ol.layer.Tile({
    type: 'base',
    title: 'Osm Base Map',
    visible: true,
    source: new ol.source.OSM()
});

var topo = new ol.layer.Tile({
    title: 'Topo Map',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'Anonymous',
    })
});

var bing = new ol.layer.Tile({
    title: 'Satellite Map',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
        imagerySet: 'AerialWithLabels'
    })
});
var street = new ol.layer.Tile({
    title: 'Street Map',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
        imagerySet: 'Road'
    })
});

var nomap = new ol.layer.Tile({
    title: 'No Base Map',
    type: 'base',
    source: new ol.source.XYZ({
        url: ''
    })
});

var latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
//    var wgs84Sphere = new ol.Sphere(6378137);
var scaleLineControl = new ol.control.ScaleLine({
    units: 'metric',
    type: 'scalebar',
    steps: 2
});
var mouse = new ol.control.MousePosition({
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, latLong, 4);
    }
});

var center = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
view = new ol.View({
    center: center,
    zoom: 6.5
});


//------------------------on click display table-------------------------
var container = document.getElementById('popup');
var container1 = document.getElementById('popup1');
var content = document.getElementById('popup-content');
var content1 = document.getElementById('popup-content1');
var content2 = document.getElementById('legend');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    positioning: 'center-center'
});
var overlay1 = new ol.Overlay({
    element: container1,
    positioning: 'center-right'
});

// var overlay2 = new ol.Overlay({
//     element: content2,
//     positioning: 'left-left'
// });

var MahaDist = new ol.layer.Tile({
    title: "State",
    source: new ol.source.TileWMS({
        url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        visible: true,
        params: {
            'LAYERS': 'PoCRA:MahaDist',
            'TILED': true,
        }
    })
});
var rejected_point = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/geonode/wms',
        serverType: 'geoserver',
        params: {
            'LAYERS': 'geonode:tbl_rejected_point',
            'TILED': true
        }
    }),
    visible: false
});

// Popup overlay
var popup = new ol.Overlay.Popup({
    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onshow: function() { console.log("You opened the box"); },
    onclose: function() { console.log("You close the box"); },
    positioning: 'top-center',
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});


layerList = [topo, MahaDist];

map = new ol.Map({
    overlays: [popup, overlay],
    controls: ol.control.defaults({
        attribution: false
    }).extend([mouse, scaleLineControl]),
    target: 'map',
    layers: layerList, //featurelayer
    view: view
});
mapm = new ol.Map({
    overlays: [popup, overlay],
    controls: ol.control.defaults({
        attribution: false
    }).extend([mouse, scaleLineControl]),
    target: 'mapm',
    layers: layerList, //featurelayer
    view: view
});



const mapView = map.getView();
const mapViewm = mapm.getView();









// var menu = new ol.control.Overlay({
//     closeBox: true,
//     className: "slide-left menu ol-visible",
//     content: $("#menu").get(0)
// });
// map.addControl(menu);

// // A toggle control to show/hide the menu
// var t = new ol.control.Toggle(
//     {
//         html: '<i class="fa fa-bars" ></i>',
//         className: "menu",
//         title: "Menu",
//         collapsed: false,
//         onToggle: function () { menu.toggle(); }
//     });
// map.addControl(t);

// Print control
// var printControl = new ol.control.Print();
// map.addControl(printControl);


map.getLayers().forEach(function(layer, i) {

    bindInputs('#layer' + i, layer);
});

// map.getLayers().forEach(layer => {
//     if (layer === layer.get('name')) {
//       console.log(layer.get('name'))
//     }
// });


function bindInputs(layerid, layer) {

    var visibilityInput = $(layerid + ' input.visible');
    // alert(layerid)
    // console.log(visibilityInput)
    visibilityInput.on('change', function(evt) {
        // alert(layerid)
        // if(layer.get('name')){
        //     console.log(layer.get('name'))
        // }
        // addRowToLegent(layer);
        layer.setVisible(this.checked);

    });
    visibilityInput.prop('checked', layer.getVisible());
    var opacityInput = $(layerid + ' input.opacity');
    opacityInput.on('input change', function() {
        layer.setOpacity(parseFloat(this.value));
    });
    opacityInput.val(String(layer.getOpacity()));
}


function show_sub() {
    var selectData = document.getElementById("id_component").value;
    // console.log(selectData)
    // cat.getElementsByTagName("ul")[0].style.display = (cat.getElementsByTagName("ul")[0].style.display == "none") ? "inline" : "none";
}

function getDisdrict() {
    var ele = document.getElementById("district");
    ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
        success: function(result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.district[i]["dtncode"] + '">' + result.district[i]["dtnname"].charAt(0).toUpperCase() + result.district[i]["dtnname"].slice(1).toLowerCase() + '</option>';
            }

        }
    });
}

function getDisdrictm() {
    var ele = document.getElementById("districtm");
    ele.innerHTML = "<option value='-1'>--जिल्हा निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts",
        success: function(result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.district[i]["dtncode"] + '">' + result.district[i]["dtnname"].charAt(0).toUpperCase() + result.district[i]["dtnname"].slice(1).toLowerCase() + '</option>';
            }

        }
    });
}

function addMapTolayer(lName, cqlparam) {
    // alert(cqlparam)
    //legend();
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true,
                "CQL_FILTER": cqlparam
            }
        }),

    });
    map.addLayer(district)
}

function addMapTolayer2(lName) {
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })
    });
    map.addLayer(district);
}

function addMapTolayer1(lName, type) {
    var district = document.getElementById("district").value;
    var subdivision = document.getElementById("division").value;
    var taluka = document.getElementById("taluka").value;
    var village = document.getElementById("village").value;
    var layer = new ol.layer.Tile({
        extent: extentforLayer,
        title: lName,
        type: type,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })

    });
    if (district !== "-1" && subdivision === "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function(layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "District", "dtncode", district);
    } else if (district !== "-1" && subdivision !== "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function(layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Subdivision", "sdcode", subdivision);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village === "-1") {
        map.getLayers().forEach(function(layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Taluka", "thncode", taluka);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village !== "-1") {
        map.getLayers().forEach(function(layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Village", "vincode", village);
    }



}

function getSubdivision(dtncode) {
    var ele = document.getElementById("division");
    ele.innerHTML = "<option value='-1'>--Select Subdivision--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/subdivision?dtncode=" + dtncode,
        success: function(result) {
            console.log(result)
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["sdcode"] + '">' + result.taluka[i]["sdname"] + '</option>';
            }

        }
    });

    // query('District', 'dtncode', dtncode, 'dtnname');
    // query('Subdivision', 'dtncode', dtncode, 'dtnname');
    //legend();

    // addMapTolayer("District", "dtncode='" + dtncode + "'");
    // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}




function getTaluka(dtncode) {
    var ele = document.getElementById("taluka");
    ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=" + dtncode,
        success: function(result) {
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
            }

        }
    });

    // query('Subdivision', 'sdcode', dtncode, 'dtnname');
    //legend();

    // addMapTolayer("District", "dtncode='" + dtncode + "'");
    // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}

function getTalukam(dtncode) {
    var ele = document.getElementById("talukam");
    ele.innerHTML = "<option value='-1'>--तालुका निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=" + dtncode,
        success: function(result) {
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
            }

        }
    });
}

function getVillage(thncode) {
    var ele = document.getElementById("village");
    ele.innerHTML = "<option value='-1'>--गाव निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode,
        success: function(result) {
            for (var i = 0; i < result.village.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
            }

        }
    });
    // query('Taluka', 'thncode', thncode, 'thnname');
    //legend();
    // addMapTolayer("Taluka", "thncode='" + thncode + "'");
    // addMapTolayer("Village", "thncode='" + thncode + "'");
    // alert("kh")

}

function getVillagem(thncode) {
    var ele = document.getElementById("villagem");
    ele.innerHTML = "<option value='-1'>--गाव निवडा--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode,
        success: function(result) {
            for (var i = 0; i < result.village.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
            }

        }
    });
    // query('Taluka', 'thncode', thncode, 'thnname');
    //legend();
    // addMapTolayer("Taluka", "thncode='" + thncode + "'");
    // addMapTolayer("Village", "thncode='" + thncode + "'");
    // alert("kh")

}

function getVillageData(vincode) {

    // query('Village', 'vincode', vincode, 'vil_name');
    // addMapTolayer("Village", "vincode='" + vincode + "'");
    //legend();
    // alert("kh")
}

function wms_layers() {
    if (document.getElementById("district").value === "-1") {
        alert("Select District from panel")
    } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    // getDisdrict();

}
// function wms_layers() {
//     // var modal = document.getElementById("myModal");
//     // modal.style.display = "block";
//     // var span = document.getElementsByClassName("close")[0];
//     // span.onclick = function () {
//     //     modal.style.display = "none";
//     // }
//     // getDisdrict();

// }


function GetSelected() {
    //Reference the Table.

    var grid = document.getElementById("Table1");

    //Reference the CheckBoxes in Table.
    var checkBoxes = grid.getElementsByTagName("INPUT");
    var message = "";

    //Loop through the CheckBoxes.
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            var row = checkBoxes[i].parentNode.parentNode;
            message += row.cells[1].innerHTML;
            message += "   " + row.cells[2].innerHTML;
            // message += "   " + row.cells[3].innerHTML;
            message += "\n";
            // alert(row.cells[2].innerHTML)
            var layerName12 = row.cells[2].innerHTML;
            addMapTolayer1(layerName12);
            //legend();
        }

    }
    for (var i = 0; i < checkBoxes.length; i++) {
        if (!checkBoxes[i].checked) {
            var row = checkBoxes[i].parentNode.parentNode;
            var layerName1 = row.cells[2].innerHTML;
            //    alert(layerName12)
            map.removeLayer(layerName1);
        }

    }


    //Display selected Row data in Alert Box.
    // alert(message);
}

function checkboxevt(val) {

    if (val.checked) {
        // alert(val.value)
        if (val.value === "Settlement") {
            addMapTolayer1(val.value, "otherlayer");
            //legend();
        } else if (val.value === "Structures") {
            addMapTolayer1(val.value, "otherlayer");
            //legend();
        } else if (val.value === "Cadastral_Kalmnuri") {
            addMapTolayer1(val.value, "otherlayer");
            //legend();
        } else {
            addMapTolayer2(val.value);
            //legend();
        }
    } else {
        var chkName = val.value;
        map.getLayers().forEach(function(layer, i) {
            if (map.getLayers().item(i).get('title') === chkName) {
                map.removeLayer(layer);
            }
        });
    }

}

var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#ee7300'
        }),
        stroke: new ol.style.Stroke({
            color: '#232323',
            width: 3
        })
    })
});

// ================ District Style =====================
var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var districtBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});


var districtBoundaryStyle1 = new ol.style.Style({

    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8]
    })
});
var districtStyle = [districtBoundaryStyle, districtBoundaryStyle1, districtLabelStyle];

var subdivisionLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#001'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});

var subdivisionBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00000',
        width: 2,
        // linejoin:'bevel',
        // lineDash: [4,8],
        // lineDashOffset: 6
    })
});

var subdivisionStyle = [subdivisionBoundaryStyle, subdivisionLabelStyle];
// ===============================================

// ================ Taluka Style =====================
var talukaLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var talukaBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 1.5,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});
var talukaBoundaryStyle1 = new ol.style.Style({

    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 1.5,
        lineDash: [4, 8]
    })
});
var talukaStyle = [talukaBoundaryStyle, talukaBoundaryStyle1, talukaLabelStyle];
// ===============================================

// ================ Taluka Style =====================
var villageLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var villageBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#ffff',
        width: 1

    })
});

var villageStyle = [villageBoundaryStyle, villageLabelStyle];
// ===============================================



function query(layerName, paramName, paramValue, labelname) {
    map.getLayers().forEach(function(layer, i) {
        if (map.getLayers().item(i).get('title') === "State") {
            map.removeLayer(layer);
        }
    });

    // map.removeLayer(geojson);
    if (geojson) {
        map.removeLayer(geojson);
    }
    if (geojson1) {
        map.removeLayer(geojson1);
    }

    if (layerName === "District") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({

            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                districtLabelStyle.setGeometry(geometry);
                districtLabelStyle.getText().setText(feature.get('dtnname'));
                districtLabelStyle.getText().setTextAlign(textAlign);
                return districtStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Subdivision&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Subdivision",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });
        geojson.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Subdivision") {

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                extentforLayer = extent;
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                // var mask = new ol.filter.Mask({ feature: feature, inner:false, fill: new ol.style.Fill({ color:[255,255,255,0.8] }) });
                // topo.addFilter(mask);

                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        geojson.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Taluka") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);

                extentforLayer = extent;
                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Village",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });
        geojson.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });


        geojson1.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);
    } else if (layerName === "Village") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        geojson.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson);
    }
}

function querym(layerName, paramName, paramValue, labelname) {
    map.getLayers().forEach(function(layer, i) {
        if (mapm.getLayers().item(i).get('title') === "State") {
            mapm.removeLayer(layer);
        }
    });

    // mapm.removeLayer(geojson);
    if (geojsonm) {
        mapm.removeLayer(geojsonm);
    } else if (layerName === "Village") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojsonm = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = mapm.getSize();
                var extent = mapm.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        geojsonm.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            mapm.getView().fit(
                geojsonm.getSource().getExtent(), { duration: 1590, size: mapm.getSize() - 100 }
            );
        });
        mapm.addLayer(geojsonm);
    }
}
var layers_names = [];

function legendtest() {
    $('#legend').empty();
    var no_layers = map.getLayers().get('length');
    // var head = document.createElement("h4");

    // var txt = document.createTextNode("Legend");

    // head.appendChild(txt);
    // var element = document.getElementById("legend");
    // element.appendChild(head);
    // var ar = [];

    // var i;
    // var zone;
    // var values = [];
    // var testVals = {}
    var div = document.getElementById("legend");

    div.innerHTML = ""; // clear images
    for (i = 0; i < no_layers; i++) {
        console.log(map.getLayers().item(i).get('title'))



        var imagem = document.createElement("img");
        imagem.src = "/legend/" + map.getLayers().item(i).get('title') + ".png";
        div.appendChild(imagem);

        // ar.push("http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title'));
        // layers_names.push(map.getLayers().item(i).get('title'))

        // layers_names.push(map.getLayers().item(i).get('title'))
    }


    // ar = ar.filter(function (item, index, inputArray) {
    //     return inputArray.indexOf(item) == index;
    // });
    // layers_names = layers_names.filter(function (item, index, inputArray) {
    //     return inputArray.indexOf(item) == index;
    // });

    // for (i = 0; i < ar.length; i++) {
    //     var head = document.createElement("p");
    //     var img = new Image();
    //     img.src = ar[i];
    //     var src = document.getElementById("legend");

    //     if (src.value === "undifined") {
    //     } else {
    //         src.appendChild(img);
    //     }
    // }

    // reOrderLayer();
}

// legend();
var currentValue = "";

function radioChange(rdoValue) {
    if (document.getElementById("district").value === "-1") {
        alert("Select District")
        rdoValue.checked = false;
    } else {

        // alert('Old value: ' + currentValue);
        // alert('New value: ' + rdoValue.value);
        currentValue = rdoValue.value;
        addMapTolayer1(currentValue, "baselayer");
        legend();
    }

}

var dims = {
    a0: [1189, 841],
    a1: [841, 594],
    a2: [594, 420],
    a3: [420, 297],
    a4: [297, 210],
    a5: [210, 148],
};


var imagesList
const imagesWidth = []
const imgDataList = []
const img = new Image();
var ImageToLoad = new Image();

function getImageFromUrl(url, callback) {
    // alert(url)
    ImageToLoad.crossOrigin = "Anonymous";

    ImageToLoad.onError = function() {
        console.log('Cannot load image: "' + url + '"');
    };

    ImageToLoad.onload = function() {
        alert("image is loaded");
    }

    ImageToLoad.onload = function() {
        imagesWidth.push({
            width: ImageToLoad.width,
            height: ImageToLoad.height
        })
        callback(ImageToLoad);
    };
    ImageToLoad.src = url;
    createPDF(ImageToLoad)
}
var format = "a0";
var resolution = "175";
var dim = dims[format];
var width = Math.round((dim[0] * resolution) / 25.4);
var height = Math.round((dim[1] * resolution) / 25.4);
var pdf = new jsPDF('landscape', 'pt', "a3");
// jsPDF('p', 'mm', 'a4');
function createPDF(imgData) {
    imgDataList.push(imgData)
        // var pwidth = doc.internal.pageSize.getWidth();
        // var pheight = doc.internal.pageSize.getHeight();
    var maxWidth = width - 40; // Max width for the image
    var maxHeight = height - 40; // Max height for the image
    // var ratio = 0;  // Used for aspect ratio
    // var width = imgData.width;    // Current image width
    // var height = imgData.height;  // Current image height

    var xvar = 20;
    var yvar = 120;
    // Check if the current width is larger than the max
    if (width > maxWidth) {
        ratio = maxWidth / width; // get ratio for scaling image
        // $(this).css("width", maxWidth); // Set new width
        // $(this).css("height", height * ratio);  // Scale height based on ratio
        height = height * ratio; // Reset height to match scaled image
        width = width * ratio; // Reset width to match scaled image
    }
    // Check if current height is larger than max
    if (height > maxHeight) {
        ratio = maxHeight / height; // get ratio for scaling image
        // $(this).css("height", maxHeight);   // Set new height
        // $(this).css("width", width * ratio);    // Scale width based on ratio
        width = width * ratio; // Reset width to match scaled image
        height = height * ratio; // Reset height to match scaled image
    }
    pdf.text(700, 90, 'Legend')
    pdf.rect(650, 70, 185, 490)
    if (imgDataList.length !== Object.keys(imagesList).length)
        yvar = yvar + imgData.height + 50;
    pdf.addImage({
        imageData: imgData,
        x: 660,
        y: yvar,
        w: imgData.width,
        h: imgData.height,
        angle: 0
    });



    // doc.addPage();
    if (imgDataList.length == Object.keys(imagesList).length) {
        // yvar=yvar+10;
        // pdf.text(700, 90, 'Legend')
        pdf.save("pocra_map.pdf");
        location.reload();
        //window.open(doc.output('bloburl'), '_blank');
    }
}


function CreatePDFfromHTML() {
    document.body.style.cursor = 'progress';


    var size = map.getSize();
    var viewResolution = map.getView().getResolution();

    var top_left_margin = 15;
    var PDF_Width = width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);



    var totalPDFPages = Math.ceil(height / PDF_Height) - 1;
    document.getElementById("menu").style.display = "None";
    document.getElementById("compassimg").style.display = "block";
    document.getElementById("logoimg").style.display = "block";
    // var pdf = new jsPDF('landscape', 'pt', [PDF_Width, PDF_Height]);
    // document.getElementById("legend").style.display = "none";
    pdf.text(width / 3, 45, 'NANAJI DESHMUKH KRUSHI SANJEEVANI PRAKALP', { align: "center" })
    var map_title = document.getElementById("title_name").value;
    pdf.text(350, 85, map_title)
    pdf.rect(5, 20, width - 10, 40);
    pdf.rect(5, 60, width - 10, 40);
    // jsPDFimages();

    html2canvas($("#content")[0]).then(function(canvas) {
        var imgDatanew = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgDatanew, 'JPG', 5, 120, width, 450);
        // pdf.addImage(imgDatanew, 'JPG', 7, 70, 640, 300);
        // pdf.rect(5, 70, 640, 305);
        // jsPDFimages();
        document.getElementById("menu").style.display = "block";
        modal.style.display = "none";
        document.getElementById("compassimg").style.display = "none";
        document.getElementById("logoimg").style.display = "none";
        // document.getElementById("legend").style.display = "block";
        pdf.save("pocra_map.pdf");
    });

    // html2canvas($("#mydata")[0]).then(function (canvas) {
    //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
    //     // pdf.addImage(imgDatanew, 'JPG', 5,70, width-200, height-100);
    //     pdf.addImage(imgData, 'JPG', 650, 70, 185, 490);
    //     // 650, 70, 185, 490
    //     pdf.rect(650, 70, 185, 490);
    //     // jsPDFimages();
    //     // document.getElementById("menu").style.display = "block";
    //     // document.getElementById("legend").style.display = "block";
    //     pdf.save("pocra_map.pdf");

    // });

    // html2canvas($("#mydata")[0]).then(function (canvas) {
    //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
    //     pdf.addImage({
    //         imageData: imgData,
    //         x: 5,
    //         y: 70,
    //         w: width - 200,
    //         h: height - 100,
    //         angle: 0
    //     });
    //     pdf.save("pocra_map.pdf");
    //     //     // pdf.addImage(imgDatanew, 'JPG', 5,70, width-200, height-100);
    //     // pdf.rect(10, 20, 150, 75);
    //     // pdf.roundedRect( 5, 70, width-200, height-100);
    //     //     jsPDFimages();
    //     //     document.getElementById("menu").style.display="block"; 

    //     //     pdf.save("pocra_map.pdf");

    // });



    document.body.style.cursor = 'auto';
}

function jsPDFimages() {
    var imagesListData = {}
    for (var i = 1; i < map.getLayers().get('length'); i++) {
        imagesListData["imag" + i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
    }
    imagesList = imagesListData;
    console.log(imagesList)
    for (var item in imagesList) {
        getImageFromUrl(imagesList[item], createPDF);
    }

    // imagesList={ "imag1": "https://as2.ftcdn.net/jpg/00/42/98/87/500_F_42988762_JMNpHWOFWnbtCBZeYsRo5PmzD28rIquS.jpg", "imag2": "https://as2.ftcdn.net/jpg/00/42/98/87/500_F_42988762_JMNpHWOFWnbtCBZeYsRo5PmzD28rIquS.jpg" }
    // for (var item in imagesList) {
    //     getImageFromUrl(imagesList[item], createPDF);
    // }
}

// imagesList = {}
//     for(var i=1;i<map.getLayers().get('length');i++){
//         imagesList ["imag"+i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
//         // imagesList ["token"+i] = "samplevalue2";
//     }
// console.log(JSON.stringify(imagesList))      


function croplayer(name, lname, paramName, paramValue) {
    legend();
    if (geojson) {
        map.removeLayer(geojson);
    }

    map.getLayers().forEach(function(layer, i) {
        // if (map.getLayers().item(i).get('title') === lname ) {
        //     map.removeLayer(layer)
        // }
        if (map.getLayers().item(i).get('title') === name) {
            var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + lname + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
            geojson = new ol.layer.Vector({
                title: lname,
                source: new ol.source.Vector({
                    url: url,
                    format: new ol.format.GeoJSON()
                }),
                style: function(feature) {
                    var geometry = feature.getGeometry();
                    if (geometry.getType() == 'MultiPolygon') {
                        // Only render label for the widest polygon of a multipolygon
                        var polygons = geometry.getPolygons();
                        var widest = 0;
                        for (var i = 0, ii = polygons.length; i < ii; ++i) {
                            var polygon = polygons[i];
                            var width = ol.extent.getWidth(polygon.getExtent());
                            if (width > widest) {
                                widest = width;
                                geometry = polygon;
                            }
                        }
                    }
                    // Check if default label position fits in the view and move it inside if necessary
                    geometry = geometry.getInteriorPoint();
                    var size = map.getSize();
                    var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                    var textAlign = 'center';
                    var coordinates = geometry.getCoordinates();
                    if (!geometry.intersectsExtent(extent)) {
                        geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                        // Align text if at either side
                        var x = geometry.getCoordinates()[0];
                        if (x > coordinates[0]) {
                            textAlign = 'left';
                        }
                        if (x < coordinates[0]) {
                            textAlign = 'right';
                        }
                    }
                    var crop = new ol.filter.Crop({ feature: feature, inner: false });
                    layer.addFilter(crop);
                    if (lname === "District") {
                        query('District', paramName, paramValue, 'dtnname');
                        districtLabelStyle.setGeometry(geometry);
                        districtLabelStyle.getText().setText(feature.get('dtnname'));
                        districtLabelStyle.getText().setTextAlign(textAlign);
                        return districtStyle;
                    } else if (lname === "Subdivision") {
                        query('Subdivision', paramName, paramValue, 'thnname');
                        subdivisionLabelStyle.setGeometry(geometry);
                        subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                        subdivisionLabelStyle.getText().setTextAlign(textAlign);
                        return subdivisionStyle;
                    } else if (lname === "Taluka") {
                        query('Taluka', paramName, paramValue, 'thnname');
                        talukaLabelStyle.setGeometry(geometry);
                        talukaLabelStyle.getText().setText(feature.get('thnname'));
                        talukaLabelStyle.getText().setTextAlign(textAlign);
                        return talukaStyle;
                    } else if (lname === "Village") {
                        query('Village', paramName, paramValue, 'vilmname');
                        villageLabelStyle.setGeometry(geometry);
                        villageLabelStyle.getText().setText(feature.get('vilmname'));
                        villageLabelStyle.getText().setTextAlign(textAlign);
                        return villageStyle;
                    }
                    // extentforLayer=extent;

                },
            });

            geojson.getSource().on('addfeature', function() {
                map.getView().fit(
                    geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
                );
            });
            map.addLayer(geojson);
        }
    });

}

// function reOrderLayer(){


//         layers_names = layers_names.filter(e => e !== 'Topo Map');
//         layers_names = layervar; 
//         var format = document.getElementById('format').value;
//             var resolution = document.getElementById('resolution').value;
//             var dim = dims[format];
//             var pwidth = Math.round((dim[0] * resolution) / 25.4);
//             var pheight = Math.round((dim[1] * resolution) / 25.4);
//             const doc = new jsPDF('landscape', 'pt', [pwidth, pheight]);
//             const imagesWidth = []
//             const imgDataList = []
//             const img = new Image();
//             var ImageToLoad = new Image();ers_names[i])
//             }
//             nrr = nrr.filter(e => e !== undefined);
//         }

//         for(y=0;y < nrr.length;nrr++){
//         map.getLayers().forEach(function (layer, x) {
//             if(map.getLayers().item(x).get('title')===nrr[y]){
//                 console.log(layer)
//             }
//         // 
//         });
//     }

// }
function clearlayer() {
    location.reload();
}

function legend() {

    var myTableDiv = document.getElementById("mydata");
    myTableDiv.innerHTML = "";
    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 1; i < map.getLayers().get('length'); i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 1; j++) {
            var td = document.createElement('TD');
            td.width = '75';
            // td.appendChild(document.createTextNode("Cell " + i + "," + j));
            // tr.appendChild(td);
            var img = '<img src="./legend/' + map.getLayers().item(i).get('title') + '.png" ><br>'
            var row = table.insertRow(i);
            row.insertCell(0).innerHTML = img;
        }
    }
    myTableDiv.appendChild(table);

}

function addRow() {



    // var myName = document.getElementById("name");
    // var age = document.getElementById("age");
    var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    // alert(rowCount)

    // row.insertCell(0).innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    // var img = '<img src="./legend/District.png" >';
    for (var i = 1; i < map.getLayers().get('length'); i++) {
        var img = '<img src="http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + map.getLayers().item(i).get('title') + '" >'
            // alert(img)
        row.insertCell(0).innerHTML = img;
        // imagesListData["imag" + i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
    }

    // row.insertCell(2).innerHTML = age.value;

}

function opendiv(divid) {
    document.getElementById(divid).style.display = "block";
}

function closediv(divid) {
    document.getElementById(divid).style.display = "none";
}

function shcrdocheck(rdovalue) {

    if (rdovalue === "rdofarmer") {
        var ele = document.getElementById("farmername");
        ele.innerHTML = "<option value='-1'>--Select--</option>";
        var villagecode = document.getElementById("village").value;
        if (villagecode === "-1") {
            document.getElementById("rdofarmer").checked = false;
            // alert("Please select village from POCRA AREA ")
        } else {
            document.getElementById("rdosurvey").checked = false;
            document.getElementById("farmerdiv").style.display = "block";
            document.getElementById("surveydiv").style.display = "none";
            $.ajax({
                url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=0",
                success: function(result) {
                    console.log(result)

                    for (var i = 0; i < result.basicInfo.length; i++) {
                        ele.innerHTML = ele.innerHTML +
                            '<option value="' + result.basicInfo[i].shc_no + '">' + result.basicInfo[i].farmer_name + '</option>';
                    }

                }
            });
        }
    }
    if (rdovalue === "rdosurvey") {
        var ele = document.getElementById("surveyno");
        ele.innerHTML = "<option value='-1'>--Select--</option>";
        var villagecode = document.getElementById("village").value;
        if (villagecode === "-1") {
            document.getElementById("rdosurvey").checked = false;
            // alert("Please select village from POCRA AREA ")
        } else {
            document.getElementById("rdofarmer").checked = false;
            document.getElementById("surveydiv").style.display = "block";
            document.getElementById("farmerdiv").style.display = "none";
            $.ajax({
                url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=0",
                success: function(result) {
                    console.log(result)

                    for (var i = 0; i < result.basicInfo.length; i++) {
                        ele.innerHTML = ele.innerHTML +
                            '<option value="' + result.basicInfo[i].surveyno + '">' + result.basicInfo[i].surveyno + '</option>';
                    }

                }
            });
        }

    }
}

function loadCadastral() {
    var sel = document.getElementById("district");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("district").value;
    // alert(layerName)

    var paramValue = document.getElementById("village").value;
    if (paramValue === "-1") {
        // alert("Please select village from POCRA AREA ")
    } else {
        // http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/shcavailable?vincode=534065&pinno=3080

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=vincode+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: "Village",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilmname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=census2011+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function(feature) {

                if (checkSoilcard(paramValue, feature.get("pin1")) === "true") {
                    style = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: '#bfff00'
                        }),
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0, 1],
                            width: 0.5
                        }),
                        text: new ol.style.Text({
                            text: feature.get("pin"),
                            fill: new ol.style.Fill({
                                color: 'Black'
                            }),
                            textAlign: 'center'
                        })
                    });

                    return style;
                } else {
                    style = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'white'
                        }),
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 0, 1],
                            width: 0.5
                        }),
                        text: new ol.style.Text({
                            text: feature.get("pin"),
                            fill: new ol.style.Fill({
                                color: 'Black'
                            }),
                            textAlign: 'center'
                        })
                    });

                    return style;
                }

                // var geometry = feature.getGeometry();
                // if (geometry.getType() == 'MultiPolygon') {
                // 	// Only render label for the widest polygon of a multipolygon
                // 	var polygons = geometry.getPolygons();
                // 	var widest = 0;
                // 	for (var i = 0, ii = polygons.length; i < ii; ++i) {
                // 		var polygon = polygons[i];
                // 		var width = ol.extent.getWidth(polygon.getExtent());
                // 		if (width > widest) {
                // 			widest = width;
                // 			geometry = polygon;
                // 		}
                // 	}
                // }
                // // Check if default label position fits in the view and move it inside if necessary
                // geometry = geometry.getInteriorPoint();
                // var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                // var textAlign = 'center';
                // var coordinates = geometry.getCoordinates();
                // if (!geometry.intersectsExtent(extent)) {
                // 	geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                // 	// Align text if at either side
                // 	var x = geometry.getCoordinates()[0];
                // 	if (x > coordinates[0]) {
                // 		textAlign = 'left';
                // 	}
                // 	if (x < coordinates[0]) {
                // 		textAlign = 'right';
                // 	}
                // }

                // villageLabelStyle.setGeometry(geometry);
                // villageLabelStyle.getText().setText(feature.get('pin'));
                // villageLabelStyle.getText().setTextAlign(textAlign);
                // return villageStyle;
            },
        });
        geojson.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });


        geojson1.getSource().on('addfeature', function() {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    }


}

function loadshcDetails() {

    // map.getLayers().forEach(function (layer, i) {
    // 	if ((map.getLayers().item(i).get('title') === "Topo Map")) {

    // ;
    // 	}else{
    // 		map.removeLayer(layer)
    // 	}
    // });
    var villagecode = document.getElementById("village").value;
    if (document.getElementById("district").value === "-1") {
        alert("Please select District  ")
    } else if (document.getElementById("taluka").value === "-1") {
        alert("Please select Taluka  ")
    } else if (villagecode === "-1") {
        document.getElementById("rdofarmer").checked = false;
        alert("Please select Village  ")
    } else {
        query('Village', 'vincode', villagecode, 'vil_name');
        closediv('mydivatt');
        closediv('mydiva');
        opendiv('mydivatt');
        var seldistrict = document.getElementById("district");
        var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
        var seltaluka = document.getElementById("taluka");
        var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
        var selvillage = document.getElementById("village");
        var textvillage = selvillage.options[selvillage.selectedIndex].text;
        document.getElementById("districtlabel").innerHTML = textdistrict;
        document.getElementById("talukalabel").innerHTML = texttaluka;
        document.getElementById("villagelabel").innerHTML = textvillage;
        document.getElementById("ptTable").innerHTML = '<table id="example" class="table table-striped table-bordered" style="width:100%;font-size: 10px;">\n\
            <thead>\n\
				<tr> <th style="width:20px;text-align: center;font-size: 12px">अनु.क्र.</th>\n\
				<th style="width: 300px;font-size: 12px;text-align: center;">शेतकरी नाव</th>\n\
                <th style="width: 25px;text-align: center;font-size: 12px">सर्वे. क्र.</th>\n\
                <th style="width: 25px;text-align: center;font-size: 12px">#</th>\n\
                       </tr>\n\
                </thead>\n\
                <tbody>'
            // datatable
        var table = $('#example').DataTable({
            fixedHeader: true
        });
        $.ajax({
            url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=0",
            beforeSend: function() {
                $("#wait").css("display", "block");
            },
            complete: function() {
                $("#wait").css("display", "none");
            },
            error: function(data) {
                //AJAX request not completed
                $("#wait").css("display", "none");
            },
            success: function(result) {
                for (var i = 0; i < result.basicInfo.length; i++) {
                    table.row.add([
                        i + 1,
                        // result.basicInfo[i].district,
                        // result.basicInfo[i].blockname,
                        // result.basicInfo[i].vinname,
                        // result.basicInfo[i].soil_sample_no,
                        // result.basicInfo[i].shc_no,
                        result.basicInfo[i].farmer_name,
                        result.basicInfo[i].surveyno,
                        '<a style="color:blue;text-decoration: underline;" id="btn" onclick=loadshcfarmerDetails("' + result.basicInfo[i].shc_no + '");>View </a>'
                    ]).draw(false);
                }

            }
        });
        '</tbody>'
        '</table>'
    }
}

function loadshcDetailsm() {
    // map.getLayers().forEach(function (layer, i) {
    // 	if ((map.getLayers().item(i).get('title') === "Topo Map")) {

    // ;
    // 	}else{
    // 		map.removeLayer(layer)
    // 	}
    // });
    var villagecode = document.getElementById("villagem").value;
    if (document.getElementById("districtm").value === "-1") {
        alert("Please select District  ")
    } else if (document.getElementById("talukam").value === "-1") {
        alert("Please select Taluka  ")
    } else if (villagecode === "-1") {
        document.getElementById("rdofarmer").checked = false;
        alert("Please select Village  ")
    } else {
        querym('Village', 'vincode', villagecode, 'vil_name');
        closediv('mydivattm');
        opendiv('mydivattm');
        var seldistrict = document.getElementById("districtm");
        var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
        var seltaluka = document.getElementById("talukam");
        var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
        var selvillage = document.getElementById("villagem");
        var textvillage = selvillage.options[selvillage.selectedIndex].text;
        document.getElementById("districtlabelm").innerHTML = textdistrict;
        document.getElementById("talukalabelm").innerHTML = texttaluka;
        document.getElementById("villagelabelm").innerHTML = textvillage;
        document.getElementById("ptTablem").innerHTML = '<table id="example" class="table table-striped table-bordered" style="width:100%;font-size: 10px;">\n\
            <thead>\n\
			<tr> <th style="width:20px;text-align: center;font-size: 12px">अनु.क्र.</th>\n\
			<th style="width: 300px;font-size: 12px;text-align: center;">शेतकरी नाव</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">सर्वे. क्र.</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">#</th>\n\
                       </tr>\n\
                </thead>\n\
                <tbody>'
            // datatable
        var table = $('#example').DataTable({
            fixedHeader: true
        });
        $.ajax({
            url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=0",
            beforeSend: function() {
                $("#wait").css("display", "block");
            },
            complete: function() {
                $("#wait").css("display", "none");
            },
            error: function(data) {
                //AJAX request not completed
                $("#wait").css("display", "none");
            },
            success: function(result) {
                for (var i = 0; i < result.basicInfo.length; i++) {
                    table.row.add([
                        i + 1,
                        // result.basicInfo[i].district,
                        // result.basicInfo[i].blockname,
                        // result.basicInfo[i].vinname,
                        // result.basicInfo[i].soil_sample_no,
                        // result.basicInfo[i].shc_no,
                        result.basicInfo[i].farmer_name,
                        result.basicInfo[i].surveyno,
                        '<a style="color:blue;text-decoration: underline;" id="btn" onclick=loadshcfarmerDetailsm("' + result.basicInfo[i].shc_no + '");>View </a>'
                    ]).draw(false);
                }

            }
        });
        '</tbody>'
        '</table>'
    }
}

function checkSoilcard(vincode, pinno) {
    var request = new XMLHttpRequest();
    request.open('get', 'http://gis.mahapocra.gov.in/weatherservices/meta/shcavailable?vincode=' + vincode + '&pinno=' + pinno, /* async = */ false);
    request.send();
    var jsonData = request.response;
    return jsonData;

}

function loadshcfarmerDetails(shcno) {
    //alert(shcno)
    closediv('mydivatt');
    closediv('mydiva');
    opendiv('mydiva');
    document.getElementById("shcfarmerdetails").innerHTML = "";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/farmershc?shcno=" + shcno,
        beforeSend: function() {
            $("#wait").css("display", "block");
        },
        complete: function() {
            $("#wait").css("display", "none");
        },
        success: function(result) {
            var seldistrict = document.getElementById("district");
            var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
            var seltaluka = document.getElementById("taluka");
            var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
            var selvillage = document.getElementById("village");
            var textvillage = selvillage.options[selvillage.selectedIndex].text;
            for (var i = 0; i < result.length; i++) {
                var testResult = result[i].soiltestresult;
                var fertrecommandation = result[i].fertrecommendation;
                var combination = result[i].fertcom;
                // var surveyNo = result[i].surveyno;

                // var Listfarmer_name = toTitleCase(result[i].farmer_name);
                var basicDetails = "";
                var farmtype = "";
                if (result[i].irrigated === "Irrigated") {
                    farmtype = "बागायत";
                } else if (result[i].irrigated === "Rainfed") {
                    farmtype = "पर्जन्य आधारित"
                }

                basicDetails = basicDetails + '<tr style="font-size:px"> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#ffdd00">शेतकरी तपशील</th></tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">जिल्हा </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + textdistrict + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">तालुका </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + texttaluka + '</td></tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">गाव </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + textvillage + '</td><tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">शेतकरी नाव</td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].farmer_name + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">वडिलांचे/पतीचे नाव</td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].father_name + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">नमुना संकलन तारीख </td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].sample_coll_date + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">सर्वेक्षण क्रमांक, खसरा क्र./डाग क्र.</td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].surveyno + ',' + result[i].khasrano + '</td></tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">शेताचा प्रकार </td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + farmtype + '</td>\n\
		</tr>';
                var ph, ec, oc, an, aph, apo, asu, azn, abr, air, amn, acr;
                var avlph, avlec, avloc, avlan, avlaph, avlapo, avlasu, avlazn, avlabr, avlair, avlamn, avlacr;


                for (var j = 0; j < testResult.length; j++) {
                    if (testResult[j].testparamname === "pH") {
                        if (testResult[j].rating === "Moderately alkaline") {
                            avlph = "";
                        } else {
                            avlph = testResult[j].rating;
                        }

                        ph = '<tr style="font-size:14px"><td style="font-size:14px">1</td><td style="font-size:14px">सामू </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px"> </td><td style="font-size:14px">' + avlph + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "EC") {

                        if (testResult[j].rating === "Normal") {
                            avlec = "";
                        } else {
                            avlec = testResult[j].rating;
                        }

                        ec = '<tr style="font-size:14px"><td style="font-size:14px">2</td><td style="font-size:14px">क्षारता  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">डीएस/एम </td><td style="font-size:14px">' + avlec + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Organic Carbon (OC)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avloc = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avloc = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avloc = "मध्यम ";
                        }

                        oc = '<tr style="font-size:14px"><td style="font-size:14px">3</td><td style="font-size:14px">सेंद्रिय कर्ब  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">%</td><td style="font-size:14px">' + avloc + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "Available Nitrogen (N)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlan = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlan = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlan = "मध्यम ";
                        }


                        an = '<tr style="font-size:14px"><td style="font-size:14px">4</td><td style="font-size:14px">उपलब्ध नत्र  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे. </td><td style="font-size:14px">' + avlan + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Phosphorus (P)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlaph = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlaph = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlaph = "मध्यम ";
                        }


                        aph = '<tr style="font-size:14px"><td style="font-size:14px">5</td><td style="font-size:14px">उपलब्ध स्फुरद  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे.</td><td style="font-size:14px">' + avlaph + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Potassium (K)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlapo = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlapo = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlapo = "मध्यम ";
                        }


                        apo = '<tr style="font-size:14px"><td style="font-size:14px">7</td><td style="font-size:14px">उपलब्ध पालाश  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे.</td><td style="font-size:14px">' + avlapo + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Sulphur (S)") {

                        if (testResult[j].rating === "Deficient") {
                            avlasu = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlasu = "पुरेसा";
                        } else {
                            avlasu = "";
                        }

                        asu = '<tr style="font-size:14px"><td style="font-size:14px">8</td><td style="font-size:14px">उपलब्ध गंधक (S) </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlasu + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Zinc (Zn)") {

                        if (testResult[j].rating === "Deficient") {
                            avlazn = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlazn = "पुरेसा";
                        } else {
                            avlazn = "";
                        }


                        azn = '<tr style="font-size:14px"><td style="font-size:14px">9</td><td style="font-size:14px">उपलब्ध जस्त (Zn)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlazn + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Boron (B)") {


                        if (testResult[j].rating === "Deficient") {
                            avlabr = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlabr = "पुरेसा";
                        } else {
                            avlabr = "";
                        }

                        abr = '<tr style="font-size:14px"><td style="font-size:14px">10</td><td style="font-size:14px">उपलब्ध बोरॉन(B)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlabr + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "Available Iron (Fe)") {

                        if (testResult[j].rating === "Deficient") {
                            avlair = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlair = "पुरेसा";
                        } else {
                            avlair = "";
                        }

                        air = '<tr style="font-size:14px"><td style="font-size:14px">11</td><td style="font-size:14px"> उपलब्ध लोह (Fe)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlair + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Manganese (Mn)") {
                        if (testResult[j].rating === "Deficient") {
                            avlamn = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlamn = "पुरेसा";
                        } else {
                            avlamn = "";
                        }

                        amn = '<tr style="font-size:14px"><td style="font-size:14px">12</td><td style="font-size:14px">उपलब्ध मँगनीज(Mn)</td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlamn + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Copper (Cu)") {
                        if (testResult[j].rating === "Deficient") {
                            avlacr = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlacr = "पुरेसा";
                        } else {
                            avlacr = "";
                        }

                        acr = '<tr style="font-size:14px"><td style="font-size:14px">' + (j + 1) + '</td><td style="font-size:14px">उपलब्ध तांबे (Cu) </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlacr + '</td></tr>';
                    }

                }
                var testResultTable = ph + ec + oc + an + aph + apo + asu + azn + abr + air + amn + acr;
                var fertrecommandationTable = "";
                var fertrecommandationTable1 = "";
                for (var k = 0; k < fertrecommandation.length; k++) {
                    var combinationTable = "";
                    var combinationTable1 = "";
                    for (var l = 0; l < combination.length; l++) {
                        if (fertrecommandation[k].sr_no === combination[l].sr_no) {
                            var combname1 = "",
                                combname2 = "";
                            if (combination[l].furt_comb_one_name === "Urea") {
                                combname1 = "नीम कोटेड युरिया";
                            } else if (combination[l].furt_comb_one_name === "Single Superphosphate") {
                                combname1 = "सिंगल सुपर फॉस्फेट";
                            } else if (combination[l].furt_comb_one_name === "Potassium Chloride (Muriate of Potash) (Granular)") {
                                combname1 = "पोटॅशियम क्लोराईड (म्युरेट ऑफ पोटॅश-दाणेदार)";
                            } else if (combination[l].furt_comb_one_name === "DAP(18-46-0)") {
                                combname1 = "डायअमोनियम फॉस्फेट(18-46-0)";
                            } else if (combination[l].furt_comb_one_name === "Phosphate Solubilising Bacteria") {
                                combname1 = "स्फुरद विद्राव्य जिवाणू";
                            } else {
                                combname1 = combination[l].furt_comb_one_name;
                            }
                            if (combination[l].furt_comb_two_name === "Urea") {
                                combname2 = "नीम कोटेड युरिया";
                            } else if (combination[l].furt_comb_two_name === "Single Superphosphate") {
                                combname2 = "सिंगल सुपर फॉस्फेट";
                            } else if (combination[l].furt_comb_two_name === "Potassium Chloride (Muriate of Potash) (Granular)") {
                                combname2 = "पोटॅशियम क्लोराईड (म्युरेट ऑफ पोटॅश-दाणेदार)";
                            } else if (combination[l].furt_comb_two_name === "DAP(18-46-0)") {
                                combname2 = "डायअमोनियम फॉस्फेट(18-46-0)";
                            }
                            if (combination[l].furt_comb_two_name === "Phosphate Solubilising Bacteria") {
                                combname2 = "स्फुरद विद्राव्य जिवाणू";
                            } else {
                                combname2 = combination[l].furt_comb_two_name;
                            }
                            combinationTable = combinationTable + '<tr><td style="font-size:14px">' + combname1 + '</td><td style="font-size:14px">' + combination[l].furt_comb_one_quantity + '</td></tr>';
                            combinationTable1 = combinationTable1 + '<tr><td style="font-size:14px">' + combname1 + '</td><td style="font-size:14px">' + combination[l].furt_comb_two_quantity + '</td></tr>';
                        }
                    }
                    var cropver;
                    if (fertrecommandation[k].crop_variety.includes("Cotton")) {
                        cropver = "कापूस";
                    } else if (fertrecommandation[k].crop_variety.includes("Bajra")) {
                        cropver = "बाजरी";
                    } else if (fertrecommandation[k].crop_variety.includes("Soyabean") || fertrecommandation[k].crop_variety.includes("(Soyabean)")) {
                        cropver = "सोयाबीन";
                    } else if (fertrecommandation[k].crop_variety.includes("Tur")) {
                        cropver = "तूर";
                    } else if (fertrecommandation[k].crop_variety.includes("Gram") || fertrecommandation[k].crop_variety.includes("Chana")) {
                        cropver = "चना";
                    } else if (fertrecommandation[k].crop_variety.includes("Brinjal")) {
                        cropver = "वांगी";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Chilly")) {
                        cropver = "मिरची";
                    } else if (fertrecommandation[k].crop_variety.includes("Wheat")) {
                        cropver = "गहू";
                    } else if (fertrecommandation[k].crop_variety.includes("Sugarcane")) {
                        cropver = "ऊस";
                    } else if (fertrecommandation[k].crop_variety.includes("Groundnut")) {
                        cropver = "भुईमुग";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Urd Beans")) {
                        cropver = "उडीद";
                    } else if (fertrecommandation[k].crop_variety.includes("Moong")) {
                        cropver = "मूंग";
                    } else if (fertrecommandation[k].crop_variety.includes("Sorgham")) {
                        cropver = "ज्वारी";
                    } else if (fertrecommandation[k].crop_variety.includes("Horses")) {
                        cropver = "हरभरा";
                    } else if (fertrecommandation[k].crop_variety.includes("Gwar")) {
                        cropver = "गवार";
                    } else if (fertrecommandation[k].crop_variety.includes("Sunflower")) {
                        cropver = "सूर्यफूल";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Safflower")) {
                        cropver = "केशर";
                    } else if (fertrecommandation[k].crop_variety.includes("Pomegranate")) {
                        cropver = "डाळिंब";
                    } else if (fertrecommandation[k].crop_variety.includes("Sesamum")) {
                        cropver = "तीळ";
                    } else if (fertrecommandation[k].crop_variety.includes("Lemon")) {
                        cropver = "लिंबू";
                    } else if (fertrecommandation[k].crop_variety.includes("Horses")) {
                        cropver = "हरभरा";
                    } else if (fertrecommandation[k].crop_variety.includes("Onion")) {
                        cropver = "कांदा";
                    } else if (fertrecommandation[k].crop_variety.includes("Mousambi")) {
                        cropver = "मौसंबी";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Turmeric")) {
                        cropver = "हळद";
                    } else if (fertrecommandation[k].crop_variety.includes("Tomato")) {
                        cropver = "टमाटर";
                    } else if (fertrecommandation[k].crop_variety.includes("Astera")) {
                        cropver = "अस्टर";
                    } else if (fertrecommandation[k].crop_variety.includes("Mango")) {
                        cropver = "आंबा";
                    } else if (fertrecommandation[k].crop_variety.includes("Chickpeas-White")) {
                        cropver = "कबुली चना";
                    } else if (fertrecommandation[k].crop_variety.includes("Banana")) {
                        cropver = "केळी";
                    } else if (fertrecommandation[k].crop_variety.includes("Rice") || fertrecommandation[k].crop_variety.includes("Paddy")) {
                        cropver = "तांदूळ";
                    } else if (fertrecommandation[k].crop_variety.includes("Potato")) {
                        cropver = "बटाटा";
                    } else if (fertrecommandation[k].crop_variety.includes("Bhindi")) {
                        cropver = "भेंडी";
                    } else if (fertrecommandation[k].crop_variety.includes("Maize")) {
                        cropver = "मका";
                    } else if (fertrecommandation[k].crop_variety.includes("MulBerry")) {
                        cropver = "मलबेरी";
                    } else if (fertrecommandation[k].crop_variety.includes("Ragi")) {
                        cropver = "रागी";
                    } else if (fertrecommandation[k].crop_variety.includes("Orange")) {
                        cropver = "संत्रा";
                    }
                    // else {
                    // 	cropver = fertrecommandation[k].crop_variety;
                    // }
                    var biofertname = "";
                    if (fertrecommandation[k].bio_fert.includes("Azotobacter")) {
                        biofertname = "अझोटोबॅक्टर"
                    } else if (fertrecommandation[k].bio_fert.includes("Rhizobium")) {
                        biofertname = "रायझोबियम"
                    } else if (fertrecommandation[k].bio_fert.includes("Phosphate Solubilising Bacteria")) {
                        biofertname = "स्फुरद विद्राव्य जिवाणू";
                    } else {
                        biofertname = fertrecommandation[k].bio_fert;
                    }

                    var orgfert = "";
                    if (fertrecommandation[k].organic_fert.includes("FYM")) {
                        orgfert = "शेण खत"
                    } else {
                        orgfert = fertrecommandation[k].organic_fert;
                    }


                    fertrecommandationTable = fertrecommandationTable + '<tr><td style="font-size:14px">' + (k + 1) + '</td><td style="font-size:14px">' + cropver + '</td><td style="font-size:14px"><table>' + combinationTable + '</table></td><td style="font-size:14px">' + orgfert + '<br>' + fertrecommandation[k].reference_yield + '</td><td style="font-size:14px">' + biofertname + '<br>' + fertrecommandation[k].bio_fert_qty + '</td></tr>';

                    fertrecommandationTable1 = fertrecommandationTable1 + '<tr><td style="font-size:14px">' + (k + 1) + '</td><td style="font-size:14px">' + cropver + '</td><td><table>' + combinationTable1 + '</table></td><td style="font-size:14px">' + orgfert + '<br>' + fertrecommandation[k].reference_yield + '</td><td style="font-size:14px">' + biofertname + '<br>' + fertrecommandation[k].bio_fert_qty + '</td></tr>';
                }
                // var combinationTable = "";
                // for (var l = 0; l < combination.length; l++) {
                // 	combinationTable = combinationTable + '<tr><td>Sr No</td><td>' + combination[l].sr_no + '</td></tr>' + '<tr><td>Fertilizer Combination One Name</td><td>' + combination[l].furt_comb_one_name + '</td></tr>' +
                // 		'<tr><td>Fertilizer Combination One Quantity</td><td>' + combination[l].furt_comb_one_quantity + '</td></tr>' + '<tr><td>Fertilizer Combination Two Name</td><td>' + combination[l].furt_comb_two_name + '</td></tr>' + '<tr><td>Fertilizer Combination Two Quantity </td><td>' + combination[l].furt_comb_two_quantity + '</td></tr>';
                // }
                document.getElementById("shcfarmerdetails").innerHTML = '<table style="width:100%;font-size: 10px;border: 1px solid black" id="tablehealthcard"><tr hidden><th colspan="5" style="width:100%;text-align: center;font-size: 12px;background-color:#eba834"><input type="text" value="' + shcno + '" id="shcnumber" ></th></tr>\n\
					<tr hidden> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#eba834">मृद आरोग्य पत्रिका</th>' + basicDetails + '</table><table style="width:100%;font-size: 10px;"><tr> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#ffdd00">माती चाचणी परिणाम</th>\n\
	</tr>\n\
	<tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">परिमाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">वाचन</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">एकक </th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">वर्गवारी </th>\n\
	</tr>' + testResultTable + ' </table><br>' +
                    '<table style="width:100%;font-size: 10px;border: 1px solid black">\n\
	<tr > <th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#eba834">कृपया पर्याय १ किंवा पर्याय २ वापरा, दोन्ही पर्याय वापरू नका.</th><tr > <th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#ffdb4d">पर्याय १</th><tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">पीक वाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">खते संयोजन-१ (कि.ग्रॅ/हे.)	</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">सेंद्रीय खते आणि प्रमाण</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">जैव खते आणि प्रमाण</th></tr>' + fertrecommandationTable + '<tr ><th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#e6e6ff">किंवा</th></tr><tr><th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#ffdb4d">पर्याय २</th><tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">पीक वाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">खते संयोजन-१ (कि.ग्रॅ/हे.)	</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">सेंद्रीय खते आणि प्रमाण</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">जैव खते आणि प्रमाण</th></tr>' + fertrecommandationTable1 + '</table>';
            }

        }

    });

}

function loadshcfarmerDetailsm(shcno) {
    // alert(shcno)
    closediv('mydivattm');
    opendiv('mydivam');
    document.getElementById("shcfarmerdetailsm").innerHTML = "";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/farmershc?shcno=" + shcno,
        cache: false,
        beforeSend: function() {
            $("#wait").css("display", "block");
        },
        complete: function() {
            $("#wait").css("display", "none");
        },
        success: function(result) {

            var seldistrict = document.getElementById("districtm");
            var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
            var seltaluka = document.getElementById("talukam");
            var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
            var selvillage = document.getElementById("villagem");
            var textvillage = selvillage.options[selvillage.selectedIndex].text;

            for (var i = 0; i < result.length; i++) {
                var testResult = result[i].soiltestresult;
                var fertrecommandation = result[i].fertrecommendation;
                var combination = result[i].fertcom;
                // var surveyNo = result[i].surveyno;

                // var Listfarmer_name = toTitleCase(result[i].farmer_name);
                var basicDetails = "";
                var farmtype = "";
                if (result[i].irrigated === "Irrigated") {
                    farmtype = "बागायत";
                } else if (result[i].irrigated === "Rainfed") {
                    farmtype = "पर्जन्य आधारित"
                }

                basicDetails = basicDetails + '<tr style="font-size:px"> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#ffdd00">शेतकरी तपशील</th></tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">जिल्हा </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + textdistrict + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">तालुका </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + texttaluka + '</td></tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">गाव </td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + textvillage + '</td><tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">शेतकरी नाव</td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].farmer_name + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="1" style="text-align: left;font-size: 14px;background-color:#e6e5df">वडिलांचे/पतीचे नाव</td>\n\
		<td colspan="4" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].father_name + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">नमुना संकलन तारीख </td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].sample_coll_date + '</td>\n\
		</tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">सर्वेक्षण क्रमांक, खसरा क्र./डाग क्र.</td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + result[i].surveyno + ',' + result[i].khasrano + '</td></tr>\n\
		<tr style="font-size:14px"> <td colspan="2" style="text-align: left;font-size: 14px;background-color:#e6e5df">शेताचा प्रकार </td>\n\
		<td colspan="3" style="text-align: left;font-size: 14px;background-color:#e6e5df">' + farmtype + '</td>\n\
		</tr>';
                var ph, ec, oc, an, aph, apo, asu, azn, abr, air, amn, acr;
                var avlph, avlec, avloc, avlan, avlaph, avlapo, avlasu, avlazn, avlabr, avlair, avlamn, avlacr;
                for (var j = 0; j < testResult.length; j++) {
                    if (testResult[j].testparamname === "pH") {
                        if (testResult[j].rating === "Moderately alkaline") {
                            avlph = "";
                        } else {
                            avlph = testResult[j].rating;
                        }

                        ph = '<tr style="font-size:14px"><td style="font-size:14px">1</td><td style="font-size:14px">सामू </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px"> </td><td style="font-size:14px">' + avlph + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "EC") {

                        if (testResult[j].rating === "Normal") {
                            avlec = "";
                        } else {
                            avlec = testResult[j].rating;
                        }

                        ec = '<tr style="font-size:14px"><td style="font-size:14px">2</td><td style="font-size:14px">क्षारता  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">डीएस/एम </td><td style="font-size:14px">' + avlec + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Organic Carbon (OC)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avloc = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avloc = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avloc = "मध्यम ";
                        }

                        oc = '<tr style="font-size:14px"><td style="font-size:14px">3</td><td style="font-size:14px">सेंद्रिय कर्ब  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">%</td><td style="font-size:14px">' + avloc + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "Available Nitrogen (N)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlan = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlan = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlan = "मध्यम ";
                        }


                        an = '<tr style="font-size:14px"><td style="font-size:14px">4</td><td style="font-size:14px">उपलब्ध नत्र  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे. </td><td style="font-size:14px">' + avlan + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Phosphorus (P)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlaph = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlaph = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlaph = "मध्यम ";
                        }


                        aph = '<tr style="font-size:14px"><td style="font-size:14px">5</td><td style="font-size:14px">उपलब्ध स्फुरद  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे.</td><td style="font-size:14px">' + avlaph + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Potassium (K)") {

                        if (testResult[j].rating === "Very Low" || testResult[j].rating === "Low") {
                            avlapo = "कमी";
                        } else if (testResult[j].rating === "Very High" || testResult[j].rating === "High") {
                            avlapo = "खूप जास्त";
                        } else if (testResult[j].rating === "Medium") {
                            avlapo = "मध्यम ";
                        }


                        apo = '<tr style="font-size:14px"><td style="font-size:14px">7</td><td style="font-size:14px">उपलब्ध पालाश  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">कि.ग्रॅ/हे.</td><td style="font-size:14px">' + avlapo + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Sulphur (S)") {

                        if (testResult[j].rating === "Deficient") {
                            avlasu = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlasu = "पुरेसा";
                        } else {
                            avlasu = "";
                        }

                        asu = '<tr style="font-size:14px"><td style="font-size:14px">8</td><td style="font-size:14px">उपलब्ध गंधक (S) </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlasu + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Zinc (Zn)") {

                        if (testResult[j].rating === "Deficient") {
                            avlazn = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlazn = "पुरेसा";
                        } else {
                            avlazn = "";
                        }


                        azn = '<tr style="font-size:14px"><td style="font-size:14px">9</td><td style="font-size:14px">उपलब्ध जस्त (Zn)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlazn + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Boron (B)") {


                        if (testResult[j].rating === "Deficient") {
                            avlabr = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlabr = "पुरेसा";
                        } else {
                            avlabr = "";
                        }

                        abr = '<tr style="font-size:14px"><td style="font-size:14px">10</td><td style="font-size:14px">उपलब्ध बोरॉन(B)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlabr + '</td></tr>';
                    }

                    if (testResult[j].testparamname === "Available Iron (Fe)") {

                        if (testResult[j].rating === "Deficient") {
                            avlair = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlair = "पुरेसा";
                        } else {
                            avlair = "";
                        }

                        air = '<tr style="font-size:14px"><td style="font-size:14px">11</td><td style="font-size:14px"> उपलब्ध लोह (Fe)  </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम </td><td style="font-size:14px">' + avlair + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Manganese (Mn)") {
                        if (testResult[j].rating === "Deficient") {
                            avlamn = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlamn = "पुरेसा";
                        } else {
                            avlamn = "";
                        }

                        amn = '<tr style="font-size:14px"><td style="font-size:14px">12</td><td style="font-size:14px">उपलब्ध मँगनीज(Mn)</td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlamn + '</td></tr>';
                    }
                    if (testResult[j].testparamname === "Available Copper (Cu)") {
                        if (testResult[j].rating === "Deficient") {
                            avlacr = "कमतरता";
                        } else if (testResult[j].rating === "Sufficient") {
                            avlacr = "पुरेसा";
                        } else {
                            avlacr = "";
                        }

                        acr = '<tr style="font-size:14px"><td style="font-size:14px">' + (j + 1) + '</td><td style="font-size:14px">उपलब्ध तांबे (Cu) </td><td style="font-size:14px">' + testResult[j].testvalue + '</td><td style="font-size:14px">पीपीएम</td><td style="font-size:14px">' + avlacr + '</td></tr>';
                    }

                }
                var testResultTable = ph + ec + oc + an + aph + apo + asu + azn + abr + air + amn + acr;
                var fertrecommandationTable = "";
                var fertrecommandationTable1 = "";
                for (var k = 0; k < fertrecommandation.length; k++) {
                    var combinationTable = "";
                    var combinationTable1 = "";
                    for (var l = 0; l < combination.length; l++) {
                        if (fertrecommandation[k].sr_no === combination[l].sr_no) {
                            var combname1 = "",
                                combname2 = "";
                            if (combination[l].furt_comb_one_name === "Urea") {
                                combname1 = "नीम कोटेड युरिया";
                            } else if (combination[l].furt_comb_one_name === "Single Superphosphate") {
                                combname1 = "सिंगल सुपर फॉस्फेट";
                            } else if (combination[l].furt_comb_one_name === "Potassium Chloride (Muriate of Potash) (Granular)") {
                                combname1 = "पोटॅशियम क्लोराईड (म्युरेट ऑफ पोटॅश-दाणेदार)";
                            } else if (combination[l].furt_comb_one_name === "DAP(18-46-0)") {
                                combname1 = "डायअमोनियम फॉस्फेट(18-46-0)";
                            } else {
                                combname1 = combination[l].furt_comb_one_name;
                            }
                            if (combination[l].furt_comb_two_name === "Urea") {
                                combname2 = "नीम कोटेड युरिया";
                            } else if (combination[l].furt_comb_two_name === "Single Superphosphate") {
                                combname2 = "सिंगल सुपर फॉस्फेट";
                            } else if (combination[l].furt_comb_two_name === "Potassium Chloride (Muriate of Potash) (Granular)") {
                                combname2 = "पोटॅशियम क्लोराईड (म्युरेट ऑफ पोटॅश-दाणेदार)";
                            } else if (combination[l].furt_comb_two_name === "DAP(18-46-0)") {
                                combname2 = "डायअमोनियम फॉस्फेट(18-46-0)";
                            } else {
                                combname2 = combination[l].furt_comb_two_name;
                            }
                            combinationTable = combinationTable + '<tr><td style="font-size:14px">' + combname1 + '</td><td style="font-size:14px">' + combination[l].furt_comb_one_quantity + '</td></tr>';
                            combinationTable1 = combinationTable1 + '<tr><td style="font-size:14px">' + combname1 + '</td><td style="font-size:14px">' + combination[l].furt_comb_two_quantity + '</td></tr>';
                        }
                    }
                    var cropver;
                    if (fertrecommandation[k].crop_variety.includes("Cotton")) {
                        cropver = "कापूस";
                    } else if (fertrecommandation[k].crop_variety.includes("Bajra")) {
                        cropver = "बाजरी";
                    } else if (fertrecommandation[k].crop_variety.includes("Soyabean") || fertrecommandation[k].crop_variety.includes("(Soyabean)")) {
                        cropver = "सोयाबीन";
                    } else if (fertrecommandation[k].crop_variety.includes("Tur")) {
                        cropver = "तूर";
                    } else if (fertrecommandation[k].crop_variety.includes("Gram") || fertrecommandation[k].crop_variety.includes("Chana")) {
                        cropver = "चना";
                    } else if (fertrecommandation[k].crop_variety.includes("Brinjal")) {
                        cropver = "वांगी";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Chilly")) {
                        cropver = "मिरची";
                    } else if (fertrecommandation[k].crop_variety.includes("Wheat")) {
                        cropver = "गहू";
                    } else if (fertrecommandation[k].crop_variety.includes("Sugarcane")) {
                        cropver = "ऊस";
                    } else if (fertrecommandation[k].crop_variety.includes("Groundnut")) {
                        cropver = "भुईमुग";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Urd Beans")) {
                        cropver = "उडीद";
                    } else if (fertrecommandation[k].crop_variety.includes("Moong")) {
                        cropver = "मूंग";
                    } else if (fertrecommandation[k].crop_variety.includes("Sorgham")) {
                        cropver = "ज्वारी";
                    } else if (fertrecommandation[k].crop_variety.includes("Horses")) {
                        cropver = "हरभरा";
                    } else if (fertrecommandation[k].crop_variety.includes("Gwar")) {
                        cropver = "गवार";
                    } else if (fertrecommandation[k].crop_variety.includes("Sunflower")) {
                        cropver = "सूर्यफूल";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Safflower")) {
                        cropver = "केशर";
                    } else if (fertrecommandation[k].crop_variety.includes("Pomegranate")) {
                        cropver = "डाळिंब";
                    } else if (fertrecommandation[k].crop_variety.includes("Sesamum")) {
                        cropver = "तीळ";
                    } else if (fertrecommandation[k].crop_variety.includes("Lemon")) {
                        cropver = "लिंबू";
                    } else if (fertrecommandation[k].crop_variety.includes("Horses")) {
                        cropver = "हरभरा";
                    } else if (fertrecommandation[k].crop_variety.includes("Onion")) {
                        cropver = "कांदा";
                    } else if (fertrecommandation[k].crop_variety.includes("Mousambi")) {
                        cropver = "मौसंबी";
                    }
                    if (fertrecommandation[k].crop_variety.includes("Turmeric")) {
                        cropver = "हळद";
                    } else if (fertrecommandation[k].crop_variety.includes("Tomato")) {
                        cropver = "टमाटर";
                    } else if (fertrecommandation[k].crop_variety.includes("Astera")) {
                        cropver = "अस्टर";
                    } else if (fertrecommandation[k].crop_variety.includes("Mango")) {
                        cropver = "आंबा";
                    } else if (fertrecommandation[k].crop_variety.includes("Chickpeas-White")) {
                        cropver = "कबुली चना";
                    } else if (fertrecommandation[k].crop_variety.includes("Banana")) {
                        cropver = "केळी";
                    } else if (fertrecommandation[k].crop_variety.includes("Rice") || fertrecommandation[k].crop_variety.includes("Paddy")) {
                        cropver = "तांदूळ";
                    } else if (fertrecommandation[k].crop_variety.includes("Potato")) {
                        cropver = "बटाटा";
                    } else if (fertrecommandation[k].crop_variety.includes("Bhindi")) {
                        cropver = "भेंडी";
                    } else if (fertrecommandation[k].crop_variety.includes("Maize")) {
                        cropver = "मका";
                    } else if (fertrecommandation[k].crop_variety.includes("MulBerry")) {
                        cropver = "मलबेरी";
                    } else if (fertrecommandation[k].crop_variety.includes("Ragi")) {
                        cropver = "रागी";
                    } else if (fertrecommandation[k].crop_variety.includes("Orange")) {
                        cropver = "संत्रा";
                    }
                    // else {
                    // 	cropver = fertrecommandation[k].crop_variety;
                    // }
                    var biofertname = "";
                    if (fertrecommandation[k].bio_fert.includes("Azotobacter")) {
                        biofertname = "अझोटोबॅक्टर"
                    } else if (fertrecommandation[k].bio_fert.includes("Rhizobium")) {
                        biofertname = "रायझोबियम"
                    } else if (fertrecommandation[k].bio_fert.includes("Phosphate Solubilising Bacteria")) {
                        biofertname = "स्फुरद विद्राव्य जिवाणू";
                    } else {
                        biofertname = fertrecommandation[k].bio_fert;
                    }

                    var orgfert = "";
                    if (fertrecommandation[k].organic_fert.includes("FYM")) {
                        orgfert = "शेण खत"
                    } else {
                        orgfert = fertrecommandation[k].organic_fert;
                    }


                    fertrecommandationTable = fertrecommandationTable + '<tr><td style="font-size:14px">' + (k + 1) + '</td><td style="font-size:14px">' + cropver + '</td><td style="font-size:14px"><table>' + combinationTable + '</table></td><td style="font-size:14px">' + orgfert + '<br>' + fertrecommandation[k].reference_yield + '</td><td style="font-size:14px">' + biofertname + '<br>' + fertrecommandation[k].bio_fert_qty + '</td></tr>';

                    fertrecommandationTable1 = fertrecommandationTable1 + '<tr><td style="font-size:14px">' + (k + 1) + '</td><td style="font-size:14px">' + cropver + '</td><td><table>' + combinationTable1 + '</table></td><td style="font-size:14px">' + orgfert + '<br>' + fertrecommandation[k].reference_yield + '</td><td style="font-size:14px">' + biofertname + '<br>' + fertrecommandation[k].bio_fert_qty + '</td></tr>';
                }
                // var combinationTable = "";
                // for (var l = 0; l < combination.length; l++) {
                // 	combinationTable = combinationTable + '<tr><td>Sr No</td><td>' + combination[l].sr_no + '</td></tr>' + '<tr><td>Fertilizer Combination One Name</td><td>' + combination[l].furt_comb_one_name + '</td></tr>' +
                // 		'<tr><td>Fertilizer Combination One Quantity</td><td>' + combination[l].furt_comb_one_quantity + '</td></tr>' + '<tr><td>Fertilizer Combination Two Name</td><td>' + combination[l].furt_comb_two_name + '</td></tr>' + '<tr><td>Fertilizer Combination Two Quantity </td><td>' + combination[l].furt_comb_two_quantity + '</td></tr>';
                // }
                document.getElementById("shcfarmerdetailsm").innerHTML = '<table style="width:100%;font-size: 10px;border: 1px solid black" id="tablehealthcard"><tr hidden><th colspan="5" style="width:100%;text-align: center;font-size: 12px;background-color:#eba834"><input type="text" value="' + shcno + '" id="shcnumberm" ></th></tr>\n\
					<tr hidden> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#eba834">मृद आरोग्य पत्रिका</th>' + basicDetails + '</table><table style="width:100%;font-size: 10px;"><tr> <th colspan="5" style="width:100%;text-align: center;font-size: 15px;background-color:#ffdd00">माती चाचणी परिणाम</th>\n\
	</tr>\n\
	<tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">परिमाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">वाचन</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">एकक </th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">वर्गवारी </th>\n\
	</tr>' + testResultTable + ' </table><br>' +
                    '<table style="width:100%;font-size: 10px;border: 1px solid black">\n\
	<tr > <th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#eba834">कृपया पर्याय १ किंवा पर्याय २ वापरा, दोन्ही पर्याय वापरू नका.</th><tr > <th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#ffdb4d">पर्याय १</th><tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">पीक वाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">खते संयोजन-१ (कि.ग्रॅ/हे.)	</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">सेंद्रीय खते आणि प्रमाण</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">जैव खते आणि प्रमाण</th></tr>' + fertrecommandationTable + '<tr ><th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#e6e6ff">किंवा</th></tr><tr><th colspan="5" style="width:100%;text-align: center;font-size: 14px;background-color:#ffdb4d">पर्याय २</th><tr style="border: 1px solid black"> <th  style="text-align: left;font-size: 14px;background-color:#85c505;" width="10px">अनु.क्र.</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">पीक वाण</th>\n\
	 <th  style="text-align: left;font-size: 14px;background-color:#85c505">खते संयोजन-१ (कि.ग्रॅ/हे.)	</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">सेंद्रीय खते आणि प्रमाण</th>\n\
	<th  style="text-align: left;font-size: 14px;background-color:#85c505">जैव खते आणि प्रमाण</th></tr>' + fertrecommandationTable1 + '</table>';
            }

        }

    });

}

var wmslayer;

function addCadastrallayer() {
    // alert(cqlparam)
    //legend();
    var sel = document.getElementById("district");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("district").value;
    // alert(layerName)

    var paramValue = document.getElementById("village").value;
    if (paramValue === "-1") {
        // alert("Please select village from POCRA AREA ")
    } else {
        var tal = "census2011 IN('" + paramValue + "')";
        if (wmslayer) {
            window.map.removeLayer(wmslayer);
        }
        wmslayer = new ol.layer.Tile({
            title: layerName,
            source: new ol.source.TileWMS({
                url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
                crossOrigin: 'Anonymous',
                serverType: 'geoserver',
                visible: true,
                params: {
                    'LAYERS': 'PoCRA:' + layerName,
                    'TILED': true,
                    "CQL_FILTER": tal
                }
            }),

        });

        map.addLayer(wmslayer)
    }
}
var wmslayerm;

function addCadastrallayerm() {
    // alert(cqlparam)
    //legend();
    var sel = document.getElementById("districtm");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("districtm").value;
    // alert(layerName)

    var paramValue = document.getElementById("villagem").value;
    if (paramValue === "-1") {
        // alert("Please select village from POCRA AREA ")
    } else {
        var tal = "census2011 IN('" + paramValue + "')";
        if (wmslayerm) {
            window.mapm.removeLayer(wmslayerm);
        }
        wmslayerm = new ol.layer.Tile({
            title: layerName,
            source: new ol.source.TileWMS({
                url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
                crossOrigin: 'Anonymous',
                serverType: 'geoserver',
                visible: true,
                params: {
                    'LAYERS': 'PoCRA:' + layerName,
                    'TILED': true,
                    "CQL_FILTER": tal
                }
            }),

        });

        mapm.addLayer(wmslayerm)
    }
}
map.on('singleclick', function(evt) {
    closediv('mydiva');
    // document.getElementById('info').innerHTML = '';
    var sel = document.getElementById("district");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("district").value;
    var viewResolution = /** @type {number} */ (view.getResolution());
    map.getLayers().forEach(function(layer, i) {
        if (map.getLayers().item(i).get('title') === layerName) {

            var url = layer.getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
            );
            // console.log(url)
            if (url) {
                fetch(url)
                    .then(function(response) {
                        // console.log(response.text());
                        return response.text();
                    })
                    .then(function(html) {
                        var jsondata = JSON.parse(html);

                        loadshcDetails1(jsondata.features[0].properties.pin1)
                            //   document.getElementById('info').innerHTML = html;
                    });
            }
        }
    });
    // for (var i = 1; i < map.getLayers().get('length'); i++) {
    // 	 if(map.getLayers().item(i).get('title')=== layerName){
    // 		var url = layerName.getSource().getFeatureInfoUrl(
    // 			  evt.coordinate,
    // 			  viewResolution,
    // 			  'EPSG:3857',
    // 			  {'INFO_FORMAT': 'text/json'}
    // 			);
    // 			if (url) {
    // 			  fetch(url)
    // 				.then(function (response) { return response.text(); })
    // 				.then(function (html) {
    // 					alert(html)
    // 				//   document.getElementById('info').innerHTML = html;
    // 				});
    // 			}
    // 	 }		
    // }
    // 
});
mapm.on('singleclick', function(evt) {
    closediv('mydiva');
    // document.getElementById('info').innerHTML = '';
    var sel = document.getElementById("districtm");
    var text = sel.options[sel.selectedIndex].text;

    var layerName = document.getElementById("districtm").value;
    var viewResolution = /** @type {number} */ (view.getResolution());
    mapm.getLayers().forEach(function(layer, i) {
        if (mapm.getLayers().item(i).get('title') === layerName) {

            var url = layer.getSource().getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
            );
            // console.log(url)
            if (url) {
                fetch(url)
                    .then(function(response) {
                        // console.log(response.text());
                        return response.text();
                    })
                    .then(function(html) {
                        var jsondata = JSON.parse(html);

                        loadshcDetails1m(jsondata.features[0].properties.pin1)
                            //   document.getElementById('info').innerHTML = html;
                    });
            }
        }
    });
    // for (var i = 1; i < map.getLayers().get('length'); i++) {
    // 	 if(map.getLayers().item(i).get('title')=== layerName){
    // 		var url = layerName.getSource().getFeatureInfoUrl(
    // 			  evt.coordinate,
    // 			  viewResolution,
    // 			  'EPSG:3857',
    // 			  {'INFO_FORMAT': 'text/json'}
    // 			);
    // 			if (url) {
    // 			  fetch(url)
    // 				.then(function (response) { return response.text(); })
    // 				.then(function (html) {
    // 					alert(html)
    // 				//   document.getElementById('info').innerHTML = html;
    // 				});
    // 			}
    // 	 }		
    // }
    // 
});


function loadshcDetails1(pin) {
    //   alert(pin)
    var villagecode = document.getElementById("village").value;
    if (document.getElementById("district").value === "-1") {
        alert("Please select District  ")
    } else if (document.getElementById("taluka").value === "-1") {
        alert("Please select Taluka  ")
    } else if (villagecode === "-1") {
        document.getElementById("rdofarmer").checked = false;
        alert("Please select Village  ")
    } else {
        closediv('mydivatt');
        opendiv('mydivatt');
        // query('Village', 'vincode', villagecode, 'vil_name');
        // opendiv('mydivatt');
        var seldistrict = document.getElementById("district");
        var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
        var seltaluka = document.getElementById("taluka");
        var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
        var selvillage = document.getElementById("village");
        var textvillage = selvillage.options[selvillage.selectedIndex].text;
        document.getElementById("districtlabel").innerHTML = textdistrict;
        document.getElementById("talukalabel").innerHTML = texttaluka;
        document.getElementById("villagelabel").innerHTML = textvillage;
        document.getElementById("ptTable").innerHTML = '<table id="example" class="table table-striped table-bordered" style="width:100%;font-size: 10px;">\n\
            <thead>\n\
			<tr> <th style="width:20px;text-align: center;font-size: 12px">अनु.क्र.</th>\n\
			<th style="width: 300px;font-size: 12px;text-align: center;">शेतकरी नाव</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">सर्वे. क्र.</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">#</th>\n\
                       </tr>\n\
                </thead>\n\
                <tbody>'
            // datatable
        var table = $('#example').DataTable({
            fixedHeader: true
        });
        $.ajax({
            url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=" + pin,
            success: function(result) {
                for (var i = 0; i < result.basicInfo.length; i++) {
                    table.row.add([
                        i + 1,
                        // result.basicInfo[i].district,
                        // result.basicInfo[i].blockname,
                        // result.basicInfo[i].vinname,
                        // result.basicInfo[i].soil_sample_no,
                        // result.basicInfo[i].shc_no,
                        result.basicInfo[i].farmer_name,
                        result.basicInfo[i].surveyno,
                        '<a style="color:blue;text-decoration: underline;" id="btn" onclick=loadshcfarmerDetails("' + result.basicInfo[i].shc_no + '");>View </a>'
                    ]).draw(false);
                }

            }
        });
        '</tbody>'
        '</table>'
    }
}

function loadshcDetails1m(pin) {
    //   alert(pin)
    var villagecode = document.getElementById("villagem").value;
    if (document.getElementById("districtm").value === "-1") {
        alert("Please select District  ")
    } else if (document.getElementById("talukam").value === "-1") {
        alert("Please select Taluka  ")
    } else if (villagecode === "-1") {
        document.getElementById("rdofarmer").checked = false;
        alert("Please select Village  ")
    } else {
        closediv('mydivattm');
        opendiv('mydivattm');
        // query('Village', 'vincode', villagecode, 'vil_name');
        // opendiv('mydivatt');
        var seldistrict = document.getElementById("districtm");
        var textdistrict = seldistrict.options[seldistrict.selectedIndex].text;
        var seltaluka = document.getElementById("talukam");
        var texttaluka = seltaluka.options[seltaluka.selectedIndex].text;
        var selvillage = document.getElementById("villagem");
        var textvillage = selvillage.options[selvillage.selectedIndex].text;
        document.getElementById("districtlabelm").innerHTML = textdistrict;
        document.getElementById("talukalabelm").innerHTML = texttaluka;
        document.getElementById("villagelabelm").innerHTML = textvillage;
        document.getElementById("ptTablem").innerHTML = '<table id="example" class="table table-striped table-bordered" style="width:100%;font-size: 10px;">\n\
            <thead>\n\
			<tr> <th style="width:20px;text-align: center;font-size: 12px">अनु.क्र.</th>\n\
			<th style="width: 300px;font-size: 12px;text-align: center;">शेतकरी नाव</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">सर्वे. क्र.</th>\n\
			<th style="width: 25px;text-align: center;font-size: 12px">#</th>\n\
                       </tr>\n\
                </thead>\n\
                <tbody>'
            // datatable
        var table = $('#example').DataTable({
            fixedHeader: true
        });
        $.ajax({
            url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + villagecode + "&pinno=" + pin,
            success: function(result) {
                for (var i = 0; i < result.basicInfo.length; i++) {
                    table.row.add([
                        i + 1,
                        // result.basicInfo[i].district,
                        // result.basicInfo[i].blockname,
                        // result.basicInfo[i].vinname,
                        // result.basicInfo[i].soil_sample_no,
                        // result.basicInfo[i].shc_no,
                        result.basicInfo[i].farmer_name,
                        result.basicInfo[i].surveyno,
                        '<a style="color:blue;text-decoration: underline;" id="btn" onclick=loadshcfarmerDetailsm("' + result.basicInfo[i].shc_no + '");>View </a>'
                    ]).draw(false);
                }

            }
        });
        '</tbody>'
        '</table>'
    }
}


function printshc() {
    var shc = document.getElementById("shcnumber").value;
    window.open("https://mahapocra.gov.in/data-services/farmershc.php?shcno=" + shc);
}

function printshcm() {
    var shc = document.getElementById("shcnumberm").value;
    window.open("https://mahapocra.gov.in/data-services/farmershc.php?shcno=" + shc);
}
var geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
        enableHighAccuracy: true,
    },
    projection: view.getProjection(),
});

function el(id) {
    return document.getElementById(id);
}

el('locbutton').addEventListener('click', function() {
    geolocation.setTracking(true);
});

// update the HTML page when the position changes.




var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC',
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2,
            }),
        }),
    })
);

geolocation.on('change:position', function() {
    map.getView().setCenter(geolocation.getPosition());
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ?
        new ol.geom.Point(coordinates) : null);
    map.getLayers().forEach(function(layer, i) {
        if (map.getLayers().item(i).get('title') === "State") {
            map.removeLayer(layer);
        }
    });
    mapm.getLayers().forEach(function(layer, i) {
        if (mapm.getLayers().item(i).get('title') === "State") {
            mapm.removeLayer(layer);
        }
    });
    map.getView().setZoom(10);
    mapm.getView().setZoom(10);
});
// update the HTML page when the position changes.
geolocation.on('change', function() {
    el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';

});

// handle geolocation error.
geolocation.on('error', function(error) {
    var info = document.getElementById('accuracy');
    info.innerHTML = error.message;
    info.style.display = '';
});
new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: [positionFeature],
    }),
});
new ol.layer.Vector({
    map: mapm,
    source: new ol.source.Vector({
        features: [accuracyFeature, positionFeature],
    }),
});

function loaddiv() {
    opendiv("container");
    opendiv("mydiv");
    opendiv("containerm");
    opendiv("mydivmo");
}