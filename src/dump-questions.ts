// This file is released under the MIT License. See the LICENSE file.

import { questions, pickRandomQuestion, pickRandomCourse } from './modules/main/server/questions'

const levels = ["Primaire", "6e", "5e", "4e", "3e"]

for (let level in questions) {
    console.log(`# Niveau ${levels[level]}\n`)
    for (let field in questions[level]) {
        console.log(`## ${field}\n`)
        questions[level][field].forEach(question_function => {
            let question = question_function();
            console.log(question.statement);
            console.log(`  * ${question.correct} ✓`)
            question.wrong.forEach(text => { console.log(`  * ${text}`); });
            if (question.course) {
                console.log(`\n  Cours:`);
                question.course.forEach(text => {
                    console.log(`    ${text}`);
                });
            }
            console.log();
        });
    }
}

console.log("# Test de l'API\n")

let question = pickRandomQuestion(5);
console.log("pickRandomQuestion(5):\n", question);
let course = pickRandomCourse(5, 'maths');
console.log(`pickRandomCourse(5, 'maths'):\n ${course}\n`);
