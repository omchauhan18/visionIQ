// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB08F3M-PszKDuYj33U8tXA9GrgcUwMGc",
  authDomain: "visioniq-ram22.firebaseapp.com",
  projectId: "visioniq-ram22",
  storageBucket: "visioniq-ram22.firebasestorage.app",
  messagingSenderId: "613181488839",
  appId: "1:613181488839:web:29274f31cb85662ae808e2",
  measurementId: "G-HBKNKQVQ6S"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const uploadPreview = document.getElementById('upload-preview');
const predictButton = document.getElementById('predict-button');
const plusIcon = document.getElementById('plus-icon');
const popupOverlay = document.getElementById('popup-overlay');
const closePopupButton = document.getElementById('close-popup');
const recheckButton = document.getElementById('recheck-btn');
const predictNextButton = document.getElementById('predict-next');

// Image Upload Logic
let uploadedImage = null;

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadPreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image Preview" style="max-width: 100%; max-height: 100%;">`;
        predictButton.classList.add('enabled');
        predictButton.disabled = false; // Enable the predict button
        plusIcon.classList.add('enabled');
        uploadedImage = event.target.result; // Save the image data
    };
    reader.readAsDataURL(file);
}

// Drag-and-Drop and Upload Button
uploadPreview.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadPreview.classList.add('dragover');
});

uploadPreview.addEventListener('dragleave', () => {
    uploadPreview.classList.remove('dragover');
});

uploadPreview.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadPreview.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        previewImage(file);
    } else {
        alert('Please upload a valid image file.');
    }
});

// Prediction Button Logic
predictButton.addEventListener('click', async () => {
    if (!uploadedImage) {
        alert('Please upload an image first!');
        return;
    }

    // Send image to backend for prediction
    const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadedImage })
    });

    const result = await response.json();

    // Display the result in the popup
    popupOverlay.style.display = 'flex';
    document.querySelector('#popup-title').textContent = 'Prediction Result';
    document.querySelector('#popup-summary tbody').innerHTML = `
        <tr>
            <td>Product</td>
            <td>${result.product}</td>
            <td>${result.remainingDays} Days</td>
        </tr>
    `;
    document.getElementById('popup-images').innerHTML = `
        <img src="${result.predictedImage}" alt="Predicted Item Image" style="width: 300px; height: 300px; margin-right: 20px;">
    `;
});

// Predict Next Button Logic
predictNextButton.addEventListener('click', async () => {
    const predictionData = {
        product: document.querySelector('#popup-summary tbody tr td:nth-child(2)').textContent,
        remainingDays: document.querySelector('#popup-summary tbody tr td:nth-child(3)').textContent,
        timestamp: new Date()
    };

    // Check if the 'predictions' collection exists by querying the collection
    const predictionsCollectionRef = collection(db, 'predictions');
    const querySnapshot = await getDocs(predictionsCollectionRef);

    // If there are any documents in the predictions collection, it exists
    if (!querySnapshot.empty) {
        // Save the result to Firestore (collection already exists)
        try {
            await addDoc(predictionsCollectionRef, predictionData);
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data: ', error);
            alert('Failed to save data.');
        }
    } else {
        // If the collection doesn't exist, Firestore will automatically create it when we add the first document.
        try {
            await addDoc(predictionsCollectionRef, predictionData);
            alert('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data: ', error);
            alert('Failed to save data.');
        }
    }

    // Close popup and reset UI
    popupOverlay.style.display = 'none';
    uploadPreview.innerHTML = `<span>Image preview here</span>`;
    predictButton.classList.remove('enabled');
    predictButton.disabled = true;
    plusIcon.classList.remove('enabled');
});

// Close Popup Logic
closePopupButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

// Recheck Button Logic
recheckButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
    uploadPreview.innerHTML = `<span>Image preview here</span>`;
    predictButton.classList.remove('enabled');
    predictButton.disabled = true;
    plusIcon.classList.remove('enabled');
});