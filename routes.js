const express = require('express');
const bodyParser = require('body-parser');
// Controllers to request
const studentController = require('./src/controllers/studentController');
const paymentMethodController = require('./src/controllers/paymentMethodController');
// express
const app = express();
const router = express.Router();

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
router.get('/student', studentController.getAllStudents);

// GET an student
router.get('/student/:id', studentController.getOneStudent);

// INSERT An Student
router.post('/student', studentController.save);

// Update student
router.put('/student/:id', studentController.update);

// DELETE An Student
router.delete('/student/:id', studentController.deleteStudent);

// Get all payments availables
router.get('/payment', paymentMethodController.getPaymentMethods);


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
