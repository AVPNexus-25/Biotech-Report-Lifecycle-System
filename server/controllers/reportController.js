const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  const report = await Report.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.json(report);
};

exports.getReports = async (req, res) => {
  const reports = await Report.find()
    .populate('createdBy')
    .populate('clientId');

  res.json(reports);
};

exports.submitReport = async (req, res) => {
  const report = await Report.findById(req.body.id);
  report.status = 'submitted';
  await report.save();

  res.json(report);
};

exports.approveReport = async (req, res) => {
  const report = await Report.findById(req.body.id);

  if (req.user.role === 'manager') {
    report.status = 'approved';
  } else if (req.user.role === 'client') {
    report.status = 'finalised';
  }

  await report.save();
  res.json(report);
};

exports.rejectReport = async (req, res) => {
  const report = await Report.findById(req.body.id);
  report.status = 'draft';
  await report.save();

  res.json(report);
};