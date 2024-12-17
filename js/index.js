// Mendapatkan elemen DOM
const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');

// Inisialisasi variabel permainan
let inputDir = { x: 0, y: 0 }; // Arah gerakan
let speed = 10; // Kecepatan permainan (frame per detik)
let score = 0; // Skor saat ini
let lastPaintTime = 0; // Waktu frame terakhir
let snakeArr = [
    { x: 13, y: 15 }
];

let food = { x: 6, y: 7 };

// Mendapatkan HiScore dari localStorage
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

// Fungsi utama permainan
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Fungsi untuk mendeteksi tabrakan
function isCollide(snake) {
    // Tabrakan dengan diri sendiri
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Tabrakan dengan dinding
    if (snake[0].x > 18 || snake[0].x < 1 || snake[0].y > 18 || snake[0].y < 1) {
        return true;
    }
    return false;
}

// Fungsi utama logika permainan
function gameEngine() {
    // Memeriksa tabrakan
    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Tekan tombol enter untuk memulai ulang.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // Memeriksa apakah ular makan makanan
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        // Menambah bagian baru pada ular
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        // Memposisikan ulang makanan secara acak
        let a = 2;
        let b = 16;
        food = {
            x: Math.floor(a + (b - a + 1) * Math.random()),
            y: Math.floor(a + (b - a + 1) * Math.random())
        };
    }

    // Menggerakkan ular
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Menampilkan ular di papan
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Menampilkan makanan di papan
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Memulai permainan
window.requestAnimationFrame(main);

// Menangani input keyboard
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) { // Mencegah pembalikan arah
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;

        case "ArrowDown":
            if (inputDir.y === 0) { // Mencegah pembalikan arah
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;

        case "ArrowLeft":
            if (inputDir.x === 0) { // Mencegah pembalikan arah
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;

        case "ArrowRight":
            if (inputDir.x === 0) { // Mencegah pembalikan arah
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;

        default:
            break;
    }
});