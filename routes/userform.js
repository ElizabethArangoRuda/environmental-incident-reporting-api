import express from "express";
import fs from 'fs';
import knex from 'knex';
import knexConfig from '../knexfile.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const db = knex(knexConfig);

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/temp'); // Folder where the files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique name for the file
    },
});
const upload = multer({ storage });

router.get("/anonymous", async (request, response) => {
    try {
        const complaint = await db("reports").select("*");
        response.json(complaint);
    } catch (error) {
        console.error("Error fetching complaints:", error)
    }
});

router.post('/anonymous', async (request, response) => {
    try {
        // Serialize the media field to JSON if provided
        const media = request.body.media ? JSON.stringify(request.body.media) : null;
        // Construct the complaint object to match the table schema
        const complaint = {
            address: request.body.address,
            contact_name: request.body.contact_name,
            contact_phone: request.body.contact_phone,
            contact_email: request.body.contact_email,
            description: request.body.description,
            category: request.body.category,
            media: media, // Serialized JSON
            latitude: parseFloat(request.body.latitude),
            longitude: parseFloat(request.body.longitude),
            created_at: new Date(),
            updated_at: new Date(),
        };

        // Insert the complaint into the 'reports' table
        const [id] = await db("reports").insert(complaint);

        // Respond to the client
        response.status(201).send({
            message: 'Complaint submitted successfully.',
            reportId: id, // Changed to reportId for clarity
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send({
            message: 'An error occurred while submitting the complaint.',
            error: error.message || error, // Include the error details in the response
        });
    }
});

router.post('/anonymous', upload.single('media_files'), async (request, response) => {
    try {

        const complaint = {
            address: request.body.address,
            description: request.body.description,
            category: request.body.category,
            contact_name: request.body.contact_name,
            contact_phone: request.body.contact_phone,
            contact_email: request.body.contact_email,
            media: JSON.stringify(request.file),
            latitude: request.body.latitude,
            longitude: request.body.longitude,
            created_at: new Date(),
            updated_at: new Date(),
        };

        // Insert the complaint into the database
        const [id] = await db("reports").insert(complaint);

        if (request.file) {

            // Create folder with report id
            const reportFolder = path.join('uploads/reports', id.toString());
            if (!fs.existsSync(reportFolder)) {
                fs.mkdirSync(reportFolder, { recursive: true });
            }

            // Move the file uploaded to the temp folder to the report id folder
            const oldPath = request.file.path;
            const newPath = path.join(reportFolder, request.file.filename);
            fs.renameSync(oldPath, newPath);
        }

        // Respond to the customer
        response.status(201).send({
            message: 'Complaint submitted successfully.',
            reportId: id,
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send({
            message: 'An error occurred while submitting the complaint.',
            error: error.message || error,
        });
    }
});


export default router;


