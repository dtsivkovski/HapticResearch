let operators = ['+', '-', '*', '/'];

/*
    Addition Section
*/
let additionSkillLevel = parseInt(localStorage.getItem("additionSkillLevel")) || 75;
let additionAnswerStreak = 0;
let additionDifficultyRanges = [
    [10,10,'none'], // lowest difficulty is 1 digit plus 1 digit, no upper limit to answer
    [100,10,100], // 2 digit + 1 digit, upper limit is 100
    [100,100,100],
    [100,100,'none'],
    [1000,1000,1000],
    [1000,1000,'none'],
    [10000,10000,10000]
];

/*
    Subtraction Section
*/
let subtractionSkillLevel = parseInt(localStorage.getItem("subtractionSkillLevel")) || 75;
let subtractionAnswerStreak = 0;
let subtractionDifficultyRanges = [
    [10,10,0], // 1 digit minus 1 digit, no negatives
    [100,10,0], // 2 digit minus 1 digit, no negatives
    [100,100,0],
    [100,100,'none'],
    [1000,100,'none'],
    [1000,1000,'none'],
    [1000,10000,'none']
];

let multiplicationSkillLevel = parseInt(localStorage.getItem("multiplicationSkillLevel")) || 75;
let multiplicationAnswerStreak = 0;
let multiplicationDifficultyRanges = [
    [6,6,25], // 5x5, 25 max
    [9,11,64], // 8x10, 64 max
    [11,11,100], // 10x10, 100 max
    [26,11,250], // 25x10, 250 max
    [41,21,500], // 40x20, 500 max
    [101,101,1000], // 100x100, 1000 max
    [101,101,'none'] // 100x100, no max
]

let divisionSkillLevel = parseInt(localStorage.getItem("divisionSkillLevel")) || 75;
let divisionAnswerStreak = 0;
let divisionDifficultyRanges = [
    [26,6,'none'], // 25/5 - bound for numbers means divisor must be above that
    [65,9,0], // 64/8
    [101,11,1],
    [251,11,1],
    [251,26,1],
    [1001,26,1],
    [1001,1001,1] // upper limit 1000/1000
]

class MathQuestion {

    // TODO: custom incorrect multiple choice answers depending on the question

    pointVal = 2;
    operator;
    num1 = 0;
    num2 = 0;
    answer = 0;

    constructor() {
        this.operator = operators[Math.floor(Math.random() * 4)]; // random operator from list
    } // TODO: fix operator numbers to include division

    createQuestion() {
        if (this.operator === '+') this.createAdditionQuestion();
        else if (this.operator === '-') this.createSubtractionQuestion();
        else if (this.operator === '*') this.createMultiplicationQuestion(); //TODO: division question
        else this.createDivisionQuestion(); //TODO: multiplication question
    }

    createAdditionQuestion() {
        // set question value
        console.log(additionSkillLevel);
        let questionVal = Math.pow(2,additionAnswerStreak);
        if (questionVal >= 16) 
            questionVal = 16;
        this.pointVal = questionVal;

        let questionBounds;

        // check skill level for addition
        if (additionSkillLevel <= 50) {
            questionBounds = additionDifficultyRanges[0];
        }
        else if (additionSkillLevel <= 100) {
            questionBounds = additionDifficultyRanges[1];
        }
        else if (additionSkillLevel <= 150) {
            questionBounds = additionDifficultyRanges[2];
        }
        else if (additionSkillLevel <= 200) {
            questionBounds = additionDifficultyRanges[3];
        }
        else if (additionSkillLevel <= 250) {
            questionBounds = additionDifficultyRanges[4];
        }
        else if (additionSkillLevel <= 300) {
            questionBounds = additionDifficultyRanges[5];
        }
        else {
            questionBounds = additionDifficultyRanges[6];
        }

        // create question
        do {
            this.num1 = Math.floor(Math.random() * questionBounds[0]); // get bounds from first val in array
            this.num2 = Math.floor(Math.random() * questionBounds[1]); // get bounds from second val in array
            this.answer = this.num1 + this.num2;
        }
        while (this.answer >= questionBounds[2] && questionBounds[2] !== 'none') // regenerate if above bounds
    }

    createSubtractionQuestion() {
        // set question value
        console.log(subtractionSkillLevel);
        let questionVal = Math.pow(2,subtractionAnswerStreak);
        if (questionVal >= 16) 
            questionVal = 16;
        this.pointVal = questionVal;

        let questionBounds;

        // check skill level for subtraction
        if (subtractionSkillLevel <= 50) {
            questionBounds = subtractionDifficultyRanges[0];
        }
        else if (subtractionSkillLevel <= 100) {
            questionBounds = subtractionDifficultyRanges[1];
        }
        else if (subtractionSkillLevel <= 150) {
            questionBounds = subtractionDifficultyRanges[2];
        }
        else if (subtractionSkillLevel <= 200) {
            questionBounds = subtractionDifficultyRanges[3];
        }
        else if (subtractionSkillLevel <= 250) {
            questionBounds = subtractionDifficultyRanges[4];
        }
        else if (subtractionSkillLevel <= 300) {
            questionBounds = subtractionDifficultyRanges[5];
        }
        else {
            questionBounds = subtractionDifficultyRanges[6];
        }

        // create question
        do {
            this.num1 = Math.floor(Math.random() * questionBounds[0]); // get bounds from first val in array
            this.num2 = Math.floor(Math.random() * questionBounds[1]); // get bounds from second val in array
            this.answer = this.num1 - this.num2;
        }
        while (this.answer < questionBounds[2] && questionBounds[2] !== 'none') // regenerate if below bounds

    }

    createMultiplicationQuestion() {

        // set question value
        console.log(multiplicationSkillLevel);
        let questionVal = Math.pow(2,multiplicationAnswerStreak);
        if (questionVal >= 16) 
            questionVal = 16;
        this.pointVal = questionVal;

        let questionBounds;

        // check skill level for multiplication
        if (multiplicationSkillLevel <= 50) {
            questionBounds = multiplicationDifficultyRanges[0];
        }
        else if (multiplicationSkillLevel <= 100) {
            questionBounds = multiplicationDifficultyRanges[1];
        }
        else if (multiplicationSkillLevel <= 150) {
            questionBounds = multiplicationDifficultyRanges[2];
        }
        else if (multiplicationSkillLevel <= 200) {
            questionBounds = multiplicationDifficultyRanges[3];
        }
        else if (multiplicationSkillLevel <= 250) {
            questionBounds = multiplicationDifficultyRanges[4];
        }
        else if (multiplicationSkillLevel <= 300) {
            questionBounds = multiplicationDifficultyRanges[5];
        }
        else {
            questionBounds = multiplicationDifficultyRanges[6];
        }

        // create question
        do {
            this.num1 = Math.floor(Math.random() * questionBounds[0]); // get bounds from first val in array
            this.num2 = Math.floor(Math.random() * questionBounds[1]); // get bounds from second val in array
            this.answer = this.num1 * this.num2;
        }
        while (this.answer > questionBounds[2] && questionBounds[2] !== 'none') // regenerate if above bounds

    }

    createDivisionQuestion() {

        // set question value
        console.log(divisionSkillLevel);
        let questionVal = Math.pow(2,divisionAnswerStreak);
        if (questionVal >= 16) 
            questionVal = 16;
        this.pointVal = questionVal;

        let questionBounds;

        // check skill level for division
        if (divisionSkillLevel <= 50) {
            questionBounds = divisionDifficultyRanges[0];
        }
        else if (divisionSkillLevel <= 100) {
            questionBounds = divisionDifficultyRanges[1];
        }
        else if (divisionSkillLevel <= 150) {
            questionBounds = divisionDifficultyRanges[2];
        }
        else if (divisionSkillLevel <= 200) {
            questionBounds = divisionDifficultyRanges[3];
        }
        else if (divisionSkillLevel <= 250) {
            questionBounds = divisionDifficultyRanges[4];
        }
        else if (divisionSkillLevel <= 300) {
            questionBounds = divisionDifficultyRanges[5];
        }
        else {
            questionBounds = divisionDifficultyRanges[6];
        }

        // create question
        do {
            this.num1 = Math.floor(Math.random() * questionBounds[0]); // get bounds from first val in array
            this.num2 = Math.floor(Math.random() * questionBounds[1]); // get bounds from second val in array
            this.answer = this.num1 / this.num2;
        }
        while (this.num1 % this.num2 != 0 || this.num2 <= questionBounds[2]) // regenerate if doesn't divide evenly

    }

    updateSkillLevel(isCorrect) {
        if (this.operator === '+') {
            if (isCorrect) {
                additionSkillLevel += this.pointVal;
                additionAnswerStreak++;
            }
            else {
                additionSkillLevel -= this.pointVal;
                additionAnswerStreak = 0;
            }
            localStorage.setItem("additionSkillLevel", additionSkillLevel.toString());
        }
        else if (this.operator === '-') {
            if (isCorrect) {
                subtractionSkillLevel += this.pointVal;
                subtractionAnswerStreak++;
            }
            else {
                subtractionSkillLevel -= this.pointVal;
                subtractionAnswerStreak = 0;
            }
            localStorage.setItem("subtractionSkillLevel", subtractionSkillLevel.toString());
        }
        else if (this.operator === '*') {
            if (isCorrect) {
                multiplicationSkillLevel += this.pointVal;
                multiplicationAnswerStreak++;
            }
            else {
                multiplicationSkillLevel -= this.pointVal;
                multiplicationAnswerStreak = 0;
            }
            localStorage.setItem("multiplicationSkillLevel", multiplicationSkillLevel.toString());
        }
        else if (this.operator === '/') {
            if (isCorrect) {
                divisionSkillLevel += this.pointVal;
                divisionAnswerStreak++;
            }
            else {
                divisionSkillLevel -= this.pointVal;
                divisionAnswerStreak = 0;
            }
            localStorage.setItem("divisionSkillLevel", divisionSkillLevel.toString());
        }
    }
    
}