// Legal page tab switching and navigation

// Tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab;

    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab
    button.classList.add('active');
    document.getElementById(`${targetTab}-tab`).classList.add('active');
  });
});

// Close button - close the tab/window
document.getElementById('close-btn').addEventListener('click', () => {
  window.close();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // ESC to close
  if (e.key === 'Escape') {
    window.close();
  }

  // Cmd/Ctrl + W to close
  if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
    e.preventDefault();
    window.close();
  }
});
