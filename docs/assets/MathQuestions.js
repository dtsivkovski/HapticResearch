let additionSkillLevel = 50;
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

    constructor() {
        this.questionType = 'addition'; // TODO: implement all 4 types

        if (this.questionType === 'addition') 
            createAdditionQuestion();
    }

    createAdditionQuestion() {
        // set question value
        let questionVal = Math.pow(2,additionAnswerStreak);
        if (questionVal >= 32) 
            questionVal = 32;
        this.pointVal = questionVal;

        // TODO: check skill level for addition
        if (additionSkillLevel <= 50) {

        }
    }
    
}