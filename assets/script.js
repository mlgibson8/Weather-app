var cityList =$("#city-list");
var cities = [];
var key = "a4c7cd182e0270914ac439908765d471";

function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dayOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dayOutput;
}
init();
function init(){
     var storedCities = JSON.parse(localStorage.getItem("cities"));    
    if (storedCities !== null) {
        cities = storedCities;
      }
        renderCities();
        console.log(storeCities);
    };

function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
    };


function renderCities() {
    cityList.empty();      
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }    
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   

  
  $("#add-city").on("click", function(event){
      event.preventDefault();    
    var city = $("#city-input").val().trim();    
        if (city === "") {
        return;
    }
    cities.push(city);
    storeCities();
    renderCities();
  });

  
  
  function getResponseWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 
    
    $("#today-weather").empty();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {             
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay()+ "" ) ;
      $("#today-weather").append(cityTitle); 
      var imgtag = $("<img>");
      var skyconditions = response.weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }
       $("#today-weather").append(imgtag);

      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");

      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);

      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);       
    
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;   
      
      var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(response5day) { 
            $("#boxes").empty();
            
            for(var i=0, j=0; j<=5; i=i+7){                
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class","col-3 m-2 bg-dark text-white rounded");
                    var d = new Date(0); 
                    d.setUTCSeconds(read_date);
                    var date = d;
                    
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day

                    var Fivedayh4 = $("<h6>").text(dayOutput);

                    //Set src to the imags
                    var imgtag = $("<img>");
                    var skyconditions = response5day.list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var pTemperatureK = response5day.list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %"); 
                    var pWindSpeed = $("<p>").text("Wind Speed: "+ response5day.list[i].wind.speed + " MPH");                   
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);                    
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    FivedayDiv.append(pWindSpeed);
                    
                    $("#boxes").append(FivedayDiv);
                    console.log(response5day);
                    
                }
            
        }
      
    });
      

    });
    
  }

  //Click function to each Li 
  $(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getResponseWeather(thisCity);
  });
