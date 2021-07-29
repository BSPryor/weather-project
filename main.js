require('dotenv').config();
var apiKey = process.env.API_KEY; 

$('.search').on('click', function () {
  var city = $('#city-search').val();
  $('#city-search').val('');
  fetchToday(city);
  fetchWeek(city);
})

var fetchToday = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      addTodaysWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}
var addTodaysWeather = function (data) {
  var todaysWeather = {
    temp: Math.round(data.main.temp),
    city: data.name,
    sky: data.weather[0].main,
    imgURL: data.weather[0].icon
  }
  var renderWeather = function () {
    $('.today').empty();
  
    var template = $('#today-template').html();
    var compiled = Handlebars.compile(template);
    var newHTML = compiled(todaysWeather);
    $('.today').append(newHTML);
  }
  renderWeather();
}

var fetchWeek = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      addWeeksWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var addWeeksWeather = function (data) {
  $('.five-day').empty();
  var buildWeek = [];
  for (let i = 7; i < data.list.length; i += 8) {
    var wD = data.list[i];

    var dayData = {
      sky1: wD.weather[0].main,
      temp1: Math.round(wD.main.temp),
      imgURL1: wD.weather[0].icon,
      day1: dayjs(wD.dt_txt).format('dddd'), 
    }
    buildWeek.push(dayData);
  };

  for (let j = 0; j < buildWeek.length; j++) {
    var template = $('#week-template').html();
    var compiled = Handlebars.compile(template);
    var newHTML = compiled(buildWeek[j]);
    $('.five-day').append(newHTML);  
  }
};
