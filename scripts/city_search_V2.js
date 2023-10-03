var cityList = [];
var cityShortList = [];
/************************************/
function city_in_list_found(list, item) {
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

function load_city_list() {
  var data = JSON.parse(cityRawList);
  
  cityList = [];
  cityList.length = 0;

  var country = "_all";;  
      
  for (i = 0; i <data.length; i++) {
    var city = data[i];
    var country_json = '"Country"' + ":" + '"' +  city.co + '", ';
    var city_json = '"City_ascii"' + ":" + '"' +  city.city + '", ';

    var show_json = '"Show"' + ":" + '"' +  city.city  + ", " + city.co;

    var str = '{' + country_json + city_json + show_json + '"}';

    cityList.push(JSON.parse(str));
  }
  //console.log("cityList: ", cityList);
}

function update_drop_box_city_list() {
  var input = document.getElementById('inputcityCodeID').value;
  var searchList = document.getElementById('cityDropBoxList');
  
  searchList.innerHTML = '';
  cityShortList = [];
  cityShortList.length = 0;

  input = input.toLowerCase();

  var count = 0;
  
  //console.log("cityList.length: ", cityList.length);
  for (i = 0; i < cityList.length; i++) {
    let item = cityList[i];
    //if (item.Show.toLowerCase().includes(input)) {
    if (item.Show.toLowerCase().indexOf(input)==0) {      
      const elem = document.createElement("option");
      elem.value = item.Show;
      searchList.appendChild(elem);
      cityShortList.push(item);
      count++;
    }
    
    if (count > 30) {
      break;
    }
  }

  if (city_in_list_found(cityList, document.getElementById('inputcityCodeID').value)) {
    console.log("Found ", document.getElementById('inputcityCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputcityCodeID').value);
  }   

}

function select_city() {
  var selectedCity = document.getElementById('inputcityCodeID').value;
  var savedData;
  var found = false;

  api.fn.answers({Q2c_City:  selectedCity});
  api.fn.answers({Core_Q2c:  selectedCity});
  console.log("Saving data...", savedData);
  
  for (i = 0; i < cityShortList.length; i++) 
  {
    var currentCity = cityShortList[i];
    if (currentCity.Show == selectedCity) 
    {
      found = true;
      break;
    } 
  }    
  
  if (!found) {
    alert("Please search for a larger city.");
  }
  else
  {
    $('.rt-btn.rt-btn-next').show(); 
  }
  console.log("Select city done!");
}

// Important: Make sure to return true when your filter
// receives an empty string as a search term.

function contains(str1, str2) {
  return new RegExp(str2, "i").test(str1);
}


function show_city_search_box() {
  load_city_list();  
   
  if (data) { // clear data
    delete data;
  }
  var data = $.map(cityList, function (obj) {
    obj.id = obj.id || cityList.indexOf(obj); // replace pk with your identifier
    obj.text = obj.Show;
    return obj;
  });

  $('.rt-body.slt-page-container main').find('section').hide(500);
  if ($('.city-number').length) {
    $('.city-number').show();
    $('.city-number #city-number-select2').select2("destroy");
  }
  else
  {
    $('.rt-body.slt-page-container main').append(`<section class='city-number'>
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
                                                <div class="dx-dropdowneditor-input-wrapper" id="city-number-select2">
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
  $('#city-number-select2').on('select2:select', function (e) {
    var data = e.params.data;
    document.getElementById('inputOutletID').value = data.Show;
    $('#select2-city-number-select2-container').prop('title', data.Show);
    $('#select2-city-number-select2-container').html(data.Show);
    $('#single_1_1').prop('checked', true);
    
    select_data(data);
  });
  var currentValue  = api.fn.answers().Outlet_ID;
  console.log("currentValue", currentValue);
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputOutletID').value = currentValue;
      $('#single_1_1').prop('checked', true);
    }
  }
  $('.city-number #city-number-select2').select2({
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
  $('.city-number').show(); 
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
  $('#city-number-select2').val(null).trigger('change');
  document.getElementById('inputOutletID').value = "";
  $('#select2-city-number-select2-container').prop('title', "");
  $('#select2-city-number-select2-container').html("");
}

function hide_city_search_box() {
  $('.rt-body.slt-page-container main').find('section').show();
  $('.city-number').hide();
  $('#city-number-select2').find("[data-select2-id]").remove();
}