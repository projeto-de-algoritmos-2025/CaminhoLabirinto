"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Flag, MapPin, RotateCcw, Trash2 } from "lucide-react";

type CellType = "empty" | "wall" | "startPoint" | "endPoint" | "visited" | "path"
interface Position {
  row: number;
  col: number;
}
interface Node {
  position: Position;
  parent: Node | null;
}

const GRID_SIZE = 10;

const ANIMATION_SPEED = 20 // ms

export default function Maze() {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [drawMode, setDrawMode] = useState<"wall" | "startPoint" | "endPoint">(
    "wall"
  );
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: CellType[][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push("empty");
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStartPosition(null);
    setEndPosition(null);
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];

    if (drawMode === "wall") {
      if (newGrid[row][col] === "wall") {
        newGrid[row][col] = "empty";
      } else if (newGrid[row][col] === "empty") {
        newGrid[row][col] = "wall";
      }
    } else if (drawMode === "startPoint") {
      if (startPosition) {
        newGrid[startPosition.row][startPosition.col] = "empty";
      }
      newGrid[row][col] = "startPoint";
      setStartPosition({ row, col });
    } else if (drawMode === "endPoint") {
      if (endPosition) {
        newGrid[endPosition.row][endPosition.col] = "empty";
      }
      newGrid[row][col] = "endPoint";
      setEndPosition({ row, col });
    }
    setGrid(newGrid);
  };

  const resetVisualization = () => { };



  const bfs = () => {
    if (!startPosition || !endPosition) {
      alert("Defina os pontos de início e fim primeiro!")
      return
    }

    setIsAnimating(true)
    resetVisualization()

    const directions = [
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
    ]

    const queue: Node[] = []

    const visited: boolean[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false))

    const startNode: Node = { position: startPosition, parent: null }
    queue.push(startNode)
    visited[startPosition.row][startPosition.col] = true

    const visitOrder: Position[] = []

    let endNode: Node | null = null

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      const { row, col } = currentNode.position

      if (row === endPosition.row && col === endPosition.col) {
        endNode = currentNode
        break
      }

      if (!(row === startPosition.row && col === startPosition.col)) {
        visitOrder.push({ row, col })
      }

      for (const dir of directions) {
        const newRow = row + dir.row
        const newCol = col + dir.col

        if (
          newRow >= 0 &&
          newRow < GRID_SIZE &&
          newCol >= 0 &&
          newCol < GRID_SIZE &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol] !== "wall"
        ) {
          const newNode: Node = {
            position: { row: newRow, col: newCol },
            parent: currentNode,
          }

          queue.push(newNode)
          visited[newRow][newCol] = true
        }
      }
    }

    const path: Position[] = []
    if (endNode) {
      let current: Node | null = endNode
      while (current && current.parent) {
        const { row, col } = current.position

        if (!(row === endPosition.row && col === endPosition.col)) {
          path.unshift({ row, col })
        }

        current = current.parent
      }
    }

    animateVisitedCells(visitOrder, path)
  };


  const animateVisitedCells = (visitedOrder: Position[], path: Position[]) => {
    let i = 0
    const visitInterval = setInterval(() => {
      if (i === visitedOrder.length) {
        clearInterval(visitInterval)

        if (path.length > 0) {
          animatePath(path)
        } else {
          setIsAnimating(false)
          if (path.length === 0 && visitedOrder.length > 0) {
            alert("Não foi possível encontrar um caminho!")
          }
        }
        return
      }

      const { row, col } = visitedOrder[i]

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        if (newGrid[row][col] === "empty") {
          newGrid[row][col] = "visited"
        }
        return newGrid
      })

      i++
    }, ANIMATION_SPEED)
  }


  const animatePath = (path: Position[]) => {
    let i = 0
    const pathInterval = setInterval(() => {
      if (i === path.length) {
        clearInterval(pathInterval)
        setIsAnimating(false)
        return
      }

      const { row, col } = path[i]

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        if (newGrid[row][col] === "visited") {
          newGrid[row][col] = "path"
        }
        return newGrid
      })

      i++
    }, ANIMATION_SPEED * 2)
  }
  const getHoverClass = () => {
    switch (drawMode) {
      case "wall":
        return "over:bg-gray-800";
      case "startPoint":
        return "hover:bg-green-500";
      case "endPoint":
        return "hover:bg-red-500 ";
      default:
        return "hover:bg-white";
    }
  };
  const getCellClass = (type: CellType) => {
    switch (type) {
      case "empty":
        return "bg-white ";
      case "wall":
        return "bg-gray-800";
      case "startPoint":
        return "bg-green-500";
      case "endPoint":
        return "bg-red-500";
      case "visited":
        return "bg-blue-300"
      case "path":
        return "bg-yellow-400"
      default:
        return "bg-white";
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Button
          onClick={() => setDrawMode("wall")}
          variant={drawMode === "wall" ? "default" : "outline"}
          className="flex items-center gap-1 cursor-pointer"
        >
          {" "}
          <Trash2 className="h-4 w-4" />
          Parede
        </Button>
        <Button
          onClick={() => setDrawMode("startPoint")}
          variant={drawMode === "startPoint" ? "default" : "outline"}
          className="flex items-center gap-1 cursor-pointer"
        >
          <MapPin className="h-4 w-4" />
          Início
        </Button>
        <Button
          onClick={() => setDrawMode("endPoint")}
          variant={drawMode === "endPoint" ? "default" : "outline"}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Flag className="h-4 w-4" /> Fim
        </Button>
        <Button
          onClick={bfs}
          disabled={isAnimating}
          className="flex items-center gap-1 cursor-pointer"
        >
          Iniciar
        </Button>
        <Button
          onClick={resetVisualization}
          variant="outline"
          className="flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </Button>
        <Button
          onClick={initializeGrid}
          variant="destructive"
          className="flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Apagar tudo
        </Button>
      </div>
      <div className="border border-black bg-gray-100 p-1 rounded-xl shadow-md">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gap: "1px",
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                className={`text-black w-10 h-10 sm:w-10 sm:h-10 cursor-pointer ${getHoverClass()}                 
                )} ${getCellClass(cell)}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {rowIndex}-{colIndex}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
