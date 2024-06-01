let operators = ['+', '-', '/', '*'];

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

class MathQuestion {

    // TODO: custom incorrect multiple choice answers depending on the question

    pointVal = 2;
    operator;
    num1 = 0;
    num2 = 0;
    answer = 0;

    constructor() {
        this.operator = operators[Math.floor(Math.random() * 2)]; // random operator from list
    } // TODO: fix operator numbers to include division and multiplication

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
        while (this.answer >= questionBounds[2] && questionBounds[2] !== 'none') { // regenerate if above bounds
            this.num1 = Math.floor(Math.random() * questionBounds[0]); 
            this.num2 = Math.floor(Math.random() * questionBounds[1]); 
            this.answer = this.num1 + this.num2;
        }
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
        while (this.answer < questionBounds[2] && questionBounds[2] !== 'none') { // regenerate if above bounds
            this.num1 = Math.floor(Math.random() * questionBounds[0]); 
            this.num2 = Math.floor(Math.random() * questionBounds[1]); 
            this.answer = this.num1 - this.num2;
        }

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
        else if (this.operator === '/') {

        }
        else if (this.operator === '*') {

        }
        // TODO: implement other operators
    }
    
}