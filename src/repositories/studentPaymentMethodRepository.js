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
      respCBack(null,
        {
          status: statusHandler.CREATED,
          data: result.insertId
        });
    }
  );
};

module.exports.store = store;
