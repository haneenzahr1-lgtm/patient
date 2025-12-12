// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApplication();
});

function initApplication() {
    // Navigation setup
    setupNavigation();
    
    // Patient list setup
    setupPatientList();
    
    // New patient form setup
    setupNewPatientForm();
    
    // Patient profile setup
    setupPatientProfile();
    
    // Create order setup
    setupCreateOrder();
    
    // Initialize with sample data
    loadSampleData();
}

// Navigation Functions
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const patientProfileLink = document.querySelector('.patient-profile-link');
    const createOrderLink = document.querySelector('.create-order-link');

    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            
            // Show/hide special navigation links
            if (pageId === 'patient-profile') {
                patientProfileLink.classList.remove('hidden');
                createOrderLink.classList.remove('hidden');
            } else if (pageId === 'create-order') {
                patientProfileLink.classList.remove('hidden');
                createOrderLink.classList.remove('hidden');
            } else {
                patientProfileLink.classList.add('hidden');
                createOrderLink.classList.add('hidden');
            }
        });
    });

    // Show page function
    window.showPage = function(pageId) {
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Add active class to current nav link
            const activeLink = document.querySelector(`[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Quick links in footer
    const footerLinks = document.querySelectorAll('.footer-section a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
}

// Patient List Functions
function setupPatientList() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const newPatientBtn = document.getElementById('newPatientBtn');
    const patientsTable = document.getElementById('patientsTable');

    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            searchPatients(searchTerm);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                searchPatients(searchTerm);
            }
        });
    }

    // New Patient button
    if (newPatientBtn) {
        newPatientBtn.addEventListener('click', function() {
            showPage('new-patient');
        });
    }

    // View profile functionality
    if (patientsTable) {
        patientsTable.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-profile-btn')) {
                const patientId = e.target.getAttribute('data-patient-id');
                loadPatientProfile(patientId);
                showPage('patient-profile');
            }
        });
    }
}

function searchPatients(searchTerm) {
    const rows = document.querySelectorAll('#patientsTable tr');
    let found = false;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (searchTerm === '' || text.includes(searchTerm)) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    });

    // Show message if no results
    const messageRow = document.getElementById('noResultsMessage');
    if (!found && searchTerm !== '') {
        if (!messageRow) {
            const newRow = document.createElement('tr');
            newRow.id = 'noResultsMessage';
            newRow.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>No patients found matching "${searchTerm}"</p>
                </td>
            `;
            document.getElementById('patientsTable').appendChild(newRow);
        }
    } else if (messageRow) {
        messageRow.remove();
    }
}

// New Patient Form Functions
function setupNewPatientForm() {
    const patientForm = document.getElementById('patientForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (patientForm) {
        patientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNewPatient();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            showPage('patient-list');
            resetPatientForm();
        });
    }
}

function saveNewPatient() {
    // Get form values
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value.trim(),
        nationalId: document.getElementById('nationalId').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        id: generatePatientId(),
        registrationDate: new Date().toISOString().split('T')[0]
    };

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.gender || 
        !formData.dob || !formData.phone || !formData.nationalId || !formData.address) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    // Save to localStorage
    savePatientToStorage(formData);

    // Show success message
    showNotification('Patient registered successfully!', 'success');

    // Reset form and go to patient list
    setTimeout(() => {
        resetPatientForm();
        showPage('patient-list');
        updatePatientsTable();
    }, 1500);
}

function resetPatientForm() {
    const form = document.getElementById('patientForm');
    if (form) {
        form.reset();
    }
}

function generatePatientId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P-${new Date().getFullYear()}-${timestamp}${randomNum}`;
}

// Patient Profile Functions
function setupPatientProfile() {
    const createOrderBtn = document.getElementById('createOrderBtn');
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Create Order button
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', function() {
            showPage('create-order');
        });
    }

    // Save Notes button
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', function() {
            const notes = document.getElementById('editNotes').value;
            updatePatientNotes(notes);
        });
    }

    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

function loadPatientProfile(patientId) {
    // In a real application, you would fetch this data from a server
    // For now, we'll use sample data
    
    const patient = getPatientById(patientId);
    
    if (patient) {
        // Update patient info in profile
        document.getElementById('patientName').textContent = `${patient.firstName} ${patient.lastName}`;
        document.getElementById('profilePatientId').textContent = `ID: ${patient.id}`;
        document.getElementById('patientAge').textContent = `${calculateAge(patient.dob)} years`;
        document.getElementById('patientPhone').textContent = patient.phone;
        document.getElementById('patientGender').textContent = patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1);
        document.getElementById('lastVisit').textContent = patient.lastVisit || 'No visits yet';
        document.getElementById('patientAddress').textContent = patient.address;
        document.getElementById('nationalIdDisplay').textContent = patient.nationalId;
        document.getElementById('patientNotes').textContent = patient.notes || 'No notes available';
        document.getElementById('editNotes').value = patient.notes || '';
        
        // Update create order page patient info
        document.getElementById('orderPatientInfo').textContent = 
            `Patient: ${patient.firstName} ${patient.lastName} (ID: ${patient.id})`;
        
        // Load patient data for tabs
        loadPatientOrders(patientId);
        loadPatientResults(patientId);
        loadPatientBilling(patientId);
    }
}

function updatePatientNotes(notes) {
    // In a real app, you would save this to the server
    const patientId = document.getElementById('profilePatientId').textContent.split(': ')[1];
    
    // Update display
    document.getElementById('patientNotes').textContent = notes;
    
    showNotification('Patient notes updated successfully!', 'success');
}

// Create Order Functions
function setupCreateOrder() {
    const orderForm = document.getElementById('orderForm');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const priorityBtns = document.querySelectorAll('.priority-btn');

    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewOrder();
        });
    }

    // Cancel button
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', function() {
            showPage('patient-profile');
            resetOrderForm();
        });
    }

    // Priority buttons
    priorityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            priorityBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('priority').value = this.getAttribute('data-value');
        });
    });
}

function createNewOrder() {
    const patientId = document.getElementById('profilePatientId').textContent.split(': ')[1];
    const selectedTests = Array.from(document.querySelectorAll('.test-item input:checked'))
        .map(input => input.value);
    const priority = document.getElementById('priority').value;
    const sampleType = document.getElementById('sampleType').value;
    const instructions = document.getElementById('instructions').value;

    // Validate
    if (selectedTests.length === 0) {
        showNotification('Please select at least one test', 'error');
        return;
    }

    if (!sampleType) {
        showNotification('Please select sample type', 'error');
        return;
    }

    // Create order object
    const order = {
        orderId: generateOrderId(),
        patientId: patientId,
        tests: selectedTests,
        priority: priority,
        sampleType: sampleType,
        instructions: instructions,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        amount: calculateOrderAmount(selectedTests)
    };

    // Save order (in real app, send to server)
    saveOrderToStorage(order);

    showNotification('Order created successfully!', 'success');

    // Reset form and go back to profile
    setTimeout(() => {
        resetOrderForm();
        showPage('patient-profile');
        loadPatientOrders(patientId);
    }, 1500);
}

function resetOrderForm() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.reset();
        // Reset priority buttons
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.priority-btn[data-value="routine"]').classList.add('active');
        document.getElementById('priority').value = 'routine';
    }
}

function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${new Date().getFullYear()}-${timestamp}${randomNum}`;
}

function calculateOrderAmount(tests) {
    const testPrices = {
        cbc: 50,
        lipid: 100,
        liver: 120,
        kidney: 120,
        urinalysis: 40,
        glucose: 30,
        thyroid: 150
    };
    
    return tests.reduce((total, test) => total + (testPrices[test] || 0), 0);
}

// Data Loading Functions
function loadSampleData() {
    // Sample patients data
    const samplePatients = [
        {
            id: "P-2024-001",
            firstName: "John",
            lastName: "Doe",
            gender: "male",
            dob: "1992-05-15",
            phone: "+1 (555) 123-4567",
            nationalId: "123456789",
            address: "123 Main Street, New York, NY 10001",
            notes: "Patient has mild anemia. Recommended iron supplements.",
            lastVisit: "2024-03-15"
        },
        {
            id: "P-2024-002",
            firstName: "Jane",
            lastName: "Smith",
            gender: "female",
            dob: "1988-08-22",
            phone: "+1 (555) 987-6543",
            nationalId: "987654321",
            address: "456 Oak Avenue, Los Angeles, CA 90001",
            notes: "Annual check-up completed. All tests normal.",
            lastVisit: "2024-03-10"
        },
        {
            id: "P-2024-003",
            firstName: "Robert",
            lastName: "Johnson",
            gender: "male",
            dob: "1975-12-10",
            phone: "+1 (555) 456-7890",
            nationalId: "456789123",
            address: "789 Pine Road, Chicago, IL 60601",
            notes: "Diabetes monitoring. Next appointment in 3 months.",
            lastVisit: "2024-03-05"
        },
        {
            id: "P-2024-004",
            firstName: "Sarah",
            lastName: "Williams",
            gender: "female",
            dob: "1995-03-28",
            phone: "+1 (555) 789-0123",
            nationalId: "789123456",
            address: "321 Maple Lane, Houston, TX 77001",
            notes: "Pregnant - first trimester. Regular monitoring needed.",
            lastVisit: "2024-02-28"
        },
        {
            id: "P-2024-005",
            firstName: "Michael",
            lastName: "Brown",
            gender: "male",
            dob: "1980-11-03",
            phone: "+1 (555) 234-5678",
            nationalId: "234567891",
            address: "654 Cedar Street, Phoenix, AZ 85001",
            notes: "High cholesterol. On medication.",
            lastVisit: "2024-02-25"
        }
    ];

    // Save sample patients to localStorage
    samplePatients.forEach(patient => {
        savePatientToStorage(patient);
    });

    // Update patients table
    updatePatientsTable();
}

function updatePatientsTable() {
    const patients = getPatientsFromStorage();
    const tableBody = document.getElementById('patientsTable');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        patients.forEach(patient => {
            const billingStatus = Math.random() > 0.5 ? 'Paid' : 'Unpaid';
            const statusClass = billingStatus === 'Paid' ? 'status-paid' : 'status-unpaid';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.phone}</td>
                <td>${patient.lastVisit || 'No visits'}</td>
                <td><span class="status-badge ${statusClass}">${billingStatus}</span></td>
                <td>
                    <button class="btn-primary view-profile-btn" data-patient-id="${patient.id}">
                        <i class="fas fa-eye"></i> View Profile
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function loadPatientOrders(patientId) {
    const ordersTable = document.getElementById('ordersTable');
    if (ordersTable) {
        // Sample orders data
        const orders = [
            {
                orderId: "ORD-2024-001",
                tests: ["CBC", "Lipid Profile"],
                status: "Completed",
                amount: "$150.00",
                date: "2024-03-15"
            },
            {
                orderId: "ORD-2024-002",
                tests: ["Liver Function Test"],
                status: "In Progress",
                amount: "$120.00",
                date: "2024-03-10"
            },
            {
                orderId: "ORD-2023-015",
                tests: ["Urinalysis", "Glucose Test"],
                status: "Completed",
                amount: "$70.00",
                date: "2023-12-20"
            }
        ];
        
        ordersTable.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.tests.join(', ')}</td>
                <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
                <td>${order.amount}</td>
                <td>
                    <button class="btn-primary btn-sm">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            ordersTable.appendChild(row);
        });
    }
}

function loadPatientResults(patientId) {
    const resultsTable = document.getElementById('resultsTable');
    if (resultsTable) {
        // Sample results data
        const results = [
            {
                orderId: "ORD-2024-001",
                date: "2024-03-15",
                testName: "Complete Blood Count",
                status: "Finalized"
            },
            {
                orderId: "ORD-2024-001",
                date: "2024-03-15",
                testName: "Lipid Profile",
                status: "Finalized"
            },
            {
                orderId: "ORD-2023-015",
                date: "2023-12-20",
                testName: "Urinalysis",
                status: "Finalized"
            }
        ];
        
        resultsTable.innerHTML = '';
        
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.orderId}</td>
                <td>${result.date}</td>
                <td>${result.testName}</td>
                <td><span class="status-badge status-success">${result.status}</span></td>
                <td>
                    <button class="btn-primary btn-sm">
                        <i class="fas fa-file-pdf"></i> View Report
                    </button>
                </td>
            `;
            resultsTable.appendChild(row);
        });
    }
}

function loadPatientBilling(patientId) {
    const billingTable = document.getElementById('billingTable');
    if (billingTable) {
        // Sample billing data
        const billing = [
            {
                orderId: "ORD-2024-001",
                amount: "$150.00",
                date: "2024-03-15",
                status: "Paid"
            },
            {
                orderId: "ORD-2024-002",
                amount: "$120.00",
                date: "2024-03-10",
                status: "Pending"
            },
            {
                orderId: "ORD-2023-015",
                amount: "$70.00",
                date: "2023-12-20",
                status: "Paid"
            }
        ];
        
        billingTable.innerHTML = '';
        
        billing.forEach(bill => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.orderId}</td>
                <td>${bill.amount}</td>
                <td>${bill.date}</td>
                <td><span class="status-badge ${bill.status === 'Paid' ? 'status-paid' : 'status-pending'}">${bill.status}</span></td>
            `;
            billingTable.appendChild(row);
        });
    }
}

// Helper Functions
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'completed': return 'status-success';
        case 'in progress': return 'status-warning';
        case 'pending': return 'status-pending';
        default: return 'status-info';
    }
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function getPatientById(patientId) {
    const patients = getPatientsFromStorage();
    return patients.find(patient => patient.id === patientId);
}

// LocalStorage Functions
function savePatientToStorage(patient) {
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // Check if patient already exists
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    
    if (existingIndex >= 0) {
        patients[existingIndex] = patient;
    } else {
        patients.push(patient);
    }
    
    localStorage.setItem('patients', JSON.stringify(patients));
}

function getPatientsFromStorage() {
    return JSON.parse(localStorage.getItem('patients')) || [];
}

function saveOrderToStorage(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

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
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
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

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .notification-message {
        flex: 1;
    }
    
    .status-success {
        background-color: #d4edda;
        color: #155724;
    }
    
    .status-warning {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .status-info {
        background-color: #d1ecf1;
        color: #0c5460;
    }
    
    .btn-sm {
        padding: 6px 12px;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(notificationStyles);