const paymentMethodRepo = require('../repositories/paymentMethodRepository.js');

/**
 * Payment Method Controller
 * @author Maxi Mendoza
 */
const getAvailablePayments = async (req, res) => {
  try {
    // Callback response from mysql.query component
    paymentMethodRepo.getAll(null, null, (err, result) => {
      if (err) {
        console.error(`[DEBUG]:GET ALL STUDENTS ${JSON.stringify(err)}`);
        return res.status(err.status).json(err);
      }
      // query Promise ok
      return res.status(result.status).json(result.data);
    });
  } catch (errCatch) {
    console.error(errCatch);
    throw errCatch;
  }
  return true;
};
module.exports.getAvailablePayments = getAvailablePayments;
