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

function toggleAccordion(projectId) {
    const details = document.getElementById(projectId + '-more-info');
    if (details.classList.contains('hidden')) {
      details.classList.remove('hidden');
    } else {
      details.classList.add('hidden');
    }
  }