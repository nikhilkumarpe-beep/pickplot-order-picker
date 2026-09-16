# PickPlot Order Picker

A browser-based warehouse route visualization project that uses **Breadth-First Search (BFS)** to find and animate a shortest path through a configurable grid.

## What it does

PickPlot lets a user define a warehouse-style grid containing walkable cells, obstacles, a start point, and a target. The application validates the input, runs BFS, displays the shortest route, and visualizes the result directly in the browser.

## Features

- Interactive warehouse grid visualization
- Configurable JSON grid input
- Random example scenarios
- BFS shortest-path routing
- Obstacle-aware navigation
- Route animation
- Step-count and execution-time metrics
- Input validation and error handling
- Responsive frontend interface

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Browser DOM APIs
- Breadth-First Search (BFS)

## How the algorithm works

The route finder treats the grid as a graph:

1. Start from the selected starting cell.
2. Explore neighboring cells using a queue.
3. Ignore cells outside the grid, already visited cells, and obstacles.
4. Store each cell's parent so the route can be reconstructed.
5. Stop when the target is reached.
6. Reconstruct and animate the shortest path.

Because BFS explores nodes level by level, it finds a shortest path when every movement has the same cost.

## Project Structure

```text
pickplot-order-picker/
├── index.html
├── script.js
├── style.css
└── README.md
```

## Run locally

Clone the repository:

```bash
git clone https://github.com/nikhilkumarpe-beep/pickplot-order-picker.git
cd pickplot-order-picker
```

No backend or package installation is required for the current version. Open `index.html` in a modern browser.

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

`0` represents a walkable cell, `1` represents an obstacle, and the start/target coordinates identify the route endpoints.

## What I practiced

This project helped me strengthen practical JavaScript and algorithm skills, including:

- DOM manipulation
- Event handling
- JSON parsing and validation
- Arrays, maps, and queues
- Breadth-First Search
- Path reconstruction
- Browser-based visualization
- Separating HTML, CSS, and JavaScript responsibilities

## Future Improvements

- Add weighted paths and Dijkstra's algorithm
- Add A* pathfinding for comparison
- Support multiple targets and order sequences
- Add warehouse statistics and route comparisons
- Add automated tests
- Improve accessibility and keyboard controls

## Author

**Nikhil Kumar PE**
