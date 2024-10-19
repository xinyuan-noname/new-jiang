export function LOAD_GAME_TETRIS(lib, game, ui, get, ai, _status) {
    const blocks = {
        "I": [0, 15, 0, 0],
        "J": [4, 7, 0],
        "L": [1, 7, 0],
        "O": [3, 3],
        "S": [3, 6, 0],
        "T": [2, 7, 0],
        "Z": [6, 3, 0]
    }
    const matrixLen = {
        "I": 4,
        "J": 3,
        "L": 3,
        "O": 2,
        "S": 3,
        "T": 3,
        "Z": 3
    }
    class Tetris {
        parseStatus(status, len) {
            return status.map(statusNumber => statusNumber.toString(2).padStart(len, '0').split("").map(num => num * 1));
        }
        getStatus(matrix) {
            return matrix.map(line => parseInt(line.join(""), 2))
        }
        backStatus = new Array(20).fill(0);
        backMatrix = this.parseStatus(this.backStatus, 10)
        /**
         * 
         * @param {movingBlocks} movingBlocks 
         */
        becomeBack(movingBlocks) {
            if (!movingBlocks) return;
            const statusList = movingBlocks.toBackStatus();
            for (let i = 0; i < 20; i++) {
                this.backStatus[i] ^= statusList[i]
                this.backStatus[i] |= statusList[i]
            }
            this.backMatrix = this.parseStatus(this.backStatus, 10);
        }
    }
    class movingBlocks extends Tetris {
        /**
         * @type {number[]}
         */
        initStatus
        /**
         * @type {number[][]}
         */
        position
        /**
         * @type {number[]}
         */
        lastMatrix
        /**
         * @type {number[]}
         */
        nowMatrix
        /**
         * @type {string}
         */
        shape
        /**
         * 
         * @param {string} shape 
         */
        constructor(shape) {
            super()
            this.shape = shape;
            this.initStatus = blocks[shape];
            this.nowMatrix = this.parseInitStatus();
            this.position = [parseInt(Math.random() * (10 - matrixLen[shape])), 0];
        }
        reinit(shape) {
            this.shape = shape;
            this.initStatus = blocks[shape];
            this.nowMatrix = this.parseInitStatus();
            this.position = [parseInt(Math.random() * (10 - matrixLen[shape])), 0];
        }
        parseInitStatus() {
            return this.parseStatus(this.initStatus, matrixLen[this.shape]);
        }
        getNowStatus() {
            return this.getStatus(this.nowMatrix);
        }
        rotate() {
            const len = matrixLen[this.shape]
            const result = new Array(len).fill().map(_ => new Array(len).fill(0));
            for (let y = 0; y < len; y++) {
                for (let x = 0; x < len; x++) {
                    result[len - 1 - x][y] = this.nowMatrix[y][x];
                }
            }
            this.lastMatrix = this.nowMatrix;
            this.nowMatrix = result;
            return this.nowMatrix;
        }
        tryRotate() {
            this.rotate();
            const prediction = this.toBackMatrix(true);
            if (!prediction || prediction.some(line => line.length > 10) || prediction.length > 20 || this.isOverlap()) {
                this.nowMatrix = this.lastMatrix;
                return this.toBackMatrix()
            }
            return prediction;
        }
        moveLeft() {
            this.position[0]--
            const prediction = this.toBackMatrix();
            if (prediction.some(line => line.length > 10)) return this.moveRight();
            if (this.isOverlap()) return this.moveRight();
            return prediction;
        }
        moveRight() {
            this.position[0]++
            const prediction = this.toBackMatrix(true);
            if (prediction === false) return this.moveLeft();
            if (this.isOverlap()) return this.moveLeft();
            return prediction
        }
        moveDown() {
            this.position[1]++
            const prediction = this.toBackMatrix();
            if (prediction.length > 20 && parseInt(prediction[20].join("")) != 0) return this.moveUp();
            if (this.isOverlap()) return this.moveUp();
            return prediction
        }
        moveUp() {
            this.position[1]--
            return this.toBackMatrix();
        }
        drop() {
            let last;
            while (last !== this.position[1]) {
                last = this.position[1]
                this.moveDown();
            }
            return this.toBackMatrix();;
        }
        isOverlap() {
            const statusList = this.toBackStatus();
            for (let i = 0; i < 20; i++) {
                const judge = (statusList[i] ^ this.backStatus[i]) & statusList[i];
                if (judge != statusList[i]) return true;
            }
            return false;
        }
        toBackStatus(getBool) {
            let result = new Array(20).fill(0);
            const len = matrixLen[this.shape];
            const [x, y] = this.position;
            const nowStatus = this.getNowStatus();
            for (let i = 0; i < len; i++) {
                const moveLen = 9 - len - x;
                result[y + i] = nowStatus[i]
                if (moveLen >= 0) {
                    result[y + i] <<= moveLen;
                }
                else if ((nowStatus[i] >> Math.abs(moveLen + 1) & 1) === 0) {
                    result[y + i] >>= Math.abs(moveLen);
                }
                else if (getBool) {
                    return false;
                }
            }
            return result;
        }
        toBackMatrix(getBool) {
            let result = this.toBackStatus(getBool);
            return result && this.parseStatus(result, 10);
        }
        shouldBeBack() {
            const last = this.position[1]
            this.moveDown();
            if (last === this.position[1]) return true;
            else {
                this.position[1]--;
                return false;
            }
        }
        becomeBack() {
            super.becomeBack(this);
            return this.backMatrix;
        }
        countClear() {
            return this.backStatus.filter(status => status === 1023).length
        }
        clearStatus() {
            const count = this.countClear()
            this.backStatus.removeArray(new Array(count).fill(1023))
            this.backStatus.unshift(...new Array(count).fill(0))
            this.backMatrix = this.parseStatus(this.backStatus)
        }
        gameMatrix() {
            const moving = this.toBackStatus(),
                back = this.backStatus,
                temp = [];
            for (let i = 0; i < 20; i++) {
                temp[i] = back[i] ^ moving[i]
                temp[i] |= moving[i]
            }
            return this.parseStatus(temp, 10);
        }
    }
    game.xjb_gameTetris = function () {
        //页面创建部分
        const dialog = game.xjb_create.alert();
        dialog.classList.add("xjb_tetrisDialog");
        dialog.buttons[0].remove();
        /**
         * @type {function}
         */
        const element = dialog.elementTool;
        element()
            .setTarget(dialog)
            .flexRow()
        const gameArea = element("div")
            .father(dialog)
            .style({
                flex: 2,
                display: "flex",
                position: "relative"
            })
            .flexColumn()
            .exit()
        const gameShow = element("div")
            .father(gameArea)
            .style({
                flex: 9,
            })
            .flexColumn()
            .exit()
        const table = element("table")
            .father(gameShow)
            .exit()
        const rows = []
        for (let i = 0; i < 20; i++) {
            const row = document.createElement("tr")
            const cells = []
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('td');
                cell.x = j;
                cell.y = i;
                cells.push(cell)
            }
            row.append(...cells)
            rows.push(row)
        }
        table.append(...rows)
        const move = element("div")
            .addClass("tetrisMoveArea")
            .father(gameArea)
            .style({
                flex: 2,
            })
            .flexRow()
            .exit()
        const moveL = element("div")
            .father(move)
            .style({
                flex: 3,
            })
            .flexColumn()
            .exit()
        const moveL1 = element("div")
            .father(moveL)
            .style({
                "justify-content": "center",
                flex: 1,
            })
            .flexRow()
            .exit()
        const moveL2 = element("div")
            .father(moveL)
            .style({
                "justify-content": "center",
                flex: 1,
            })
            .flexRow()
            .exit()
        const moveR = element("div")
            .father(move)
            .style({
                flex: 1,
                display: "flex",
                position: "relative"
            })
            .flexRow()
            .exit()
        const [leftArrow, downArrow, rightArrow, rotate, drop] = [
            ui.create.xjb_button(moveL2, "←"),
            ui.create.xjb_button(moveL2, "↓"),
            ui.create.xjb_button(moveL2, "→"),
            ui.create.xjb_button(moveL1, "↶"),
            ui.create.xjb_button(moveR, "drop")
        ]
        const sidebar = element("div")
            .father(dialog)
            .style({
                flex: 1,
                display: "flex",
            })
            .flexColumn()
            .exit();
        const point = element("div")
            .father(sidebar)
            .style({
                width: "100%",
                flex: 1,
            })
            .innerHTML("<h3>得分</h3><h1 style=text-align:center>0000</h1>")
            .exit()
        const controls = element("div")
            .father(sidebar)
            .style({
                width: "100%",
                flex: 1.618
            })
            .flexColumn()
            .innerHTML("<h3>控制</h3>")
            .exit()
        const startButton = ui.create.xjb_button(controls, "开始");
        const pauseButton = ui.create.xjb_button(controls, "暂停");
        const resumeButton = ui.create.xjb_button(controls, "恢复");
        const endButton = ui.create.xjb_button(controls, "结束", [dialog, dialog.back]);
        //游戏部分
        const GameData = {}
        const getRandomShape = () => "ILOZSTJ".split("").randomGet();
        const showBlocks = () => {
            const tds = table.querySelectorAll("td");
            const matrix = GameData.RECORDS.gameMatrix();
            for (const [i, td] of tds.entries()) {
                const x = i % 10, y = parseInt(i / 10);
                if (matrix[y][x] === 0) {
                    td.classList.remove("xjb-tetrisCovered")
                } else {
                    td.classList.add("xjb-tetrisCovered")
                }
            }
        }
        const gainPoints = (points) => {
            GameData.points += points;
            point.querySelector('h1').innerText = GameData.points.toString().padStart(4, "0");
        }
        const clearLine = () => {
            let count = GameData.RECORDS.countClear()
            GameData.RECORDS.clearStatus();
            setTimeout(() => {
                showBlocks();
                if (count === 2) count += 1;
                else if (count === 3) count += 2;
                else if (count === 4) count += 4;
                gainPoints(count * 100)
            }, 50)
        }
        const moveDown = () => {
            if (GameData.paused === true) return;
            if (GameData.end === true) return;
            GameData.RECORDS.moveDown();
            if (GameData.RECORDS.shouldBeBack()) {
                GameData.RECORDS.becomeBack();
                clearLine();
                GameData.RECORDS.reinit(getRandomShape());
                if (GameData.RECORDS.isOverlap()) {
                    clearInterval(GameData.TIMER);
                    clearInterval(GameData.ROUTINE);
                    document.removeEventListener("keydown", keydown);
                    alert("GAME OVER!");
                    GameData.end = true
                    return;
                }
                GameData.TIME = -1;
            }
            showBlocks();
        }
        const moveLeft = () => {
            if (GameData.paused === true) return;
            if (GameData.end === true) return;
            GameData.RECORDS.moveLeft();
            showBlocks();
        }
        const moveRight = () => {
            if (GameData.paused === true) return;
            if (GameData.end === true) return;
            GameData.RECORDS.moveRight();
            showBlocks();
        }
        const tryRotate = () => {
            if (GameData.paused === true) return;
            if (GameData.end === true) return;
            GameData.RECORDS.tryRotate();
            showBlocks();
        }
        const tryDrop = () => {
            if (GameData.paused === true) return;
            if (GameData.end === true) return;
            GameData.RECORDS.drop();
            showBlocks();
        }
        const keydown = e => {
            switch (e.key) {
                case 'ArrowUp': {
                    tryRotate();
                }; break;
                case 'ArrowDown': {
                    moveDown()
                }; break;
                case 'ArrowLeft': {
                    moveLeft()
                }; break;
                case 'ArrowRight': {
                    moveRight()
                }; break;
                case ' ': {
                    tryDrop()
                }; break;
            }
        }

        const startGame = () => {
            GameData.points = 0;
            GameData.paused = false;
            GameData.end = false;
            GameData.RECORDS = new movingBlocks(getRandomShape())
            GameData.TIME = -1;
            GameData.TIMER && clearInterval(GameData.TIMER);
            GameData.ROUTINE && clearInterval(GameData.ROUTINE);
            GameData.TIMER = setInterval(() => (GameData.TIME++), 100);
            GameData.ROUTINE = setInterval(() => {
                if (GameData.end === true) return;
                if (GameData.TIME % 10 === 0) {
                    moveDown();
                }
            }, 100);
            document.addEventListener('keydown', keydown);
        }
        const pauseGame = () => {
            if (GameData.end === true) return;
            clearInterval(GameData.TIMER);
            clearInterval(GameData.ROUTINE);
            GameData.paused = true;
        }
        const resumeGame = () => {
            if (GameData.end === true) return;
            GameData.paused = false;
            GameData.TIMER = setInterval(() => (GameData.TIME++), 100);
            GameData.ROUTINE = setInterval(() => {
                if (GameData.end === true) return;
                if (GameData.TIME % 10 === 0) {
                    moveDown();
                }
            }, 100);
        }
        const endGame = () => {
            clearInterval(GameData.TIMER);
            clearInterval(GameData.ROUTINE);
            document.removeEventListener("keydown", keydown)
        }
        //绑定事件
        startButton.addEventListener(lib.config.touchscreen ? "touchend" : "click", startGame);
        endButton.addEventListener(lib.config.touchscreen ? "touchend" : "click", endGame);
        pauseButton.addEventListener(lib.config.touchscreen ? "touchend" : "click", pauseGame);
        resumeButton.addEventListener(lib.config.touchscreen ? "touchend" : "click", resumeGame);

        downArrow.addEventListener(lib.config.touchscreen ? "touchend" : "click", moveDown);
        leftArrow.addEventListener(lib.config.touchscreen ? "touchend" : "click", moveLeft);
        rightArrow.addEventListener(lib.config.touchscreen ? "touchend" : "click", moveRight);
        rotate.addEventListener(lib.config.touchscreen ? "touchend" : "click", tryRotate);
        drop.addEventListener(lib.config.touchscreen ? "touchend" : "click", tryDrop);
    };
}