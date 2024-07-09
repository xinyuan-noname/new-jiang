export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
};
export function isEven(number) {
    return !(number & 1);
}
export function isOdd(number) {
    return !(!(number & 1));
}
/**
 * 根据输入字符串获取相应的运算符符号。
 * @param {string} str - 表示运算符的字符串。
 * @returns {string|undefined} 返回对应的运算符符号，如果输入字符串不匹配任何已知运算符，则返回 undefined。
 */
export function getSymbol(str) {
    let symbol;
    // 根据输入字符串的内容，确定并设置符号变量
    if (['减', '-', '减少'].includes(str)) symbol = '-';
    else if (['加', '+', '增加'].includes(str)) symbol = '+';
    else if (['乘', '*', '乘以'].includes(str)) symbol = '*';
    else if (['取模', '%', '模'].includes(str)) symbol = '%';
    return symbol;
}
window.XJB_LOAD_MATH = function (_status, lib, game, ui, get, ai) {
    lib._xjb = {
        usuallyUsedString: {
            Point: `
           class Point{
           constructor(){
              this.cartesian=[0,0];
              this.polar=[0,0];
           }
           magnitude(x,y){
              return Math.sqrt(x**2+y**2)
           }
           dotProduct(...target){
              return (target[0]*this.cartesian[0]+target[1]*this.cartesian[1])
           }
           setCartesian(x,y){
              const magnitude=this.magnitude(x,y)
              this.cartesian=[x,y]
              this.polar=[magnitude,Math.atan2(y,x)]
              return this
           }
           setPolar(m,a){
              this.polar=[m,a]
              this.cartesian=[m*(cos(a)),m*(sin(a))]
              return this
           }
           translate(...previousCoordinate){
              let newCoordinate
              newCoordinate=this.cartesian.map((item,index)=>{
                  return item+previousCoordinate[index]
              })
              this.setCartesian(...newCoordinate)
              return this
           }
           project(...target){
              let product=this.dotProduct(...target),magnitude=this.magnitude(...target)
              let newCoordinate
              newCoordinate=this.cartesian.map((item,index)=>{
                  return (product/(magnitude**2))*target[index]
              })
              this.setCartesian(...newCoordinate)
              return this
           }
           multiply(a,b){
              let x=this.cartesian[0];
              let y=this.cartesian[1];
              let newX=x*a-y*b
              let newY=x*b+a*y
              let newCoordinate=[newX,newY]
              this.setCartesian(...newCoordinate)
              return this
           }
           beDividedBy(a,b){
              let x=this.cartesian[0];
              let y=this.cartesian[1];
              let m=a*a+b*b
              let newX=(x*a+y*b)/m
              let newY=(-x*b+a*y)/m
              let newCoordinate=[newX,newY]
              this.setCartesian(...newCoordinate)
              return this
           }
           symmetry(A,B,C=0){
              let x=this.cartesian[0];
              let y=this.cartesian[1];
              let k=(A*x+B*y+C)/(A*A+B*B)
              let newX=-2*A*k+x
              let newY=-2*B*k+y
              let newCoordinate=[newX,newY]
              this.setCartesian(...newCoordinate)
              return this
           }
           
        };
        const cartesian=function(x=0,y=0){
            return new Point().setCartesian(x,y)
        };
        const polar=function(m=0,a=0){
            return new Point().setPolar(m,a)
        };
           `,
            Math: `const PI=Math.PI,e=Math.E
               //定义三角函数
               const tan=Math.tan,cos=Math.cos,sin=Math.sin;
               const sec=function(x){
                  return 1/cos(x)
               }
               const cot=function(x){
                  return 1/tan(x)
               }
               const csc=function(x){
                  return 1/sin(x)
               }
               //定义反三角函数
               const arctan=Math.atan,arcsin=Math.asin,arccos=Math.acos;
               const arccot=function(x){
                  return arctan(1/x)
               }
               const arcsec=function(x){
                  return arccos(1/x)
               }
               const arccsc=function(x){
                  return arcsin(1/x)
               }
               //定义指对函数
               const ln=Math.log,exp=Math.exp
               const log=function(a,x){
                   return ln(x)/ln(a)
               }                       
               //正态分布函数
               const ND=function(x,S,E){
                   let a=((2*PI)**(1/2))*S
                   let b=(x-E)**2
                   let c=-(2*(S**2))
                   return (1/a)*exp(b/c)
               }
               //斯特林公式
               const Stirling=function(x){
                   const a=(2*PI*x)**(1/2)
                   const b=(x/e)**x
                   return a*b
               }
               //取模函数
               const mod=function(x,a){
                   return x%a
               }
               //求和函数
               const sum=function(...toDispose){
                   return toDispose.reduce((acc,cur)=>acc+cur,0)
               }
               //求积函数
               const product=function(...toDispose){
                   return toDispose.reduce((acc,cur)=>acc*cur,1)
               }
               //均值函数
               const ave=function(...toDispose){
                   return sum(...toDispose)/(toDispose.length)
               }
               //最值函数
               const max=Math.max,min=Math.min
               //极差函数
               const range=function(...toDispose){
                   return max(...toDispose)-min(...toDispose)
               }
               //
               const abs=Math.abs,Gause=Math.floor;
               
               `,
            PI: String.fromCharCode(960),
            deg: String.fromCharCode(176),
        },
        StringDispose: {
            //用于捕获变量
            VarTest(testString) {
                let regexp = /(?<=(var|let|const)\s+)([a-z]+[0-9]{0,1})/g
                let list = []
                while ((match = regexp.exec(testString)) != null) {
                    list.push(...match.slice(1))
                }
                return list
            },
            //用于捕获分母
            DenominatorGet(testString) {
                let regexp = /[0-9]+\/([0-9]+)/
                let result = regexp.exec(testString)
                return parseInt(result ? result[1] : 1)
            },
            //
            disposeSpecialCharacter(testString) {
                let result = testString.replace(/π/g, "PI")
                result = result.replace(/°/g, "*(PI/180)")
                return result
            },
            anaDuncStringDispose(testString) {
                let AnaFun = this.disposeSpecialCharacter(testString)
                AnaFun = AnaFun.replace(/\^/ig, "**")
                AnaFun = AnaFun.replace(/([0-9\.]+|PI|e|x)%/ig, function (match, p) {
                    return "(" + p + "*0.01)"
                })
                AnaFun = AnaFun.replace(/([0-9\.]+|PI|e|x)*(sin|cos|tan|csc|sec|cot|arcsin|arccos|arctan|arccsc|arcsec|arccot|exp|ln|Gause|Stirling|abs|mod)x/g, function (match, p1, p2) {
                    return (p1 ? p1 + "*" : "") + p2 + "(x)"
                })
                AnaFun = AnaFun.replace(/log([0-9\.]+|PI|e)x/ig, function (match, p) {
                    return "log(" + p + ",x)"
                })
                AnaFun = AnaFun.replace(/([0-9\.]+|PI|e)x/ig, function (match, p) {
                    return "(" + p + "*x)"
                })
                return AnaFun;
            },
            shiftingTerms(toDispose, term) {
                let strEquation = toDispose, matchStr = "";
                let tempStr = strEquation.replace(/.*\=/, "");
                let regexp = (`(\-|\+){0,1}[0-9][0-9\.\/]*${term}`, "g");
                tempStr = tempStr.replace(regexp, function (match, p) {
                    if (p == "" || p == "+") matchStr += `-${match.replace("+", "")}`;
                    if (p == "-") matchStr += `+${match.replace("-", "")}`;
                    return "";
                });
                if (tempStr == "") tempStr = "0";
                strEquation = strEquation.replace(/\=.*/, "") + matchStr + "=" + tempStr;
                return strEquation
            },
            disposeEandPI(toDispose) {
                return toDispose.replace(/([0-9]*)(E|PI)/gi, function (match, p1, p2) {
                    return (p1 || 1) * Math[p2.toUpperCase()]
                });
            }
        }
    };
    //阶乘
    lib._xjb["Math_!"] = function (x) {
        if (x < 0) return
        else if (x == 0) return 1
        return x * this["Math_!"](x - 1)
    };
    //兔子数列
    lib._xjb["Math_f"] = function (n) {
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
    lib._xjb["Math_doPI"] = function (n) {
        var π = Math.PI, cos = Math.cos
        if (n >= 6111123) return π.toFixed(10)
        return (cos((π / 2) - (π / n)) * n).toFixed(10)
    };
    //算e
    lib._xjb["Math_doe"] = function (y) {
        var x = 1 + (1 / y)
        if (y > 60028450) return Math.E.toFixed(10)
        /*x^(1+1/x)*/
        return (Math.pow(x, y)).toFixed(10)
    };
    //算Φ
    lib._xjb["Math_doΦ"] = function (n) {
        /*斐波拉契数列前后两项之比随项数增大，越来越趋近黄金分割*/
        var a = lib._xjb["Math_f"](n)
        var b = lib._xjb["Math_f"](n + 1)
        if (n > 25) return 0.6180339887.toFixed(10)
        return (a / b).toFixed(10)
    };
    //二次方程
    lib._xjb["Math_2yuan"] = function (a, b, e, c, d, f) {
        if (a * d == b * c) return ["无解", "无解"]
        return [(d * e - b * f) / (a * d - b * c), (a * f - c * e) / (a * d - b * c)]
    };
    lib._xjb["Math_2Equal"] = function (str1, str2) {
        var a = str1.getNumberBefore('x'), b = str1.getNumberBefore('y'),
            e = str1.getNumberAfter('=')
        var c = str2.getNumberBefore('x'), d = str2.getNumberBefore('y'),
            f = str2.getNumberAfter('=');
        let list = [a, b, e, c, d, f].map(array => {
            return (array.reduce((acc, val) => (acc + eval(val)), 0))
        })
        game.print(list)
        var num = this["Math_2yuan"](...list)
        return num
    };
    lib._xjb["Math_2Equal1"] = function (str, str2) {
        var result = str.withTogether(str2, function (str1) {
            str1 = str1.toLowerCase()
            str1 = lib._xjb.StringDispose.disposeEandPI(str1)
            if (str1.indexOf("x") < 0) str1 = "0x+" + str1
            if (str1.indexOf("y") < 0) str1 = "0y+" + str1
            str1 = str1.replace(/([^0-9]|^)([xy])/g, function (match, p1, p2) {
                return p1 + "1" + p2
            });
            ["x", "y"].forEach(term => {
                if (str1.replace(/.*\=/, "").includes(term)) {
                    str1 = lib._xjb.StringDispose.shiftingTerms(str1, term)
                }
            })
            if (true) {
                let termsStr = ""
                let LeftNum = str1.replace(/\=.*/, "").replace(/(\-|\+){0,1}[0-9][0-9\.\/]*(x|y)/g, function (match) {
                    termsStr += match
                    return ""
                }) || "0"
                let RightNum = str1.replace(/.*\=/, "")
                let num1, num2
                try {
                    num1 = eval(LeftNum)
                } catch (err) {
                    num1 = 0
                }
                try {
                    num2 = eval(RightNum)
                } catch (err) {
                    num2 = 0
                }
                str1 = termsStr + "=" + (num2 - num1)
            }
            game.print(str1)
            return str1
        })
        return this["Math_2Equal"](...result)
    };
    //坐标点
    lib._xjb["Math_point"] = function (toDispose) {
        let string = lib._xjb.usuallyUsedString.Math +
            lib._xjb.usuallyUsedString.Point + `               
            return ${toDispose}
            `;
        string = lib._xjb.StringDispose.disposeSpecialCharacter(string)
        try {
            return (new Function(string))()
        } catch (err) {
            alert(err.message)
            return err
        }
    };
    lib._xjb['randomInt'] = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}