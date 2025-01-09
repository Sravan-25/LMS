const express = require('express');
const router = express.Router();
const path = require('path');
const documentController = require('../Controllers/documentController');

router.get('/document-page', documentController.renderDocumentPage);

router.post(
  '/upload-document',
  documentController.upload.single('file'),
  documentController.uploadDocument
);

router.get('/get-all-documents', documentController.getAllDocuments);
router.get('/document/:id', documentController.viewDocument);
router.get("/delete-document/:id", documentController.deleteDocs);
router.get('/edit-document/:documentId', documentController.renderDocumentPage);
router.post('/edit-document/:documentId', documentController.updateOrCreateDocument);


module.exports = router;
