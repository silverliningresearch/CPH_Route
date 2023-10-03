var flightRawList;
var flightList = [];
var flightShortList = [];
/************************************/
function getToDate() {
  var d = new Date();
      
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
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

function notDeparted_flight_search(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  //plus  2 hour
  flight_time_value = flight_time_value + 120;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function load_flights_list() {
  flightRawList = JSON.parse(flight_list_raw);
  flightList = [];
  flightList.length = 0;

  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if (flight.Date == getToDate() && notDeparted_flight_search(flight.Time))
    {
      var Date = '"Date"' + ":" + '"' +  flightRawList[i].Date + '", ';
      var Time = '"Time"' + ":" + '"' +  flightRawList[i].Time + '", ';
      var Flight = '"Flight"' + ":" + '"' +  flightRawList[i].Flight + '", ';
      var Airline = '"Airline"' + ":" + '"' +  flightRawList[i].Airline + '", '; //name
      var AirlineCode = '"AirlineCode"' + ":" + '"' +  flightRawList[i].AirlineCode + '", ';//code
      var Dest = '"Dest"' + ":" + '"' +  flightRawList[i].Dest + '", ';
      var DestName = '"DestName"' + ":" + '"' +  flightRawList[i].DestName + '", ';
      var City = '"City"' + ":" + '"' +  flightRawList[i].City + ", "  + flightRawList[i].Country  + '", ';
      var Country = '"Country"' + ":" + '"' +  flightRawList[i].Country + '", ';
      var Via = "";
      var ViaName = "";

      if ((flightRawList[i].Next && flightRawList[i].Next !="") && (flightRawList[i].Next != flightRawList[i].Dest)) {
        Via = '"Via"' + ":" + '"' +  flightRawList[i].Next + '", ';
        ViaName = '"ViaName"' + ":" + '"' +  flightRawList[i].NextName + '", ';
      }

      var Show = '"Show"' + ":" + '"' +  flightRawList[i].Flight + " (" + flightRawList[i].Airline + ", ";
      Show += flightRawList[i].Time + " to " + flightRawList[i].Dest ;
      if (flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
        Show += " via " +  flightRawList[i].Next ;
      }
      Show +=")";

      var str = '{' + Date + Time + AirlineCode + Airline + Flight +  Dest + DestName + Via + ViaName +  City +  Country + Show + '"}';
    
      flightList.push(JSON.parse(str));
    }
  }
  console.log("flightList: ", flightList);
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
    
    if (count > 30) {
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

function select_flight(currentFlight) {
    if (flight_in_list_found(flightList,currentFlight.Show)) { 
      //store detail data here
      api.fn.answers({Qii_airline_name:   currentFlight.Airline}); //airline name
      api.fn.answers({Qii_airline:   currentFlight.AirlineCode}); //airline code
      api.fn.answers({Qii_flight_number:   currentFlight.Flight});
      api.fn.answers({Core_Qii:   currentFlight.Flight});
      api.fn.answers({Qii_destination:   currentFlight.Dest});
      api.fn.answers({Qii_destination_name: currentFlight.DestName});
      api.fn.answers({Qii_city: currentFlight.City});
      api.fn.answers({Qii_country: currentFlight.Country});
      api.fn.answers({Qii_Show: currentFlight.Show});
        
      console.log("currentFlight: ", currentFlight);
      found = true;
      $('.rt-btn.rt-btn-next').show(); 
    }

}

// Important: Make sure to return true when your filter
// receives an empty string as a search term.

function contains(str1, str2) {
  return new RegExp(str2, "i").test(str1);
}


function show_flight_search_box() {
  load_flights_list();  
   
  if (data) { // clear data
    delete data;
  }
  var data = $.map(flightList, function (obj) {
    obj.id = obj.id || flightList.indexOf(obj); // replace pk with your identifier
    obj.text = obj.Show;
    return obj;
  });

  $('.rt-body.slt-page-container main').find('section').hide(500);
  if ($('.flight-number').length) {
    $('.flight-number').show();
    $('.flight-number #flight-number-select2').select2("destroy");
  }
  else
  {
    $('.rt-body.slt-page-container main').append(`<section class='flight-number'>
  <sha-interview-page-renderer>
      <sha-interview-page-item-renderer>
        <sha-rt-element>
            <div class="sv-rt-element-container rt-element rt-sc-container q1 rt-element-active">
              <sha-basic-single-choice>
                  <div class="rt-qtext fr-view" id="1-text">Please select outlet name:</div>
                  <div class="rt-qelement">
                    <div class="rt-form-group">
                        <sha-basic-single-item>
                          <div class="rt-control rt-answer-option rt-has-input">
                              <input type="radio" class="rt-control-input ng-untouched ng-pristine ng-valid" id="single_1_1" name="single_1" aria-labelledby="1-text label-1-0" tabindex="100000" onchange="save_answer()"><label class="rt-control-label rt-radio-button fr-view" id="label-1-0" for="single_1_1"><span>Outlet name:</span></label>
                              <sha-validated-text-input>
                                <div class="rt-semi-open-container">
                                    <sha-list-autocomplete>
                                      <sha-drop-down class="ng-untouched ng-pristine ng-valid">
                                          <div >
                                            <dx-drop-down-box  class="rt-drop-down-container dx-show-invalid-badge dx-dropdownbox dx-textbox dx-texteditor dx-show-clear-button dx-dropdowneditor-button-visible dx-editor-outlined dx-widget dx-texteditor-empty dx-dropdowneditor dx-dropdowneditor-field-clickable dx-dropdowneditor-active">
                                                <div class="dx-dropdowneditor-input-wrapper" id="flight-number-select2">
                                                  <div class="dx-dropdowneditor-field-template-wrapper">
                                                      <div  class="rt-dropdown-choice-container dx-template-wrapper">
                                                        <div class="fr-view" title=""></div>
                                                        <dx-text-box class="rt-sr-only dx-show-invalid-badge dx-textbox dx-texteditor dx-editor-outlined dx-texteditor-empty dx-state-readonly dx-widget">
                                                            <div class="dx-texteditor-container">
                                                              <div class="dx-texteditor-input-container">
                                                                  <input id="inputOutletID" autocomplete="off" placeholder=" " class="dx-texteditor-input" type="text" readonly="" aria-readonly="true" spellcheck="false" tabindex="0" role="combobox">
                                                                  <div data-dx_placeholder="" class="dx-placeholder"></div>
                                                              </div>
                                                              <div class="dx-texteditor-buttons-container">
                                                                  <div></div>
                                                              </div>
                                                            </div>
                                                        </dx-text-box>
                                                      </div>
                                                  </div>
                                                  <input type="hidden" value="">
                                                  <div class="dx-texteditor-buttons-container">
                                                      <span class="dx-clear-button-area"><span class="dx-icon dx-icon-clear"></span></span>
                                                      <div role="button" class="dx-widget dx-button-mode-contained dx-button-normal dx-dropdowneditor-button" aria-label="Select">
                                                        <div class="dx-button-content">
                                                            <div class="dx-dropdowneditor-icon"></div>
                                                        </div>
                                                      </div>
                                                  </div>
                                                </div>
                                            </dx-drop-down-box>
                                          </div>
                                      </sha-drop-down>
                                    </sha-list-autocomplete>
                                </div>
                              </sha-validated-text-input>
                          </div>
                        </sha-basic-single-item>
                        
                    </div>
                  </div>
              </sha-basic-single-choice>
            </div>
        </sha-rt-element>
      </sha-interview-page-item-renderer>
  </sha-interview-page-renderer>
  </section>
  `);

  }
  $('#flight-number-select2').on('select2:select', function (e) {
    var data = e.params.data;
    document.getElementById('inputOutletID').value = data.Show;
    $('#select2-flight-number-select2-container').prop('title', data.Show);
    $('#select2-flight-number-select2-container').html(data.Show);
    $('#single_1_1').prop('checked', true);
    
    select_flight(data);
  });
  var currentValue  = api.fn.answers().Outlet_ID;
  console.log("currentValue", currentValue);
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputOutletID').value = currentValue;
      $('#single_1_1').prop('checked', true);
    }
  }
  $('.flight-number #flight-number-select2').select2({
    // allowClear: true,
    // placeholder: "",
    data: data,
    query: function(q) {
      var pageSize = 50,
          results = this.data.filter(function(e) {
            return contains(e.text, q.term);
          });
          
      // Get a page sized slice of data from the results of filtering the data set.
      var paged = results.slice((q.page - 1) * pageSize, q.page * pageSize);
      
      q.callback({
        results: paged,
        more: results.length >= q.page * pageSize
      });
    }
  });
  $('.flight-number').show(); 
  $('.rt-btn.rt-btn-next').hide(); 
}

function dontanswer(){
  console.log('Press do not want to answer')
  clear_data_select2();
  //set value don't answer
}

function save_answer(){ //doesnt works???
  console.log('saving data via event...');
  clear_data_select2();
  //store detail data here
}

function clear_data_select2(){
  $('#flight-number-select2').val(null).trigger('change');
  document.getElementById('inputOutletID').value = "";
  $('#select2-flight-number-select2-container').prop('title', "");
  $('#select2-flight-number-select2-container').html("");
}

function hide_flight_search_box() {
  $('.rt-body.slt-page-container main').find('section').show();
  $('.flight-number').hide();
  $('#flight-number-select2').find("[data-select2-id]").remove();
}
