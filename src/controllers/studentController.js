const studentRepo = require('../repositories/studentRepository.js');
// Ony for handler transaction
const connection = require('../../db/connector.js');
const studentsPaymentMethodRepo = require('../repositories/studentPaymentMethodRepository.js');

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
            connection.end();
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
