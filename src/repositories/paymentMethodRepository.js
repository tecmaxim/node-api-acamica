const connection = require('../../db/connector.js');
const statusHandler = require('../statusHandler');
/**
 * Payment Method Repository
 * @author Maxi Mendoza
 */
const { LIMIT_DEFAULT } = process.env;


/**
 * Get all actives Students
 *
 * @param {queryString} criteria
 * @param {queryString} offset
 * @param {callback} respCallback
 */
const getAll = (criteria, offset = null, respCallback) => {
  const PAYMENT_SELECT = `SELECT * FROM payment_methods P 
    ${criteria !== null ? `WHERE ${criteria}` : ''}
    LIMIT ${LIMIT_DEFAULT} 
    ${offset !== null ? `OFFSET =${offset}` : ''}`;

  connection.query(
    PAYMENT_SELECT,
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
