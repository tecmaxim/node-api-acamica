const express = require('express');
const bodyParser = require('body-parser');

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
router.get('/student', async (req, res) => {
  // Callback response
  studentController.getAllStudents(req.query, (status, result) => {
    res.status(status).json(result);
  });
});

// GET an student
router.get('/student/:id', async (req, res) => {
  studentController.getOneStudent(req.params, (status, result) => {
    res.status(status).json(result);
  });
});

// INSERT An Student
router.post('/student', async (req, res) => {
  const result = await studentController.save(req.body);
  res.status(201).json(result);
});

// Update student
router.put('/student/:id', async (req, res) => {
  const result = await studentController.update(req.body, req.params);
  res.status(202).json(result);
});

// DELETE An Student
router.delete('/student/:id', async (req, res) => {
  const result = await studentController.deleteStudent(req.params);
  res.status(204).json(result);
});

// Get all payments availables
router.get('/payment', async (req, res) => {
  // Callback Response
  paymentMethodController.getPaymentMethods((status, result) => {
    res.status(status).json(result);
  });
});

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
