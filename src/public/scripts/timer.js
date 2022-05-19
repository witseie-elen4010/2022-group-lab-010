document.getElementById('timer').innerHTML =
    00 + ":" + 15;
    let pause = false
startTimer();



function startTimer() {

if(pause == false)
{
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
module.exports = {pauseTimer}