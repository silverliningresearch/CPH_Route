var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentDate; //dd-mm-yyyy
var currentMonth; //mm
var nextDate; //dd-mm-yyyy

var download_time;

var total_quota = 3666;
var total_completed;
var total_completed_percent;

var total_quota_completed;
var total_hard_quota;

var less_than_2_flights_list;
var less_than_6_flights_list;
/************************************/
/************************************/
function initCurrentTimeVars() {
  var today = new Date();

  var day = '' + today.getDate();
  var month = '' + (today.getMonth() + 1); //month start from 0;
  var year = today.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  currentDate = [day, month, year].join('-');
  currentMonth =[month, year].join('-');;

  //return [day, month,year].join('-');
  if (document.getElementById('year_month') && document.getElementById('year_month').value.length > 0)
  {
    if (document.getElementById('year_month').value != "current-month")
    {
      currentMonth = document.getElementById('year_month').value;
    }
  }
    console.log("currentMonth: ", currentMonth);

  //////////
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  var tomorrowMonth = '' + (tomorrow.getMonth() + 1); //month start from 0;
  var tomorrowDay = '' + tomorrow.getDate();
  var tomorrowYear = tomorrow.getFullYear();

  if (tomorrowMonth.length < 2) tomorrowMonth = '0' + tomorrowMonth;
  if (tomorrowDay.length < 2) tomorrowDay = '0' + tomorrowDay;

  nextDate  = [tomorrowDay, tomorrowMonth, tomorrowYear].join('-');
  //////////
  switch(currentMonth) {
    case "05-2023":
      total_quota = 3666;
      break;    
    case "06-2023":
      total_quota = 3666;
      break;
    case "07-2023":
      total_quota = 3667;
      break;
    case "08-2023":
      total_quota = 3667;
      break;      
    case "09-2023":      
      total_quota = 3666;
      break;    
    case "10-2023":          
      total_quota = 3000;
      break;
    case "11-2023":          
      total_quota = 3000;
      break;
    case "12-2023":              
      total_quota = 3000;
      break;
    case "01-2024":
      total_quota = 3035;
       break;      
    case "02-2024":
      total_quota = 3035;
      break;      
    case "03-2024":
      total_quota = 3035;
      break;      
    case "04-2024":
      total_quota = 3632;
      break;      
    case "05-2024":
      total_quota = 3900;
      break;      
    
    case "06-2024":
    case "07-2024":                    
    case "08-2024":        
    case "09-2024":  
      total_quota = 3666;
        break;   

    case "10-2024":
    case "11-2024":        
    case "12-2024":   
    total_quota = 3000;
    break;  

    case "01-2025":
      total_quota = 3600;
      break;  

    case "02-2025":                    
    case "03-2025":        
      total_quota = 3000;
      break;  

    case "04-2025":  
    case "05-2025":      
      total_quota = 3666;
      break;   
      

        default:
      total_quota = 99;
      break;
  }
}

function isNextDay()
{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  //?nextday=true
  //console.log("urlParams.has('nextday'): ", urlParams.has('nextday'));
  return(urlParams.has('nextday'));
}

function isCurrentMonth(interviewEndDate)
{
// Input: "2023-04-03 10:06:22 GMT"
  var interviewDateParsed = interviewEndDate.split("-")

  var interviewYear = (interviewDateParsed[0]);
  var interviewMonth =(interviewDateParsed[1]);
  
  var result = false;

  if ( currentMonth ==[interviewMonth,interviewYear].join('-'))
  {
    result = true;
  }

   return result;
}

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('dk-DK', { timeZone: 'Europe/Copenhagen', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function isvalid_id(id)
{
  valid = true;

  var i = 0;
  for (i = 0; i < removed_ids_data.length; i++) 
  { 
    if (removed_ids_data[i].removed_id == id)
    {
      valid = false;
    }
  }
  return valid;
}
function prepareInterviewData() {
  var quota_data_temp = JSON.parse(quota_info);
  removed_ids_data = JSON.parse(removed_ids);

  var interview_data_temp  = JSON.parse(interview_statistics);
  var flight_list_temp  = JSON.parse(flight_list_raw);

  initCurrentTimeVars();	

  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    var quota_month =  quota_data_temp[i].Month + "-"  + quota_data_temp[i].Year; 

    if ((quota_month== currentMonth) && (quota_data_temp[i].Quota>0))
    {
      if (currentMonth == "07-2024") 
        {
          if ((quota_data_temp[i].Dest == "SOF")) {
            quota_data_temp[i].Quota = Math.round(30);
          }

          if ((quota_data_temp[i].Dest == "ADD")) {
            quota_data_temp[i].Quota = Math.round(50);
          }

          if ((quota_data_temp[i].Airport_Airline == "ZRH-SK")) {
            quota_data_temp[i].Quota = Math.round(50);
          }

          if ((quota_data_temp[i].Airport_Airline == "BOD-EJU")) {
            quota_data_temp[i].Quota = Math.round(40);
          }

          if ((quota_data_temp[i].Airport_Airline == "IAS-W4")) {
            quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota*2);
          }
      

    }
 
    if (currentMonth == "08-2024") 
    {
      if ((quota_data_temp[i].Dest == "SOF")) {
        quota_data_temp[i].Quota = Math.round(30);
      }

      if ((quota_data_temp[i].Dest == "ADD")) {
        quota_data_temp[i].Quota = Math.round(50);
      }

      if ((quota_data_temp[i].Airport_Airline == "ZRH-SK")) {
        quota_data_temp[i].Quota = Math.round(50);
      }

      if ((quota_data_temp[i].Airport_Airline == "BOD-EJU")) {
        quota_data_temp[i].Quota = Math.round(40);
      }

      if ((quota_data_temp[i].Dest == "DEL")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 50;
      }
  
      if ((quota_data_temp[i].Dest == "AUH")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
      
      if ((quota_data_temp[i].Dest == "PEK")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 50;
      }
  
      if ((quota_data_temp[i].Dest == "DXB")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
  
      if ((quota_data_temp[i].Dest == "ORD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
    }

    if (currentMonth == "09-2024") 
    {
      if ((quota_data_temp[i].Dest == "KUT")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }
  
      if ((quota_data_temp[i].Dest == "BOD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }
  
      if ((quota_data_temp[i].Dest == "VIE")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }
  
      if ((quota_data_temp[i].Dest == "ADD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }

      if ((quota_data_temp[i].Dest == "DEL")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 60;
      }
      if ((quota_data_temp[i].Dest == "ORD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 60;
      }

      if ((quota_data_temp[i].Dest == "IST")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 50;
      }

    }

    if (currentMonth == "10-2024") 
    {

      if ((quota_data_temp[i].Dest == "IAS")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
      if ((quota_data_temp[i].Dest == "ORD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30 + 30;
      }
      if ((quota_data_temp[i].Dest == "ADD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
      if ((quota_data_temp[i].Dest == "SOF")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 25;
      }
      if ((quota_data_temp[i].Dest == "AUH")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
      if ((quota_data_temp[i].Dest == "DXB")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30 + 50;
      }

      if (quota_data_temp[i].Airport_Airline =="DOH-AY") {
        quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota) + 50;
      }

      if ((quota_data_temp[i].Dest == "PEK")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }

      if ((quota_data_temp[i].Dest == "JFK")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }

      quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota*1.1);      
    }
  
    
    if (currentMonth == "11-2024") 
    {
      if ((quota_data_temp[i].Dest == "DEL")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }

      if ((quota_data_temp[i].Dest == "DXB")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 80;
      }

      if (quota_data_temp[i].Airport_Airline =="DOH-AY") {
        quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota) + 80;
      }

      if ((quota_data_temp[i].Dest == "ORD")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
        
      if ((quota_data_temp[i].Dest == "PEK")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
      }
      
      //All all A and B destinations with 25
      quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota +25);      

      //All A+ destinations with 50 interviews (meaning 25 more)
      var A_plus_list = ['AMS', 'CDG', 'DOH', 'DXB', 'IST', 'LHR'];
            
      if (A_plus_list.includes(quota_data_temp[i].Dest)) {
        quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota +25);      
        // do stuff
      }

    }

    if (currentMonth == "12-2024") 
      {
        if ((quota_data_temp[i].Dest == "ADD")) {
          quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;
        }
  
        if (quota_data_temp[i].Dest == "DEL") {
          quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota) + 50;
        }
  
        if (quota_data_temp[i].Dest == "DXB") {
          quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota) + 50;
        }

        quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota*1.15);      
    
    }


    if (currentMonth == "01-2025") 
    {

      if ((quota_data_temp[i].Airport_Airline == "BKK-TG")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }

      if ((quota_data_temp[i].Airport_Airline == "BEG-JU")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 20;
      }

      if ((quota_data_temp[i].Dest == "ADD")) {
        quota_data_temp[i].Quota = 0;
      }
  
      if ((quota_data_temp[i].Dest == "DEL")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 50;;
      }

      if (quota_data_temp[i].Airport_Airline =="DOH-AY") {
        quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota) + 50;
      }

      if ((quota_data_temp[i].Dest == "PEK")) {
        quota_data_temp[i].Quota = quota_data_temp[i].Quota + 30;;
      }

      //All A+ destinations with 50 interviews (meaning 25 more)
      var A_plus_list = ['AMS', 'CDG', 'DOH', 'DXB', 'IST', 'LHR'];
      
      if (A_plus_list.includes(quota_data_temp[i].Dest)) {
        quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota*1.15);      
        // do stuff
      }
        
    }
   
    if (currentMonth == "02-2025") 
    {
      //All A+ destinations with 50 interviews (meaning 25 more)
      var A_plus_list = ['AMS', 'CDG', 'DOH', 'DXB', 'IST', 'LHR'];
      
      if (A_plus_list.includes(quota_data_temp[i].Dest)) {
        quota_data_temp[i].Quota =  Math.round(quota_data_temp[i].Quota*1.15);      
      }
    }
     

      quota_data.push(quota_data_temp[i]);
    }
  }
  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_temp[0].download_time;
  for (i = 0; i < interview_data_temp.length; i++) {
    var interview = interview_data_temp[i];
    //only get complete interview & not test
    //if ((interview.InterviewState == "Completed")
    if (isCurrentMonth(interview.Interview_Date))
    {
      if (interview["Dest"] &&  interview["AirlineCode"])
       {
        var airport_code = interview["Dest"];
        var airline_code = interview["AirlineCode"];

        interview.Airport_Airline = airport_code + "-" + airline_code;
        interview.InterviewEndDate = interview["Interview_Date"] ;
        
        interview_data.push(interview);
       }
    }
  }

  //prepare flight list
  //>>Special treat for ET-VIE which will be used for ET-ADD as well
  var flight_list_temp_1 = [];
  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];
    flight_list_temp_1.push(flight);

    if ((flight.Dest == "VIE") && ((flight.AirlineCode == "ET"))) {
      const temp_flight = JSON.parse(JSON.stringify(flight));
      temp_flight.Dest = "ADD";
      temp_flight.DestName = "ADDIS ABABA BOLE (via Vienna)";
      flight_list_temp_1.push(temp_flight);
    }
  }
  flight_list_temp = flight_list_temp_1;
  //<<Special treat for ET-VIE which will be used for ET-ADD as well

  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;
  
  this_month_flight_list  = [];
  this_month_flight_list.length = 0;
  
  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];

    flight.Airport_Airline = flight.Dest + "-" + flight.AirlineCode;//code for compare
	  flight.Dest = flight.Dest + "-" + flight.DestName;
    flight.Next = ""; //flight.Next + "-" + flight.NextName;

    //for sorting: YYYY-MM-DD
    flight.DateTimeID = flight.Date.substring(6,10) +  flight.Date.substring(3,5) +  flight.Date.substring(0,2) + flight.Time;
    flight.Date_Time = flight.Date.substring(6,10) + "-" +  flight.Date.substring(3,5) + "-" + flight.Date.substring(0,2) + " " + flight.Time;

    //currentMonth: 02-2023
    //flight.Date: 08-02-2023
    if (currentMonth ==  flight.Date.substring(3,10)) { 
      this_month_flight_list.push(flight);
    }	
    
    //only get (today || tomorrow) & not departed flight
    if (((currentDate == flight.Date) && notDeparted(flight.Time))
        || ((nextDate == flight.Date) && isNextDay())
        )
    { 
      flight.Date_Time = flight.Date.substring(6,10) + flight.Date.substring(3,5) + flight.Date.substring(0,2) + flight.Time;
      today_flight_list.push(flight);
    }
  }
  
    //add quota data
    //empty the list
  daily_plan_data = [];
  daily_plan_data.length = 0;
  
  for (i = 0; i < today_flight_list.length; i++) {
    let flight = today_flight_list[i];
    for (j = 0; j < quota_data.length; j++) {
      let quota = quota_data[j];
      if ((quota.Airport_Airline == flight.Airport_Airline) && (quota.Quota>0))
      {
        flight.Quota = quota.Quota;
        daily_plan_data.push(flight);
       }
    }
  }
  //console.log("today_flight_list: ",today_flight_list);
  //console.log("daily_plan_data: ", daily_plan_data);
}
