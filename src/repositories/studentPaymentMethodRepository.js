const connection = require('../../db/connector.js');
const statusHandler = require('../statusHandler.js');

/**
 * Student Repository
 * @author Maxi Mendoza
 */

/**
 *  Save data Payment of a student
 * @param {object} params
 * @returns {object}
 *
 * Relationship Schema
 * See studentRepository.save
 */
const store = (params, respCBack) => {
  const queryInsert = 'INSERT INTO students_payment_method SET ?';

  // Save data
  connection.query(
    queryInsert,
    params,
    async (err, result) => {
      if (err) {
        console.error(`[ERROR]:[PaymentMethod] ${JSON.stringify(err)}`);
        return respCBack({
          status: statusHandler.BAD_REQUEST,
          data: err
        }, null);
      }
      // Query Promise Ok
      respCBack(null,
        {
          status: statusHandler.CREATED,
          data: result.insertId
        });
    }
  );
};
module.exports.store = store;

/**
 *  Update Payment Method
 *
 * @param {obect} data
 * @param {queryParam} id
 * @param {callback} respCBack
 *
 * Relationship Schema
 * See studentRepository.update
 */
const update = async (data, id, respCBack) => {
  const query = `UPDATE students_payment_method SET ?
   WHERE idStudent = ${id}`;
  // Save data
  connection.query(
    query,
    data,
    (err, result) => {
      if (err) {
        console.error(`[ERROR]:[PaymentMethod] ${JSON.stringify(err)}`);
        return respCBack({
          status: statusHandler.BAD_REQUEST,
          data: err
        }, null);
      }
      // Query Promise Ok
      respCBack(null,
        {
          status: statusHandler.NO_CONTENT,
          data: result.insertId
        });
    }
  );
};
module.exports.update = update;

/**
 * Get one Payment Method
 * INTERNAL
 *
 * @param {*} id 
 * @param {*} callback 
 */
const getOne = async (id, callback) => {
  const querySelect = `SELECT
   S.id as id,
   S.description,
   SP.installments  FROM payment_methods S
   INNER JOIN students_payment_method SP ON S.id=SP.idPayment
   WHERE SP.idStudent = ${id}`;

  connection.query(
    querySelect,
    (err, rows) => {
      if (err) {
        console.error(`[ERROR]:  ${JSON.stringify(err)}`);
        callback(err, null);
      }
      callback(null, {
        status: statusHandler.SUCCESS,
        data: rows
      });
    }
  );
};
module.exports.getOne = getOne;
