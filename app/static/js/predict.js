const uploadPreview = document.getElementById('upload-preview');
const predictButton = document.getElementById('predict-button');
const plusIcon = document.getElementById('plus-icon');
const uploadButton = document.querySelector('.upload-button');
const captureButton = document.querySelector('.capture-button');
const themeSwitch = document.getElementById('theme-switch');
const popupOverlay = document.getElementById('popup-overlay');
const closePopupButton = document.getElementById('close-popup');
const recheckButton = document.getElementById('recheck-btn');
const predictNextButton = document.getElementById('predict-next');

// Drag-and-drop functionality
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
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadPreview.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image Preview" style="max-width: 100%; max-height: 100%;">`;
            predictButton.classList.add('enabled');
            predictButton.disabled = false; // Enable the predict button
            plusIcon.classList.add('enabled');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
    }
});

// Upload Image button functionality
uploadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image Preview" style="max-width: 100%; max-height: 100%;">`;
                predictButton.classList.add('enabled');
                predictButton.disabled = false; // Enable the predict button
                plusIcon.classList.add('enabled');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
        }
    });
    input.click();
});

// Capture Image button functionality
captureButton.addEventListener('click', () => {
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.style.maxWidth = '100%';
    videoElement.style.maxHeight = '100%';

    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'relative';
    captureContainer.style.display = 'flex';
    captureContainer.style.flexDirection = 'column';
    captureContainer.style.alignItems = 'center';

    const captureBtn = document.createElement('button');
    captureBtn.textContent = 'Capture';
    captureBtn.style.marginTop = '10px';

    captureContainer.appendChild(videoElement);
    captureContainer.appendChild(captureBtn);

    uploadPreview.innerHTML = '';
    uploadPreview.appendChild(captureContainer);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;

            captureBtn.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // Stop video stream
                stream.getTracks().forEach((track) => track.stop());

                uploadPreview.innerHTML = `<img src="${canvas.toDataURL()}" alt="Captured Image Preview" style="max-width: 100%; max-height: 100%;">`;
                predictButton.classList.add('enabled');
                predictButton.disabled = false; // Enable the predict button
                plusIcon.classList.add('enabled');
            });
        })
        .catch((err) => {
            alert('Could not access your camera.');
        });
});

// Handle theme toggle
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
});

    // Simulate prediction and show popup
    predictButton.addEventListener('click', () => {
        // Simulate the prediction (this should be replaced with actual prediction logic)
        setTimeout(() => {
            popupOverlay.style.display = 'flex';
            
            // Set the title of the popup box
            document.querySelector('#popup-title').textContent = 'Predicted Item';
            
            // Add dynamic table content (for example purposes, you can replace this with actual data)
            document.querySelector('#popup-summary tbody').innerHTML = `
                <tr>
                    <td>Example Product</td>
                    <td>Available</td>
                    <td>100% Match</td>
                </tr>
            `;
            
            // Add dynamic table content for Records, Product Class, and Remaining Days
            document.querySelector('#popup-table tbody').innerHTML = `
                <tr>
                    <td>Record 1</td>
                    <td>Class A</td>
                    <td>5 Days</td>
                </tr>
                <tr>
                    <td>Record 2</td>
                    <td>Class B</td>
                    <td>10 Days</td>
                </tr>
                <tr>
                    <td>Record 3</td>
                    <td>Class C</td>
                    <td>3 Days</td>
                </tr>
            `;

            // Add the predicted item image
            document.getElementById('popup-images').innerHTML = `
                <img src="https://via.placeholder.com/150" alt="Predicted Item Image" style="width: 300px; height: 300px; margin-right: 20px;">
            `;
        }, 1000);
    });


// Close the popup
closePopupButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

// Recheck button
recheckButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
    uploadPreview.innerHTML = `<span>Image preview here</span>`;
    predictButton.classList.remove('enabled');
    predictButton.disabled = true;
    plusIcon.classList.remove('enabled');
});

// Predict Next button
predictNextButton.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
    uploadPreview.innerHTML = `<span>Image preview here</span>`;
    predictButton.classList.remove('enabled');
    predictButton.disabled = true;
    plusIcon.classList.remove('enabled');
});
