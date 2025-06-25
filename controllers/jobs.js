const Job = require('../models/job');

// List all jobs (render jobs.ejs)
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt');
  res.render('jobs', { jobs });
};

// Show add job form
const renderAddJob = (req, res) => {
  res.render('job-add');
};

// Handle add job POST
const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  await Job.create(req.body);
  res.redirect('/jobs');
};

// Show edit job form
const renderEditJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) return res.redirect('/jobs');
  res.render('job-edit', { job });
};

// Handle edit job POST
const updateJob = async (req, res) => {
  const { company, position } = req.body;
  if (company === '' || position === '') {
    req.flash('error', 'Company or Position fields cannot be empty');
    return res.redirect(`/jobs/edit/${req.params.id}`);
  }
  await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  res.redirect('/jobs');
};

// Show delete confirmation
const renderDeleteJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) return res.redirect('/jobs');
  res.render('job-delete', { job });
};

// Handle delete job POST
const deleteJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (job) {
    await job.deleteOne();
  }
  res.redirect('/jobs');
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  renderAddJob,
  renderEditJob,
  renderDeleteJob,
};