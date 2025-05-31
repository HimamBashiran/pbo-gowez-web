let selectedBike = null;
let currentRentals = [];
let currentUser = null;

const bikes = {
    1: {
        id: 1,
        name: "LIGHTNING BOLT",
        description: "High-speed electric bike",
        rate: 15000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    2: {
        id: 2,
        name: "THUNDER STRIKE", 
        description: "All-terrain electric bike",
        rate: 18000,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    3: {
        id: 3,
        name: "VOLT RIDER",
        description: "City cruiser electric bike", 
        rate: 12000,
        image: "https://images.unsplash.com/photo-1544191696-15693dc17ba7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        const welcomeSpan = document.querySelector('nav span');
        if (welcomeSpan) {
            welcomeSpan.innerHTML = `Welcome, <span class="text-electric-blue font-semibold">${currentUser.name}</span>`;
        }
    } else {
        showAlert('Please log in to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 2000);
        return;
    }
    
    loadCurrentRentals();
    setupEventListeners();
    setMinDateTime();
});

async function loadCurrentRentals() {
    try {
        console.log(`Loading rentals for user ID: ${currentUser.id}`);
        const response = await fetch(`/api/rentals/user/${currentUser.id}/active`);
        if (response.ok) {
            currentRentals = await response.json();
            console.log('Loaded rentals:', currentRentals); 
        } else {
            console.error('Failed to load rentals, status:', response.status);
            currentRentals = [];
        }
    } catch (error) {
        console.error('Error loading rentals:', error);
        currentRentals = [];
    }
    
    displayCurrentRentals();
}

function displayCurrentRentals() {
    const container = document.getElementById('currentRentals');
    
    if (currentRentals.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">🚲</div>
                <p class="text-gray-400 text-lg">No active rentals</p>
                <p class="text-gray-500">Rent a bike to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = currentRentals.map(rental => `
        <div class="rental-card bg-abstract-dark-2 p-6 rounded-2xl shadow-lg border-b-4 border-electric-blue">
            <div class="flex justify-between items-start mb-4">
                <h4 class="text-lg font-bold text-white">${rental.bike.name}</h4>
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">${rental.status}</span>
            </div>
            <div class="space-y-2 text-gray-300 text-sm">
                <div class="flex justify-between">
                    <span>Rental ID:</span>
                    <span class="text-electric-blue font-mono">${rental.rentalCode}</span>
                </div>
                <div class="flex justify-between">
                    <span>Start:</span>
                    <span>${formatDateTime(rental.startDateTime)}</span>
                </div>
                <div class="flex justify-between">
                    <span>End:</span>
                    <span>${formatDateTime(rental.endDateTime)}</span>
                </div>
                <div class="flex justify-between">
                    <span>Payment:</span>
                    <span class="uppercase">${rental.paymentMethod}</span>
                </div>
                <div class="flex justify-between font-bold text-electric-yellow border-t border-gray-600 pt-2">
                    <span>Total:</span>
                    <span>Rp ${parseInt(rental.totalCost).toLocaleString()}</span>
                </div>
            </div>
            ${rental.status === 'ACTIVE' ? `
                <div class="flex space-x-2 mt-4">
                    <button onclick="updateRental(${rental.id})" class="flex-1 py-2 bg-gradient-to-r from-electric-blue to-electric-purple text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300">
                        UPDATE
                    </button>
                    <button onclick="completeRental(${rental.id})" class="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300">
                        RETURN
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('rentalForm').addEventListener('submit', handleRentalSubmission);
    
    document.getElementById('startDate').addEventListener('change', calculateCost);
    document.getElementById('endDate').addEventListener('change', calculateCost);
    
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-card').forEach(card => {
                card.classList.remove('selected');
            });
            this.nextElementSibling.classList.add('selected');
        });
    });
}

function setMinDateTime() {
    const now = new Date();
    const dateTimeString = now.toISOString().slice(0, 16);
    document.getElementById('startDate').min = dateTimeString;
    document.getElementById('endDate').min = dateTimeString;
}

function selectBike(bikeId) {
    selectedBike = bikes[bikeId];
    if (selectedBike) {
        showRentalModal();
    }
}

function showRentalModal() {
    const modal = document.getElementById('rentalModal');
    const bikeDisplay = document.getElementById('selectedBikeDisplay');
    
    bikeDisplay.innerHTML = `
        <img src="${selectedBike.image}" alt="${selectedBike.name}" class="w-24 h-24 object-cover rounded-lg mx-auto mb-4">
        <h4 class="text-xl font-bold text-white">${selectedBike.name}</h4>
        <p class="text-gray-400">${selectedBike.description}</p>
        <div class="text-lg font-bold text-electric-yellow mt-2">Rp ${selectedBike.rate.toLocaleString()}/hour</div>
    `;
    
    document.getElementById('rentalForm').reset();
    document.getElementById('hourlyRate').textContent = `Rp ${selectedBike.rate.toLocaleString()}`;
    
    document.querySelector('#rentalModal h3').textContent = 'RENT BIKE';
    document.getElementById('rentalForm').removeAttribute('data-update-id');
    
    modal.classList.remove('hidden');
}

function closeRentalModal() {
    const modal = document.getElementById('rentalModal');
    modal.classList.add('hidden');
    selectedBike = null;
}

function calculateCost() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate || !selectedBike) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
        document.getElementById('duration').textContent = 'Invalid dates';
        document.getElementById('totalCost').textContent = 'Rp 0';
        return;
    }
    
    const durationMs = end - start;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const totalCost = durationHours * selectedBike.rate;
    
    document.getElementById('duration').textContent = `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    document.getElementById('totalCost').textContent = `Rp ${totalCost.toLocaleString()}`;
}

async function handleRentalSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const payment = formData.get('payment');
    
    if (!startDate || !endDate || !payment) {
        showAlert('Please fill in all required fields!', 'error');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
        showAlert('End date must be after start date!', 'error');
        return;
    }
    
    const confirmed = await showConfirmationDialog();
    if (!confirmed) return;
    
    try {
        const submitButton = document.querySelector('#rentalForm button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'PROCESSING...';
        submitButton.disabled = true;
        
        const updateId = document.getElementById('rentalForm').getAttribute('data-update-id');
        
        let response;
        if (updateId) {
            response = await fetch(`/api/rentals/${updateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    startDateTime: startDate,
                    endDateTime: endDate,
                    paymentMethod: payment
                })
            });
        } else {
            response = await fetch('/api/rentals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    bikeId: selectedBike.id,
                    startDateTime: startDate,
                    endDateTime: endDate,
                    paymentMethod: payment
                })
            });
        }
        
        if (response.ok) {
            const result = await response.json();
            
            closeRentalModal();
            
            if (updateId) {
                showAlert('Rental updated successfully!', 'success');
            } else {
                showAlert('Rental created successfully!', 'success');
                
                setTimeout(() => {
                    showReceipt(result);
                }, 1500);
            }
            
            await loadCurrentRentals();
        } else {
            const errorData = await response.json();
            showAlert(errorData.message || 'Failed to process rental', 'error');
        }
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        if (updateId) {
            document.getElementById('rentalForm').removeAttribute('data-update-id');
        }
        
    } catch (error) {
        showAlert('Failed to process rental. Please try again.', 'error');
        console.error('Rental processing error:', error);
        
        const submitButton = document.querySelector('#rentalForm button[type="submit"]');
        submitButton.textContent = 'CONFIRM RENTAL';
        submitButton.disabled = false;
    }
}

function showConfirmationDialog() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-abstract-dark-2 rounded-2xl p-8 max-w-md w-full border-t-4 border-electric-yellow">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-4">⚡</div>
                    <h3 class="text-2xl font-bold text-white mb-2">Confirm Rental</h3>
                    <p class="text-gray-400">Are you sure you want to rent this bike?</p>
                </div>
                <div class="bg-abstract-dark p-4 rounded-lg mb-6">
                    <div class="text-center">
                        <h4 class="text-lg font-bold text-white">${selectedBike.name}</h4>
                        <p class="text-gray-400">${selectedBike.description}</p>
                        <div class="text-electric-yellow font-bold mt-2">
                            ${document.getElementById('totalCost').textContent}
                        </div>
                    </div>
                </div>
                <div class="flex space-x-4">
                    <button id="cancelBtn" class="flex-1 py-3 border-2 border-gray-600 text-gray-300 font-bold rounded-lg hover:bg-gray-600 transition-all duration-300">
                        CANCEL
                    </button>
                    <button id="confirmBtn" class="flex-1 py-3 bg-gradient-to-r from-electric-yellow to-electric-blue text-black font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                        YES, RENT IT!
                    </button>
                </div>
            </div>
        `;
        
        const cancelBtn = modal.querySelector('#cancelBtn');
        const confirmBtn = modal.querySelector('#confirmBtn');
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });
        
        confirmBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });
        
        document.body.appendChild(modal);
    });
}

function showReceipt(rental) {
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    
    const duration = Math.ceil((new Date(rental.endDateTime) - new Date(rental.startDateTime)) / (1000 * 60 * 60));
    
    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="text-4xl mb-2">🚲</div>
            <div class="text-sm text-gray-600 font-mono">Receipt #${rental.rentalCode}</div>
            <div class="text-xs text-gray-500">${formatDateTime(rental.createdAt || new Date().toISOString())}</div>
        </div>
        
        <div class="border-t border-b border-gray-300 py-4 space-y-3">
            <div class="flex justify-between">
                <span class="font-semibold">Bike:</span>
                <span>${rental.bike.name}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Start:</span>
                <span class="text-sm">${formatDateTime(rental.startDateTime)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">End:</span>
                <span class="text-sm">${formatDateTime(rental.endDateTime)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Duration:</span>
                <span>${duration} hour${duration > 1 ? 's' : ''}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Rate:</span>
                <span>Rp ${parseInt(rental.hourlyRate).toLocaleString()}/hour</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Payment:</span>
                <span class="uppercase">${rental.paymentMethod}</span>
            </div>
        </div>
        
        <div class="flex justify-between items-center py-4 text-lg font-bold">
            <span>Total Amount:</span>
            <span class="text-blue-600">Rp ${parseInt(rental.totalCost).toLocaleString()}</span>
        </div>
        
        <div class="text-center text-xs text-gray-500 mt-4">
            <p>Thank you for choosing GOWEZ!</p>
            <p>Ride safely and enjoy your journey ⚡</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    modal.classList.add('hidden');
    
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

async function updateRental(rentalId) {
    try {
        const response = await fetch(`/api/rentals/${rentalId}/user/${currentUser.id}`);
        if (!response.ok) {
            showAlert('Failed to load rental details', 'error');
            return;
        }
        
        const rental = await response.json();
        selectedBike = {
            id: rental.bike.id,
            name: rental.bike.name,
            description: rental.bike.description || 'Electric bike',
            rate: parseInt(rental.hourlyRate),
            image: rental.bike.imageUrl || bikes[rental.bike.id]?.image || 'https://via.placeholder.com/300'
        };
        
        document.getElementById('startDate').value = rental.startDateTime.slice(0, 16);
        document.getElementById('endDate').value = rental.endDateTime.slice(0, 16);
        document.querySelector(`input[name="payment"][value="${rental.paymentMethod.toLowerCase()}"]`).checked = true;
        document.querySelector(`input[name="payment"][value="${rental.paymentMethod.toLowerCase()}"]`).dispatchEvent(new Event('change'));
        
        showRentalModal();
        
        document.getElementById('rentalForm').setAttribute('data-update-id', rentalId);
        document.querySelector('#rentalModal h3').textContent = 'UPDATE RENTAL';
        
        calculateCost();
        
    } catch (error) {
        console.error('Error loading rental for update:', error);
        showAlert('Failed to load rental details', 'error');
    }
}

async function completeRental(rentalId) {
    const confirmed = confirm('Are you sure you want to return this bike?');
    if (!confirmed) return;
    
    try {
        const response = await fetch(`/api/rentals/${rentalId}/complete`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showAlert('Bike returned successfully!', 'success');
            await loadCurrentRentals();
        } else {
            const errorData = await response.json();
            showAlert(errorData.message || 'Failed to return bike', 'error');
        }
    } catch (error) {
        console.error('Error completing rental:', error);
        showAlert('Failed to return bike', 'error');
    }
}

function logout() {
    showAlert('Logging out...', 'success');
    setTimeout(() => {
        window.location.href = '../auth/login.html';
    }, 1500);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-500 ${getAlertClasses(type)}`;
    alert.style.transform = 'translateX(100%)';
    alert.style.opacity = '0';
    
    alert.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${getAlertIcon(type)}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0">
                <button class="inline-flex text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
        alert.style.opacity = '1';
    }, 100);
    
    if (type !== 'info') {
        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.transform = 'translateX(100%)';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }
        }, 4000);
    }
}

function getAlertClasses(type) {
    switch (type) {
        case 'success':
            return 'bg-green-600 text-white border border-green-700';
        case 'warning':
            return 'bg-yellow-600 text-white border border-yellow-700';
        case 'error':
            return 'bg-red-600 text-white border border-red-700';
        default:
            return 'bg-blue-600 text-white border border-blue-700';
    }
}

function getAlertIcon(type) {
    switch (type) {
        case 'success':
            return `<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>`;
        case 'warning':
            return `<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>`;
        case 'error':
            return `<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>`;
        default:
            return `<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>`;
    }
}