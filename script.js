const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 640; canvas.height = 480;

// Game State
let player = { x: 2, y: 2, dir: 0, sanity: 100 };
let ghost = { x: 8, y: 8, active: false, type: "Oni" };
const map = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// Input Handling
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    // Movement
    if (keys['ArrowUp']) { player.x += Math.cos(player.dir) * 0.05; player.y += Math.sin(player.dir) * 0.05; }
    if (keys['ArrowLeft']) player.dir -= 0.05;
    if (keys['ArrowRight']) player.dir += 0.05;

    // Sanity Drain
    if (player.sanity > 0) player.sanity -= 0.01;
    document.getElementById('sanity').innerText = Math.floor(player.sanity);

    // Ghost Logic: If sanity < 50, start a "Hunt"
    if (player.sanity < 50 && Math.random() < 0.01) {
        ghost.active = true;
        document.getElementById('message').innerText = "HUNTING!";
    }
}

function draw() {
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, canvas.width, canvas.height); // Floor/Ceiling
    
    // Simple Raycaster
    for (let i = 0; i < canvas.width; i++) {
        let rayAngle = (player.dir - 0.5) + (i / canvas.width);
        let distance = 0;
        let hitWall = false;

        while (!hitWall && distance < 15) {
            distance += 0.1;
            let testX = Math.floor(player.x + Math.cos(rayAngle) * distance);
            let testY = Math.floor(player.y + Math.sin(rayAngle) * distance);
            if (map[testY] && map[testY][testX] === 1) hitWall = true;
        }

        // Render Wall Slice
        let ceiling = canvas.height / 2 - canvas.height / distance;
        let floor = canvas.height - ceiling;
        let color = 255 / (distance * 0.5); // Depth shading
        ctx.strokeStyle = `rgb(${color/2}, ${color/2}, ${color/1.5})`;
        ctx.beginPath();
        ctx.moveTo(i, ceiling);
        ctx.lineTo(i, floor);
        ctx.stroke();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
