"use client";

import { useState, useEffect } from "react";

// Tipos de células
type CellType = "empty" | "wall" | "startPoint" | "endPoint";

const GRID_SIZE = 10;

export default function Maze() {
  const [grid, setGrid] = useState<CellType[][]>([]);

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

  return (
    <div className="flex flex-col items-center">
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
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-10 h-10 sm:w-10 sm:h-10 cursor-pointer bg-white`}
                onClick={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
