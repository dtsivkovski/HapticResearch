

var pointTotal = 0;
var streak = 0;

var correctAnswer = ""; // used to save the text of the correct answer

// add tts to necessary focus elements
document.querySelector('#sgButton').addEventListener('focus', function() {
    speak(this.value);
});

const shapeDict = {
    // dummy values temporarily
    "circle": "0001100001100110010000101000000110000001010000100110011000011000",
    "square": "0000000001111110010000100100001001000010010000100111111000000000",
    "triangle": "0000000000000000000100000010100001000100111111100000000000000000",
    "rectangle": "0000000000000000011111100100001001000010011111100000000000000000",
    "plus-cross": "0001000000010000000100001111111000010000000100000001000000000000",
    "x-cross": "1000001001000100001010000001000000101000010001001000001000000000",
    "heart": "0000000001101100100100101000001001000100001010000001000000000000"
}

var correctAnswer;
var lastSelected = " ";

function playGame() {

    document.querySelector('#gamediv').style = "display: block !important";
    document.querySelector('#sgButton').innerHTML = "Skip Question";
    document.querySelector('#sgButton').value = "Press space to skip this question";
    document.activeElement.blur(); // remove focus from the current element
    currentFocus = 0; // set focus to the first answer radio
    speak("What is this shape?");
    // generate shape number
    var shapeNum = -1;

    const shapeWordBank = Object.keys(shapeDict);

    // make sure denominator and numerator aren't zero, numerator in the single digits
    while (shapeNum == -1) {
        shapeNum = Math.floor(Math.random() * shapeWordBank.length);
    }

    // calculate the answer and build the numstring
    document.querySelector('#gamequestion').textContent = "What is this shape?";
    

    // save the correct answer
    correctAnswer = shapeWordBank[shapeNum];

    /* 
    Randomize the answers for the numerator
    */
    var answerBank = [];
    answerBank.push(correctAnswer);
    while (answerBank.length < 4) {
        var randNum = Math.floor((Math.random() * shapeWordBank.length)); // *9 + 1 in order to avoid zero/error
        if (!answerBank.includes(shapeWordBank[randNum])) {
            answerBank.push(shapeWordBank[randNum]);
        }
    }

    // shuffle the array
    answerBank = shuffle(answerBank);

    // create buttons for each answer and add to the divs
    var answerButtonDiv = document.querySelector('#answerButtons');

    answerButtonDiv.innerHTML = "";

    for (i = 0; i < 4; i++) {
        // radios for the form types 
        /* 
            <div class="form-check">
            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
            <label class="form-check-label" for="exampleRadios1">
                Default radio
            </label>
            </div>
        */
        // numerator answer radios
        var shapeForm = document.createElement('div');
        shapeForm.className = "form-check";
        // creating the radio input
        var shapeRadio = document.createElement('input');
        shapeRadio.className = "form-check-input";
        shapeRadio.type = "radio";
        shapeRadio.name = "answerButtons";
        shapeRadio.id = "shapeAnswer_" + i;
        shapeRadio.value = answerBank[i];
        var numLabel = document.createElement('label');
        // creating the label for hte input
        numLabel.className = "form-check-label";
        numLabel.htmlFor = answerBank[i];
        numLabel.textContent = answerBank[i];

        // add event listener for focus
        shapeRadio.addEventListener('focus', function() {
            speak(this.value);
        });
        shapeRadio.addEventListener('click', function() {
            if (lastSelected != this.value) {
                speak("Selected" + this.value);
                lastSelected = this.value;
            }
            else {
                checkAnswer();
                lastSelected = " ";
            }
        });

        // append the radio and label to the div
        shapeForm.appendChild(shapeRadio);
        shapeForm.appendChild(numLabel);
        answerButtonDiv.appendChild(shapeForm);

        console.log("" + i + "(" + answerBank[i] + ")");

    }

    console.log("ca(" + correctAnswer + ")");
    sendData(shapeDict[correctAnswer]);

}

// check for enter key press when submitting answer

document.querySelector('#checkAnswerButton').addEventListener('click', checkAnswer);
document.querySelector('#checkAnswerButton').addEventListener('focus', function() {
    // tries to speak selected answers
    try {
    speak('You selected ' + document.querySelector('input[name="answerButtons"]:checked').value + '. Press space to submit.');
    }
    catch (error) {
    speak('Please select an answer before submitting.'); // if no answer is selected
    }
});

function checkAnswer() {
    // if both answers are not selected, do not check
    if (!document.querySelector('input[name="answerButtons"]:checked')) {
    speak('Please select an answer before submitting.');
    return;
    }

    document.querySelector('#checkAnswerButton').classList.add('disabled');
    document.querySelector('#checkAnswerButton').removeEventListener('click', checkAnswer);
    // get user answer, correct answer is from the hidden div
    var userAnswer = document.querySelector('input[name="answerButtons"]:checked').value;
    // get divs for displaying scores and answer correct/incorrect
    const answerStatus = document.querySelector('#answerStatus');
    const pointTotalDiv = document.querySelector('#pointTotal');
    const streakDiv = document.querySelector('#streak');
    if (userAnswer == correctAnswer) {
        // correct answer
        answerStatus.textContent = 'Correct!';
        answerStatus.className = 'text-success';
        pointTotalDiv.textContent = 'Points: ' + ++pointTotal;
        streakDiv.textContent = 'Streak: ' + ++streak;
        speak("Correct! " + "You have " + pointTotal + " points.");
        if (streak % 5 == 0) {
            if (streak == 20) speak("Woah there! 20 is super impressive! Good job!");
            else if (streak == 100) speak ("You're on fire! 100 questions in a row!");
            else speak("Wow! " + streak + " in a row! Keep it up!");
        }
    } else {
        wordsList = ["Not quite!", "Almost there!", "Nice try!", "Good effort!"];
        useWord = wordsList[Math.floor(Math.random() * wordsList.length)]; // gets a random word
    // incorrect answer - gives feedback for the correct answer
        answerStatus.textContent = useWord + ' The correct answer is ' + correctAnswer + ".";
        speak(useWord + " The correct answer is " + correctAnswer + ". You have " + pointTotal + " points.")
        answerStatus.className = 'text-danger';
        streak = 0;
        streakDiv.textContent = 'Streak: ' + streak;
    }
    
    // reset after 4 seconds
    setTimeout( () => {
    answerStatus.textContent = '';
    document.querySelector('#checkAnswerButton').classList.remove('disabled');
    document.querySelector('#checkAnswerButton').addEventListener('click', checkAnswer);
    }, 4000);

    // wait 4 seconds, then play again
    setTimeout(playGame, 4000);
}

/* 
    Begin code referenced from GeeksForGeeks:
    https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
*/
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) { 
    
        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
}
/*
    End of referenced code
*/