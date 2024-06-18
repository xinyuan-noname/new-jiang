/**
 * 绘制水平线
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} fromX
 * @param {number} toX
 * @param {number} y
 */
export function horizontalLine(ctx, fromX, toX, y) {
    ctx.beginPath();
    ctx.moveTo(fromX, y);
    ctx.lineTo(toX, y);
    ctx.stroke();
}
/**
 * 绘制铅垂线
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} fromY
 * @param {number} toY
 * @param {number} x
 */
export function plumbLine(ctx, fromY, toY, x) {
    ctx.beginPath();
    ctx.moveTo(x, fromY);
    ctx.lineTo(x, toY);
    ctx.stroke();
}
