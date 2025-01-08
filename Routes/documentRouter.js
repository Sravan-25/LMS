const express = require('express');
const router = express.Router();
const documentController = require('../Controllers/documentController');

router.get('/document-page', documentController.renderDocumentPage);

router.post(
  '/upload-document',
  documentController.upload.single('file'),
  documentController.uploadDocument
);

module.exports = router;
