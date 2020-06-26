$("document").ready(function () {
    console.log("Hello World")

    var today = new Date();
    var date = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();


    $("#search").on("click", function (event) {
        event.preventDefault();
        clear();
        var searchCity = $("#searcCity").val().trim();

        //basic weather query url
        var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
        var apiKey = "d9d510d60f97d35c269584bef800f1b0";

        queryUrl += searchCity + "&appid=" + apiKey;
        console.log(queryUrl);


        //5 days query url
        var fiveDaysquery = "http://api.openweathermap.org/data/2.5/forecast?q=";
        fiveDaysquery += searchCity + "&appid=" + apiKey;


        // search history
        var searchHis = $("<div>");
        var searchHisDisplay = $("<p>");
        var hisDisplay = searchHisDisplay.text(searchCity);
        searchHis.append(hisDisplay);
        $(".SerchHistory").append(searchHis);



        //bascia weather api call 
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // Wearther icon url
            var iconNum = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/" + iconNum + "@2x.png";
            var iconImg = $("<img>").attr("src", iconUrl);

            //Display date
            var cityName = $("<h1>").text(response.name + "" + date);
            var Hum = $("<h5>").text("Humidity" + " " + response.main.humidity + "%");
            var temp = $("<h5>").text("Temp" + " " + (Math.round(response.main.temp - 273.15)) + "°C");
            var wind = $("<h5>").text("wind" + " " + response.wind.speed + "MPH");
            $(".selectedCityResult").append(cityName, iconImg, Hum, temp, wind);

            var lon = response.coord.lon;
            var lat = response.coord.lat;
            //UV query url
            var queryurlUv = "http://api.openweathermap.org/data/2.5/uvi/forecast?"
            queryurlUv += "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            // UV api call
            $.ajax({
                url: queryurlUv,
                method: "GET"
            }).then(function (response) {
                var uvVal = $("<h5>").addClass("uvAlert");

                var uvVal2 = $("<h5>").text("UV index: " + response[0].value);
                $(".selectedCityResult").append(uvVal2);
                localStorage.setItem("uv", response[0].value);
                if ( uvVal2 > 5 ) {
                   uvVal.css("background-color","red");
                }

            });

            localStorage.setItem("city", response.name);
            localStorage.setItem("icon", response.main.humidity);
            localStorage.setItem("hum", (Math.round(response.main.temp - 273.15)));
            localStorage.setItem("temp",response.wind.speed);
            localStorage.setItem("wind",response.wind.speed);
        });




        // 5 days weather api call
        $.ajax({
            url: fiveDaysquery,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 5; i++) {

                // icon display setting
                var smallIconNum = response.list[i].weather[0].icon;
                var smalliconUrl = "http://openweathermap.org/img/wn/" + smallIconNum + "@2x.png";
                var smallIconImg = $("<img>").attr("src", smalliconUrl);

                var fiveDyasDisplay = $("<div>").addClass("fiveDaysdisplay");
                // date display setting
                var dateFive = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + i);

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
            }
            localStorage.setItem("day",dateFive);
            localStorage.setItem("smallhum",response.list[i].main.humidity);
            localStorage.setItem("smallTemp", Math.round(response.list[i].main.temp - 273.15));
            localStorage.setItem("day",dateFive);


        });
    })


    

    function clear() {
        $(".selectedCityResult").empty();
        $(".fiveDays").empty();
    }


    

});


