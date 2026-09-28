# PickPlot Order Picker

A browser-based warehouse route-planning visualizer that demonstrates **Breadth-First Search (BFS)** for shortest-path navigation through obstacle-based grids.

**Stack:** HTML5 · CSS3 · JavaScript · BFS

## Why this project

PickPlot turns a core data-structures concept into an interactive application. A warehouse is represented as a grid, obstacles restrict movement, and BFS finds and animates the shortest available route from a start position to a target.

## Features

- Interactive warehouse-style grid visualization
- JSON-based grid configuration
- Random example scenarios
- BFS shortest-path routing
- Obstacle-aware navigation
- Animated route reconstruction
- Step-count and execution-time metrics
- Input validation and error handling
- Responsive browser interface
- No backend or package installation required

## How the algorithm works

1. The grid is treated as an unweighted graph.
2. Each walkable cell represents a node.
3. Valid neighbouring cells represent edges.
4. BFS explores the graph level by level.
5. Parent references are stored during traversal.
6. Once the target is reached, the path is reconstructed from the target back to the start.
7. The reconstructed shortest path is animated in the interface.

Because every movement has the same cost, BFS returns a shortest path when one exists.

## Project structure

```text
pickplot-order-picker/
├── index.html
├── script.js
├── style.css
└── README.md
```

## Run locally

```bash
git clone https://github.com/nikhilkumarpe-beep/pickplot-order-picker.git
cd pickplot-order-picker
```

Open `index.html` in a modern browser. No build step or dependency installation is required.

## Example input

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
- `start` = starting coordinate
- `target` = destination coordinate

## Engineering concepts

- Breadth-First Search and graph traversal
- Queue-based exploration
- Visited-state tracking
- Parent-based path reconstruction
- JavaScript arrays, maps, and control flow
- DOM manipulation
- Event-driven browser interactions
- JSON parsing and validation
- Algorithm visualization
- Separation of structure, styling, and behaviour

## Possible extensions

- A* and Dijkstra comparison
- Weighted warehouse paths
- Multiple orders and destination sequences
- Route optimization metrics
- Automated browser tests
- Accessibility and keyboard navigation
- Performance benchmarking on larger grids

## Author

**Nikhil Kumar PE**  
Computer Science Engineering · Python · JavaScript · Data Structures & Algorithms

[GitHub](https://github.com/nikhilkumarpe-beep)
