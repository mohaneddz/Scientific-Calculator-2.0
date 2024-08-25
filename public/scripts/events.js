import * as btn from './btn.js';
import calc from './calculator.js';

const calculator = new calc();

// Event delegation
document.querySelector('.calc').addEventListener('click', (event) => {
	const target = event.target;

	switch (target) {
		case btn.off:
			calculator.powerOff();
			break;
		case btn.on:
			calculator.powerOn();
			break;
		case btn.left:
			calculator.left();
			break;
		case btn.right:
			calculator.right();
			break;
		case btn.shift:
			calculator.shift();
			break;
		case btn.equal:
			calculator.calculate();
			break;
		case btn.sroot:
			calculator.append('√');
			break;
		case btn.ab:
			calculator.append('/');
			break;
		case btn.powerMinus:
			calculator.append('^-');
			break;
		case btn.power:
			calculator.append('^');
			break;
		case btn.power2:
			calculator.append('^2');
			break;
		case btn.log2:
			calculator.append('log_2');
			break;
		case btn.ln:
			calculator.append('ln');
			break;
		case btn.e:
			calculator.append('e');
			break;
		case btn.exp:
			calculator.append('exp');
			break;
		case btn.cos:
			calculator.append('cos');
			break;
		case btn.sin:
			calculator.append('sin');
			break;
		case btn.tan:
			calculator.append('tan');
			break;
		case btn.log:
			calculator.append('log');
			break;
		case btn.root3:
			calculator.append('3_√');
			break;
		case btn.factorial:
			calculator.append('!');
			break;
		case btn.mod:
			calculator.append('%');
			break;
		case btn.abs:
			calculator.abs();
			break;
		case btn.clear:
			calculator.clear();
			break;
		case btn.p:
			calculator.append('P');
			break;
		case btn.c:
			calculator.append('C');
			break;
		case btn.zero:
			calculator.append(0);
			break;
		case btn.one:
			calculator.append(1);
			break;
		case btn.two:
			calculator.append(2);
			break;
		case btn.three:
			calculator.append(3);
			break;
		case btn.four:
			calculator.append(4);
			break;
		case btn.five:
			calculator.append(5);
			break;
		case btn.six:
			calculator.append(6);
			break;
		case btn.seven:
			calculator.append(7);
			break;
		case btn.eight:
			calculator.append(8);
			break;
		case btn.nine:
			calculator.append(9);
			break;
		case btn.dot:
			calculator.append('.');
			break;
		case btn.plus:
			calculator.append('+');
			break;
		case btn.minus:
			calculator.append('-');
			break;
		case btn.times:
			calculator.append('x');
			break;
		case btn.divide:
			calculator.append('/');
			break;
		case btn.x10:
			calculator.append('x10^');
			break;
		case btn.pie:
			calculator.append('π');
			break;
		case btn.sq2:
			calculator.append(`√2`);
			break;
		case btn.del:
			calculator.delete();
			break;
		case btn.ans:
			calculator.ans();
			break;
		case btn.lparent:
			calculator.append('(');
			break;
		case btn.rparent:
			calculator.append(')');
			break;
		case btn.acos:
			calculator.append('acos');
			break;
		case btn.asin:
			calculator.append('asin');
			break;
		case btn.atan:
			calculator.append('atan');
		break;
		default:
			break;
	}
});
