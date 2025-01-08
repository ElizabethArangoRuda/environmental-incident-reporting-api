import express from "express";
import fs from 'fs';

const router = express.Router();

function getPhotos(){
	const photosData = fs.readFileSync('./data/photos.json')
	const parseData = JSON.parse(photosData)
	return parseData
} 

// Function to save photos data
function savePhotos(data) {
	fs.writeFileSync('./data/photos.json', JSON.stringify(data, null, 2), 'utf-8');
}

router.get("/", (request, response)=>{
    // response.json({msg: 'Recieved a GET request'})
    const photos = getPhotos()
    response.json(photos)})

router.get("/:id", (request, response) => {
    const photos = getPhotos(); // Get all photos
    const { id } = request.params; // Extract id from the request
    const photo = photos.find(p => p.id === id); // Find the photo with the matching id

    if (!photo) {
        return response.status(404).json({ error: "Photo not found" });
    }

    response.json(photo);
});

router.get("/:id/comments", (request, response) => {
    const photos = getPhotos();
    const photo = photos.find(photo => photo.id === request.params.id);

    if (!photo) {
        return response.status(404).json({ error: "Photo not found" });
    }

    response.json(photo.comments || []);
});

router.post("/:id/comments", (request, response) => {
    const photos = getPhotos();
    const photo = photos.find(photo => photo.id === request.params.id);

    if (!photo) {
        return response.status(404).json({ error: "Photo not found" });
    }

    // Generate a new comment object
    const newComment = {
        id: crypto.randomUUID(), // Generate a unique ID for the comment
        name: request.body.name,
        comment: request.body.comment,
        timestamp: Date.now(),
    };

    // Add the new comment to the photo's comments array
    if (!photo.comments) {
        photo.comments = [];
    }
    photo.comments.push(newComment);

     // Save updated photos data back to the JSON file
     savePhotos(photos);

    response.status(201).json(newComment);
});

export default router;
