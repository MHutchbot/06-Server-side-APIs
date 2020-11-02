$(document).ready(function () {

    // All dates shown on page
    const todaysDate = (moment().format("ll"));
    $("#dayOneHeader").append(moment().add(1, 'days').format("ll"));
    $("#dayTwoHeader").append(moment().add(2, 'days').format("ll"));
    $("#dayThreeHeader").append(moment().add(3, 'days').format("ll"));
    $("#dayFourHeader").append(moment().add(4, 'days').format("ll"));
    $("#dayFiveHeader").append(moment().add(5, 'days').format("ll"));

    // variables
    const locationSearch = $("#location-search");
    const locationPlace = $("#location-search input[name='search-location']");
    const locationError = $("#error");

    //runs functions when "search" button is clicked
    locationSearch.submit(function (event) {
        event.preventDefault();
        locationSearched = locationPlace.val();
        displayWeather(locationSearched);
    });

    //
    function displayWeather(location) {
        //pull the items from storage and creates an empty array
        searchedLocations = JSON.parse(localStorage.getItem("searchedLocations")) || [];
        //pushes locations to empty array only once, no duplications
        if (searchedLocations.indexOf(location) === -1) {
            searchedLocations.push(location);
            //saves them into local storage
            localStorage.setItem("searchedLocations", JSON.stringify(searchedLocations));
        }
        //URL for same day weather
        const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&appid=fb517bd849e0220a93b8751e3f2588d2";

        // ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (locationData) {
            updateMainResults(locationData);
            updateFiveDay();
            showLocations();
            locationError.hide()
        }).catch(function (error) {
            locationError.text("Oops, have you spelled something wrong? Try again!");
        });

        //updates the same day results
        function updateMainResults(locationData) {
            //variables for all the data i want to show
            const locationName = locationData.name
            const locationTemp = locationData.main.temp
            const locationWind = locationData.wind.speed
            const locationHumid = locationData.main.humidity
            const locationIcon = locationData.weather[0].icon;
            const locationIconLink = "https://openweathermap.org/img/wn/" + locationIcon + ".png";
            //variables for UV part of app
            const locationLat = locationData.coord.lat
            const locationLon = locationData.coord.lon
            const uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + locationLat + "&lon=" + locationLon + "&appid=fb517bd849e0220a93b8751e3f2588d2";

            //displays the above variables as text in the designated fields
            $("#main-location").text(locationName + " - " + todaysDate);
            $("#icon").attr("src", locationIconLink)
            $("#mainTemp").text("Current Temperature: " + locationTemp + " °C");
            $("#mainHumid").text("Humidity: " + locationHumid + "%");
            $("#mainWind").text("Wind Speed: " + locationWind + " MPH");

            // ajax call for UV
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvData) {
                //shows the UV as a number
                const uvRay = uvData.value
                //shows the UBV number in designated field
                $("#mainUV").text("UV Index:" + uvRay);
                // if statement that will change the class on the text depending on what the UV number is
                if (uvData.value <= 2) {
                    $("#mainUV").addClass("lowUV").removeClass("modUV highUV veryHighUV extremeUV");
                } else if
                    (uvData.value <= 5) {
                    $("#mainUV").addClass("modUV").removeClass("lowUV highUV veryHighUV extremeUV")
                } else if
                    (uvData.value <= 7) {
                    $("#mainUV").addClass("highUV").removeClass("lowUV modUV veryHighUV extremeUV")
                } else if
                    (uvData.value <= 10) {
                    $("#mainUV").addClass("veryHighUV").removeClass("lowUV modUVhighUV highUV extremeUV")
                } else if
                    (uvData.value >= 11) {
                    $("#mainUV").addClass("extremeUV").removeClass("lowUV modUVhighUV highUV veryHighUV")
                }
            })
        };
        //updated the 5 day forecast
        function updateFiveDay(fiveDayData) {
            const fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&cnt=6&units=metric&appid=fb517bd849e0220a93b8751e3f2588d2";

            $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function (fiveDayData) {
                //variables to get to the data for each day and element i need
                const dayOneIcon = fiveDayData.list[1].weather[0].icon
                const dayOneIconLink = "https://openweathermap.org/img/wn/" + dayOneIcon + ".png";
                const dayOneTemp = fiveDayData.list[1].main.temp
                const dayOneHumid = fiveDayData.list[1].main.humidity
                const dayTwoIcon = fiveDayData.list[2].weather[0].icon
                const dayTwoIconLink = "https://openweathermap.org/img/wn/" + dayTwoIcon + ".png";
                const dayTwoTemp = fiveDayData.list[2].main.temp
                const dayTwoHumid = fiveDayData.list[2].main.humidity
                const dayThreeIcon = fiveDayData.list[3].weather[0].icon
                const dayThreeIconLink = "https://openweathermap.org/img/wn/" + dayThreeIcon + ".png";
                const dayThreeTemp = fiveDayData.list[3].main.temp
                const dayThreeHumid = fiveDayData.list[3].main.humidity
                const dayFourIcon = fiveDayData.list[4].weather[0].icon
                const dayFourIconLink = "https://openweathermap.org/img/wn/" + dayFourIcon + ".png";
                const dayFourTemp = fiveDayData.list[4].main.temp
                const dayForHumid = fiveDayData.list[4].main.humidity
                const dayFiveIcon = fiveDayData.list[5].weather[0].icon
                const dayFiveIconLink = "https://openweathermap.org/img/wn/" + dayFiveIcon + ".png";
                const dayFiveTemp = fiveDayData.list[5].main.temp
                const dayFiveHumid = fiveDayData.list[5].main.humidity
                //displays above variables in specific fields
                $("#dayOneIcon").attr("src", dayOneIconLink)
                $("#dayOneTemp").text("Temperature: " + dayOneTemp + " °C");
                $("#dayOneHumdity").text("Humidity: " + dayOneHumid + "%");
                $("#dayTwoIcon").attr("src", dayTwoIconLink)
                $("#dayTwoTemp").text("Temperature: " + dayOneTemp + " °C");
                $("#dayTwoHumdity").text("Humidity: " + dayOneHumid + "%");
                $("#dayThreeIcon").attr("src", dayThreeIconLink)
                $("#dayThreeTemp").text("Temperature: " + dayOneTemp + " °C");
                $("#dayThreeHumdity").text("Humidity: " + dayOneHumid + "%");
                $("#dayFourIcon").attr("src", dayThreeIconLink)
                $("#dayFourTemp").text("Temperature: " + dayOneTemp + " °C");
                $("#dayFourHumdity").text("Humidity: " + dayOneHumid + "%");
                $("#dayFiveIcon").attr("src", dayThreeIconLink)
                $("#dayFiveTemp").text("Temperature: " + dayOneTemp + " °C");
                $("#dayFiveHumdity").text("Humidity: " + dayOneHumid + "%");


            })
        };
        //runs locations function 
        showLocations()
    }
    //runs through the array and displays them as a list item
    function showLocations() {
        $("#previouslySearched").empty();
        let locationsArray = JSON.parse(localStorage.getItem("searchedLocations")) || [];

        for (let i = 0; i < locationsArray.length; i++) {
            let locationName = locationsArray[i];

            $("#previouslySearched").append("<li class='list-group-item' id='locationButton'>" + locationName + "</li>")
        }
    }

    //when a list item is clicked, it will run display function for whichever text is in the list
    $("#previouslySearched").on("click", "li", function (event) {
        const locationButton = $(this).text();
        displayWeather(locationButton);

    })

    //shows the last result in the stored array
    let locationsHistory = JSON.parse(localStorage.getItem("searchedLocations")) || [];
    if (locationsHistory.length > 0) {
        displayWeather(locationsHistory[locationsHistory.length - 1]);
    }
    //continues to display the stored locations 
    showLocations();

});