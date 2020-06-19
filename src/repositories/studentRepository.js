const connection = require('../../db/connector.js');
const statusHandler = require('../statusHandler');
const studentPaymentMethodRepo = require('../repositories/studentPaymentMethodRepository.js');
/**
 * Student Repository
 * @author Maxi Mendoza
 */
const { LIMIT_DEFAULT } = process.env;

const STUDENT_SELECT = `SELECT 
S.idStudent as id,
S.name,
S.email,
S.career,
S.city,
S.phone,
S.birthday,
S.country `;

const STUDENT_SELECT_ALL = `${STUDENT_SELECT},
PM.description,
SP.installments FROM students S `;

/**
 * Save a student
 * @param {object} studentData
 * @param {object} respCallback
 *
 */
const store = (studentData, respCallback) => {
  const queryInsert = 'INSERT INTO students SET ?';
  // Query promise
  connection.query(
    queryInsert,
    studentData,
    (err, result) => {
      if (err) {
        console.error(`[ERROR]: ${JSON.stringify(err.message)}`);
        // return status;
        respCallback({
          status: statusHandler.BAD_REQUEST,
          data: JSON.stringify(err.message)
        }, null);
        return;
      }
      // IF save
      respCallback(null,
        {
          status: statusHandler.CREATED,
          studentId: result.insertId
        });
    }
  );
};
module.exports.store = store;

/**
 * Get all actives Students
 *
 * @param {queryString} criteria
 * @param {queryString} offset
 * @param {callback} respCallback
 */
const getAll = (criteria, offset = null, respCallback) => {
  const query = `
    ${STUDENT_SELECT_ALL}
    INNER JOIN students_payment_method SP ON S.idStudent=SP.idStudent
    INNER JOIN payment_methods PM ON PM.id = SP.idPayment
    WHERE S.isActive = 1 ${criteria !== '' ? `AND ${criteria}` : ''}
    LIMIT ${LIMIT_DEFAULT} 
    ${offset !== null ? `OFFSET =${offset}` : ''}
    `;

  connection.query(
    query,
    (err, rows) => {
      if (err) {
        console.error(`[ERROR]:[GET ONE] ${JSON.stringify(err)}`);
        return respCallback({
          status: statusHandler.BAD_REQUEST,
          msg: err
        }, null);
      }
      respCallback(null, {
        status: statusHandler.SUCCESS,
        data: rows
      });
    }
  );
};
module.exports.getAll = getAll;

/**
 * Get One active Student
 *
 * @param {queryParam} id
 * @param {callback} callback
 */
const getOne = (id, respCallback) => {
  let finalAnswer;
  const query = `
    ${STUDENT_SELECT} FROM students S
    WHERE S.idStudent=${id} AND S.isActive = 1`;

  connection.query(
    query,
    (err, student) => {
      if (err) {
        console.error(`[ERROR]:[GET ONE] ${JSON.stringify(err)}`);
        return respCallback({
          status: statusHandler.BAD_REQUEST,
          msg: err
        }, null);
      }

      studentPaymentMethodRepo.getOne(student[0].id, (err, result) => {
        if (err) {
          console.error(`[ERROR] CAN NOT FOUND PAYMENT FROM STUDENT:
            ${JSON.stringify(err.message)}`);
          return;
        }
        // Perform answer
        finalAnswer = { student: student[0] };
        // Get Payload of dataPayment
        const data = result.data[0];
        // Edit final Answer
        finalAnswer.student.paymentMethod = data;

        respCallback(null, {
          status: statusHandler.SUCCESS,
          data: finalAnswer
        });
      });
    }
  );
};
module.exports.getOne = getOne;

/**
 * Update Student
 *
 * @param {*} studentData 
 * @param {*} id 
 * @param {*} respCallback 
 */
const update = (studentData, id, respCallback) => {
  const queryUpdate = `UPDATE students SET ? WHERE idStudent = ${id}`;
  // Query promise
  connection.query(
    queryUpdate,
    studentData,
    (err, result) => {
      if (err) {
        console.error(`[ERROR]: ${JSON.stringify(err.message)}`);
        // return status;
        respCallback({
          status: statusHandler.BAD_REQUEST,
          data: JSON.stringify(err.message)
        }, null);
        return;
      }
      // IF save
      respCallback(null,
        {
          status: statusHandler.NO_CONTENT,
          studentId: result.insertId
        });
    }
  );
};
module.exports.update = update;
