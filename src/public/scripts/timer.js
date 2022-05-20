/* import {gameEnd} from '/'; */

document.getElementById('timer').innerHTML =
    01 + ":" + 05;
let pause = false
startTimer();

{/* <link rel="stylesheet" href="/cdn/stylesheets/style.css"></link> */ }
link.rel = 'stylesheet';

link.type = 'text/css';

link.href = '/cdn/stylesheets/style.css';

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
                x.innerHTML = ` You ran out of time. Please try again. If you give up, Hover your curser below me to see the word ` //The correct word was ${data}` // Dont show the correct word when you run out of time
                //  let btn = document.createElement("button");
                // btn.classList.value = "btn btn-primary"
                //btn.id = 'revealWord';
                // btn.onclick = revWord(data)
                // btn.innerHTML = "If you give up, click to reveal the word";

                //x.appendChild(btn)
                let out = document.createElement("div")
                out.style = 'border:  width: 220px; font-family: sans-serif'

                let inner = document.createElement("div")
                inner.style = 'height: 20px; width: 220px;;' // background-color: cyan;'
                inner.id = id='mouse_over'
                inner.innerText = `The correct word was ${data}`
                out.appendChild(inner)
                x.appendChild(out)

/* 
                out.classList.add('myDIV')
                let block = document.createElement("div")
                // console.log(out)
                let showw = document.createElement("h1")
               // showw.classList.add('myDIV', 'hide')
               showw.innerHTML = 'Hover over me to see the word'
                out.appendChild(showw)

                block.classList.add('hide')
                block.innerHTML = `The correct word was ${data}`
                let letter = document.createElement("h1")
                letter.classList.add('myDIV', 'hide')
                letter.innerHTML = `The correct word was ${data}`
               // block.appendChild(letter)
                out.appendChild(block)


                x.appendChild(out) */

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

        //document.body.appendChild(btn);

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


var el = document.getElementById("revealWord");
if (el) {
    console.log('show word')
    el.addEventListener("click", revWord, false);
}
function revWord(data) {
    console.log('show word')
    const x = document.getElementById('Game Result')
    x.innerHTML = ` You ran out of time. Please try again.` //  The correct word was ${data}` // Dont show the correct word when you run out of time

    let out = document.createElement("div")
    out.classList.add('myDIV')
    let block = document.createElement("div")
    // console.log(out)
    let showw = document.createElement("h1")
    showw.innerHTML = 'Hover over me to see the word'
    out.appendChild(showw)

    block.classList.add('myDIV', 'hide')
    let letter = document.createElement("h1")
    letter.classList.add('myDIV', 'hide')
    letter.innerHTML = `The correct word was ${data}`
    block.appendChild(letter)
    out.appendChild(block)
    x.appendChild(out)
}


module.exports = { pauseTimer }