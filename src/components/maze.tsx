"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Flag, MapPin, RotateCcw, Trash2 } from "lucide-react";

type CellType = "empty" | "wall" | "startPoint" | "endPoint";
interface Position {
  row: number;
  col: number;
}

const GRID_SIZE = 10;

export default function Maze() {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [drawMode, setDrawMode] = useState<"wall" | "startPoint" | "endPoint">(
    "wall"
  );
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);

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

  const startVisualization = () => {};
  const resetVisualization = () => {};
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
          onClick={startVisualization}
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
                className={`w-10 h-10 sm:w-10 sm:h-10 cursor-pointer ${getHoverClass()}                 
                )} ${getCellClass(cell)}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
