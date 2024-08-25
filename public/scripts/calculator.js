import * as btn from './btn.js';

export const operations = [
	'+',
	'-',
	'^-',
	'x',
	'/',
	'x10^',
	'P',
	'C',
	'√',
	'^2',
	'^',
	'^-',
	'log_2',
	'ln',
	'exp',
	'cos',
	'sin',
	'tan',
	'log',
	'3_√',
	'!',
	'%',
	'acos',
	'asin',
	'atan',
];

export const precedenceMap = {
	'+': 1,
	'-': 1,
	x: 2,
	'/': 2,
	'%': 2,
	'^': 3,
	'√': 4,
	'3_√': 4,
	'^2': 4,
	'^-': 4,
	log: 4,
	log_2: 4,
	ln: 4,
	sin: 5,
	cos: 5,
	tan: 5,
	asin: 5,
	acos: 5,
	atan: 5,
	exp: 5,
	'!': 6,
};

class Calculator {
	constructor() {
		this.constants = {
			π: Math.PI,
			e: Math.E,
		};
		this.display = btn.display;
		this.currentExpression = '';
		this.isPoweredOn = true;
		this.cursorIndex = 0;
		this.previousValue = 0;
		this.shifted = false;
	}

	isOperator(token) {
		return operations.includes(token);
	}

	precedence(operator) {
		return precedenceMap[operator] || 0;
	}

	infixToPostfix(expression) {
		const output = [];
		const stack = [];
		expression = expression.replace(/π/g, this.constants['π']).replace(/e/g, this.constants['e']);
		const tokens = expression.match(
			/(\d+\.?\d*|\^-|\.\d+|[+\-x/^√!%()]|x10\^|\^2|log_2|ln|exp|cos|sin|tan|log|3_√|[PC]|acos|asin|atan)/g
		);

		for (let token of tokens) {
			if (!isNaN(parseFloat(token))) {
				output.push(token);
			} else if (token in this.constants) {
				output.push(this.constants[token].toString());
			} else if (this.isOperator(token)) {
				while (
					stack.length &&
					stack[stack.length - 1] !== '(' &&
					this.precedence(stack[stack.length - 1]) >= this.precedence(token)
				) {
					output.push(stack.pop());
				}
				stack.push(token);
			} else if (token === '(') {
				stack.push(token);
			} else if (token === ')') {
				while (stack.length && stack[stack.length - 1] !== '(') {
					output.push(stack.pop());
				}
				if (stack[stack.length - 1] === '(') {
					stack.pop(); // Remove the '('
				} else {
					throw new Error('Mismatched parentheses');
				}
			}
		}

		while (stack.length) {
			if (stack[stack.length - 1] === '(' || stack[stack.length - 1] === ')') {
				throw new Error('Mismatched parentheses');
			}
			output.push(stack.pop());
		}

		return output;
	}

	evaluatePostfix(postfixExpression) {
		const stack = [];

		for (let token of postfixExpression) {
			if (!isNaN(parseFloat(token))) {
				stack.push(parseFloat(token));
			} else if (this.isOperator(token)) {
				if (this.isUnaryOperator(token)) {
					const operand = stack.pop();
					stack.push(this.applyUnaryOperation(token, operand));
				} else {
					const b = stack.pop();
					const a = stack.pop();
					stack.push(this.applyBinaryOperation(token, a, b));
				}
			}
		}

		return stack[0];
	}

	isUnaryOperator(operator) {
		return [
			'√',
			'^2',
			'log_2',
			'ln',
			'exp',
			'cos',
			'sin',
			'tan',
			'acos',
			'asin',
			'atan',
			'log',
			'3_√',
			'!',
		].includes(operator);
	}

	applyUnaryOperation(operator, value) {
		switch (operator) {
			case '√':
				return Math.sqrt(value);
			case '^2':
				return Math.pow(value, 2);
			case 'log_2':
				return Math.log2(value);
			case 'ln':
				return Math.log(value);
			case 'exp':
				return Math.exp(value);
			case 'cos':
				return Math.round(Math.cos(value), 3);
			case 'sin':
				return Math.round(Math.sin(value), 3);
			case 'tan':
				return Math.round(Math.tan(value), 3);
			case 'acos':
				return Math.round(Math.acos(value), 3);
			case 'asin':
				return Math.round(Math.asin(value), 3);
			case 'atan':
				return Math.round(Math.atan(value), 3);
			case 'log':
				return Math.log10(value);
			case '3_√':
				return Math.cbrt(value);
			case '!':
				return this.factorial(value);
			default:
				throw new Error('Unknown unary operation');
		}
	}

	applyBinaryOperation(operator, a, b) {
		try {
			switch (operator) {
				case '+':
					return (a || 0) + b;
				case '-':
					return a === undefined ? -b : a - b;
				case '^-':
					return Math.pow(a, -b);
				case 'x':
					return a * b;
				case '/': {
					if (b === 0) throw new Error('Division by zero!');
					return b !== 0 ? a / b : Infinity;
				}
				case 'x10^':
					return a * Math.pow(10, b);
				case '^':
					return Math.pow(a, b);
				case 'C':
					return this.combination(a, b);
				case 'P':
					return this.permutation(a, b);
				case '%':
					return a % b;
				default:
					throw new Error('Unknown binary operation');
			}
		} catch (error) {
			this.handleError(error);
		}
	}

	append(value) {
		if (!this.isPoweredOn) return;
		this.currentExpression =
			this.currentExpression.slice(0, this.cursorIndex) +
			value +
			this.currentExpression.slice(this.cursorIndex);
		this.cursorIndex += String(value).length;
		this.updateDisplay(this.currentExpression);
	}

	calculate() {
		try {
			if (!this.currentExpression) return;
			const postfixExpression = this.infixToPostfix(this.currentExpression);
			const result = this.evaluatePostfix(postfixExpression);
			if (isNaN(result)) throw new Error('Invalid input');
			this.updateDisplay(result.toString());
			this.previousValue = result;
			this.currentExpression = '';
			this.cursorIndex = 0;
		} catch (error) {
			this.handleError(error);
		}
	}

	clear() {
		this.currentExpression = '';
		this.updateDisplay('0');
		this.cursorIndex = 0;
	}

	factorial(num) {
		if (num < 0) throw new Error('Invalid input for factorial');
		if (num === 0) return 1;
		return Array.from({ length: num }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
	}

	combination(n, r) {
		return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
	}

	permutation(n, r) {
		return this.factorial(n) / this.factorial(n - r);
	}

	updateDisplay(content) {
		this.display.value = content;
		this.display.setSelectionRange(this.cursorIndex, this.cursorIndex);
		// set the color of the cursor to the same color as the text
	}

	handleError(err) {
		this.display.style.color = '#521d1d';
		this.currentExpression = '';
		this.updateDisplay('ERROR');
		setTimeout(() => {
			this.display.style.color = '#1a3c10';
			this.clear();
		}, 1000);
		console.error(err.message);
	}

	degreesToRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	radiansToDegrees(radians) {
		return radians * (180 / Math.PI);
	}

	powerOff() {
		this.clear();
		this.isPoweredOn = false;
		this.display.disabled = true;
		this.display.value = '';
	}

	powerOn() {
		this.clear();
		this.isPoweredOn = true;
		this.updateDisplay('0');
		this.display.disabled = false;
	}

	left() {
		if (this.cursorIndex > 0) {
			this.cursorIndex--;
		}
	}

	right() {
		if (this.cursorIndex < this.currentExpression.length) {
			this.cursorIndex++;
		}
	}

	delete() {
		if (!this.display.value) return;

		if (this.display.value.length <= 1) {
			this.currentExpression = '';
			this.updateDisplay('0');
			this.cursorIndex = 0;
			return;
		}

		this.currentExpression =
			this.currentExpression.slice(0, this.cursorIndex - 1) +
			this.currentExpression.slice(this.cursorIndex);
		this.cursorIndex = Math.max(0, this.cursorIndex - 1);
		this.updateDisplay(this.currentExpression || '0');
	}

	abs() {
		this.currentExpression = Math.abs(parseFloat(this.currentExpression)).toString();
		this.updateDisplay(this.currentExpression);
	}

	shift() {
		this.shifted = !this.shifted;
		btn.shift.classList.toggle('active');
		// toggle hidden for sin, cos, tan and their inverses, and ( ) and C P
		const list = [
			btn.sin,
			btn.cos,
			btn.tan,
			btn.asin,
			btn.acos,
			btn.atan,
			btn.lparent,
			btn.rparent,
			btn.c,
			btn.p,
		];
		list.forEach((el) => {
			el.classList.toggle('hidden');
		});
	}

	ans() {
		if (this.previousValue) {
			this.append(this.previousValue.toString());
		}
	}
}

export default Calculator;
