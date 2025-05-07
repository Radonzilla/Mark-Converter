// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Standard Calculator Elements
const obtainedMarksInput = document.getElementById('obtainedMarks');
const totalMarksInput = document.getElementById('totalMarks');
const targetScaleInput = document.getElementById('targetScale');
const convertedMarkSpan = document.getElementById('convertedMark');
const percentageSpan = document.getElementById('percentage');

// Reverse Calculator Elements
const targetMarksInput = document.getElementById('targetMarks');
const reverseTotalMarksInput = document.getElementById('reverseTotalMarks');
const originalScaleInput = document.getElementById('originalScale');
const requiredMarksSpan = document.getElementById('requiredMarks');
const requiredPercentageSpan = document.getElementById('requiredPercentage');

// Error Elements
const obtainedMarksError = document.getElementById('obtainedMarksError');
const totalMarksError = document.getElementById('totalMarksError');
const targetScaleError = document.getElementById('targetScaleError');
const targetMarksError = document.getElementById('targetMarksError');
const reverseTotalMarksError = document.getElementById('reverseTotalMarksError');
const originalScaleError = document.getElementById('originalScaleError');

// History Elements
const historyList = document.getElementById('historyList');

// Initialize history from localStorage
let conversionHistory = JSON.parse(localStorage.getItem('markConverterHistory')) || [];

// Theme toggle with animation
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    
    // Add animation effect when toggling
    themeToggle.classList.add('toggling');
    setTimeout(() => {
        themeToggle.classList.remove('toggling');
    }, 500);
});

// Load saved theme
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab') + 'Tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Standard Calculator Logic
function calculateStandardConversion() {
    // Reset error messages
    obtainedMarksError.style.display = 'none';
    totalMarksError.style.display = 'none';
    targetScaleError.style.display = 'none';
    
    // Get input values
    const obtainedMarks = parseFloat(obtainedMarksInput.value);
    const totalMarks = parseFloat(totalMarksInput.value);
    const targetScale = parseFloat(targetScaleInput.value);
    
    // Validate inputs
    let isValid = true;
    
    if (isNaN(obtainedMarks) || obtainedMarks < 0) {
        obtainedMarksError.style.display = 'block';
        isValid = false;
    }
    
    if (isNaN(totalMarks) || totalMarks <= 0) {
        totalMarksError.style.display = 'block';
        isValid = false;
    }
    
    if (isNaN(targetScale) || targetScale < 0) {
        targetScaleError.style.display = 'block';
        isValid = false;
    }
    
    // Calculate and display result if inputs are valid
    if (isValid) {
        const percentage = (obtainedMarks / totalMarks) * 100;
        const convertedMark = (obtainedMarks / totalMarks) * targetScale;
        
        convertedMarkSpan.textContent = convertedMark.toFixed(2);
        percentageSpan.textContent = percentage.toFixed(2);
        
        // Add to history
        addToHistory('standard', {
            obtainedMarks,
            totalMarks,
            targetScale,
            convertedMark: convertedMark.toFixed(2),
            percentage: percentage.toFixed(2)
        });
    } else {
        // Reset results if inputs are invalid
        convertedMarkSpan.textContent = '--';
        percentageSpan.textContent = '--';
    }
}

// Reverse Calculator Logic
function calculateReverseConversion() {
    // Reset error messages
    targetMarksError.style.display = 'none';
    reverseTotalMarksError.style.display = 'none';
    originalScaleError.style.display = 'none';
    
    // Get input values
    const targetMarks = parseFloat(targetMarksInput.value);
    const reverseTotalMarks = parseFloat(reverseTotalMarksInput.value);
    const originalScale = parseFloat(originalScaleInput.value);
    
    // Validate inputs
    let isValid = true;
    
    if (isNaN(targetMarks) || targetMarks < 0) {
        targetMarksError.style.display = 'block';
        isValid = false;
    }
    
    if (isNaN(reverseTotalMarks) || reverseTotalMarks <= 0) {
        reverseTotalMarksError.style.display = 'block';
        isValid = false;
    }
    
    if (isNaN(originalScale) || originalScale <= 0) {
        originalScaleError.style.display = 'block';
        isValid = false;
    }
    
    // Calculate and display result if inputs are valid
    if (isValid) {
        const requiredMarks = (targetMarks / reverseTotalMarks) * originalScale;
        const requiredPercentage = (requiredMarks / originalScale) * 100;
        
        requiredMarksSpan.textContent = requiredMarks.toFixed(2);
        requiredPercentageSpan.textContent = requiredPercentage.toFixed(2);
        
        // Add to history
        addToHistory('reverse', {
            targetMarks,
            reverseTotalMarks,
            originalScale,
            requiredMarks: requiredMarks.toFixed(2),
            requiredPercentage: requiredPercentage.toFixed(2)
        });
    } else {
        // Reset results if inputs are invalid
        requiredMarksSpan.textContent = '--';
        requiredPercentageSpan.textContent = '--';
    }
}

// History management
function addToHistory(calculatorType, data) {
    const historyItem = {
        id: Date.now(),
        type: calculatorType,
        data: data,
        timestamp: new Date().toLocaleString()
    };
    
    conversionHistory.unshift(historyItem); // Add to beginning of array
    
    // Keep only the last 5 conversions
    if (conversionHistory.length > 5) {
        conversionHistory = conversionHistory.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('markConverterHistory', JSON.stringify(conversionHistory));
    
    // Update UI
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<p>No conversion history yet</p>';
        return;
    }
    
    conversionHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const historyText = document.createElement('div');
        historyText.className = 'history-text';
        
        if (item.type === 'standard') {
            historyText.innerHTML = `
                <strong>${item.timestamp}</strong><br>
                ${item.data.obtainedMarks} out of ${item.data.totalMarks} 
                → ${item.data.convertedMark} (scale: ${item.data.targetScale})<br>
                Percentage: ${item.data.percentage}%
            `;
        } else {
            historyText.innerHTML = `
                <strong>${item.timestamp}</strong><br>
                To get ${item.data.targetMarks} out of ${item.data.reverseTotalMarks}
                → Need ${item.data.requiredMarks} (scale: ${item.data.originalScale})<br>
                Required Percentage: ${item.data.requiredPercentage}%
            `;
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => deleteHistoryItem(item.id));
        
        historyItem.appendChild(historyText);
        historyItem.appendChild(deleteBtn);
        historyList.appendChild(historyItem);
    });
}

function deleteHistoryItem(id) {
    conversionHistory = conversionHistory.filter(item => item.id !== id);
    localStorage.setItem('markConverterHistory', JSON.stringify(conversionHistory));
    renderHistory();
}

// Event listeners
obtainedMarksInput.addEventListener('input', calculateStandardConversion);
totalMarksInput.addEventListener('input', calculateStandardConversion);
targetScaleInput.addEventListener('input', calculateStandardConversion);

targetMarksInput.addEventListener('input', calculateReverseConversion);
reverseTotalMarksInput.addEventListener('input', calculateReverseConversion);
originalScaleInput.addEventListener('input', calculateReverseConversion);

// Initialize history display
renderHistory();