// let problems = [
//  {
//     "id": 1,
//     "name": "One Sum",
//     "desc": "Given an array...1111111111111111111",
//     "difficulty": "easy"
//   },
//   {
//     "id": 2,
//     "name": "Two Sum",
//     "desc": "Given an array...2222222222222222222",
//     "difficulty": "medium"
//   },
//   {
//     "id": 3,
//     "name": "Three Sum",
//     "desc": "Given an array...33333333333333333333",
//     "difficulty": "easy"
//   },
//   {
//     "id": 4,
//     "name": "Four Sum",
//     "desc": "Given an array...44444444444444444444",
//     "difficulty": "hard"
//   },
//   {
//     "id": 5,
//     "name": "Five Sum",
//     "desc": "Given an array...5555555555555555555555",
//     "difficulty": "super"
//   }
// ];

const ProblemModel = require('../models/problemModel');

const getProblems = function(){
    // return new Promise((resolve, reject) => {
    //     resolve(problems);
    // });
    return new Promise((resolve, reject) =>{
        ProblemModel.find({}, function(err, problems) {
            if (err) {
                reject(err);
            } else {
                resolve(problems);
            }
        });
    });
}

const getProblem = function(id){
    // return new Promise((resolve, reject) => {
    //     resolve(problems.find(problem => problem.id === id));
    // });
    return new Promise((resolve, reject) =>{
        ProblemModel.findOne({id: id}, function(err, problem) {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        });
    });
}

const addProblem = function(newProblem) {
    // return new Promise((resolve, reject) => {
    //     if (problems.find(problem => problem.name === newProblem.name)) {
    //         reject('problem name already exists! Sent by problemService.js');
    //     } else {
    //         newProblem.id = problems.length + 1;
    //         problems.push(newProblem);
    //         resolve(newProblem);
    //     }
    // });
        return new Promise((resolve, reject) => {
            ProblemModel.findOne({name: newProblem.name}, function(err, data) {
                if (data){
                    reject('Problem name already exists!');
                } else {
                    ProblemModel.count({}, function(err, num) {
                        newProblem.id = num + 1;
                        let mongoProblem = new ProblemModel(newProblem);
                        mongoProblem.save();
                        resolve(mongoProblem);
                    });
                }
            });
        });
}

module.exports = {
    getProblems,
    getProblem,
    addProblem
}