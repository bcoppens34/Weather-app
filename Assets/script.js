$(document).ready(function () {

  
  $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY'));

  checkDataInLocalStorage();

  
var APIKey = "6bf413c2e88cb4ca8e5252acc70d8770";
var city = "";

 
  $('.searchBtn').on('click', function (event) {

    event.preventDefault();

  
    city = $("#formInputCity").val();
    if (city === '') {
        return alert('Enter City');
    }
    getWeatherInfo(city);

    saveInfoToLocalStorage(city);

  });

  function getWeatherInfo(city) {
    var queryAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryAPI,
        method: "GET",
        error: (err => { //If API through error then alert 
            alert("City not found")
            return;
          })
    }).then(function (response) {
        console.log(response)

        $(".cityInformationBox").empty()

        var now = moment();
        var currentDate = now.format('MMMM D, YYYY');
        var cityId = response.id;
        var cityWeatherData = $("<div col-12>").append($("<h2>" + response.name + ' (' + currentDate + ')' + "</h2>"));
        var icon = $('<img class="icon">').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');  
        var temperatureInfo = $('<br><h4>').text('Temp: ' + response.main.temp + ' °F');
        var windInfo = $('<h4>').text('Wind: ' + response.wind.speed + 'MPH'); 
        var humidityInfo = $('<h4>').text('Humidity: ' + response.main.humidity + '%');
        
        cityWeatherData.append(icon).append(temperatureInfo).append(windInfo).append(humidityInfo);

        displayFiveDayForecast(cityId);

        $('#CityInfo').append(cityWeatherData);

    });
}

function saveInfoToLocalStorage(city) {
  var data = localStorage.getItem('cities-recently-searched');
  if (data) {
      console.log(data, city)

  } else {
      data = city;
      localStorage.setItem('cities-recently-searched', data);
  }
  if (data.indexOf(city) === -1) {
      data = data + ',' + city;
      localStorage.setItem('cities-recently-searched', data);
  }
}

  function displayFiveDayForecast(city) {
    $.ajax({ // gets the 5 day forecast API
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&units=imperial&APPID=" + APIKey,
        method: "GET",
    }).then(function (response) {
       
        var arrayList = response.list;
        for (var i = 0; i < arrayList.length; i++) {
            if (arrayList[i].dt_txt.split(' ')[1] === '12:00:00') {
                console.log(arrayList[i]);
                
                var cityWeatherData = $('<div>');

                cityWeatherData.addClass('forecast bg-primary>');

                var days5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);

                var icon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');

                var tempInfo = $('<p>').text('Temp: ' + arrayList[i].main.temp + ' °F');               

                var windInfo = $('<p>').text('Wind: ' + arrayList[i].wind.speed + 'MPH');    
                
                var humidityInfo = $('<p>').text('Humidity: ' + arrayList[i].main.humidity + '%');

                cityWeatherData.append(days5).append(icon).append(tempInfo).append(windInfo).append(humidityInfo);

                $('#forecast').append(cityWeatherData);
            }
        }
    });
};

  function checkDataInLocalStorage() {
    var storedCities = localStorage.getItem('cities-recently-searched');
    var dataArray = [];
    if (!storedCities) {
        console.log("no data stored");
    } else {
      storedCities.trim();
        dataArray = storedCities.split(',');
        for (var i = 0; i < dataArray.length; i++) {
            createRecentCitySearchedBtn(dataArray[i]);
        }
    }
};

  function createRecentCitySearchedBtn(city) {
   var buttonsList = $("<div>")
    var recentCityButton = $('<button type="submit" class="btn btn-secondary atlanta">');
    //add ID to avoid duplicate city button
    recentCityButton.attr('id', 'dupBtn');
    recentCityButton.addClass("button is-small recentSearch");
    recentCityButton.text(city);
    buttonsList.append(recentCityButton)
    $("#recentCitiesList").prepend(buttonsList);
    //set click function to avoid duplicate city button
    $("#dupBtn").on("click", function () {
        var newCity = $(this).text();
        getWeatherInfo(newCity);
    });
}

});
