const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const getQuestions = (itemId, callback) => {
  const sql = `SELECT * FROM questions WHERE item_id = ?`;
  db.all(sql, [itemId], (err, rows) => {
    callback(err, rows);
  });
}


const addQuestion = (questionData, done) => {
  const sql = `INSERT INTO questions (item_id, user_id, question_text) VALUES (?, ?, ?)`;
  const values = [questionData.itemId, questionData.askedBy, questionData.questionText];
  db.run(sql, [values], function (err) {
    if (err) return done(err)
    return done(false);
  });
};

const answerQuestion = (answerData, callback) => {
  const sql = `UPDATE questions SET answer_text = ? WHERE id = ?`;
  db.run(sql, [answerData.answer, answerData.questionId], function (err) {
    callback(err);
  });
};

module.exports = {
  getQuestions,
  addQuestion,
  answerQuestion
};
