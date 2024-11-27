
(function() {

    "use strict";
    
    var touchCapable = "ontouchstart" in document.documentElement;
    
    // ----------------
    // Змінні полотна
    // ----------------
    
    var mazeCanvas = document.getElementById("maze-canvas");
    var mazeContext = mazeCanvas.getContext("2d");
    
    var menuCanvas = document.getElementById("menu-canvas");
    var menuContext = menuCanvas.getContext("2d");
    
    var canvasDiv = document.getElementById("canvas-div");
    
    menuCanvas.width = mazeCanvas.width = canvasDiv.clientWidth - 20;
    menuCanvas.height = mazeCanvas.height = canvasDiv.clientHeight - 20;
    
    menuContext.textAlign = mazeContext.textAlign = "center";
    menuContext.textBaseline = mazeContext.textBaseline = "middle";
    
    var menuCanvas = document.getElementById("menu-canvas");
    var menuContext = menuCanvas.getContext("2d");
    
    // --------------
    // Змінні лабіринту
    // --------------
    
    var maze, m, n;
    var start, end;
    
    // ----------------------
    // Змінні малювання лабіринту
    // ----------------------
    
    var cellWidth;
    var cellHeight;
    
    var playerWidth;
    var playerHeight;
    
    // --------------
    // Змінні меню
    // --------------
    
    // Розміри та розташування блоків головного меню
    var diffBoxWidth, diffBoxHeight;
    var easyTopLeftX, easyTopLeftY;
    var mediumTopLeftX, mediumTopLeftY;
    var hardTopLeftX, hardTopLeftY;
    
    // Розміри та розташування вікон ігрового меню
    var menuBoxWidth, menuBoxHeight;
    var menuContTopLeftX, menuContTopLeftY;
    var menuRestartTopLeftX, menuRestartTopLeftY;
    var menuQuitTopLeftX, menuQuitTopLeftY;
    
    // --------------
    // Змінні гри
    // --------------
    
    var playerPosX, playerPosY;
    
    var timeLeft;
    var timerInterval;
    var hasStarted, hasWon, hasLost;
    
    var INITIAL_TIME = 35;
    var TIME_BOOST = 5;
    
    // -------------
    // Змінні, що збираються
    // -------------
    
    var solutionCounter, solutionTotal;
    var randomCounter, randomTotal;
    
    // Розміри скриньок для підрахунку голосів
    var circleRad;
    
    // Розміри скриньок для підрахунку голосів
    var BOX_WIDTH = 75;
    var BOX_HEIGHT = 50;
    
    var BOX_WIDTH = 160;
    var BOX_HEIGHT = 100;
    
    // Просторове зміщення скриньок для підрахунку голосів
    var BOX_OFFSET_X = BOX_WIDTH + 5;
    var BOX_OFFSET_Y = 5;
    
    // ----------------------
    // Змінні кнопки паузи
    // ----------------------
    
    var PAUSE_OFFSET_X = 5;
    var PAUSE_OFFSET_Y = 5;
    
    // ------------------
    // Визначення кольорів
    // ------------------
     //колір гравця
    var PLAYER_COLOUR = "#A69911"; // наш жовтий
    var PLAYER_TRIM_COLOUR = "#755E02"; //темно жовтий
     //колір кружечкій жовтих
    var SOLUTION_FILL_COLOUR = "#A69911";// наш жовтий
    var SOLUTION_STROKE_COLOUR = "#755E02";//темно жовтий
    //кнопка паузи
    var END_FILL_COLOUR = "#a6d6e0";// фіолетовий
    var END_STROKE_COLOUR = "#5e87d9";//темно фіолетовий

    var MESSAGE_FILL_COLOUR = "#90EBF0";// бірюзовий
    var MESSAGE_STROKE_COLOUR = "#0B88A8";//темно бірюзовий
    
    // Кольори для областей сенсорного екрану
    var UP_COLOUR = "#F2B01F";//ж->
    var DOWN_COLOUR = "#73F175";//з->
    var LEFT_COLOUR = "#73CDF1";//б->
    var RIGHT_COLOUR = "#E773F1";//ф->
    
    // Кольори для таймера
    var TIMER_FILL_COLOUR = MESSAGE_FILL_COLOUR;
    var TIMER_STROKE_COLOUR = MESSAGE_STROKE_COLOUR;
    
    var WARNING_FILL_COLOUR = "#5e87d9"; //жовтий заповнення
    var WARNING_STROKE_COLOUR = "#0b163b";//жовтий контур
    
    var DANGER_FILL_COLOUR = "#5e87d9"; //червоний заповнення
    var DANGER_STROKE_COLOUR = "#0b163b";//червоний контур

    var RANDOM_FILL_COLOUR = "#5e87d9"; 
    var RANDOM_STROKE_COLOUR = "#0b163b";

    var MENU_TEXT_COLOUR = "#e0eaec"; //колір тексту наш

    var  CIRCLE_FILL_COLOUR = "#7ae060"; //зелений
    var CIRCLE_STROKE_COLOUR = "#317520";//темно зелений

    var END_CIRCLE_COLOUR = "#be68de";// фіолетовий
    var END_CIRCLE_STROKE_COLOUR = "#4d1263";//темно фіолетовий

    // --------------
    // Починайте веселитися!
    // --------------
    
    drawMenu();
    
    // -----------------------------------------------
    // Початок гри, екран меню
    // -----------------------------------------------
    
    function drawMenu() {
        // Малює меню на полотні та ініціалізує гру при натисканні
        
        clearCanvas();
        menuContext.lineWidth = 5;
    
        // Ширина та висота боксів складності
        diffBoxWidth = 0.5 * menuCanvas.width;
        diffBoxHeight = 0.1 * menuCanvas.height - 10;
    
        // Малюємо квадратики складності
        easyTopLeftX = 0.5 * (menuCanvas.width - diffBoxWidth);
        easyTopLeftY = 0.7 * menuCanvas.height - 0.5 * diffBoxHeight;
        drawRect(easyTopLeftX, easyTopLeftY,
                 diffBoxWidth, diffBoxHeight,
                 menuContext,
                 RANDOM_FILL_COLOUR, RANDOM_STROKE_COLOUR);
    
        mediumTopLeftX = 0.5 * (menuCanvas.width - diffBoxWidth);
        mediumTopLeftY = 0.8 * menuCanvas.height - 0.5 * diffBoxHeight;
        drawRect(mediumTopLeftX, mediumTopLeftY,
                 diffBoxWidth, diffBoxHeight,
                 menuContext,
                 WARNING_FILL_COLOUR, WARNING_STROKE_COLOUR);
    
        hardTopLeftX = 0.5 * (menuCanvas.width - diffBoxWidth);
        hardTopLeftY = 0.9 * menuCanvas.height - 0.5 * diffBoxHeight;
        drawRect(hardTopLeftX, hardTopLeftY,
                 diffBoxWidth, diffBoxHeight,
                 menuContext,
                 DANGER_FILL_COLOUR, DANGER_STROKE_COLOUR);
    
        // Намалювати іконку maze.js
        drawIcon();
    
        // Заголовки
        menuContext.fillStyle = "#D2E3E7";
        menuContext.font = "40px Philosopher";
        menuContext.fillText("Правила:",
                             0.5 * menuCanvas.width,
                             0.2 * menuCanvas.height);
        menuContext.fillText("Оберіть складність:",
                             0.5 * menuCanvas.width,
                             0.6 * menuCanvas.height);
    
        menuContext.font = "30px Philosopher";
    
        wrapText("За вами женеться єті! Ваша мета - втекти від нього до фіолетової точки до того, " +
                 "як закінчиться час. Також вам потрібно зібрати всі жовті та зелені фішки в лабіринті. " +
                 "Кожна зелена дає " +
                 "вам ще 5 секунд на годиннику. Хай щастить!",
                 0.5 * menuCanvas.width, 0.3 * menuCanvas.height,
                 0.75 * menuCanvas.width, 40);
    
        menuContext.fillStyle = MENU_TEXT_COLOUR;
        menuContext.fillText("Легкий",
                             0.5 * menuCanvas.width,
                             0.7 * menuCanvas.height);
        menuContext.fillStyle = MENU_TEXT_COLOUR;
        menuContext.fillText("Середній",
                             0.5 * menuCanvas.width,
                             0.8 * menuCanvas.height);
        menuContext.fillStyle = MENU_TEXT_COLOUR;
        menuContext.fillText("Складний",
                             0.5 * menuCanvas.width,
                             0.9 * menuCanvas.height);
        // Викликаємо функцію обробника наведення
        window.addEventListener("resize", resizeMenu, false);
        window.addEventListener("click", menuCheckClick, false);
        window.addEventListener("touchstart", checkTouch, false);
        window.addEventListener("keydown", checkKey, false);
    }
    
    function menuCheckClick(evt) {
        // Check whether the user has clicked within the easy, medium or hard
        // boxes
    
        var clickX = evt.pageX;
        var clickY = evt.pageY;
    
        menuCheckPos(clickX, clickY);
    }
    
    function checkTouch(evt) {
        // Checks whether the player has touched one of the difficulty boxes
    
        // We want to record only individual touches
        evt.preventDefault();
    
        var touchX = evt.targetTouches[0].pageX;
        var touchY = evt.targetTouches[0].pageY;
    
        menuCheckPos(touchX, touchY);
    }
    
    function menuCheckPos(x, y) {
        // Check whether x, y is within any of the difficulty boxes, and
        // initialise the game with the corresponding difficulty
    
        if (x >= easyTopLeftX && x <= easyTopLeftX + diffBoxWidth &&
            y >= easyTopLeftY && y <= easyTopLeftY + diffBoxHeight) {
            startGame("easy");
        }
    
        if (x >= mediumTopLeftX && x <= mediumTopLeftX + diffBoxWidth &&
            y >= mediumTopLeftY && y <= mediumTopLeftY + diffBoxHeight) {
            startGame("medium");
        }
    
        if (x >= hardTopLeftX && x <= hardTopLeftX + diffBoxWidth &&
            y >= hardTopLeftY && y <= hardTopLeftY + diffBoxHeight) {
            startGame("hard");
        }
    }
    
    function checkKey(evt) {
        // Checks whether user has pressed `e`, `m`, or `h` for easy, medium
        // and hard difficulties
    
        switch (evt.keyCode) {
            case 69:  // `e` for easy
                startGame("easy");
                break;
            case 77:  // `m` for medium
                startGame("medium");
                break;
            case 72:  // 'h' for hard
                startGame("hard");
                break;
            case 73:  // 'i' for secret insane mode
                startGame("insane");
                break;
        }
    }
    
    function startGame(difficulty) {
        // Remove all event listeners and initialise game with specifiied
        // difficulty
    
        window.removeEventListener("click", menuCheckClick, false);
        window.removeEventListener("touchstart", checkTouch, false);
        window.removeEventListener("keydown", checkKey, false);
        window.removeEventListener("resize", resizeMenu, false);
    
        initialiseGame(difficulty);
    }
    
    function drawIcon() {
        // Намалювати іконку maze.js
    
        var icon = new Image();
        icon.src = "maze-icon.png";
        icon.onload = function() {
            menuContext.drawImage(icon,
                                  0.5 * menuCanvas.width - 150,
                                  0.025 * menuCanvas.height)
        }
    }
    
    function wrapText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(" ");
        var line = "";
    
        for (var i = 0; i < words.length; i++) {
            var testLine = line + words[i] + " ";
            var metrics = menuContext.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                menuContext.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        menuContext.fillText(line, x, y);
    }
    
    // --------------------------------------
    // Корисна функція для створення 2D масивів
    // --------------------------------------
    
    function createArray(width, height) {
        // Створюється масив розміром m на n
    
        var arr = new Array(width);
    
        for (var i = 0; i < width; i++) {
            arr[i] = new Array(height);
    
            for (var j = 0; j < height; j++) {
                arr[i][j] = 0;
            }
        }
    
        return arr;
    }
    
    // -----------------------------------------
    // Функції генерації та розв'язання лабіринту
    // -----------------------------------------
    
    function initialiseMaze() {
        // Ініціалізувати лабіринт розміром m x n з усіма стінами догори
    
        // Встановлюємо нуль у всіх комірках
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                maze[i][j] = 0;
            }
        }
    
        // Усередині клітин лабіринту
        for (var i = 1; i < m - 1; i++) {
            for (var j = 1; j < n - 1; j++) {
                maze[i][j] |= 15;
            }
        }
    
        // Верхня та нижня граничні комірки
        for (var i = 1; i < m - 1; i++) {
            maze[i][0] |= 7;
            maze[i][n - 1] |= 13;
        }
    
        // Ліва та права граничні комірки
        for (var i = 1; i < n - 1; i++) {
            maze[0][i] |= 14;
            maze[m - 1][i] |= 11;
        }
    
        // Кутові комірки
        maze[0][0] |= 6;  // Верхній лівий кут
    
        maze[m - 1][0] |= 3;  // Верхній правий кут
    
        maze[0][n - 1] |= 12;  // Нижній лівий кут
    
        maze[m - 1][n - 1] |= 9;  //  Нижній правий кут
    
        return maze;
    }
    
    function buildMaze() {
        // Побудувати ідеальний лабіринт у `maze` розміром m на
    
        var cellStack, totalCells, currentCell, visitedCells, newCell;
        var visitedArray, validNeighbours, neighbour;
    
        // Стек для збереження розташування комірок
        cellStack = new Array();
    
        totalCells = m * n;
    
        // Масив, що містить інформацію про те, чи була відвідана кожна комірка
        visitedArray = createArray(m, n);
    
        currentCell = getRandomCell();
    
        visitedCells = 1;
    
        while (visitedCells < totalCells) {
            // Встановити цю комірку як відвідану
            visitedArray[currentCell[0]][currentCell[1]] = 1;
    
            // Отримати байт, що описує, які сусіди не були відвідані
            validNeighbours = getNeighbours(visitedArray, currentCell);
    
            if (validNeighbours === 0) {
                currentCell = cellStack.pop();
            }
            else {
                // Вибираємо випадковим чином одного дійсного сусіда
                neighbour = getRandomFlag(validNeighbours);
                switch (neighbour) {
                    case 1:  // Зліва від початкової комірки
                        newCell = [currentCell[0] - 1, currentCell[1]];
                        knockDownWall(currentCell, "left");
                        knockDownWall(newCell, "right");
                        break;
                    case 2:  // Нижче початкової комірки
                        newCell = [currentCell[0], currentCell[1] + 1];
                        knockDownWall(currentCell, "bottom");
                        knockDownWall(newCell, "top");
                        break;
                    case 4:  // Праворуч від початкової комірки
                        newCell = [currentCell[0] + 1, currentCell[1]];
                        knockDownWall(currentCell, "right");
                        knockDownWall(newCell, "left");
                        break;
                    case 8:  // Над початковою коміркою
                        newCell = [currentCell[0], currentCell[1] - 1];
                        knockDownWall(currentCell, "top");
                        knockDownWall(newCell, "bottom");
                        break;
                    default:
                        console.log("Error: Invalid choice of neighbour.");
                        return false;
                }
    
                cellStack.push(currentCell);
                currentCell = newCell;
                visitedCells++;
            }
    
        }
    }
    
    function removeCounters() {
        // Видалити всі лічильники струму з лабіринту
    
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                // 16 - біт лічильника розв'язків; 32 - біт випадкового лічильника
                maze[i][j] &= ~48;
            }
        }
    }
    
    function placeCounters() {
        // Розмістіть на лабіринті випадкові фішки та фішки рішень
    
        placeSolutionCounters();
        placeRandomCounters();
    }
    
    function placeSolutionCounters() {
        // Позначає рішення лабіринту, використовуючи метод, схожий на будівництво
    
        var cellStack, currentCell, visitedCells, newCell;
        var visitedArray, unvisitedNeighbours, validNeighbours, neighbour;
    
        // Стек для збереження розташування комірок
        cellStack = new Array();
    
        // Масив, що містить інформацію про те, чи була відвідана кожна комірка
        visitedArray = createArray(m, n);
    
        currentCell = start;
    
        while (!(currentCell[0] === end[0] && currentCell[1] === end[1])) {
            // Встановити цю комірку як відвідану
            visitedArray[currentCell[0]][currentCell[1]] = 1;
    
            // Отримайте байт, що описує, які сусіди не були відвідані
            unvisitedNeighbours = getNeighbours(visitedArray, currentCell);
    
            // Тут також не потрібна проміжна стіна
            validNeighbours = unsetWalledNeighbours(unvisitedNeighbours,
                                                    currentCell);
    
            if (validNeighbours === 0) {
                currentCell = cellStack.pop();
            }
            else {
                // Вибираємо випадковим чином одного дійсного сусіда
                neighbour = getRandomFlag(validNeighbours);
                switch (neighbour) {
                    case 1:  // Зліва від початкової комірки
                        newCell = [currentCell[0] - 1, currentCell[1]];
                        break;
                    case 2:  // Нижче початкової комірки
                        newCell = [currentCell[0], currentCell[1] + 1];
                        break;
                    case 4:  // Праворуч від початкової комірки
                        newCell = [currentCell[0] + 1, currentCell[1]];
                        break;
                    case 8:  // Над початковою коміркою
                        newCell = [currentCell[0], currentCell[1] - 1];
                        break;
                    default:
                        console.log("Error: Invalid choice of neighbour.");
                        return false;
                }
    
                cellStack.push(currentCell);
                currentCell = newCell;
            }
        }
    
        // Видаляємо перший елемент, початкову точку, яка є особливою
        cellStack.splice(0, 1);
    
        // Скидання загальної суми рішення в разі перезапуску гри
        solutionTotal = 0;
    
        // Позначити всі комірки в стеку як рішення
        for (var i = 0; i < cellStack.length; i += 2) {
            solutionTotal++;
            maze[cellStack[i][0]][cellStack[i][1]] |= 16;
        }
    }
    
    function placeRandomCounters() {
        // Розміщуємо випадкові жетони, які гравці повинні зібрати по всьому лабіринту лабіринту
    
        // На одну п'яту більше випадкових фішок, ніж фішок рішень
        randomTotal = Math.ceil(solutionTotal / 5);
    
        var i = 0, cell;
        while (i < randomTotal) {
            cell = getRandomCell();
    
            if (validRandomCounterCell(cell)) {
                maze[cell[0]][cell[1]] |= 32;
                i++;
            }
        }
    }
    
    function getRandomInt(min, max) {
        // Повертає випадкове ціле число між `min` та `max`, згідно з документацією MDN
    
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function getRandomFlag(num) {
        // Вибираємо випадковий прапорець з 4-бітового числа
    
        // Запобігання нескінченному циклу через неправильний аргумент
        if (num === 0) {
            console.log("Помилка: Неможливо вибрати довільний прапор набору.");
            return false;
        }
    
        var rand, res;
    
        do {
            rand = Math.pow(2, getRandomInt(0, 4));
            res = num & rand;
        } while (res === 0);
    
        return res;
    }
    
    function knockDownWall(cell, wall) {
        // Зруйнувати стіну між коміркою 1 і коміркою 2
    
        var wallmask;
    
        switch (wall) {
            case "top":
                wallmask = 8;
                break;
            case "right":
                wallmask = 4;
                break;
            case "bottom":
                wallmask = 2;
                break;
            case "left":
                wallmask = 1;
                break;
            default:
                console.log("Error: Invalid wall to destroy.");
                return false;
        }
    
        maze[cell[0]][cell[1]] &= ~wallmask;
    }
    
    function getNeighbours(visitedArray, cell) {
        // Отримати всі невідвідані сусіди `cell` в `maze` як байт
    
        var validNeighbours = 0;
    
        // Перевірка ліворуч
        if ((cell[0] != 0) && (!visitedArray[cell[0] - 1][cell[1]])) {
            validNeighbours |= 1;
        }
    
        // Перевірка нижче
        if ((cell[1] != n - 1) && (!visitedArray[cell[0]][cell[1] + 1])) {
            validNeighbours |= 2;
        }
    
        // Перевірка праворуч
        if ((cell[0] != m - 1) && (!visitedArray[cell[0] + 1][cell[1]])) {
            validNeighbours |= 4;
        }
    
        // Перевірка вище
        if ((cell[1] != 0) && (!visitedArray[cell[0]][cell[1] - 1])) {
            validNeighbours |= 8;
        }
    
        return validNeighbours;
    }
    
    function unsetWalledNeighbours(neighbours, cell) {
        // Знімаємо всі прапори в байтах `сусідів`, де між `коміркою` та цим сусідом є стіна
    
        var cellval = maze[cell[0]][cell[1]];
    
        // Біти, що представляють ліву, нижню, праву та верхню стіни відповідно
        var wallmasks = [1, 2, 4, 8];
    
        // Перевірити, чи має комірка стінки, і скинути відповідний біт сусіда
        wallmasks.forEach(function(mask) {
            if (cellval & mask) {
                neighbours &= ~mask;
            }
        });
    
        return neighbours;
    }
    
    function validRandomCounterCell(cell) {
        // Перевірити, чи є `cell` допустимим для розміщення випадкового лічильника
    
        // Переконайтися, що це не відправна точка
        if (cell[0] === start[0] && cell[1] === start[1]) {
            return false;
        }
    
        // Переконайтися, що це не відправна точка
        if (cell[0] === end[0] && cell[1] === end[1]) {
            return false;
        }
    
        // Переконайтися, що там ще немає лічильника рішень
        if (maze[cell[0]][cell[1]] & 16) {
            return false;
        }
    
        // Переконайтися, що там ще немає лічильника рішень
        if (maze[cell[0]][cell[1]] & 32) {
            return false;
        }
    
        return true;
    }
    
    function getRandomCell() {
        // Отримуємо випадкову комірку в лабіринті
    
        return [getRandomInt(0, m - 1), getRandomInt(0, n - 1)];
    }
    // -----------------------------
    // Функції руху гравця
    // -----------------------------
    
    function movePlayerKeyboard(evt) {
        // Перевірити, чи може гравець переміститися у місце, вказане при введенні з клавіатури, і якщо так, то перемістити його туди. Перевірити, чи виграв гравець, і вивести на екран привітання.
    
        var newX;
        var newY;
        var canMove;
    
        switch (evt.keyCode) {
            case 38:  // Клавіша зі стрілкою вгору
            case 87:  // w ключ
                newX = playerPosX;
                newY = playerPosY - 1;
                canMove = canMoveTo("up");
                break;
            case 37:  // Клавіша зі стрілкою вліво
            case 65:  // a ключ
                newX = playerPosX - 1;
                newY = playerPosY;
                canMove = canMoveTo("left");
                break;
            case 40: // Клавіша зі стрілкою вниз
            case 83: // s ключ
                newX = playerPosX;
                newY = playerPosY + 1;
                canMove = canMoveTo("down");
                break;
            case 39:  // Клавіша зі стрілкою вправо
            case 68: // d ключ
                newX = playerPosX + 1;
                newY = playerPosY;
                canMove = canMoveTo("right");
                break;
            default:
                return;
        }
    
        if (canMove) {
            movePlayer(newX, newY);
        }
    }
    
    function movePlayerTouch(evt) {
        // Робить те саме, що й moverPlayerKeyboard, але замість того, щоб приймати введення з клавіатури, визначає рух на основі того, якої частини екрана торкається користувач
    
        // Ми хочемо записувати лише окремі дотики
        evt.preventDefault();
    
        var touchX = evt.targetTouches[0].pageX;
        var touchY = evt.targetTouches[0].pageY;
    
        var newX;
        var newY;
        var canMove;
    
        // Якщо гравець натиснув кнопку паузи, не рухайтеся
        if (touchX >= PAUSE_OFFSET_X &&
            touchX <= PAUSE_OFFSET_X + BOX_WIDTH &&
            touchY >= menuCanvas.height - PAUSE_OFFSET_Y - BOX_HEIGHT &&
            touchY <= menuCanvas.height - PAUSE_OFFSET_Y) {
            return;
        }
    
        if (touchY < 0.25 * mazeCanvas.height) {
            newX = playerPosX;
            newY = playerPosY - 1;
            canMove = canMoveTo("up");
        } else if (touchY > 0.75 * mazeCanvas.height) {
            newX = playerPosX;
            newY = playerPosY + 1;
            canMove = canMoveTo("down");
        } else if (touchX < 0.5 * mazeCanvas.width) {
            newX = playerPosX - 1;
            newY = playerPosY;
            canMove = canMoveTo("left");
        } else if (touchX > 0.5 * mazeCanvas.width) {
            newX = playerPosX + 1;
            newY = playerPosY;
            canMove = canMoveTo("right");
        }
    
        if (canMove) {
            movePlayer(newX, newY);
        }
    }
    
    function movePlayer(newX, newY) {
        // Переконуємось, що лабіринт не розмитий
        unblurMaze();
    
        if (!hasStarted) {
            createTimer();
        }
    
        hasStarted = true;
    
        checkCounters(newX, newY);
    
        drawAll(newX, newY);
        playerPosX = newX;
        playerPosY = newY;
    
        if (playerPosX === end[0] && playerPosY === end[1] &&
            hasCollectedAllCounters()) {
            // Видалення слухачів подій руху
            window.removeEventListener("keydown", movePlayerKeyboard, false);
            window.removeEventListener("touchstart", movePlayerTouch, false);
    
            hasWon = true;
            clearInterval(timerInterval);
            drawAll(playerPosX, playerPosY);
    
            // Встановлення слухачів подій, щоб гравець міг перезапустити гру
            window.addEventListener("keydown", restartGameKeyboard, false);
            window.addEventListener("touchstart", restartGameTouch, false);
        }
    }
    
    function hasCollectedAllCounters() {
        // Перевірити, чи зібрав гравець усі фішки
    
        if (solutionCounter === solutionTotal && randomCounter === randomTotal) {
            return true;
        }
    
        return false;
    }
    
    function checkCounters(x, y) {
        // Перевірити, чи є лічильники за адресою (`x`,`y`)
    
        if (maze[x][y] & 16) {
            // Перебуваючи на лічильнику рішення
            solutionCounter++;
    
            // Не встановлений лічильник випадкових комірок
            maze[x][y] &= ~16;
        }
    
        if (maze[x][y] & 32) {
            // Перебуваючи на лічильнику рішення
            randomCounter++;
    
            // Не встановлений лічильник випадкових комірок
            maze[x][y] &= ~32;
    
            // Отримайте більше часу!
            timeLeft += TIME_BOOST;
        }
    }
    
    function canMoveTo(direction) {
        // Перевірити, чи може гравець переміститися з точки `destX` в точку `destY
    
        var cellval = maze[playerPosX][playerPosY];
    
        switch (direction) {
            case "left":
                if (playerPosX === 0 || cellval & 1) {
                    return false;
                }
                break;
            case "down":
                if (playerPosY === n - 1 || cellval & 2) {
                    return false;
                }
                break;
            case "right":
                if (playerPosX === m - 1 || cellval & 4) {
                    return false;
                }
                break;
            case "up":
                if (playerPosY === 0 || cellval & 8) {
                    return false;
                }
                break;
        }
    
        return true;
    }
    
    function restartGameKeyboard(evt) {
        // Перезапуск гри після натискання користувачем клавіші Enter
    
        if (evt.keyCode === 13) {
            window.removeEventListener("keydown", restartGameKeyboard, false);
            window.removeEventListener("touchstart", restartGameTouch, false);
            drawMenu();
        }
    }
    
    function restartGameTouch(evt) {
        // Перезапуск гри після дотику користувача до екрану, якщо він не натиснув на паузу
    
        var touchX = evt.targetTouches[0].pageX;
        var touchY = evt.targetTouches[0].pageY;
    
        if (touchX >= PAUSE_OFFSET_X &&
            touchX <= PAUSE_OFFSET_X + BOX_WIDTH &&
            touchY >= menuCanvas.height - PAUSE_OFFSET_Y - BOX_HEIGHT &&
            touchY <= menuCanvas.height - PAUSE_OFFSET_Y) {
            return;
        }
    
        window.removeEventListener("keydown", restartGameKeyboard, false);
        window.removeEventListener("touchstart", restartGameTouch, false);
        drawMenu();
    }
    
    // ------------------
    // Функція таймера
    // ------------------
    
    function createTimer() {
        // Запускає таймер з кроком у секундах (1000 мс)
    
        timerInterval = setInterval(function() {
            timeLeft--;
            drawAll(playerPosX, playerPosY);
            if (timeLeft === 0) {
                window.removeEventListener("keydown", movePlayerKeyboard, false);
                window.removeEventListener("touchstart", movePlayerTouch, false);
    
                hasLost = true;
                clearInterval(timerInterval);
                drawAll(playerPosX, playerPosY);
    
                window.addEventListener("keydown", restartGameKeyboard, false);
                window.addEventListener("touchstart", restartGameTouch, false);
    
                return;
            }
        }, 1000);
    }
    
    // ----------------------
    // Функції малювання
    // ----------------------
    
    function drawMaze() {
        // Загальна функція для малювання стін лабіринту та фішок
    
        drawMazeWalls();
        drawCounters();
        drawEnd();
        drawCounterTallies();
        drawTimer(timeLeft);
    }
    
    function drawMazeWalls() {
        // Нанести створені стіни лабіринту на полотно
    
        mazeContext.lineWidth = 2;
    
        // Накреслити межі двічі, щоб забезпечити однакову товщину зі стінами
        for (var i = 0; i < 2; i++) {
            drawLine(cellWidth, 0, m * cellWidth, 0, mazeContext);
            drawLine(0, 0, 0, n * cellHeight, mazeContext);
            drawLine(m * cellWidth, 0, m * cellWidth, n * cellHeight, mazeContext);
            drawLine(0, n * cellHeight, (m - 1) * cellWidth, n * cellHeight, mazeContext);
        }
    
        // Малюємо стіни
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                drawCellWalls([i, j]);
            }
        }
    
        mazeContext.lineWidth = 1;
    }
    
    function drawCounters() {
        // Малюємо розв'язок та випадкові фішки до лабіринту
    
        mazeContext.lineWidth = 5;
    
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (maze[i][j] & 16) {
                    // 
                    drawCircle((i + 0.5) * cellWidth, (j + 0.5) * cellHeight,
                            circleRad, SOLUTION_FILL_COLOUR, SOLUTION_STROKE_COLOUR);
                }
                if (maze[i][j] & 32) {
                    // Малюємо випадкові фішки
                    drawCircle((i + 0.5) * cellWidth, (j + 0.5) * cellHeight,
                            circleRad, CIRCLE_FILL_COLOUR, CIRCLE_STROKE_COLOUR);
                }
            }
        }
    
        mazeContext.lineWidth = 1;
    }
    
    function drawCircle(x, y, radius, fillStyle, strokeStyle) {
        // Намалювати коло радіуса `radius` з центром у точці (`x`, `y`)
    
        mazeContext.beginPath();
        mazeContext.arc(x, y, radius, 0, 2 * Math.PI, false);
        mazeContext.fillStyle = fillStyle;
        mazeContext.fill();
        mazeContext.strokeStyle = strokeStyle;
        mazeContext.stroke();
    }
    
    function drawEnd() {
        // Намалюйте початкову та кінцеву точки у вигляді кіл спеціального кольору
    
        mazeContext.lineWidth = 5;
    
        drawCircle((end[0] + 0.5) * cellWidth, (end[1] + 0.5) * cellHeight,
                circleRad, END_CIRCLE_COLOUR, END_CIRCLE_STROKE_COLOUR);
    
        mazeContext.lineWidth = 1;
    }
    
    function drawCellWalls(cell) {
        // Малюємо всі існуючі стіни навколо клітинки у позиції `клітинка` лабіринту
    
        var cellval = maze[cell[0]][cell[1]];
    
        if (cellval & 1) {  // Ліва стіна присутня
            drawLine(cell[0] * cellWidth, cell[1] * cellHeight,
                     cell[0] * cellWidth, (cell[1] + 1) * cellHeight,
                     mazeContext);
        }
    
        if (cellval & 2) { // Нижня стінка присутня
            drawLine(cell[0] * cellWidth, (cell[1] + 1) * cellHeight,
                     (cell[0] + 1) * cellWidth, (cell[1] + 1) * cellHeight,
                     mazeContext);
        }
    
        if (cellval & 4) { // Права стіна присутня
            drawLine((cell[0] + 1) * cellWidth, cell[1] * cellHeight,
                     (cell[0] + 1) * cellWidth, (cell[1] + 1) * cellHeight,
                     mazeContext);
        }
    
        if (cellval & 8) { // Верхня стінка присутня
            drawLine(cell[0] * cellWidth, cell[1] * cellHeight,
                     (cell[0] + 1) * cellWidth, cell[1] * cellHeight,
                     mazeContext);
        }
    }
    
    function drawLine(startX, startY, endX, endY, context) {
        // Малює лінію від точки startPos = [startPosX, startPosY] до endPos = [endPosX, endPosY] з використанням контексту `context``
    
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }
    
    function drawRect(x, y, width, height, context, fillStyle, strokeStyle, borderRadius = 15) {
        // Тіньова стилізація (box-shadow)
        context.shadowColor = fillStyle;
        context.shadowBlur = 10;
    
        // Намалювати прямокутник із закругленими кутами у вказаному контексті
        context.beginPath();
        context.moveTo(x + borderRadius, y);
        context.lineTo(x + width - borderRadius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        context.lineTo(x + width, y + height - borderRadius);
        context.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        context.lineTo(x + borderRadius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        context.lineTo(x, y + borderRadius);
        context.quadraticCurveTo(x, y, x + borderRadius, y);
        context.closePath();
    
        // Заливка та обведення
        context.fillStyle = fillStyle;
        context.fill();
        context.strokeStyle = strokeStyle;
        context.stroke();
    
        // Скидаємо тінь після заливки
        context.shadowBlur = 0;
    }
    
    
    function drawTouchControls() {
        // Малює кольорові прямокутники, що показують зони керування сенсорним екраном
    
        menuContext.globalAlpha = 0.2;
    
        drawRect(0, 0,
                 menuCanvas.width, 0.25 * menuCanvas.height,
                 menuContext,
                 UP_COLOUR, UP_COLOUR);
        drawRect(0, 0.75 * menuCanvas.height,
                 menuCanvas.width, 0.25 * menuCanvas.height,
                 menuContext,
                 DOWN_COLOUR, DOWN_COLOUR);
        drawRect(0, 0.25 * menuCanvas.height,
                 0.5 * menuCanvas.width, 0.5 * menuCanvas.height,
                 menuContext,
                 LEFT_COLOUR, LEFT_COLOUR);
        drawRect(0.5 * menuCanvas.width, 0.25 * menuCanvas.height,
                 0.5 * menuCanvas.width, 0.5 * menuCanvas.height,
                 menuContext,
                 RIGHT_COLOUR, RIGHT_COLOUR);
    
        menuContext.globalAlpha = 1;
    }
    
    function drawPlayer(x, y) {
        // Малюємо об'єкт, що представляє гравця, наразі це квадрат. ! Зверніть увагу, що зменшена клітинка очищується, щоб уникнути стирання стінок.
    
        var currTopLeftX = (playerPosX + 0.5) * cellWidth - 0.5 * playerWidth;
        var currTopLeftY = (playerPosY + 0.5) * cellHeight - 0.5 * playerHeight;
    
        playerPosX = x;
        playerPosY = y;
    
        var newTopLeftX = (x + 0.5) * cellWidth - 0.5 * playerWidth;
        var newTopLeftY = (y + 0.5) * cellHeight - 0.5 * playerHeight;
    
        mazeContext.beginPath();
        mazeContext.rect(newTopLeftX, newTopLeftY, playerWidth, playerHeight);
        mazeContext.closePath();
        mazeContext.fillStyle = PLAYER_COLOUR;
        mazeContext.fill();
        mazeContext.lineWidth = 5;
        mazeContext.strokeStyle = PLAYER_TRIM_COLOUR;
        mazeContext.stroke();
        mazeContext.lineWidth = 1;
    }
    
    function drawStartMessage() {
        menuContext.font = "40px Philosopher";
        menuContext.lineWidth = 5;
    
        if (touchCapable) {
            drawRect(0.5 * menuCanvas.width - 450, 0.5 * menuCanvas.height - 50,
                     900, 140,
                     menuContext,
                     MESSAGE_FILL_COLOUR, MESSAGE_STROKE_COLOUR);
            menuContext.fillStyle = MESSAGE_STROKE_COLOUR;
            menuContext.fillText("Торкніться зверху, зліва, справа і знизу",
                             0.5 * menuCanvas.width, 0.5 * menuCanvas.height);
            menuContext.fillText("секції екрана для переміщення",
                             0.5 * menuCanvas.width, 0.5 * menuCanvas.height + 40);
        } else {
            drawRect(0.5 * menuCanvas.width - 450, 0.5 * menuCanvas.height - 50,
                     900, 100,
                     menuContext,
                     MESSAGE_FILL_COLOUR, MESSAGE_STROKE_COLOUR);
            menuContext.fillStyle = MESSAGE_STROKE_COLOUR;
            menuContext.fillText("Використовуйте WASD для навігації лабіринтом",
                             0.5 * menuCanvas.width, 0.5 * menuCanvas.height);
        }
    
        drawIcon();
    }
    
    function drawWinMessage() {
        menuContext.lineWidth = 5;
    
        drawRect(0.5 * menuCanvas.width - 450, 0.5 * menuCanvas.height - 50,
                 900, 225,
                 menuContext,
                 RANDOM_FILL_COLOUR, RANDOM_STROKE_COLOUR);
        menuContext.font = "60px Philosopher";
        menuContext.fillStyle = RANDOM_STROKE_COLOUR;
        menuContext.fillText("Ти встиг!",
                         0.5 * menuCanvas.width, 0.5 * menuCanvas.height);
        menuContext.font = "40px Philosopher";
        menuContext.fillText("Ти фінішував з " + timeLeft + " секундами в запасі.",
                             0.5 * menuCanvas.width, 0.5 * menuCanvas.height + 75);
    
        if (touchCapable) {
            menuContext.fillText("Торкніться екрана, щоб продовжити.",
                                 0.5 * menuCanvas.width,
                                 0.5 * menuCanvas.height + 125);
        } else {
            menuContext.fillText("Натисніть «Enter», щоб продовжити.",
                                 0.5 * menuCanvas.width,
                                 0.5 * menuCanvas.height + 125);
        }
    
        drawIcon();
        blurMaze();
    }
    
    function drawLostMessage() {
        menuContext.lineWidth = 5;
    
        drawRect(0.5 * menuCanvas.width - 400, 0.5 * menuCanvas.height - 60,
                 800, 200,
                 menuContext,
                 DANGER_FILL_COLOUR, DANGER_STROKE_COLOUR);
        menuContext.font = "60px Philosopher";
        menuContext.fillStyle = DANGER_STROKE_COLOUR;
        menuContext.fillText("Тебе наздогнали!",
                             0.5 * menuCanvas.width,
                             0.5 * menuCanvas.height);
        menuContext.font = "40px Philosopher";
    
        if (touchCapable) {
            menuContext.fillText("Торкніться екрана, щоб продовжити",
                                 0.5 * menuCanvas.width,
                                 0.5 * menuCanvas.height + 75);
        } else {
            menuContext.fillText("Натисніть «Enter», щоб продовжити",
                                 0.5 * menuCanvas.width,
                                 0.5 * menuCanvas.height + 75);
        }
    
        drawIcon();
        blurMaze();
    }
    
    function drawCounterTallies() {
        // Малює поле з кількістю зібраних фішок
    
        menuContext.lineWidth = 5;
    
        if (timeLeft <= 0) {
            menuContext.globalAlpha = 1;
        } else if (solutionCounter != solutionTotal) {
            menuContext.globalAlpha = 0.25;
        } else {
            menuContext.globalAlpha = 0.75;
        }
    
        drawRect(menuCanvas.width - BOX_OFFSET_X, BOX_OFFSET_Y,
                 BOX_WIDTH, BOX_HEIGHT,
                 menuContext,
                 SOLUTION_FILL_COLOUR, SOLUTION_STROKE_COLOUR);
        menuContext.font = "50px Philosopher";
        menuContext.fillStyle = SOLUTION_STROKE_COLOUR;
        menuContext.fillText(solutionCounter + " / " + solutionTotal,
                             menuCanvas.width - BOX_OFFSET_X + 0.5 * BOX_WIDTH,
                             BOX_OFFSET_Y + 0.5 * BOX_HEIGHT);
    
        menuContext.globalAlpha = 1;
    
        if (timeLeft <= 0) {
            menuContext.globalAlpha = 1;
        } else if (randomCounter != randomTotal) {
            menuContext.globalAlpha = 0.25;
        } else {
            menuContext.globalAlpha = 0.75;
        }
    
        drawRect(menuCanvas.width - BOX_OFFSET_X, BOX_HEIGHT + 2 * BOX_OFFSET_Y,
                 BOX_WIDTH, BOX_HEIGHT,
                 menuContext,
                 RANDOM_FILL_COLOUR, RANDOM_STROKE_COLOUR);
        menuContext.fillStyle = RANDOM_STROKE_COLOUR;
        menuContext.fillText(randomCounter + " / " + randomTotal,
                             menuCanvas.width - BOX_OFFSET_X + 0.5 * BOX_WIDTH,
                             2 * BOX_OFFSET_Y + 1.5 * BOX_HEIGHT);
    
        menuContext.globalAlpha = 1;
    }
    
    function drawTimer(time) {
        // Малює таймер, що показує час
    
        menuContext.font = "50px Philosopher";
        menuContext.lineWidth = 5;
        menuContext.globalAlpha = 1;
    
        if (time <= 10 && time > 5) {
            menuContext.fillStyle = WARNING_FILL_COLOUR;
            menuContext.strokeStyle = WARNING_STROKE_COLOUR;
            menuContext.globalAlpha = 0.5;
        } else if (time <= 5) {
            menuContext.fillStyle = DANGER_FILL_COLOUR;
            menuContext.strokeStyle = DANGER_STROKE_COLOUR;
            menuContext.globalAlpha = 0.75;
        } else {
            menuContext.fillStyle = TIMER_FILL_COLOUR;
            menuContext.strokeStyle = TIMER_STROKE_COLOUR;
            menuContext.globalAlpha = 0.25;
        }
    
        if (hasWon || hasLost) {
            menuContext.globalAlpha = 1;
        }
    
        var minutesLeft = Math.floor(time / 60).toString();
        var secondsLeft = (time - minutesLeft * 60).toString();
    
        if (secondsLeft.length === 1) {
            secondsLeft = "0" + secondsLeft;
        }
    
        drawRect(menuCanvas.width - BOX_OFFSET_X,
                 2 * BOX_HEIGHT + 3 * BOX_OFFSET_Y,
                 BOX_WIDTH, BOX_HEIGHT,
                 menuContext);
    
        menuContext.fillStyle = menuContext.strokeStyle;
    
        menuContext.fillText(minutesLeft + ":" + secondsLeft,
                             menuCanvas.width - BOX_OFFSET_X + 0.5 * BOX_WIDTH,
                             3 * BOX_OFFSET_Y + 2.5 * BOX_HEIGHT);
    
        menuContext.globalAlpha = 1;
    
    }
    
    function blurMaze() {
        // Використовуємо CSS, щоб розмити полотно лабіринту, залишаючи повідомлення
    
        mazeCanvas.style.filter = mazeCanvas.style.webkitFilter = "blur(5px)";
    }
    
    function unblurMaze() {
        // Видалити розмиття на лабіринті
    
        mazeCanvas.style.filter = mazeCanvas.style.webkitFilter = "blur(0px)";
    }
    
    function drawAll(x, y) {
        // Перемальовує весь лабіринт, елементи керування та гравця в позиції `x`, `y`.
    
        clearCanvas();
    
        drawMaze();
        drawPlayer(x, y);
        drawPauseButton();
    
        if (touchCapable) {
            drawTouchControls();
        }
    
        if (!hasStarted) {
            drawStartMessage();
        }
    
        if (hasWon) {
            drawWinMessage();
        }
    
        if (hasLost) {
            drawLostMessage();
        }
    }
    
    // ------------------------------------------
    // Ігрове меню викликається натисканням клавіші escape
    // ------------------------------------------
    
    function checkEscape(evt) {
        // Check whether the user has brought up the in-game menu with Escape
    
        if (evt.keyCode === 27) {  // Escape button
            drawPauseMenu();
        }
    }
    
    function drawPauseMenu() {
        // Малює ігрове меню, яке з'являється, коли гравець натискає клавішу escape
    
        //Видалення слухачів події паузи
        window.removeEventListener("keydown", checkEscape, false);
        window.removeEventListener("click", checkPauseClick, false);
        window.removeEventListener("touchstart", checkPauseTouch, false);
    
        // Видаліть слухачів подій руху
        window.removeEventListener("keydown", movePlayerKeyboard, false);
        window.removeEventListener("keydown", drawPauseMenu, false);
        window.removeEventListener("touchstart", movePlayerTouch, false);
        window.removeEventListener("resize", resizeMaze, false);
    
        clearInterval(timerInterval);
    
        clearCanvas();
    
        drawMaze();
        drawPlayer(playerPosX, playerPosY);
        blurMaze();
        drawIcon();
    
        if (touchCapable) {
            drawTouchControls();
        }
    
        menuContext.font = "60px Philosopher";
        menuContext.fillStyle = "#D2E3E7";
        menuContext.strokeStyle = "#D2E3E7";
        menuContext.fillText("ПРИЗУПИНЕНО",
                             0.5 * menuCanvas.width,
                             0.25 * menuCanvas.height);
    
        // Розміри пунктів меню
        menuBoxWidth = 0.5 * menuCanvas.width;
        menuBoxHeight = 0.2 * menuCanvas.height - 10;
    
        // Малюємо поля пунктів меню
        menuContTopLeftX = 0.5 * (menuCanvas.width - menuBoxWidth);
        menuContTopLeftY = 0.4 * menuCanvas.height - 0.5 * menuBoxHeight;
        drawRect(menuContTopLeftX, menuContTopLeftY,
                 menuBoxWidth, menuBoxHeight,
                 menuContext,
                 RANDOM_FILL_COLOUR, "#0b163b");
    
        menuRestartTopLeftX = 0.5 * (menuCanvas.width - menuBoxWidth);
        menuRestartTopLeftY = 0.6 * menuCanvas.height - 0.5 * menuBoxHeight;
        drawRect(menuRestartTopLeftX, menuRestartTopLeftY,
                 menuBoxWidth, menuBoxHeight,
                 menuContext,
                 MESSAGE_FILL_COLOUR, "#0b163b");
    
        menuQuitTopLeftX = 0.5 * (menuCanvas.width - menuBoxWidth);
        menuQuitTopLeftY = 0.8 * menuCanvas.height - 0.5 * menuBoxHeight;
        drawRect(menuQuitTopLeftX, menuQuitTopLeftY,
                 menuBoxWidth, menuBoxHeight,
                 menuContext,
                 PLAYER_COLOUR, "#0b163b");
    
        menuContext.fillStyle = "#0b163b";
        menuContext.fillText("Продовжити",
                             0.5 * menuCanvas.width,
                             0.4 * menuCanvas.height);
        menuContext.fillText("Перезапустити",
                             0.5 * menuCanvas.width,
                             0.6 * menuCanvas.height)
        menuContext.fillText("Завершити",
                             0.5 * menuCanvas.width,
                             0.8 * menuCanvas.height);
    
        // Додавання слухачів подій меню
        window.addEventListener("keydown", pauseMenuKeyboardSelection, false);
        window.addEventListener("click", pauseMenuMouseSelection, false);
        window.addEventListener("touchstart", pauseMenuTouchSelection, false);
    
        // Слухач зміни розміру полотна
        window.addEventListener("resize", resizePauseMenu, false);
    }
    
    function pauseMenuKeyboardSelection(evt) {
        // Перевірити, чи гравець обирає щось у меню паузи
    
        switch (evt.keyCode) {
            case 67:  // `c` для продовження
            case 27:  // Escape також ставить на паузу
                resumeGame();
                break;
            case 82:  // `r` для перезапуску
                restartCurrentGame();
                break;
            case 81:  // `q` вийти
                quitGame();
                break;
        }
    }
    
    function pauseMenuMouseSelection(evt) {
        // Перевірити, чи не натиснуто кнопки продовжити, перезапустити та вийти з гри 
    
        var clickX = evt.pageX;
        var clickY = evt.pageY;
    
        pauseMenuCheckPos(clickX, clickY);
    }
    
    function pauseMenuTouchSelection(evt) {
        // Перевірити, чи не торкнулися ви одного з пунктів продовжити, перезапустити або вийти з гри в ігровому меню
    
        // Ми хочемо записувати лише окремі дотики
        evt.preventDefault();
    
        var touchX = evt.targetTouches[0].pageX;
        var touchY = evt.targetTouches[0].pageY;
    
        pauseMenuCheckPos(touchX, touchY);
    }
    
    function pauseMenuCheckPos(x, y) {
        // Перевірити, чи знаходиться позиція (`x`,`y`) в межах будь-якого поля параметрів
    
        if (x >= menuContTopLeftX && x <= menuContTopLeftX + menuBoxWidth &&
            y >= menuContTopLeftY && y <= menuContTopLeftY + menuBoxHeight) {
            resumeGame();
        }
    
        if (x >= menuRestartTopLeftX && x <= menuRestartTopLeftX + menuBoxWidth &&
            y >= menuRestartTopLeftY && y <= menuRestartTopLeftY + menuBoxHeight) {
            restartCurrentGame();
        }
    
        if (x >= menuQuitTopLeftX && x <= menuQuitTopLeftX + menuBoxWidth &&
            y >= menuQuitTopLeftY && y <= menuQuitTopLeftY + menuBoxHeight) {
            quitGame();
        }
    }
    
    function checkPauseClick(evt) {
        // Check whether the player has clicked the pause button
    
        var clickX = evt.pageX;
        var clickY = evt.pageY;
    
        checkPauseButton(clickX, clickY);
    }
    
    function checkPauseTouch(evt) {
        // Перевірте, чи натиснув гравець кнопку паузи
    
        var touchX = evt.targetTouches[0].pageX;
        var touchY = evt.targetTouches[0].pageY;
    
        checkPauseButton(touchX, touchY);
    }
    
    function checkPauseButton(x, y) {
        // Перевірити, чи точка (`x`,`y`) знаходиться в межах кнопки паузи
    
        if (x >= PAUSE_OFFSET_X &&
            x <= PAUSE_OFFSET_X + BOX_WIDTH &&
            y >= menuCanvas.height - PAUSE_OFFSET_Y - BOX_HEIGHT &&
            y <= menuCanvas.height - PAUSE_OFFSET_Y) {
            drawPauseMenu();
        }
    }
    
    function resumeGame() {
        // Продовжити гру з того місця, де гравець зупинився
        unblurMaze();
    
        // Якщо гра триває, продовжуйте відлік часу з того місця, на якому він був зупинений
        if (hasStarted && !hasLost && !hasWon) {
            createTimer(timeLeft);
        }
    
        drawAll(playerPosX, playerPosY);
    
        // Видалити слухачів подій меню
        window.removeEventListener("keydown", pauseMenuKeyboardSelection, false);
        window.removeEventListener("click", pauseMenuMouseSelection, false);
        window.removeEventListener("touchstart", pauseMenuTouchSelection, false);
    
        window.removeEventListener("resize", resizePauseMenu);
    
        // Повернути звичайних слухачів ігрових подій
        window.addEventListener("keydown", movePlayerKeyboard, false);
        window.addEventListener("touchstart", movePlayerTouch, false);
    
        window.addEventListener("keydown", checkEscape, false);
        window.addEventListener("click", checkPauseClick, false);
        window.addEventListener("touchstart", checkPauseTouch, false);
    
        window.addEventListener("resize", resizeMaze, false);
    }
    
    function restartCurrentGame() {
        // Зберігаємо поточний лабіринт, але перезапускаємо гру, замінивши всі фішки
    
        unblurMaze();
    
        // Скинути ігрові змінні
        playerPosX = playerPosY = 0;
        hasStarted = hasWon = hasLost = false;
        randomCounter = solutionCounter = 0;
        timeLeft = INITIAL_TIME;
    
        // Замінити всі зібрані фішки
        removeCounters();
        placeCounters();
    
        drawAll(playerPosX, playerPosY);
    
        // Remove the menu event listeners
        window.removeEventListener("keydown", pauseMenuKeyboardSelection, false);
        window.removeEventListener("click", pauseMenuMouseSelection, false);
        window.removeEventListener("touchstart", pauseMenuTouchSelection, false);
        window.removeEventListener("resize", resizePauseMenu);
    
        // Видалити слухачів подій меню
        window.addEventListener("keydown", movePlayerKeyboard, false);
        window.addEventListener("touchstart", movePlayerTouch, false);
    
        window.addEventListener("keydown", checkEscape, false);
        window.addEventListener("click", checkPauseClick, false);
        window.addEventListener("touchstart", checkPauseTouch, false);
    
        window.addEventListener("resize", resizeMaze, false);
    }
    
    function quitGame() {
        // Вийти з поточної гри та повернутися до екрана головного меню
    
        unblurMaze();
    
        // Перемальовувати головне меню, виходячи з поточної гри
        drawMenu();
    
        // Видалити слухачів подій меню
        window.removeEventListener("keydown", pauseMenuKeyboardSelection, false);
        window.removeEventListener("click", pauseMenuMouseSelection, false);
        window.removeEventListener("touchstart", pauseMenuTouchSelection, false);
        window.removeEventListener("resize", resizePauseMenu);
    }
    
    function drawPauseButton() {
        // Малює маленьку кнопку паузи внизу ліворуч для натискання/торкання на місці клавіші Escape
    
        menuContext.globalAlpha = 0.5;
    
        menuContext.fillStyle = END_FILL_COLOUR;
        menuContext.strokeStyle = END_STROKE_COLOUR;
        menuContext.lineWidth = 5;
    
        drawRect(PAUSE_OFFSET_X,
                 menuCanvas.height - BOX_HEIGHT - PAUSE_OFFSET_Y,
                 BOX_WIDTH,
                 BOX_HEIGHT,
                 menuContext,
                 END_FILL_COLOUR, END_STROKE_COLOUR);
    
        menuContext.lineWidth = 10;
        drawLine(PAUSE_OFFSET_X + 0.33 * BOX_WIDTH,
                 menuCanvas.height - PAUSE_OFFSET_Y - 0.75 * BOX_HEIGHT,
                 PAUSE_OFFSET_X + 0.33 * BOX_WIDTH,
                 menuCanvas.height - PAUSE_OFFSET_Y - 0.25 * BOX_HEIGHT,
                 menuContext);
        drawLine(PAUSE_OFFSET_X + 0.66 * BOX_WIDTH,
                 menuCanvas.height - PAUSE_OFFSET_Y - 0.75 * BOX_HEIGHT,
                 PAUSE_OFFSET_X + 0.66 * BOX_WIDTH,
                 menuCanvas.height - PAUSE_OFFSET_Y - 0.25 * BOX_HEIGHT,
                 menuContext);
        menuContext.lineWidth = 1;
    
        menuContext.globalAlpha = 1;
    }
    
    // ------------------------------
    // Функції динамічної розмірності
    // ------------------------------
    
    function clearCanvas() {
        // Очищає полотно, встановлюючи ширину та висоту полотна
    
        mazeCanvas.width = mazeCanvas.width;
        mazeCanvas.height = mazeCanvas.height;
    
        menuCanvas.width = menuCanvas.width;
        menuCanvas.height = menuCanvas.height;
    
        menuContext.textAlign = mazeContext.textAlign = "center";
        menuContext.textBaseline = mazeContext.textBaseline = "middle";
    }
    
    function resizeMenu() {
        // Змінює розмір полотна на розмір вікна
    
        menuCanvas.width = mazeCanvas.width = canvasDiv.clientWidth - 20;
        menuCanvas.height = mazeCanvas.height = canvasDiv.clientHeight - 20;
    
        menuContext.textAlign = mazeContext.textAlign = "center";
        menuContext.textBaseline = mazeContext.textBaseline = "middle";
    
        cellWidth = mazeCanvas.width / m;
        cellHeight = mazeCanvas.height / n;
        playerWidth = 0.85 * cellWidth;
        playerHeight = 0.85 * cellHeight;
        circleRad = cellWidth >= cellHeight ? 0.2 * cellHeight : 0.2 * cellWidth;
    
        drawMenu(playerPosX, playerPosY);
    }
    
    function resizePauseMenu() {
        // Динамічно змінювати розмір меню швидкого виклику
    
        menuCanvas.width = mazeCanvas.width = canvasDiv.clientWidth - 20;
        menuCanvas.height = mazeCanvas.height = canvasDiv.clientHeight - 20;
    
        menuContext.textAlign = mazeContext.textAlign = "center";
        menuContext.textBaseline = mazeContext.textBaseline = "middle";
    
        cellWidth = mazeCanvas.width / m;
        cellHeight = mazeCanvas.height / n;
        playerWidth = 0.85 * cellWidth;
        playerHeight = 0.85 * cellHeight;
        circleRad = cellWidth >= cellHeight ? 0.2 * cellHeight : 0.2 * cellWidth;
    
        drawPauseMenu();
    }
    
    function resizeMaze() {
        // Змінює розмір полотна на розмір вікна
    
        menuCanvas.width = mazeCanvas.width = canvasDiv.clientWidth - 20;
        menuCanvas.height = mazeCanvas.height = canvasDiv.clientHeight - 20;
    
        menuContext.textAlign = mazeContext.textAlign = "center";
        menuContext.textBaseline = mazeContext.textBaseline = "middle";
    
        cellWidth = mazeCanvas.width / m;
        cellHeight = mazeCanvas.height / n;
        playerWidth = 0.85 * cellWidth;
        playerHeight = 0.85 * cellHeight;
        circleRad = cellWidth >= cellHeight ? 0.2 * cellHeight : 0.2 * cellWidth;
    
        drawAll(playerPosX, playerPosY);
    }
    
    // ---------------------------------------------------------------------
    // Функція для ініціалізації лабіринту, малювання всіх елементів та 
    // налаштування слухачів подій для руху
    // ---------------------------------------------------------------------
    
    function initialiseGame(difficulty) {
        // Перезавантажуємо, будуємо і розгадуємо лабіринт, потім малюємо всі елементи і налаштовуємо слухачів
    
        switch (difficulty) {
            case "easy":
                m = 10, n = 10;
                break;
            case "medium":
                m = 15; n = 15;
                break;
            case "hard":
                m = 20, n = 20;
                break;
            case "insane":
                m = 50, n = 50;
                break;
        }
    
        // Обчислити всі змінні, залежні від розміру
        maze = createArray(m, n);
        start= [0, 0];
        end = [m - 1, n - 1];
        cellWidth = mazeCanvas.width / m;
        cellHeight = mazeCanvas.height / n;
        playerWidth = 0.85 * cellWidth;
        playerHeight = 0.85 * cellHeight;
        circleRad = cellWidth >= cellHeight ? 0.2 * cellHeight : 0.2 * cellWidth;
    
        // Скинути ігрові змінні
        playerPosX = playerPosY = 0;
        hasStarted = hasWon = hasLost = false;
        solutionCounter = solutionTotal = 0;
        randomCounter = randomTotal = 0;
        timeLeft = INITIAL_TIME;
    
        initialiseMaze();
        buildMaze();
        placeSolutionCounters();
        placeRandomCounters();
    
        // Переконайтеся, що лабіринт не розмитий
        unblurMaze();
    
        drawAll(start[0], start[1]);
    
        // Слухачі подій Руху
        window.addEventListener("keydown", movePlayerKeyboard, false);
        window.addEventListener("touchstart", movePlayerTouch, false);
    
        // Слухачі подій в ігровому меню
        window.addEventListener("keydown", checkEscape, false);
        window.addEventListener("click", checkPauseClick, false);
        window.addEventListener("touchstart", checkPauseTouch, false);
    
        // Слухач події зміни розміру полотна
        window.addEventListener("resize", resizeMaze, false);
    }
    
    })();