let tiles = [];
let visited = [];
const w = 40;
const h = 40;
const minSize = 10;

function setup() {
    createCanvas(600, 600);

    for(let j = 0; j < h; j++) {
        for(let i = 0; i < w; i++) {
            const solid = random(1) < 0.45;
            tiles.push(solid);
        }
    }

    noStroke();
}

function draw() {
    background(220);
    const cellSize = width/w;

    for(let j = 0; j < h; j++) {
        for(let i = 0; i < w; i++) {
            const solid = isSolid(i, j);
            if(solid) {
                fill(0);
            } else {
                fill(255);
            }
            square(i * cellSize, j * cellSize, cellSize);
        }
    }
}

function mouseReleased() {
    iterateTiles();

    let regions = getRegions();
    console.log("Regions found:", regions.length);

    // Remove disconnect regions (keep largest)
    // let largest = getLargestRegion(regions);
    // removeRegions(regions, largest);
    // regions = getRegions;

    regions = filterRegions(regions, 10);
    connectRegions(regions);
}

function iterateTiles() {
    let newTiles = [];

    for(let j = 0; j < h; j++) {
        for(let i = 0; i < w; i++) {
            const num = numWallsAround(i, j);
            const newTile = num >= 4;

            newTiles.push(newTile);
        }
    }
    tiles = newTiles;
}

function numWallsAround(x, y) {
    let num = 0;
    for(let j = -1; j <= 1; j++) {
        for(let i = -1; i <= 1; i++) {
            if(i === 0 && j === 0) continue;
            if(isSolid(x + i, y + j)) {
                num++;
            }
        }
    }
    return num;
}

function isSolid(x, y) {
    if(x < 0 || y < 0 || x >= w || y >= h) {
        return true;
    }
    return tiles[index(x, y)];
}

// Find Regions
function getRegions() {
    visited = new Array(w * h).fill(false);
    let regions = [];

    for(let y = 0; y < h; y++) {
        for(let x = 0; x < w; x++) {
            if(!visited[index(x, y)] && !isSolid(x, y)) {
                let region = floodFill(x, y);
                regions.push(region);
            }
        }
    }
    return regions;
}

function filterRegions(regions, minSize) {
    let filtered = [];

    for(let region of regions) {
        if(region.length >= minSize) {
            filtered.push(region);
        }
    }
    return filtered;
}

function getLargestRegion(regions) {
    let largest = regions[0];

    for(let r of regions) {
        if(r.length > largest.length) {
            largest = r;
        }
    }
    return largest;
}

// function removeRegions(regions, keepRegion) {
//     for(let region of regions) {
//         if(region === keepRegion) continue;
//         for(let tile of region) {
//             tiles[index(tile.x, tile.y)] = true;
//         }
//     }
// }

function floodFill(x, y) {
    let stack = [[x, y]];
    let region = [];

    while(stack.length > 0) {
        let[x, y] = stack.pop();
        if(x < 0 || y < 0 || x >= w || y >= h) continue;
        let idx = index(x, y);
        if(visited[idx]) continue;
        if(isSolid(x, y)) continue;
        visited[idx] = true;
        region.push({x, y});
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y -1]);
    }
    return region;
}

function index(x, y) {
    return x+ y * w;
}

// Connect Regions Using Tunnels
function connectRegions(regions) {
    if(regions.length <= 1) return;
    let connected = [regions[0]];
    let unconnected = regions.slice(1);

    while(unconnected.length > 0) {
        let bestDistance = Infinity;
        let bestA = null;
        let bestB = null;
        let bestIndex = -1;

        for(let i = 0; i < unconnected.length; i++) {
            let regionB = unconnected[i];
            for(let regionA of connected) {
                for(let tileA of regionA) {
                    for(let tileB of regionB) {
                        let dx = tileA.x - tileB.x;
                        let dy = tileA.y - tileB.y;
                        let distSq = dx * dx + dy * dy;

                        if(distSq < bestDistance) {
                            bestDistance = distSq;
                            bestA = tileA;
                            bestB = tileB;
                            bestIndex = i;
                        }
                    }
                }
            }
        }
        carveTunnel(bestA.x, bestA.y, bestB.x, bestB.y);
        connected.push(unconnected[bestIndex]);
        unconnected.splice(bestIndex, 1);
    }
}

function carveTunnel(x1, y1, x2, y2) {
    let x = x1;
    let y = y1;

    while(x !== x2 || y !== y2) {
        tiles[index(x, y)] = false;
        if (x !== x2) x += (x2 > x) ? 1 : -1;
        if (y !== y2) y += (y2 > y) ? 1 : -1;
    }
    tiles[index(x, y)] = false;
}
