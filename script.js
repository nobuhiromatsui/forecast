$("document").ready(function () {
    console.log("Hello World")

    var today = new Date();
    var date = today.getFullYear() + "/"+ (today.getMonth()+1) +"/"+ today.getDate();

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


        var queryurlUv = "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=37.75&lon=-122.37"
        console.log(queryurlUv);


        var searchHis = $("<div>");

        var searchHisDisplay = $("<p>");
        var hisDisplay = searchHisDisplay.text(searchCity);
        searchHis.append(hisDisplay);
        $(".SerchHistory").append(searchHis);

        
        


        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //Display date
          

            var cityName = $("<h1>").text(response.name + "/" + date);
            var Hum = $("<h5>").text("Humidity" + " " + response.main.humidity + "%");
            var temp = $("<h5>").text("Temp" + " " + (response.main.temp - 273.15) + "C");
            var wind = $("<h5>").text("wind" + " " + response.wind.speed + "MPH");
            $(".selectedCityResult").append(cityName, Hum, temp, wind);
        });

        $.ajax({
            url: fiveDaysquery,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 5; i++) {
                var fiveDyasDisplay = $("<div>").addClass("fiveDaysdisplay");
                var status = $("<p>");
                var hum = $("<p>");
                var temp = $("<p>");

                var statusDisplay = status.text(response.list[i].weather[0].description);
                var humDis = hum.text(response.list[i].main.humidity);
                var tempDis = temp.text(response.list[i].main.temp);

                fiveDyasDisplay.append(statusDisplay, humDis, tempDis);
                $(".fiveDays").append(fiveDyasDisplay);
            }
        });
    })

    function clear() {
        $(".selectedCityResult").empty();
        $(".fiveDays").empty();
    }


});


// for (var i = 0; i < articleLimit; i++) {
//     //console.log(data);
//     var newLi = $("<li>");
//     var newHeadline = $("<h1>");
//     var newByline = $("<p>");
//     newHeadline.text(data.response.docs[i].headline.main);
//     newByline.text(data.response.docs[i].byline.original);
//     newLi.append(newHeadline, newByline);
//     $("#articlesHere").append(newLi);
// }

