const router = require('express').Router();
const { retrieveCollection } = require('../db/index.js');

// GET
router.get('/', (req, res) => {
  retrieveCollection(result => {
    res.send(result);
  })
});

// POST (extension)
router.post('/', (req, res) => {
  res.sendStatus(200);
});

// PUT (extension)
router.put('/', (req, res) => {
  res.sendStatus(200);
});

// DELETE (extension)
router.delete('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;