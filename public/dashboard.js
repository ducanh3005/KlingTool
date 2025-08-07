document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const savedEmail = localStorage.getItem('kling_email');
    if (!savedEmail) {
        // Redirect to login if no saved email
        window.location.href = '/';
        return;
    }

    // Display user email
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) {
        userEmailElement.textContent = savedEmail;
    }

    // Video generator functionality
    window.openVideoGenerator = function() {
        showVideoGeneratorModal();
    };

    // Add smooth animations for dashboard elements
    const dashboardElements = document.querySelectorAll('.tool-card, .recent-activity');
    dashboardElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// Logout function
function logout() {
    // Clear stored data
    localStorage.removeItem('kling_email');
    
    // Show logout message
    showNotification('Logging out...', 'success');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// Show video generator modal
function showVideoGeneratorModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Batch Video Generator</h3>
                <button class="close-btn" onclick="closeVideoModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="upload-section">
                    <div class="file-upload-area" id="fileUploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h4>Upload CSV/Excel File</h4>
                        <p>Drag and drop your file here or click to browse</p>
                        <p class="file-format">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                        <input type="file" id="csvFile" accept=".csv,.xlsx,.xls" style="display: none;">
                        <button class="browse-btn" onclick="document.getElementById('csvFile').click()">Browse Files</button>
                    </div>
                    <div class="file-info" id="fileInfo" style="display: none;">
                        <div class="file-details">
                            <i class="fas fa-file-csv"></i>
                            <div class="file-text">
                                <span class="file-name" id="fileName"></span>
                                <span class="file-size" id="fileSize"></span>
                            </div>
                            <button class="remove-file" onclick="removeFile()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="csv-preview" id="csvPreview" style="display: none;">
                    <h4>File Preview</h4>
                    <div class="preview-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Prompt</th>
                                    <th>Image URL</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="previewTableBody">
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="form-group">
                    <label for="videoDuration">Default Duration (seconds)</label>
                    <select id="videoDuration">
                        <option value="10">10 seconds</option>
                        <option value="15">15 seconds</option>
                        <option value="30" selected>30 seconds</option>
                        <option value="60">60 seconds</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="videoStyle">Default Style</label>
                    <select id="videoStyle">
                        <option value="realistic">Realistic</option>
                        <option value="artistic">Artistic</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="cinematic">Cinematic</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="videoQuality">Default Quality</label>
                    <select id="videoQuality">
                        <option value="720p">720p</option>
                        <option value="1080p" selected>1080p</option>
                        <option value="4k">4K</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" onclick="closeVideoModal()">Cancel</button>
                <button class="generate-btn" id="generateBtn" onclick="processBatchVideo()" disabled>
                    <i class="fas fa-play"></i>
                    Process Batch
                </button>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Add file upload event listeners
    setupFileUpload();
}

// Close video modal
function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Setup file upload functionality
function setupFileUpload() {
    const fileInput = document.getElementById('csvFile');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    // File input change event
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });
}

// Handle file selection
function handleFileSelect() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        showNotification('Please select a valid CSV or Excel file', 'error');
        return;
    }
    
    // Show file info
    showFileInfo(file);
    
    // Preview CSV content
    previewCSVFile(file);
}

// Show file information
function showFileInfo(file) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    fileUploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
}

// Remove file
function removeFile() {
    const fileInput = document.getElementById('csvFile');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const csvPreview = document.getElementById('csvPreview');
    const generateBtn = document.getElementById('generateBtn');
    
    fileInput.value = '';
    fileUploadArea.style.display = 'block';
    fileInfo.style.display = 'none';
    csvPreview.style.display = 'none';
    generateBtn.disabled = true;
}

// Preview CSV file content
function previewCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
            showNotification('CSV file must have at least a header row and one data row', 'error');
            removeFile();
            return;
        }
        
        const headers = lines[0].split(',').map(header => header.trim());
        console.log('Headers found:', headers); // Debug log
        
        // Validate headers
        if (!headers.includes('prompt') || !headers.includes('image')) {
            showNotification('CSV file must contain "prompt" and "image" columns. Found: ' + headers.join(', '), 'error');
            removeFile();
            return;
        }
        
        // Show preview
        showCSVPreview(lines.slice(1, 6)); // Show first 5 rows
        document.getElementById('generateBtn').disabled = false;
    };
    reader.readAsText(file);
}

// Show CSV preview
function showCSVPreview(lines) {
    const csvPreview = document.getElementById('csvPreview');
    const previewTableBody = document.getElementById('previewTableBody');
    
    previewTableBody.innerHTML = '';
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            const columns = line.split(',').map(col => col.trim());
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${columns[0] || ''}</td>
                <td>${columns[1] || ''}</td>
                <td><span class="status pending">Pending</span></td>
            `;
            previewTableBody.appendChild(row);
        }
    });
    
    csvPreview.style.display = 'block';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Process batch video generation
function processBatchVideo() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Please select a file first', 'error');
        return;
    }
    
    const generateBtn = document.getElementById('generateBtn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    generateBtn.disabled = true;
    
    // Show progress modal
    showProgressModal();
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload and process
    fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(`Successfully processed ${data.successful} images, ${data.failed} failed`, 'success');
            closeProgressModal();
            showBatchResults(data.data);
            closeVideoModal();
        } else {
            showNotification(data.error || 'Failed to process file', 'error');
            closeProgressModal();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Network error occurred', 'error');
        closeProgressModal();
    })
    .finally(() => {
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    });
}

// Show progress modal
function showProgressModal() {
    const modal = document.createElement('div');
    modal.className = 'progress-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Processing Images</h3>
            </div>
            <div class="modal-body">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Uploading images to Kling server...</div>
                </div>
                <div class="processing-steps">
                    <div class="step active">
                        <i class="fas fa-upload"></i>
                        <span>Uploading CSV file</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-image"></i>
                        <span>Processing images</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-check"></i>
                        <span>Complete</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Animate progress bar
    setTimeout(() => {
        const progressFill = modal.querySelector('.progress-fill');
        progressFill.style.width = '100%';
    }, 500);
}

// Close progress modal
function closeProgressModal() {
    const modal = document.querySelector('.progress-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Show batch results
function showBatchResults(results) {
    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Batch Processing Results</h3>
                <button class="close-btn" onclick="closeResultsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="results-summary">
                    <div class="summary-item">
                        <span class="label">Total:</span>
                        <span class="value">${results.length}</span>
                    </div>
                    <div class="summary-item success">
                        <span class="label">Successful:</span>
                        <span class="value">${results.filter(r => r.status === 'success').length}</span>
                    </div>
                    <div class="summary-item error">
                        <span class="label">Failed:</span>
                        <span class="value">${results.filter(r => r.status === 'failed').length}</span>
                    </div>
                </div>
                <div class="results-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prompt</th>
                                <th>Original Image</th>
                                <th>Kling Image</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(result => `
                                <tr class="${result.status}">
                                    <td>${result.prompt}</td>
                                    <td><a href="${result.originalImage}" target="_blank">View</a></td>
                                    <td>${result.klingImageUrl ? `<a href="${result.klingImageUrl}" target="_blank">View</a>` : 'N/A'}</td>
                                    <td><span class="status ${result.status}">${result.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button class="close-btn" onclick="closeResultsModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

// Close results modal
function closeResultsModal() {
    const modal = document.querySelector('.results-modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Add to recent activity
function addToRecentActivity(action, details) {
    const activityList = document.querySelector('.activity-list');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <i class="fas fa-video"></i>
        <span>${action}: ${details.substring(0, 50)}${details.length > 50 ? '...' : ''}</span>
        <span class="activity-time">Just now</span>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

// Get notification color
function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#38a169';
        case 'error':
            return '#e53e3e';
        case 'warning':
            return '#d69e2e';
        default:
            return '#667eea';
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + L to logout
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        logout();
    }
    
    // Escape to close any open modals (if any)
    if (e.key === 'Escape') {
        // Close any open modals here
    }
});

// Add tool card hover effects
const toolCards = document.querySelectorAll('.tool-card');
toolCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add activity timestamp updates
function updateActivityTime() {
    const activityTime = document.querySelector('.activity-time');
    if (activityTime) {
        const now = new Date();
        const loginTime = new Date(now.getTime() - 5000); // 5 seconds ago
        const diff = Math.floor((now - loginTime) / 1000);
        
        if (diff < 60) {
            activityTime.textContent = `${diff} seconds ago`;
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            activityTime.textContent = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            const hours = Math.floor(diff / 3600);
            activityTime.textContent = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
    }
}

// Update activity time every minute
setInterval(updateActivityTime, 60000);
updateActivityTime(); // Initial update 