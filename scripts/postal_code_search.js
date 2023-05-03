var postalCodeList;
var rawList = [];
var postalCodeShortList = [];

function find_postal_code(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  //$('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_postal_code() {
  console.log("load_postal_code started...");

  var country = api.fn.answers().Q55_Recoded;
  if (country.includes('Belgium')) {
    rawList = JSON.parse(postalCodeBelgium);
  }
  else if (country.includes('France')) {
    rawList = JSON.parse(postalCodeFrance);
  }
  else if (country.includes('Germany')) {
    rawList = JSON.parse(postalCodeGermany);
  }
  else if (country.includes('Luxembourg')) {
    rawList = JSON.parse(postalCodeLuxembourg);
  }
  else if (country.includes('Netherlands'))  {
    rawList = JSON.parse(postalCodeNetherlands);
  }
  else {
    rawList = JSON.parse(postal_code_All);
  }
  
  postalCodeList = [];
  postalCodeList.length = 0;
  for (i = 0; i < rawList.length; i++) {
    var item = rawList[i];
    postalCodeList.push(item);
  }

  //Add Dont want to answer
  // var item;
  // item.Code = "Don’t want to answer";
  // item.Catchment = "Don’t want to answer";
  // item.AVM = "Don’t want to answer";
  // item.Country = "Don’t want to answer";
  // item.show = "Don’t want to answer";  
  // postalCodeList.push(item);
  ////////////////

  api.fn.answers({Q56_Catchment:  "No"}); //Clear it
  console.log("load_postal_code done!");
}

function update_postal_code_search_box() {
  var input = document.getElementById('inputPostalCodeID').value;
  var list = document.getElementById('postalCodehtmlList');
  
  list.innerHTML = '';
  input = input.toLowerCase();

  postalCodeShortList = [];
  postalCodeShortList.length = 0;

  var count = 0;
  if (input.length>0) {
    for (i = 0; i < postalCodeList.length; i++) {
      let postcalCode = postalCodeList[i];

      if (postcalCode.show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = postcalCode.show;
        list.appendChild(elem);
        postalCodeShortList.push(postcalCode);
        count++;
      }

      if ((count > 7)) {
        break;
      }
    }
  }
  
  //Load "Dont want to answer" from the end of the list
  // let postcalCode = postalCodeList[postalCodeList.length-1];
  // const elem = document.createElement("option");
  // elem.value =  postcalCode.show;
  // list.appendChild(elem);
  // postalCodeShortList.push(postcalCode);
  ////////////////

  if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
    console.log("Found ", document.getElementById('inputPostalCodeID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputPostalCodeID').value);
  }
}

function select_postal_code() {
  var selectedPostalCode = document.getElementById('inputPostalCodeID').value;
  api.fn.answers({Core_Q56:  selectedPostalCode});
  api.fn.answers({Q56_postal_code_show:  selectedPostalCode});
  
  for (i = 0; i < postalCodeShortList.length; i++) {
    var currentPostalCode = postalCodeShortList[i];
    if (currentPostalCode.show == selectedPostalCode) { 
      console.log("selectedPostalCode: ", currentPostalCode);
      api.fn.answers({Core_Q56:  currentPostalCode.Code});
      api.fn.answers({Q56_Catchment:  currentPostalCode.Catchment});
      api.fn.answers({Q56_Key:  currentPostalCode.Key});
      api.fn.answers({Q56_AVM:  currentPostalCode.AVM});
    }
  }

  if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
    console.log("Select found ", document.getElementById('inputPostalCodeID').value);
  }
  else{
    console.log("Select not found ", document.getElementById('inputPostalCodeID').value);
    alert("Please select a postal code from the list.");
  }
}

function show_postal_code_search_box() {
    load_postal_code();  

    $('.rt-element.rt-text-container').append(`<input list="postalCodehtmlList" onchange="select_postal_code()"  onkeyup="update_postal_code_search_box()" name="inputPostalCodeID" id="inputPostalCodeID" autocomplete="off">
    <datalist id="postalCodehtmlList"> </datalist>`);
    document.getElementById('inputPostalCodeID').value = "";

    var currentValue  = api.fn.answers().Q56_postal_code_show;
    if (currentValue) {
      if (currentValue !== "") {
        document.getElementById('inputPostalCodeID').value = currentValue;
      }
    }

    if (find_postal_code(postalCodeList, document.getElementById('inputPostalCodeID').value)) {
      console.log("Found ", document.getElementById('inputPostalCodeID').value);
    }
    else{
      console.log("not found ", document.getElementById('inputPostalCodeID').value);
    }

    //$('.rt-btn.rt-btn-next').hide(); 
    $('#inputPostalCodeID').show(); 
}

function hide_postal_code_search_box() {
  $('#inputPostalCodeID').hide();
}

