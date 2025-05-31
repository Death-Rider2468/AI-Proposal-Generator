const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { GoogleAuth } = require('google-auth-library');
const { PDFDocument } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

// Middleware: verify Firebase ID token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = await require('../firebase').admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all proposals for user
router.get('/', verifyToken, async (req, res) => {
  const snapshot = await db.collection('proposals').where('userId', '==', req.user.uid).get();
  const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(proposals);
});

// Create proposal (with AI)
router.post('/', verifyToken, async (req, res) => {
  const {
    clientName,
    industry,
    projectTitle,
    timeline,
    techStack,
    modules,
    goals,
    tone,
    budget,
    stakeholders
  } = req.body;

  // Call Gemini API (replace with real call in production)
  const aiContent = await generateProposalWithGemini({
    clientName,
    industry,
    projectTitle,
    timeline,
    techStack,
    modules,
    goals,
    tone,
    budget,
    stakeholders
  });

  const proposal = {
    userId: req.user.uid,
    clientName,
    industry,
    projectTitle,
    timeline,
    techStack,
    modules,
    goals,
    tone,
    budget,
    stakeholders,
    aiContent,
    createdAt: new Date().toISOString(),
  };
  const docRef = await db.collection('proposals').add(proposal);
  res.status(201).json({ id: docRef.id, ...proposal });
});

// Edit proposal
router.put('/:id', verifyToken, async (req, res) => {
  await db.collection('proposals').doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Delete proposal
router.delete('/:id', verifyToken, async (req, res) => {
  await db.collection('proposals').doc(req.params.id).delete();
  res.json({ success: true });
});

// Export as PDF
router.get('/:id/pdf', verifyToken, async (req, res) => {
  const doc = await db.collection('proposals').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  const proposal = doc.data();
  // Generate PDF (simple example)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(`Proposal for ${proposal.clientName}\n${proposal.aiContent}`);
  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
});

// Export as DOCX
router.get('/:id/docx', verifyToken, async (req, res) => {
  const doc = await db.collection('proposals').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Not found' });
  const proposal = doc.data();

  // Parse aiContent into sections if possible, else just output as one block
  // For now, assume aiContent is a string with section headers
  const docx = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: proposal.projectTitle || `Proposal for ${proposal.clientName}`, bold: true, size: 32 })], spacing: { after: 300 } }),
        ...proposal.aiContent.split('\n\n').map(section =>
          new Paragraph({ children: [new TextRun(section)], spacing: { after: 200 } })
        ),
      ],
    }],
  });
  const buffer = await Packer.toBuffer(docx);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);
});

// Dummy Gemini API call (replace with real Gemini API integration)
async function generateProposalWithGemini(inputs) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store your API key in .env
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

  const prompt = `
Generate a professional project proposal based on the following inputs:
Client Name: ${inputs.clientName}
Industry: ${inputs.industry}
Project Title: ${inputs.projectTitle}
Project Timeline: ${inputs.timeline}
Technology Stack: ${inputs.techStack}
Modules: ${inputs.modules}
Goals: ${inputs.goals}
Budget: ${inputs.budget || "To be determined"}
Stakeholders: ${inputs.stakeholders || "To be determined"}
Tone: ${inputs.tone}

Structure the proposal with these sections:
1. Executive Summary
2. Background
3. Objectives
4. Scope
5. Timeline
6. Budget
7. Stakeholders
8. Conclusion

Ensure the proposal is concise, formal, and uses business language.
`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();
  // Gemini returns the text in data.candidates[0].content.parts[0].text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No content returned from Gemini API");
  return text.trim();
}

module.exports = router;