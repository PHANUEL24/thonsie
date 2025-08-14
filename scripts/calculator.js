let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        // Prevent multiple operators in a row
        const lastChar = currentInput[currentInput.length - 1];
        const operators = ['+', '-', '*', '/'];
        
        if (operators.includes(lastChar) && operators.includes(value)) {
            currentInput = currentInput.slice(0, -1) + value;
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Replace × with * for calculation
        let expression = currentInput.replace(/×/g, '*');
        
        // Check for division by zero
        if (expression.includes('/0')) {
            currentInput = 'Error';
            shouldResetDisplay = true;
            updateDisplay();
            return;
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle special cases
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point issues
            currentInput = parseFloat(result.toFixed(10)).toString();
        }
        
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay();