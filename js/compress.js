let files = [];

function dropHandler(ev) {
    ev.preventDefault();
    const newFiles = Array.from(ev.dataTransfer.files);

    addFiles(newFiles);
    updateFileList();
}

function handleFileInputChange(ev) {
    const newFiles = Array.from(ev.target.files);
    addFiles(newFiles);

    document.getElementById("compress-button").style.opacity = 1;

    updateFileList();
}

function addFiles(newFiles) {
    newFiles.forEach(newFile => {
        if (isImageFile(newFile) && !files.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)) {
            document.getElementById("compress-button").style.opacity = 1;
            files.push(newFile);
        } else if (!isImageFile(newFile)) {
            console.warn(`File ${newFile.name} is not an image and will not be added.`);
        }
    });
}

function updateFileList() {
    const fileListDiv = document.getElementById('file-list');
    fileListDiv.innerHTML = '';

    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item flex items-center justify-between mb-2 p-2 bg-neutral-900 rounded-lg';
        fileItem.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'bg-red-600 text-white px-2 py-1 rounded';
        deleteButton.onclick = () => {
            files.splice(index, 1);

            if (files.length === 0)
                document.getElementById("compress-button").style.opacity = 0.4;

            updateFileList();
        };

        fileItem.appendChild(deleteButton);
        fileListDiv.appendChild(fileItem);
    });
}

async function compressFiles() {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    for (const file of files) {
        try {
            if (file instanceof File) {
                const compressedFile = await imageCompression(file, options);

                const url = URL.createObjectURL(compressedFile);

                const a = document.createElement('a');
                a.href = url;
                a.download = compressedFile.name;

                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                console.error("Item is not a File:", file);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

document.getElementById('upload-area').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileInputChange);
    fileInput.click();
});


