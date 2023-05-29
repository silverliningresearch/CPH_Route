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
      total_quota = 3000;
       break;      
    case "02-2024":
      total_quota = 3000;
      break;      
    case "03-2024":
      total_quota = 3000;
      break;      
    case "04-2024":
      total_quota = 3667;
      break;      
    case "05-2024":
      total_quota = 3667;
      break;      
                    
    default:
      total_quota = 99;
      break;
  }
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
  quota_data_temp = JSON.parse(quota_info);
  removed_ids_data = JSON.parse(removed_ids);

  var interview_data_temp  = JSON.parse(interview_data_raw);
  var flight_list_temp  = JSON.parse(flight_list_raw);

  initCurrentTimeVars();	

  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    var quota_month =  quota_data_temp[i].Month + "-"  + quota_data_temp[i].Year; 
    if (quota_month== currentMonth)
    {
      quota_data.push(quota_data_temp[i]);
    }
  }
  console.log("quota_data: ", quota_data);
  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_temp[0].download_time;
  for (i = 0; i < interview_data_temp.length; i++) {
    var interview = interview_data_temp[i];
    //only get complete interview & not test
    if ((interview.InterviewState == "Completed")
          //&& (interview.InterviewerID != 999)
          && (isCurrentMonth(interview.InterviewEndDate))
    )
    {
      if (interview["Dest"] &&  interview["AirlineCode"]) {
        var Airport_Airline = '"Airport_Airline"' + ":" + '"' +  interview["Dest"] + "-" + interview["AirlineCode"] + '", ';
        var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewEndDate"] ;
        var str = '{' + Airport_Airline + InterviewEndDate + '"}';

        if (isvalid_id(interview["InterviewId"])) //check if valid
        {
          interview_data.push(JSON.parse(str));
        }
        else
        {
          console.log("invalid id: ", interview);
        }
      }
      else{
        console.log("ignored interview: ", interview);
      }
    }
  }

  //prepare flight list
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
        //|| (nextDate == flight.Date)
        )
    { 
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
}
