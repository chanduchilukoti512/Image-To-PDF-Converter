document.getElementById('convertBtn').addEventListener('click', function () {
    const inputFile = document.getElementById('imageInput');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show the spinner (processing symbol)
    loadingSpinner.style.display = 'inline-block';

    if (inputFile.files && inputFile.files.length > 0) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        let imageCount = 0;  // Track the number of images processed

        Array.from(inputFile.files).forEach((file, index) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            img.onload = function () {
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Calculate PDF page size (8.5 x 11 inches at 72 DPI)
                const pdfWidth = 210;  // A4 paper width in mm (210mm)
                const pdfHeight = 297; // A4 paper height in mm (297mm)

                // Adjust the image size to fit within the PDF page
                let imgScaledWidth = pdfWidth;
                let imgScaledHeight = (imgHeight * pdfWidth) / imgWidth;

                // If the scaled height exceeds the PDF page height, adjust the width
                if (imgScaledHeight > pdfHeight) {
                    imgScaledHeight = pdfHeight;
                    imgScaledWidth = (imgWidth * pdfHeight) / imgHeight;
                }

                if (index > 0) {
                    pdf.addPage();  // Add a new page for every image except the first one
                }

                // Draw the image onto the PDF with the calculated width and height
                pdf.addImage(img, 'JPEG', 0, 0, imgScaledWidth, imgScaledHeight);

                imageCount++;

                // If all images are processed, hide the spinner and save the PDF
                if (imageCount === inputFile.files.length) {
                    loadingSpinner.style.display = 'none';
                    pdf.save('converted_images.pdf');
                }
            };
        });
    } else {
        alert('Please select at least one image.');
        loadingSpinner.style.display = 'none'; // Hide spinner if no image selected
    }
});
