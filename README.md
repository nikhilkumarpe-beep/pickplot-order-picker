# PickPlot Order Picker

> A browser-based warehouse route visualization tool that demonstrates shortest-path planning with Breadth-First Search (BFS).

## Overview

PickPlot models a simple warehouse grid containing walkable cells, obstacles, a starting location, and a target location. Users can provide a grid configuration, run the pathfinding algorithm, and watch the selected route being reconstructed and animated in the browser.

The project was built to combine **algorithmic problem solving** with a practical browser-based visualization.

## Key Features

- Interactive warehouse-style grid visualization
- Configurable JSON input
- Random example scenarios
- BFS shortest-path routing
- Obstacle-aware navigation
- Animated route visualization
- Step-count and execution-time metrics
- Input validation and error handling
- Responsive frontend interface
- No backend or package installation required

## Tech Stack

| Area | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| Programming | JavaScript (ES6+) |
| Algorithms | Breadth-First Search (BFS) |
| Browser APIs | DOM APIs |

## How It Works

The warehouse grid can be treated as a graph where each walkable cell is a node and valid neighboring cells represent possible movements.

1. The user defines a grid, start point, and target.
2. The application validates the input.
3. BFS explores reachable cells level by level using a queue.
4. Obstacles, visited cells, and invalid positions are skipped.
5. Parent information is stored while exploring the grid.
6. Once the target is reached, the parent relationships are used to reconstruct the route.
7. The resulting route is displayed and animated in the browser.

BFS produces a shortest path when every movement has the same cost.

## Project Structure

```text
pickplot-order-picker/
├── index.html      # Application structure
├── script.js       # Grid logic, BFS, validation and visualization
├── style.css       # Interface styling and responsive layout
└── README.md       # Project documentation
```

## Run Locally

```bash
git clone https://github.com/nikhilkumarpe-beep/pickplot-order-picker.git
cd pickplot-order-picker
```

Open `index.html` in a modern web browser.

No server, backend, or dependency installation is required for the current version.

## Example Input

```json
{
  "grid": [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0]
  ],
  "start": [0, 0],
  "target": [2, 3]
}
```

- `0` = walkable cell
- `1` = obstacle
- `start` = route starting coordinate
- `target` = destination coordinate

## Engineering Concepts Demonstrated

This project demonstrates practical experience with:

- Breadth-First Search and graph traversal
- Queues and visited-state tracking
- Path reconstruction
- JavaScript arrays, maps, and control flow
- DOM manipulation
- Event-driven browser interactions
- JSON parsing and input validation
- Algorithm visualization
- Separation of HTML, CSS, and JavaScript responsibilities

## Possible Extensions

- Weighted warehouse paths with Dijkstra's algorithm
- A* pathfinding and algorithm comparison
- Multiple orders and destination sequences
- Route optimization metrics
- Automated unit and integration tests
- Accessibility and keyboard navigation
- Larger warehouse layouts and performance benchmarking

## Author

**Nikhil Kumar PE**

Computer Science Engineering student focused on building practical software projects and strengthening problem-solving skills through implementation.
