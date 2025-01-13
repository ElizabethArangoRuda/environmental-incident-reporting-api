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
        cb(null, 'uploads/temp'); // Carpeta donde se almacenarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para el archivo
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

router.post('/anonymous2', upload.single('media_files'), async (request, response) => {
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

            /*const filePath = request.file.path;  // Ruta completa del archivo subido
            const fileName = request.file.filename;  // Nombre del archivo subido
            const fileSize = request.file.size;*/  // Tamaño del archivo

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

        // Responder al cliente
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




// function getPhotos(){
// 	const photosData = fs.readFileSync('./data/photos.json')
// 	const parseData = JSON.parse(photosData)
// 	return parseData
// }

// // Function to save photos data
// function savePhotos(data) {
// 	fs.writeFileSync('./data/photos.json', JSON.stringify(data, null, 2), 'utf-8');
// }

// router.get("/", (request, response)=>{
//     // response.json({msg: 'Recieved a GET request'})
//     const photos = getPhotos()
//     response.json(photos)})



// router.get("/:id", (request, response) => {
//     const photos = getPhotos(); // Get all photos
//     const { id } = request.params; // Extract id from the request
//     const photo = photos.find(p => p.id === id); // Find the photo with the matching id

//     if (!photo) {
//         return response.status(404).json({ error: "Photo not found" });
//     }

//     response.json(photo);
// });

// router.get("/:id/comments", (request, response) => {
//     const photos = getPhotos();
//     const photo = photos.find(photo => photo.id === request.params.id);

//     if (!photo) {
//         return response.status(404).json({ error: "Photo not found" });
//     }

//     response.json(photo.comments || []);
// });

// router.post("/:id/comments", (request, response) => {
//     const photos = getPhotos();
//     const photo = photos.find(photo => photo.id === request.params.id);

//     if (!photo) {
//         return response.status(404).json({ error: "Photo not found" });
//     }

//     // Generate a new comment object
//     const newComment = {
//         id: crypto.randomUUID(), // Generate a unique ID for the comment
//         name: request.body.name,
//         comment: request.body.comment,
//         timestamp: Date.now(),
//     };

//     // Add the new comment to the photo's comments array
//     if (!photo.comments) {
//         photo.comments = [];
//     }
//     photo.comments.push(newComment);

//      // Save updated photos data back to the JSON file
//      savePhotos(photos);

//     response.status(201).json(newComment);
// });


