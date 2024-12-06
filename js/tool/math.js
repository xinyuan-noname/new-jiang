export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
};
export function isEven(number) {
	return !(number & 1);
}
export function isOdd(number) {
	return !(!(number & 1));
}
export function getSymbol(str) {
	let symbol;
	// 根据输入字符串的内容，确定并设置符号变量
	if (['减', '-', '减少'].includes(str)) symbol = '-';
	else if (['加', '+', '增加'].includes(str)) symbol = '+';
	else if (['乘', '*', '乘以'].includes(str)) symbol = '*';
	else if (['取模', '%', '模'].includes(str)) symbol = '%';
	return symbol;
}
export function apSum(first, endIndex, difference) {
	const last = first + (endIndex - 1) * difference
	return (first + last) * endIndex / 2
}
export class XJB_Math {
	static "Math_!"(x) {
		if (x < 0) return
		else if (x == 0) return 1
		return x * XJB_Math["Math_!"](x - 1)
	};
	static "Math_f"(n) {
		if (n < 1) return
		else if (n <= 2) return 1
		else {
			var x = 1, y = 1, z
			for (var i = 2; i < n; i++) {
				z = x + y
				y = x
				x = z
			}
			return x
		}
	};
	//算π
	static "Math_doPI"(n) {
		var π = Math.PI, cos = Math.cos
		if (n >= 6111123) return π.toFixed(10)
		return (cos((π / 2) - (π / n)) * n).toFixed(10)
	};
	//算e
	static "Math_doe"(y) {
		var x = 1 + (1 / y)
		if (y > 60028450) return Math.E.toFixed(10)
		/*x^(1+1/x)*/
		return (Math.pow(x, y)).toFixed(10)
	};
	//算Φ
	static "Math_doΦ"(n) {
		/*斐波拉契数列前后两项之比随项数增大，越来越趋近黄金分割*/
		var a = XJB_Math["Math_f"](n)
		var b = XJB_Math["Math_f"](n + 1)
		if (n > 25) return 0.6180339887.toFixed(10)
		return (a / b).toFixed(10)
	};
	static 'randomInt'(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
}
