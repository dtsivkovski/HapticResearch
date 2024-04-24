

var pointTotal = 0;
var streak = 0;

var correctAnswer = -1; // used to save the text of the correct answer

// add tts to necessary focus elements
document.querySelector('#sgButton').addEventListener('focus', function() {
    speak(this.value);
});

const nDict = {
    '0': '011100',
    '1': '100000',
    '2': '101000',
    '3': '110000',
    '4': '110100',
    '5': '100100',
    '6': '111000',
    '7': '111100',
    '8': '101100',
    '9': '011000',
    'N': '010111', // number sign for braille 
     /* 
      https://braillebug.org/braille/math-in-braille/ - reference for the following signs
     */
    '+': '010011', // addition
    '-': '000011', // subtraction
    '*': '010000', // first sign for multiplication 
    'm': '100001', // second sign for multiplication
     '/': '010001', // first sign for division
     'd': '010010', // second sign for division
     ' ': '000000'
}

var correctAnswer;
var lastSelected = " ";

function sendNumber(numString) {
      
    const gap = '0';
    const centerGap = '00000000'

    // display the numbers and operator on the braille display 
    // https://braillebug.org/braille/math-in-braille/

    var outputString = "";


    // row 1
    outputString = outputString + nDict[numString[0]].substring(0, 2) + gap + nDict[numString[1]].substring(0, 2) + gap + nDict[numString[2]].substring(0, 2);

    // row 2
    outputString = outputString + nDict[numString[0]].substring(2, 4) + gap + nDict[numString[1]].substring(2, 4) + gap + nDict[numString[2]].substring(2, 4);

    // row 3
    outputString = outputString + nDict[numString[0]].substring(4, 6) + gap + nDict[numString[1]].substring(4, 6) + gap + nDict[numString[2]].substring(4, 6);

    // row 4 and 5 - center gap
    outputString = outputString + centerGap + centerGap;

    // row 6
    outputString = outputString + nDict[numString[3]].substring(0, 2) + gap + nDict[numString[4]].substring(0, 2) + gap + nDict[numString[5]].substring(0, 2);

    // row 7
    outputString = outputString + nDict[numString[3]].substring(2, 4) + gap + nDict[numString[4]].substring(2, 4) + gap + nDict[numString[5]].substring(2, 4);

    // row 8
    outputString = outputString + nDict[numString[3]].substring(4, 6) + gap + nDict[numString[4]].substring(4, 6) + gap + nDict[numString[5]].substring(4, 6);

    // send the outputString to the arduino
    sendData(outputString);

}

function playGame() {

    document.querySelector('#gamediv').style = "display: block !important";
    document.querySelector('#sgButton').innerHTML = "Skip Question";
    document.querySelector('#sgButton').value = "Press space to skip this question";
    document.activeElement.blur(); // remove focus from the current element
    currentFocus = 0; // set focus to the first answer radio
    speak("What is the answer to this math problem?");
    // generate shape number
    // generate two numbers between 0 and 9
    var num1 = 0;
    var num2 = 0;

    // generate a random operator (+, -, *)
    const operators = ['+', '-', '*', '/'];
    const operator = operators[
      Math.floor(Math.random() * operators.length) // generates number from 0-3
    ];

    // generate numbers based on spacing and numerical limitations for each operator
    switch(operator) {
      case '/':
        // if division is the operator, make sure the numbers are divisible without remainder
        while (num1 % num2 != 0) {
          num1 = Math.floor(Math.random() * 100);
          num2 = Math.floor(Math.random() * 10);
        }
        break
      case '*':
        // allow up to 99 for multiplication
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 10);
        // set upper limit at 100
        while (num1 * num2 > 100) {
          num1 = Math.floor(Math.random() * 100);
          num2 = Math.floor(Math.random() * 10);
        }
        break
      case '-':
      case '+':
        // allow up to 99 for addition and subtraction
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
        // set upper limit at 100
        while (num1 + num2 > 100) {
          num1 = Math.floor(Math.random() * 100);
          num2 = Math.floor(Math.random() * 100);
        }
        break
    }

    // calculate the answer and build the numstring
    var numString = "";
    numString += "N" + num1; // N is in the dictionary as the number sign
    var htmlString = "What is ";
    htmlString += num1 + " " + operator + " " + num2 + " ? ";
    document.querySelector('#gamequestion').textContent = htmlString;
    var answer;

    // build the string based on the operator
    switch (operator) {
      // only one braille character for addition and subtraction
      case '+':
        answer = num1 + num2;
        numString += "+" + num2 + "  ";
        break;
      case '-':
        answer = num1 - num2;
        numString += "-" + num2 + "  ";
        break;
      // division and multiplicaiton require two braille characters
      case '*':
        answer = num1 * num2;
        numString += "*" + "m" + num2 + " ";
        break;
      case '/':
        answer = num1 / num2;
        numString += "/" + "d" + num2 + " ";
        break;
    }

    /* 
    Randomize the answers for the number answer
    */
    var answerBank = [];
    correctAnswer = answer;
    answerBank.push(correctAnswer);
    while (answerBank.length < 4) {
        // generate random distances from the correct answer 
        var randNum = Math.floor((Math.random() * 10)); 
        var randOperator = Math.floor((Math.random() * 2)); // negative or positive
        // random change of negative distance
        if (randOperator == 0) {
            randNum = -randNum;
        }
        // create new answer and add to answerbank
        var newAnswer = answer + randNum;
        if (!answerBank.includes(newAnswer)) {
            answerBank.push(newAnswer);
        }
    }

    // shuffle the array
    answerBank = shuffle(answerBank);

    // create buttons for each answer and add to the divs
    var answerButtonDiv = document.querySelector('#answerButtons');

    answerButtonDiv.innerHTML = "";

    for (i = 0; i < 4; i++) {
        // radios for the form types 
        // num answer radios
        var numForm = document.createElement('div');
        numForm.className = "form-check";
        // creating the radio input
        var numRadio = document.createElement('input');
        numRadio.className = "form-check-input";
        numRadio.type = "radio";
        numRadio.name = "answerButtons";
        numRadio.id = "numAnswer_" + i;
        numRadio.value = answerBank[i];
        var numLabel = document.createElement('label');
        // creating the label for hte input
        numLabel.className = "form-check-label";
        numLabel.htmlFor = answerBank[i];
        numLabel.textContent = answerBank[i];

        // add event listener for focus
        numRadio.addEventListener('focus', function() {
            speak(this.value);
        });
        numRadio.addEventListener('click', function() {
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
        numForm.appendChild(numRadio);
        numForm.appendChild(numLabel);
        answerButtonDiv.appendChild(numForm);

        console.log("" + i + "(" + answerBank[i] + ")");

    }

    console.log("ca(" + correctAnswer + ")");
    sendNumber(numString);

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
    // disable the button to prevent spam clicks
    document.querySelector('#checkAnswerButton').classList.add('disabled');
    document.querySelector('#checkAnswerButton').removeEventListener('click', checkAnswer);
    // get user answer, correct answer is from the hidden div
    var userAnswer = document.querySelector('input[name="answerButtons"]:checked').value;
    // clear the answer buttons
    document.querySelector('#answerButtons').innerHTML = '';

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