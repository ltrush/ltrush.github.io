// Add event listeners to all download buttons
document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('click', event => {
        const file = button.getAttribute('data-file');
        const downloadName = button.getAttribute('data-download');
        if (file) {
            const link = document.createElement('a');
            link.href = file;
            link.download = downloadName || '';
            link.click();
        }
    });
});