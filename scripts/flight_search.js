var flightRawList;
var flightList = [];
var flightShortList = [];
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function is_gate_valid (gate_zone, Schengen) {
  var result = false;
  //gate A (1) ==> only show Schengen: 
  //gate B (2) or T (3) ==> only show Non-Schengen: 
  if (gate_zone == "1")  
  {
    if (Schengen == "S") result = true;
  } else if (gate_zone == "2" || gate_zone == "3")
  {
    if (Schengen == "N") result = true;
  }
  return result;
}

 function flight_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_flight_list() {
  flightRawList = JSON.parse(BRU_FlightRawList);
  flightList = [];
  flightList.length = 0;
  var gate_zone = api.fn.answers().Core_Q3;

  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if ((flight.Date == getToDate()) && (flight.A_D == "D" )) //today flight && departure
    {
      if (is_gate_valid(gate_zone, flight.Schengen))
      {
        
        var Date = '"Date"' + ":" + '"' +  flightRawList[i].Date + '", ';
        var Time = '"Time"' + ":" + '"' +  flightRawList[i].Time + '", ';
        var Flight = '"Flight"' + ":" + '"' +  flightRawList[i].Flight + '", ';
        var Airline = '"Airline"' + ":" + '"' +  flightRawList[i].Airline + '", '; //name
        var AirlineCode = '"AirlineCode"' + ":" + '"' +  flightRawList[i].AirlineCode + '", ';//code
        var Dest = '"Dest"' + ":" + '"' +  flightRawList[i].Dest + '", ';
        var DestName = '"DestName"' + ":" + '"' +  flightRawList[i].DestName + '", ';
        var Via = "";
        var ViaName = "";
        var DestinationNameCombine = '"DestinationNameCombine"' + ":" + '"' + flightRawList[i].DestName+ '", ';

        if (  flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Via = '"Via"' + ":" + '"' +  flightRawList[i].Next + '", ';
          ViaName = '"ViaName"' + ":" + '"' +  flightRawList[i].NextName + '", ';
          DestinationNameCombine = '"DestinationNameCombine"' + ":" + '"' +flightRawList[i].NextName +"/"+ flightRawList[i].DestName+ '", ';
        }

        var Show = '"Show"' + ":" + '"' +  flightRawList[i].Flight + " (" + flightRawList[i].Airline + ", ";
        Show += flightRawList[i].Time + " to " + flightRawList[i].Dest ;
        if (flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Show += " via " +  flightRawList[i].Next ;
        }
        Show +=")";

        var str = '{' + Date + Time + AirlineCode + Airline + Flight +  Dest + DestName + Via + ViaName + DestinationNameCombine + Show + '"}';
      
        flightList.push(JSON.parse(str));
      }
    }
  }
  //console.log("flightList: ", flightList);
}

function update_drop_box_list() {
  var input = document.getElementById('inputFlightCodeID').value;
  var searchList = document.getElementById('flightDropBoxList');
  
  searchList.innerHTML = '';
  flightShortList = [];
  flightShortList.length = 0;

  input = input.toLowerCase();

  var count = 0;
  for (i = 0; i < flightList.length; i++) {
    let flight = flightList[i];
    var today = getToDate();
    
    if (today == flight.Date)
    { 
      if (flight.Show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = flight.Show;
        searchList.appendChild(elem);
        flightShortList.push(flight);
        count++;
      }
    }
    
    if (count > 7) {
      break;
    }
  }

  if (flight_in_list_found(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeID').value);
  }  
  
  console.log("search flight done!");
}

function select_flight() {
  var selectedFlight = document.getElementById('inputFlightCodeID').value;
  var found = false;
 //$('.rt-btn.rt-btn-next').hide(); 

  for (i = 0; i < flightShortList.length; i++) {
    var currentFlight = flightShortList[i];
    if (currentFlight.Show == selectedFlight) { 
      //store detail data here
      //Search engine to produce Flight no., Airline, Destination, Via - to be added later
      var airlineName = currentFlight.Airline; 
      api.fn.answers({Selected_Flight_Text:  selectedFlight});
      api.fn.answers({Q4_airline_name:   airlineName}); //airline name
      api.fn.answers({Q4_airline:   currentFlight.AirlineCode}); //airline code
      api.fn.answers({Q4_flight_number:   currentFlight.Flight});
      api.fn.answers({Q4_destination:   currentFlight.Dest});
      api.fn.answers({Q4_destination_name: currentFlight.DestName});
      api.fn.answers({Q4_via: currentFlight.Via});
      api.fn.answers({Q4_via_name: currentFlight.ViaName});
      api.fn.answers({Q4_Schengen: currentFlight.Schengen});
      api.fn.answers({Q4_destination_name_combine: currentFlight.DestinationNameCombine});
      
      
      console.log("currentFlight: ", currentFlight);
      found = true;
      $('.rt-btn.rt-btn-next').show(); 
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}

function show_flight_search_box() {
  load_flight_list();
/* 
  $('.rt-element.rt-text-container').append(`<input list="flightDropBoxList" onchange="select_flight()"  onkeyup="update_drop_box_list()" name="inputFlightCodeID" id="inputFlightCodeID" >
  <datalist id="flightDropBoxList"> </datalist>`); */

  $('.rt-element.rt-text-container').append(`<input list="flightDropBoxList" onchange="select_flight()"  onkeyup="update_drop_box_list()" name="inputFlightCodeID" id="inputFlightCodeID" >
  <datalist id="flightDropBoxList"> </datalist>`);
 

  var currentValue  = api.fn.answers().Selected_Flight_Text;
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputFlightCodeID').value = currentValue;
    }
  }

  if (flight_in_list_found(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeID').value);
  }
  $('#inputFlightCodeID').show(); 
}


function hide_flight_search_box() {
  $('#inputFlightCodeID').hide();
  //var x = document.getElementById('inputFlightCodeID');
  //x.style.display = "none";
}