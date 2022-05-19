/* import {gameEnd} from '/'; */
document.getElementById('timer').innerHTML =
    00 + ":" + 05;
let pause = false
startTimer();



function startTimer() {

    if (pause == false) {
        var presentTime = document.getElementById('timer').innerHTML;
        var timeArray = presentTime.split(/[:]+/);
        var m = timeArray[0];
        var s = checkSecond((timeArray[1] - 1));
        if (s == 59) { m = m - 1 }
        if (m < 0) {
            return
        }

        document.getElementById('timer').innerHTML =
            m + ":" + s;
        //console.log(m)
        setTimeout(startTimer, 1000);
    }



    if (m == 0 && s == 0) {
        console.log('TImer is up')
        fetch('/api/correct')
            .then(function (response) {
                if (response.ok) { return response.json() } // Return the response parse as JSON
                else { throw 'Failed to load correct word: response code invalid!' }
            })

            .then(function (data) {
                const x = document.getElementById('Game Result')
                x.innerHTML = ` You ran out of time. Please try again` //The correct word was ${data}` // Dont show the correct word when you run out of time
            })

            .catch(function (e) { // Process error for request
                alert(e) // Displays a browser alert with the error message.
            })

        const y = document.getElementById('submit Guess')
        y.setAttribute('class', 'btn btn-primary')
        y.setAttribute('data-bs-toggle', 'modal')
        y.setAttribute('data-bs-target', '#staticBackdrop')
        y.innerHTML = 'complete'
        y.click()

    }
    /*  console.log(pause) */

}

function checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec }; // add zero in front of numbers < 10
    if (sec < 0) { sec = "59" };
    return sec;
}
const pauseTimer = function () {
    if (pause == false) {
        pause = true
    }
    else {
        pause = false
    }
    console.log(pause)
    startTimer()

}
module.exports = { pauseTimer }