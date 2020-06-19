const studentRepo = require('../repositories/studentRepository.js');
// Ony for handler transaction
const connection = require('../../db/connector.js');
const studentsPaymentMethodRepo = require('../repositories/studentPaymentMethodRepository.js');
/**
 * Student Controller Repository
 * @author Maxi Mendoza
 */

/**
 * Save a student
 *
 * @param {request Object} req
 * @param {response Object} res
 */
const save = async (req, res) => {
  const { student } = req.body;
  const { paymentMethod } = req.body;

  console.log(`[DEBUG]: NEW STUDENT RECEIVED ${JSON.stringify(req.body)}`);
  try {
    /**
    * Transaction is handled outside models to avoid
    * multiples nested callbacks on responses and
    * make more easy to handling error
    */
    connection.beginTransaction(() => {
      studentRepo.store(student, (err, responseCb) => {
        console.log(JSON.stringify(responseCb));
        // if fail on try to save student, reject
        if (err) {
          return res.status(err.status).json(err);
        }

        // Set data of payment
        const dataPayment = {
          IdStudent: responseCb.studentId,
          idPayment: paymentMethod.idPayment,
          installments: paymentMethod.installments
        };
        console.log(`dataPayment ${JSON.stringify(dataPayment)}`);
        // Try to save data oh payment method selected
        studentsPaymentMethodRepo.store(dataPayment, (errPayment, responseCbPayment) => {
          if (errPayment) {
            // If fail trigger rollback and reject request
            connection.rollback((error) => {
              console.error(`[ROLLBACK]: FAIL ON TRY TO SAVE RELATION ${JSON.stringify(error)}`);
            });
            return res.status(errPayment.status).json(errPayment);
          }
          // If all data is saved, commit and response
          connection.commit((errCommit) => {
            if (errCommit) {
              connection.rollback(() => {
                console.log('[ROLLBACK]: FAIL ON COMMIT');
              });
            }
            console.log('[DEBUG]: Transaction Commited!');
            // End conection if is server stateless
            // connection.end();
          });
          res.status(responseCbPayment.status).json(responseCbPayment);
        });
      });
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
module.exports.save = save;

/**
 * Get All students
 *
 * @param {request Object} req
 * @param {response Object} resp
 */
const getAllStudents = async (req, res) => {
  const queryParams = req.query;
  let criteriaString = '';
  let { offset } = queryParams;
  // Delete from object to avoid re-check
  if (offset) {
    delete queryParams.offset;
  } else {
    offset = null;
  }

  // Making Create "Where" string criteria
  Object.keys(queryParams).forEach((key) => {
    criteriaString += criteriaString === '' ? '' : ' and ';
    criteriaString += `${key} like '%${queryParams[key]}%'`;
  });

  console.log(`[DEBUG]:GET ALL STUDENTS
    WHERE ${criteriaString}, 
    OFFSET ${offset}
  `);
  try {
    // Callback response from mysql.query component
    studentRepo.getAll(criteriaString, offset, (err, result) => {
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
};
module.exports.getAllStudents = getAllStudents;

const getOneStudent = async (req, res) => {
  try {
    // Callback response from mysql.query component
    studentRepo.getOne(req.params.id, (err, result) => {
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
module.exports.getOneStudent = getOneStudent;

/**
 * Update a student
 *
 * @param {request Object} req
 * @param {response Object} res
 */
const update = async (req, res) => {
  const { student } = req.body;
  const { paymentMethod } = req.body;
  const { id } = req.params;

  console.log(`[DEBUG]: NEW STUDENT RECEIVED ${JSON.stringify(req.body)}`);
  try {
    /**
    * Transaction is handled outside models to avoid
    * multiples nested callbacks on responses and
    * make more easy to handling error
    */
    connection.beginTransaction(() => {
      studentRepo.update(student, id, (err, responseCb) => {
        console.log(JSON.stringify(responseCb));
        // if fail on try to save student, reject
        if (err) {
          return res.status(err.status).json(err);
        }

        // Set data of payment
        const dataPayment = {
          IdStudent: id,
          idPayment: paymentMethod.idPayment,
          installments: paymentMethod.installments
        };
        console.log(`dataPayment ${JSON.stringify(dataPayment)}`);
        // Try to save update on payment method selected
        studentsPaymentMethodRepo.update(dataPayment, id, (errPayment, responseCbPayment) => {
          if (errPayment) {
            // If fail trigger rollback and reject request
            connection.rollback((error) => {
              console.error(`[ROLLBACK]: FAIL ON TRY TO SAVE RELATION ${JSON.stringify(error)}`);
            });
            return res.status(errPayment.status).json(errPayment);
          }
          // If all data is update, commit and response
          connection.commit((errCommit) => {
            if (errCommit) {
              connection.rollback(() => {
                console.log('[ROLLBACK]: FAIL ON COMMIT');
              });
            }
            console.log('[DEBUG]: Transaction Commited!');
            // End conection if is server stateless
            // connection.end();
          });
          res.status(responseCbPayment.status).json(responseCbPayment);
        });
      });
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
module.exports.update = update;

/**
 * Delete student
 *
 * @param {object} req 
 * @param {object} res 
 */
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  console.log(`[DEBUG]: DELETING STUDENT ${id}} `);
  try {
    // Logic DELETE
    const dataUpdate = {
      student:
    {
      isActive: 0
    },
      paymentMethod: {
        isActive: 0
      }
    };
    connection.beginTransaction(() => {
      studentRepo.update(dataUpdate.student, id, (err, responseCb) => {
        console.log(JSON.stringify(responseCb));
        // if fail on try to delete student, reject
        if (err) {
          return res.status(err.status).json(err);
        }
        // Try to delete data on payment method selected
        studentsPaymentMethodRepo.update(dataUpdate.paymentMethod, id, (errPayment, responseCbPayment) => {
          if (errPayment) {
          // If fail trigger rollback and reject request
            connection.rollback((error) => {
              console.error(`[ROLLBACK]: FAIL ON TRY TO SAVE RELATION ${JSON.stringify(error)}`);
            });
            return res.status(errPayment.status).json(errPayment);
          }
          // If all data is saved, commit and response
          connection.commit((errCommit) => {
            if (errCommit) {
              connection.rollback(() => {
                console.log('[ROLLBACK]: FAIL ON COMMIT');
              });
            }
            console.log('[DEBUG]: Transaction Commited!');
          // End conection if is server stateless
          // connection.end();
          });
          res.status(responseCbPayment.status).json(responseCbPayment);
        });
      });
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
module.exports.deleteStudent = deleteStudent;
