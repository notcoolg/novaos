// Calculator Application
const CalculatorApp = {
    name: 'calculator',
    title: 'Calculator',
    icon: '🔢',

    createContent() {
        return `
            <div class="calculator-display" id="calc-display">0</div>
            <div class="calculator-buttons" id="calc-buttons">
                <button class="calc-btn" data-value="7">7</button>
                <button class="calc-btn" data-value="8">8</button>
                <button class="calc-btn" data-value="9">9</button>
                <button class="calc-btn operator" data-value="/">÷</button>
                <button class="calc-btn" data-value="4">4</button>
                <button class="calc-btn" data-value="5">5</button>
                <button class="calc-btn" data-value="6">6</button>
                <button class="calc-btn operator" data-value="*">×</button>
                <button class="calc-btn" data-value="1">1</button>
                <button class="calc-btn" data-value="2">2</button>
                <button class="calc-btn" data-value="3">3</button>
                <button class="calc-btn operator" data-value="-">−</button>
                <button class="calc-btn" data-value="0">0</button>
                <button class="calc-btn" data-value=".">.</button>
                <button class="calc-btn operator" data-value="=">=</button>
                <button class="calc-btn operator" data-value="+">+</button>
            </div>
            <button class="calc-btn" data-value="C" style="margin-top: 10px; grid-column: 1 / -1;">Clear</button>
        `;
    },

    init(windowEl, os) {
        let currentValue = '0';
        let previousValue = null;
        let operation = null;

        const display = windowEl.querySelector('#calc-display');
        const buttons = windowEl.querySelectorAll('.calc-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;

                if (value === 'C') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    display.textContent = currentValue;
                } else if (['+', '-', '*', '/'].includes(value)) {
                    if (previousValue !== null && operation !== null) {
                        currentValue = this.calculate(previousValue, currentValue, operation);
                        display.textContent = currentValue;
                    }
                    previousValue = currentValue;
                    currentValue = '0';
                    operation = value;
                } else if (value === '=') {
                    if (previousValue !== null && operation !== null) {
                        currentValue = this.calculate(previousValue, currentValue, operation);
                        display.textContent = currentValue;
                        previousValue = null;
                        operation = null;
                    }
                } else {
                    if (currentValue === '0' && value !== '.') {
                        currentValue = value;
                    } else {
                        currentValue += value;
                    }
                    display.textContent = currentValue;
                }
            });
        });
    },

    calculate(a, b, op) {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);

        switch(op) {
            case '+': return String(num1 + num2);
            case '-': return String(num1 - num2);
            case '*': return String(num1 * num2);
            case '/': return String(num1 / num2);
            default: return b;
        }
    }
};
