const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

const getQuestions = (itemId, callback) => {
  const sql = `SELECT * FROM questions WHERE item_id = ?`;
  db.all(sql, [itemId], (err, rows) => {
    callback(err, rows);
  });
}

const getItemIdFromQuestion = (questionId, done) => {
  const sql = 'SELECT item_id FROM questions WHERE question_id=?';

  db.get(sql, [questionId], (err, row) => {
    if (err) return done(err)
    if (!row) return done(404)

    return done(false, row.item_id)
  })
}

const addAnswer = (answerData, done) => {
  const sql = 'UPDATE questions SET answer=? WHERE question_id=?';
  const values = [answerData.answerText, answerData.questionId]
  db.run(sql, [values], (err) => {
    if (err) return done(err)
    return done(false)
  })
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
  getItemIdFromQuestion,
  addQuestion,
  addAnswer,
  answerQuestion
};
