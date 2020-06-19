const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Controllers to request
const studentController = require('./src/controllers/studentController');
const paymentMethodController = require('./src/controllers/paymentMethodController');
// express
const app = express();
const router = express.Router();

// ACCEPT CORS ACCESS FROM ENV
const { SERVICE_FRONTEND } = process.env;
app.use(cors({ origin: SERVICE_FRONTEND }));

// healtCheck
router.get('/health-check', async (req, res) => {
  const result = {
    status: 200,
    timestamp: Number(new Date()),
    params: req.query
  };

  res.status(result.status).json(result);
});

// GET all students
/*
*
* Can be http://<host>:<port>/api/v1/student?name=Maxi&country=Arg&offset=3
*
*/
router.get('/student', studentController.getAllStudents);

// GET an student
router.get('/student/:id', studentController.getOneStudent);

// INSERT An Student
/*
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
 * */
router.post('/student', studentController.save);

// Update student
router.put('/student/:id', studentController.update);

// DELETE An Student
router.delete('/student/:id', studentController.deleteStudent);

// Get all payments availables
router.get('/payment', paymentMethodController.getAvailablePayments);


app.use(bodyParser.json());
// prefix
app.use('/api/v1', router);
// init app
app.listen(process.env.PORT, () => {
  console.log(
    `[${Date.now()}][${process.env.ENV}:${process.env.APP_PREFIX}:${process.env.NAME}] [LISTENING:${
      process.env.PORT
    }]`,
  );
});
