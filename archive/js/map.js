const timeoutInMiliseconds = 600000;
let timeoutId; 
  
function startTimer() { 
    // window.setTimeout returns an Id that can be used to start and stop a timer
    timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds)
}
  
function doInactive() {
	clearInterval(timer);
    document.getElementById('inactive-popup').style.visibility = "visible";
    // does whatever you need it to actually do - probably signs them out or stops polling the server for info
}
 
function setupTimers () {
    document.addEventListener("mousemove", setupTimers, false);
    document.addEventListener("mousedown", setupTimers, false);
    document.addEventListener("keypress", setupTimers, false);
    document.addEventListener("touchmove", setupTimers, false);
     
    //startTimer();
}

function startMap() {
    call();
    setupTimers();
}

const timer = setInterval(call, 60000);

document.onselectionchange = () => {
    call();
    
};

const dep = document.querySelector("#dtype");
const age = document.querySelector("#data-agency");
const are = document.querySelector("#data-area");

const url = 'https://hc911server.com/api/calls';
//const url = '//localhost:8080/api/calls';
let datapool = {};

function call() {
    fetch(url)
        .then(response => response.json()) //converts request from fetch to json
        .then(data => {
            datapool = data;
            initializingMap()
            clearPool()
            sort()
            init()
        });
}

function clearMap() {
    L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
    call();
}

let datapoolSort = {};

function sort() {
    let sort1 = datapool;
    let sort2 = {};
    let sort3 = {};
    let sort4 = {};

    let rSort = document.getElementsByName('rStatus');
    sortOne = ""
    for(i = 0; i < rSort.length; i++) {
        if(rSort[i].checked)
        sortOne = rSort[i].value;
    }

    if(sortOne == "all") {
        sort1 = datapool
    } else {
        sort1 = sort1.filter(x => x.status === sortOne)
    }

    
    sort2 = sort1;
    let sortTwo = dep.value;

    if(sortTwo == "all") {
        sort2 = sort1
    } else {
       sort2 = sort2.filter(x => x.agency_type === sortTwo)
    }


    sort3 = sort2;
    let sortThree = age.value;

    if(sortThree == "all") {
        sort3 = sort2
    } else {
       sort3 = sort3.filter(x => x.jurisdiction === sortThree)
    }

    sort4 = sort3;
    let sortFour = are.value;

    if(sortFour == "all") {
        sort4 = sort3
    } else {
       sort4 = sort4.filter(x => x.city === sortFour)
    }

    datapoolSort = sort4;
    console.log(datapoolSort);
}

function clearPool() {
    markers.clearLayers();
    let chart = document.getElementById('chart');
    if(chart != null) {
        chart.replaceChildren();
    }
}

function initializingMap() {
    var container = L.DomUtil.get('map');
    if(container != null){
        container._leaflet_id = null;
    }
}

var imagery = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
// var imagery = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
//var imagery = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var map = L.map('map').setView([35.088743, -85.239854], 11);
L.tileLayer(imagery, {
    minZoom: 8,
    maxZoom: 16,
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
}).addTo(map);

var fsControl = L.control.fullscreen({ position: 'topright' });
map.addControl(fsControl);

map.on('popupopen', function(e) {
    if(typeof e.popup._source._tooltip != "undefined") {
        e.popup._source._tooltip.setOpacity(0);
    }
});

map.on('popupclose', function(e) {
    if(typeof e.popup._source._tooltip != "undefined") {
        e.popup._source._tooltip.setOpacity(1);
    }
});

var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    animate: true
});

function init() {
    let dataset = [];
    dataset = Object.entries(datapoolSort);
    

    for (var i = 0; i < dataset.length; i++) {
        let a = dataset[i];
        let id = a[1].id
        let lat = parseFloat(a[1].latitude)
        let long = parseFloat(a[1].longitude)
        let cords = [lat, long]
        let utcDate = a[1].creation
        let newDateStart = new Date(utcDate);
        let cday = newDateStart.getDate();
        let cmonth = newDateStart.getMonth();
        let cyear = newDateStart.getFullYear();
        let chours = newDateStart.getHours();
        let cmin = String(newDateStart.getMinutes()).padStart(2, '0');
        let rhours = 0

        Date.prototype.stdTimezoneOffset = function () {
            var jan = new Date(this.getFullYear(), 0, 1);
            var jul = new Date(this.getFullYear(), 6, 1);
            return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        }
        
        Date.prototype.isDstObserved = function () {
            return this.getTimezoneOffset() < this.stdTimezoneOffset();
        }
        
        let offset = 4
        var today = new Date();
        if (today.isDstObserved()) { 
            offset = 4
        } else {
            offset = 5
        }

        if (chours + 4 == 24) {
            rhours = 00;
        } else if ( chours + offset == 25) {
            rhours = 01;
        } else if (chours + offset == 26) {
            rhours = 02;
        } else if (chours + offset == 27) {
            rhours = 03;
        } else if (chours + offset == 28) {
            rhours = 04;
        } else {
            rhours = chours + offset;
        }

        let newDate = (cmonth + 1) + "/" + cday + "/" + cyear + " " + (rhours) + ":" + cmin;

        /* Jurisdiction pin logic chain */
        let department = "";

        if (a[1].agency_type == "Law") {
            department = "police";
        } else if (a[1].agency_type == "EMS") {
            department = "ems";
        } else if (a[1].type_description == "ROAD CLOSURE") {
            department = "roadclosure"
        } else if (a[1].agency_type == "Fire") {
            department = "fire"
        } else {
            department = "police";
        }

        /* Jurisdiction pin logic chain */
        let status = "";

        if (a[1].status == "Enroute") {
            status = "e";
        } else if (a[1].status == "At Hospital") {
            status = "h";
        } else if (a[1].status == "Transporting") {
            status = "t"
        } else if (a[1].type_description == "ROAD CLOSURE") {
            status = "r"
        } else {
            status = "os";
        }

        let medSweep = ""

        if (a[1].type == "ABDPN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "ABDPN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "INJURY") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "AWOBST") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "ALAMED") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "ALLERGIC") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "AMPU") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "ANSBT") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "BABY") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "BACKPN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "BLEEDING") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "BURN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "CARARR") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "CHESTPN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "CPR") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "DIABET") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "DIFFBR") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "DROWN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "DRUGOD") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "ELESH") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "EXPOSURE") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "EYEINJ") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "FALL") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "HEADPN") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "HEART") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "FALLHI") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "MACHINERY") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "INGEST") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "INHAL") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "PREG") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "PSYCH") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "SEIZE") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "SICK") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "STROKE") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "TRAUMA") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "UNCONC") {
            medSweep = "EMS CALL"
        } else if (a[1].type == "UNKMED") {
            medSweep = "EMS CALL"
        } else {medSweep = a[1].type_description}

        let info = '<strong>' + a[1].master_incident_id + '</strong> <br>' + newDate + ' <br>' + a[1].jurisdiction + ' <br>' + medSweep + ' <br>' + a[1].location;
        L.marker((cords), {
            icon: L.icon({
                iconUrl: 'images/pins/' + department + '.png',
                iconRetinaUrl: 'images/pins/' + department + '@2x.png',
                iconSize: [30, 38],
                iconAnchor: [15, 30],
                popupAnchor: [-1, -30],
                shadowUrl: 'images/pins/_shadow.png',
                shadowSize: [59, 67],
                shadowAnchor: [25, 39],
                // className: 'marker-icon',
            }),
        })

        .bindPopup(info, {
            className: 'marker-info status-' + department
        })

        .bindTooltip('<strong>' + status + '</strong>', {
            direction: 'top',
            pane: 'shadowPane',
            permanent: true,
            opacity: 1,
            offset: [0, -23],
            className: 'marker-code status-' + department
        }).addTo(markers);

        /* Chart Logic */

        let row = document.getElementById("chart");

        let tr = document.createElement("tr");
        row.appendChild(tr);

        let type = document.createElement("td");
        tr.appendChild(type);

        let typeS = document.createElement("strong");
        typeS.innerHTML = a[1].agency_type;
        type.appendChild(typeS);

        let stat = document.createElement("td");
        tr.appendChild(stat);

        let statS = document.createElement("strong");
        statS.innerHTML = a[1].status;
        stat.appendChild(statS);

        let mi = document.createElement("td");
        tr.appendChild(mi);

        let miS = document.createElement("strong");
        miS.innerHTML = "Incident # " + a[1].sequencenumber;
        mi.appendChild(miS);

        let dateC = document.createElement("td");
        dateC.innerHTML = newDate;
        tr.appendChild(dateC);

        let jur = document.createElement("td");
        jur.innerHTML = a[1].jurisdiction;
        tr.appendChild(jur);

        let des = document.createElement("td");
        des.innerHTML = medSweep;
        tr.appendChild(des);

        let loc = document.createElement("td");
        tr.appendChild(loc);
        
        let clickBut = document.createElement("button")
        clickBut.type = "button"
        
        clickBut.addEventListener('click', function(){
            mapOpen();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            map.flyTo([lat, long], 16, {
                animate: true,
            });
        });
        loc.appendChild(clickBut)

        let butName = document.createElement("p");
        butName.innerHTML = a[1].location;
        clickBut.appendChild(butName);

        let area = document.createElement("td");
        area.innerHTML = a[1].city;
        tr.appendChild(area);

        tr.classList.add("rowSplit")
        tr.classList.add("status-code-" + department)
        type.classList.add("col-type")
        typeS.classList.add(department)
        stat.classList.add("col-status")
        mi.classList.add("col-incident")
        area.classList.add("col-area")
        dateC.classList.add("col-date")
        loc.classList.add("col-loc")
        des.classList.add("col-des")
        jur.classList.add("col-jur")

        loc.classList.add("locCell")
        clickBut.classList.add("clickBut")

    }

    map.addLayer(markers);

    L.Control.Logo = L.Control.extend({
        onAdd: function (map) {
            var img = L.DomUtil.create('img');
            img.src = 'images/logo-mobile@2x.png';
            img.style.width = '70px';
            return img;
        },
    });
    L.control.logo = function (opts) {
        return new L.Control.Logo(opts);
    };
    var logoControl = L.control.logo({position: 'bottomleft'});

    map.on('enterFullscreen', function(){
        logoControl.addTo(map);
    });

    map.on('exitFullscreen', function(){
        logoControl.remove();
    });

}

function mapToggle() {
    const element = document.getElementById("mapHouse");
    element.classList.toggle("mapGrow");
    const element2 = document.getElementById("map");
    element2.classList.toggle("mapShow");
    clearMap();
    textSwap();
}

function mapOpen() {
    const element = document.getElementById("mapHouse");
    element.classList.add("mapGrow");
    const element2 = document.getElementById("map");
    element2.classList.add("mapShow");
    clearMap();
    textOpen();
}