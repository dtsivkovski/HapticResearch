let additionSkillLevel = 75;
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

class MathQuestion {

    pointVal = 2;
    operator;
    num1 = 0;
    num2 = 0;
    answer = 0;

    constructor() {
        this.operator = '+'; // TODO: implement all 4 types through random generation
    }

    createAdditionQuestion() {
        // set question value
        console.log(additionAnswerStreak);
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
        // TODO: see if there is a way to guarantee it is of a minimum difficulty for the questions

    }

    updateSkillLevel(isCorrect) {
        if (this.operator == '+') {
            if (isCorrect) {
                additionSkillLevel += this.pointVal;
                additionAnswerStreak++;
            }
            else {
                additionSkillLevel -= this.pointVal;
                additionAnswerStreak = 0;
            }
        }
        // TODO: implement other operators
    }
    
}