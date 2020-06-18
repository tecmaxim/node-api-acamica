const connection = require('../../db/connector.js');
const statusHandler = require('../statusHandler');
/**
 * Student Repository
 * @author Maxi Mendoza
 */

/**
 * Save a student
 * @param {object} studentData
 * @param {object} respCallback
 *
 * Request Body
 * {
 *   "student": {
 *       "name":"Nomber",
 *       "email": "mail@gmail.com",
 *       "career": "Comunications",
 *       "birthday": "1988-10-10",
 *       "phone": 123213123,
 *       "country": "Arg",
 *       "city": "Bs As"
 *   },
 *   "paymentMethod": {
 *       "idPayment":1
 *   }
 * }
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
