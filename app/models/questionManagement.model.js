const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const getQuestions = (itemId, callback) => {
  const sql = `SELECT * FROM questions WHERE item_id = ?`;
  db.all(sql, [itemId], (err, rows) => {
    callback(err, rows);
  });
};

const askQuestion = (questionData, callback) => {
  const sql = `INSERT INTO questions (item_id, user_id, question_text) VALUES (?, ?, ?)`;
  db.run(sql, [questionData.itemId, questionData.userId, questionData.text], function(err) {
    callback(err, this ? this.lastID : null);
  });
};

const answerQuestion = (answerData, callback) => {
  const sql = `UPDATE questions SET answer_text = ? WHERE id = ?`;
  db.run(sql, [answerData.answer, answerData.questionId], function(err) {
    callback(err);
  });
};

module.exports = {
  getQuestions,
  askQuestion,
  answerQuestion
};
