/**
 * PickPlot Order Picker - Main Logic
 * Covers UI state, parsing, and Breadth-First Search (BFS) routing.
 */

// Sample Data Definitions representing different NxM grid sizes
const examples = [
    {   // 6x7 Asymmetric 
        "grid": [
            [0, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 0, 0]
        ],
        "start": [0, 0],
        "target": [3, 5]
    },
    {   // 4x5 Asymmetric
        "grid": [
            [0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0],
            [1, 1, 0, 0, 0]
        ],
        "start": [2, 0],
        "target": [0, 4]
    },
    {   // 5x5 Symmetric
        "grid": [
            [0, 0, 0, 1, 0],
            [1, 1, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0]
        ],
        "start": [0, 0],
        "target": [4, 4]
    },
    {   // 2x3 Asymmetric
        "grid": [
            [0, 0, 1],
            [1, 0, 0]
        ],
        "start": [1, 2],
        "target": [0, 0]
    },
    {   // 8x4 Asymmetric (Tall)
        "grid": [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [1, 1, 0, 1],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [1, 0, 1, 0]
        ],
        "start": [7, 1],
        "target": [0, 3]
    },
    {   // 3x8 Asymmetric (Wide)
        "grid": [
            [0, 0, 1, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 0, 0]
        ],
        "start": [0, 0],
        "target": [2, 7]
    }
];

// DOM Elements
const elements = {
    jsonInput: document.getElementById('json-input'),
    jsonOutput: document.getElementById('json-output'),
    inputError: document.getElementById('input-error'),
    btnLoadExample: document.getElementById('btn-load-example'),
    btnClearGrid: document.getElementById('btn-clear-grid'),
    btnFindRoute: document.getElementById('btn-find-route'),
    gridContainer: document.getElementById('grid-container'),
    metrics: document.getElementById('metrics'),
    timeVal: document.getElementById('time-val'),
    stepsVal: document.getElementById('steps-val'),
    errorModal: document.getElementById('error-modal'),
    btnCloseModal: document.getElementById('btn-close-modal')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // pre-fill the UI empty to wait for user, but we can do it empty.
});

// --- Event Listeners ---

elements.btnLoadExample.addEventListener('click', () => {
    // Pick a random example from the array
    const randomIndex = Math.floor(Math.random() * examples.length);
    const exampleData = examples[randomIndex];

    elements.jsonInput.value = JSON.stringify(exampleData, null, 2);
    elements.inputError.classList.add('hidden');
    renderGrid(exampleData);
});

elements.btnClearGrid.addEventListener('click', () => {
    elements.jsonInput.value = '';
    elements.jsonOutput.value = '';
    elements.gridContainer.innerHTML = '';
    elements.metrics.classList.add('hidden');
    elements.inputError.classList.add('hidden');
});

// Close Custom Modal
elements.btnCloseModal.addEventListener('click', () => {
    elements.errorModal.classList.add('hidden');
});

// Normalization function to handle legacy plural "targets" or nested array targets
function normalizeData(data) {
    if (data.targets && Array.isArray(data.targets) && data.targets.length > 0 && !data.target) {
        data.target = data.targets[0];
    }
    // Deep unwrap if someone put "target": [[row, col]] instead of [row, col]
    if (data.target && Array.isArray(data.target) && Array.isArray(data.target[0])) {
        data.target = data.target[0];
    }
}

elements.jsonInput.addEventListener('input', () => {
    try {
        const val = elements.jsonInput.value.trim();
        if (!val) return;
        const data = JSON.parse(val);
        normalizeData(data);
        elements.inputError.classList.add('hidden');
        renderGrid(data);
    } catch (e) {
        // Just fail silently when typing partial JSON
    }
});

elements.btnFindRoute.addEventListener('click', () => {
    elements.inputError.classList.add('hidden');
    elements.jsonOutput.style.color = "var(--text-muted)";

    let data;
    try {
        const val = elements.jsonInput.value.trim();
        if (!val) {
            elements.inputError.textContent = "Please enter JSON input first.";
            elements.inputError.classList.remove('hidden');
            return;
        }
        data = JSON.parse(val);
        normalizeData(data);
    } catch (e) {
        elements.inputError.textContent = "Invalid JSON format.";
        elements.inputError.classList.remove('hidden');
        return;
    }

    // Validate overall structure
    if (!data.grid || !data.start || !data.target) {
        elements.inputError.textContent = "JSON must contain 'grid', 'start', and 'target' keys.";
        elements.inputError.classList.remove('hidden');
        return;
    }

    // Validate array formats
    if (!Array.isArray(data.grid) || !Array.isArray(data.start) || !Array.isArray(data.target)) {
        elements.inputError.textContent = "Properties must be arrays. 'target' must be a single coordinate array like [3, 5].";
        elements.inputError.classList.remove('hidden');
        return;
    }

    // Validate target is strictly one coordinate
    if (typeof data.target[0] !== 'number' || typeof data.target[1] !== 'number') {
        elements.inputError.textContent = "'target' must be exactly one coordinate array e.g. [row, col].";
        elements.inputError.classList.remove('hidden');
        return;
    }

    // Process & Visualize
    calculateAndVisualize(data);
});

// --- Core Algorithm (BFS) ---

/**
 * Finds shortest route to visit a single target
 */
function findOptimalRoute(grid, start, target) {
    // If missing target
    if (!target || target.length !== 2) {
        return { path: [start], total_steps: 0, target_reached: false };
    }

    const rows = grid.length;
    let cols = 0;
    if (rows > 0) cols = grid[0].length;

    // Check if start or target is strictly out of bounds or an obstacle
    if (isOutOfBounds(start[0], start[1], rows, cols) || grid[start[0]][start[1]] === 1 ||
        isOutOfBounds(target[0], target[1], rows, cols) || grid[target[0]][target[1]] === 1) {
        return { path: [], total_steps: 0, target_reached: false };
    }

    const result = bfsSingle(grid, start, target, rows, cols);

    if (!result.found) {
        return { path: [], total_steps: 0, target_reached: false };
    }

    return {
        path: result.path,
        total_steps: result.path.length > 0 ? result.path.length - 1 : 0,
        target_reached: true
    };
}

/**
 * Queue-driven BFS from a start to a single target
 */
function bfsSingle(grid, start, target, rows, cols) {
    if (start[0] === target[0] && start[1] === target[1]) {
        return { found: true, path: [[...start]] };
    }

    const queue = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = new Map(); // key "r,c" -> [pr, pc]

    queue.push(start);
    visited[start[0]][start[1]] = true;

    // Ordered allowed movements: Up, Down, Left, Right
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    let found = false;

    while (queue.length > 0) {
        const [r, c] = queue.shift();

        if (r === target[0] && c === target[1]) {
            found = true;
            break;
        }

        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            // Conditions: within bounds, not visited, not obstacle (1).
            // (2 is target, 0 is walkable path).
            if (!isOutOfBounds(nr, nc, rows, cols) && !visited[nr][nc] && grid[nr][nc] !== 1) {
                visited[nr][nc] = true;
                parent.set(`${nr},${nc}`, [r, c]);
                queue.push([nr, nc]);
            }
        }
    }

    if (!found) {
        return { found: false, path: [] };
    }

    // Reconstruct shortest path by following parents from target to start
    const path = [];
    let currNode = target;
    while (currNode !== undefined) {
        path.push(currNode);
        const key = `${currNode[0]},${currNode[1]}`;
        currNode = parent.get(key);
    }

    // Reverse since we navigated from target -> start
    path.reverse();

    return { found: true, path: path };
}

function isOutOfBounds(r, c, rows, cols) {
    return r < 0 || r >= rows || c < 0 || c >= cols;
}

// --- Visualization & Output ---

function calculateAndVisualize(data) {
    // 1. Compute Output
    const t0 = performance.now();
    const result = findOptimalRoute(data.grid, data.start, data.target);
    const t1 = performance.now();
    const execTime = Math.round(t1 - t0);

    const outputJson = {
        total_steps: result.total_steps,
        path: result.path,
        target_reached: result.target_reached,
        execution_time_ms: execTime
    };

    // 2. Format Output View
    elements.jsonOutput.value = JSON.stringify(outputJson, null, 2);

    // Update Metrics Dashboard
    elements.metrics.classList.remove('hidden');
    elements.timeVal.textContent = `${execTime}ms`;

    if (result.target_reached) {
        elements.stepsVal.textContent = result.total_steps;
        elements.timeVal.style.color = "var(--text-main)";
        elements.stepsVal.style.color = "var(--text-main)";
        elements.jsonOutput.style.color = "var(--text-main)";
    } else {
        // Show our beautiful custom modal instead of alert()
        elements.errorModal.classList.remove('hidden');

        elements.stepsVal.textContent = "There is no path available";
        elements.timeVal.style.color = "var(--error)";
        elements.stepsVal.style.color = "var(--error)";
        elements.jsonOutput.style.color = "var(--error)";
    }

    // 3. Clear/Draw base Grid
    renderGrid(data);

    // 4. Animate the Path if reached
    if (result.target_reached && result.path.length > 0) {
        animatePath(result.path, data.start, data.target);
    }
}

function renderGrid(data) {
    try {
        const grid = data.grid;
        if (!grid || !Array.isArray(grid)) return;

        const rows = grid.length;
        if (rows === 0) return;
        const cols = grid[0].length;

        // Visual sanity limit
        if (rows > 80 || cols > 80) {
            elements.gridContainer.innerHTML = '<div>Grid dimensions exceed visualizer limit (max 80x80). Check JSON output below.</div>';
            return;
        }

        // Configure CSS Grid
        elements.gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        // Optional row setting makes cells square depending on container height:
        // By relying on gap and css, we just let width define size or use flex.
        elements.gridContainer.innerHTML = '';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellVal = grid[r][c];
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('grid-cell');
                cellDiv.id = `cell-${r}-${c}`;

                // Assign cell behavior classes
                if (cellVal === 1) {
                    cellDiv.classList.add('obstacle');
                } else if (cellVal === 2 || isTarget(r, c, data.target)) {
                    cellDiv.classList.add('target');
                }

                // Note: start takes visual precedence over target or obstacle in our UI
                if (data.start && data.start[0] === r && data.start[1] === c) {
                    cellDiv.classList.add('start');
                }

                elements.gridContainer.appendChild(cellDiv);
            }
        }
    } catch (e) {
        console.error("Render error: ", e);
    }
}

function isTarget(r, c, target) {
    if (!target || target.length < 2) return false;
    return target[0] === r && target[1] === c;
}

/**
 * Sequential delayed animation for green path highlight
 */
function animatePath(path, start, target) {
    let delay = 0;
    const animationSpeedMs = 100; // Delay per step: increased slightly for smoother perception 

    // Filter out start and target so we don't accidentally overwrite them
    const pathNodes = path.filter(coords => {
        const [r, c] = coords;
        const isStart = (r === start[0] && c === start[1]);
        const isTgt = isTarget(r, c, target);
        return !isStart && !isTgt;
    });

    pathNodes.forEach((coords, idx) => {
        const [r, c] = coords;

        setTimeout(() => {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) {
                // To guarantee animation runs and overtakes base rules
                cell.className = 'grid-cell path';
            }
        }, delay);

        delay += animationSpeedMs;
    });
}
