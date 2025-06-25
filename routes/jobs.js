const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  renderAddJob,
  renderEditJob,
  renderDeleteJob,
} = require('../controllers/jobs');

// List all jobs
router.get('/', getAllJobs);

// Add job
router.get('/add', renderAddJob);
router.post('/add', createJob);

// Edit job
router.get('/edit/:id', renderEditJob);
router.post('/edit/:id', updateJob);

// Delete job
router.get('/delete/:id', renderDeleteJob);
router.post('/delete/:id', deleteJob);

module.exports = router;