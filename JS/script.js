$("document").ready(function () {
    console.log("Hello World")

    var today = new Date();
    var date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    var apiKey = "d9d510d60f97d35c269584bef800f1b0";


    $("#search").on("click", function (event) {
        event.preventDefault();
        clear();
        var searchCity = $("#searcCity").val().trim();

        //basic weather query url
        var queryUrl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=";
        queryUrl += searchCity + "&appid=" + apiKey;
        console.log(queryUrl);

        //5 days query url
        var fiveDaysquery = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=";
        fiveDaysquery += searchCity + "&appid=" + apiKey;
        console.log(fiveDaysquery);

        callApi(queryUrl);
        fiveDays(fiveDaysquery);
        localStorage.setItem("city2", searchCity);

        // search history
        var searchHis = $("<div>").attr("id", "subclick");
        var searchHisDisplay = $("<p>");
        var hisDisplay = searchHisDisplay.text(searchCity);
        searchHis.append(hisDisplay);
        $(".SerchHistory").prepend(searchHis);

        $("#subclick").on("click", function (event) {
            event.preventDefault();

            var subSearchCity = $(this).text();
            console.log(subSearchCity);

            //basic weather query url
            var queryUrl2 = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=";
            queryUrl2 += subSearchCity + "&appid=" + apiKey;
            console.log(queryUrl2);

            var fiveDaysquery2 = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=";
            fiveDaysquery2 += subSearchCity + "&appid=" + apiKey;
            console.log(fiveDaysquery2);


            clear();
            callApi(queryUrl2);
            fiveDays(fiveDaysquery2);
        })

    })



    //bascia weather api call 

    function callApi(queryUrl) {
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // Wearther icon url
            var iconNum = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/" + iconNum + "@2x.png";
            var iconImg = $("<img>").attr("src", iconUrl);
            localStorage.setItem("icon", iconNum);

            //Display date
            var cityName = $("<h1>").text(response.name + "   " + date);
            var Hum = $("<h5>").text("Humidity" + " " + response.main.humidity + "%");
            var temp = $("<h5>").text("Temp" + " " + (Math.round(response.main.temp - 273.15)) + "°C");
            var wind = $("<h5>").text("wind" + " " + response.wind.speed + "MPH");
            $(".selectedCityResult").append(cityName, iconImg, Hum, temp, wind);

            var lon = response.coord.lon;
            var lat = response.coord.lat;

            console.log(lon);
            //UV query url
            var queryurlUv = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi/forecast?"
            queryurlUv += "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            // UV api call
            $.ajax({
                url: queryurlUv,
                method: "GET"
            }).then(function (response) {
                var uvVal = $("<div>").addClass("uvAlert");
                var uvVal2 = $("<h5>").text("UV index: " + response[0].value);
                var uvIndex = response[0].value;
                uvVal.append(uvVal2);
                $(".selectedCityResult").append(uvVal);
                localStorage.setItem("uv", response[0].value);
                if (uvIndex > 5) {
                    uvVal.css("color", "red");
                    console.log(uvVal);
                }
                else {
                    uvVal.css("color", "green");
                }

            });
            localStorage.setItem("city", response.name);
            localStorage.setItem("hum", response.main.humidity);
            localStorage.setItem("temp", (Math.round(response.main.temp - 273.15)));
            localStorage.setItem("wind", response.wind.speed);
        });
    }




    // 5 days weather api call
    function fiveDays(fiveDaysquery) {
        $.ajax({
            url: fiveDaysquery,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 40; i+=8) {

                
                // icon display setting
                var smallIconNum = response.list[i].weather[0].icon;
                var smalliconUrl = "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/" + smallIconNum + "@2x.png";
                var smallIconImg = $("<img>").attr("src", smalliconUrl);

                var fiveDyasDisplay = $("<div>").addClass("fiveDaysdisplay");
                // date display setting
                var dateFive = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + i /8);

                // making container for api data
                var fiveDaysHolder = $("<p>");
                var hum = $("<p>");
                var temp = $("<p>");

                // display api data to html
                var daysDisplay = fiveDaysHolder.text(dateFive);
                var humDis = hum.text("Humidity" + response.list[i].main.humidity + "%");
                var tempDis = temp.text("Temp" + Math.round(response.list[i].main.temp - 273.15) + "°C");

                fiveDyasDisplay.append(daysDisplay, smallIconImg, humDis, tempDis);
                $(".fiveDays").append(fiveDyasDisplay);
                console.log(response.list[i]);
            }
        });
    }

// clear weather result
    function clear() {
        $(".selectedCityResult").empty();
        $(".fiveDays").empty();
    }


// call back localstorage
    function keep() {
        var city = $("<h1>");
        var cityText = localStorage.getItem("city");
        city = city.text(cityText + " " + date);

        var icon = $("<img>");
        var iconImg = localStorage.getItem("icon");
        var iconUrl = "https://cors-anywhere.herokuapp.com/http://openweathermap.org/img/wn/" + iconImg + "@2x.png";
        icon = $("<img>").attr("src", iconUrl);


        var hum = $("<h5>");
        var humText = localStorage.getItem("hum");
        hum = hum.text("Humidity" + " " + humText + "%");

        var temp = $("<h5>");
        var tempText = localStorage.getItem("temp");
        temp = temp.text("Temp" + " " + tempText);

        var wind = $("<h5>");
        var windText = localStorage.getItem("wind");
        wind = wind.text("wind" + " " + windText + "MPH");

        var uv = $("<h5>");
        var uvText = localStorage.getItem("uv");
        uv = uv.text("UV index: " + uvText);
        console.log(uvText);

        if (uvText > 5){
            uv.css("color", "red");
        }
        else {
            uv.css("color", "green");
        }

        $(".selectedCityResult").append(city, icon, hum, temp, wind, uv);
        
    }

    keep();


});


