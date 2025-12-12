// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const mainContent = document.getElementById('mainContent');

// Navigation Functions
function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
}

// Navigation Event Listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        showPage(pageId);
    });
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Patient Registration Functions
document.addEventListener('DOMContentLoaded', function() {
    // Generate Patient ID
    const generatePatientIdBtn = document.getElementById('generatePatientId');
    const patientIdDisplay = document.getElementById('generatedPatientId');
    
    if (generatePatientIdBtn) {
        generatePatientIdBtn.addEventListener('click', function() {
            const timestamp = new Date().getTime().toString().slice(-6);
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const newPatientId = P-`${new Date().getFullYear()}-${timestamp}${randomNum}`;
            patientIdDisplay.textContent = newPatientId;
            
            // Show success message
            showNotification('New Patient ID generated successfully!', 'success');
        });
    }
    
    // Patient Registration Form Submission
    const registrationForm = document.getElementById('patientRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                dob: document.getElementById('dob').value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                emergencyName: document.getElementById('emergencyName').value,
                emergencyRelation: document.getElementById('emergencyRelation').value,
                emergencyPhone: document.getElementById('emergencyPhone').value,
                patientId: patientIdDisplay.textContent
            };
            
            // In a real application, you would send this data to a server
            console.log('Patient registration data:', formData);
            
            // Show success message
            showNotification('Patient registered successfully!', 'success');
            
            // Reset form
            setTimeout(() => {
                registrationForm.reset();
                showPage('dashboard');
            }, 1500);
        });
    }
    
    // Test Orders - Priority Buttons
    const priorityButtons = document.querySelectorAll('.priority-btn');
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            priorityButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Test Orders - Add Test
    const addTestBtn = document.getElementById('addTestBtn');
    if (addTestBtn) {
        addTestBtn.addEventListener('click', function() {
            const testType = document.getElementById('testType').value;
            const priority = document.querySelector('.priority-btn.active').textContent;
            
            if (!testType) {
                showNotification('Please select a test first', 'warning');
                return;
            }
            
            // In a real app, you would add this to a data structure
            console.log(`Adding test: ${testType} with priority: ${priority}`);
            showNotification('Test added to order', 'success');
        });
    }
    
    // Test Orders - Submit Order
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', function() {
            showNotification('Test order submitted successfully!', 'success');
            setTimeout(() => {
                showPage('sample-tracking');
            }, 1000);
        });
    }
    
    // Sample Tracking - Update Status
    const updateStatusBtns = document.querySelectorAll('.sample-actions .btn-small.primary');
    updateStatusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sampleCard = this.closest('.sample-card');
            const sampleId = sampleCard.querySelector('.sample-id strong').textContent;
            document.getElementById('sampleSelect').value = sampleId;
            
            // Show status update form
            document.querySelector('.status-update-form').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Results - Flag Abnormal Values
    const flagAbnormalBtn = document.getElementById('flagAbnormalBtn');
    if (flagAbnormalBtn) {
        flagAbnormalBtn.addEventListener('click', function() {
            const abnormalRows = document.querySelectorAll('.table-row.abnormal');
            abnormalRows.forEach(row => {
                const flagBtn = row.querySelector('.btn-icon');
                flagBtn.classList.add('warning', 'active');
                flagBtn.innerHTML = '<i class="fas fa-flag"></i>';
            });
            
            showNotification('Abnormal values flagged', 'warning');
        });
    }
    
    // Results - Validate Results
    const validateResultsBtn = document.getElementById('validateResultsBtn');
    if (validateResultsBtn) {
        validateResultsBtn.addEventListener('click', function() {
            showNotification('Results validated and saved to medical record', 'success');
        });
    }
    
    // Billing - Record Payment
    const recordPaymentBtn = document.querySelector('.payment-processing .btn-primary');
    if (recordPaymentBtn) {
        recordPaymentBtn.addEventListener('click', function() {
            const amount = document.getElementById('paymentAmount').value;
            const method = document.getElementById('paymentMethod').value;
            
            if (!amount || amount <= 0) {
                showNotification('Please enter a valid payment amount', 'warning');
                return;
            }
            
            // Update UI
            document.querySelector('.amount-due').textContent = '$0.00';
            document.querySelector('.status-unpaid').textContent = 'Paid';
            document.querySelector('.status-unpaid').classList.remove('status-unpaid');
            document.querySelector('.invoice-status .badge').textContent = 'Paid';
            document.querySelector('.invoice-status .badge').className = 'badge success';
            
            showNotification(`Payment of $${amount} recorded successfully (${method})`, 'success');
        });
    }
    
    // Medical Record - Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Access Control - Grant Access Form
    const grantAccessBtn = document.getElementById('grantAccessBtn');
    if (grantAccessBtn) {
        grantAccessBtn.addEventListener('click', function() {
            document.querySelector('.permission-form').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Quick Actions
    const quickActionButtons = document.querySelectorAll('.action-btn');
    quickActionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });
    
    // Footer Links
    const footerLinks = document.querySelectorAll('.footer-section a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            showPage(pageId);
        });
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 15px;
        line-height: 1;
    }
`;
document.head.appendChild(style);

// Initialize the application
showPage('dashboard');