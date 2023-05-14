import { useState } from "react";
import styled from "styled-components";
import Cell from "../Cell";
import { ICell } from "../Cell";
import CellHeader from "../CellHeader";

interface SpreadsheetProps {
  columns?: number;
  rows?: number;
}

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// TODO: fix resetting the cells isSelected and isEditing values when move to the next cell.

interface OneCell {
  isEditing?: boolean;
  isSelected?: boolean;
  value?: string;
}

const Spreadsheet = ({ rows = 10, columns = 10 }: SpreadsheetProps) => {
  const grid: OneCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
      return {
        isSelected: false,
        isEditing: false,
        value: "",
      } as OneCell;
    })
  );
  const [spreadsheetState, setSpreadsheetState] = useState<OneCell[][]>(grid);

  // TODO: is it possible to make this function a custom hook?
  const changeCellState = (
    cellUpdate: OneCell,
    columnIdx: number,
    rowIdx: number
  ) => {
    const newRow = [
      ...spreadsheetState[rowIdx].slice(0, columnIdx),
      { ...spreadsheetState[rowIdx][columnIdx], ...cellUpdate },
      ...spreadsheetState[rowIdx].slice(columnIdx + 1),
    ];
    setSpreadsheetState((spreadsheet) => [
      ...spreadsheet.slice(0, rowIdx),
      newRow,
      ...spreadsheet.slice(rowIdx + 1),
    ]);
  };

  const handleCellBlur = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: false, isSelected: false }, columnIdx, rowIdx);
  };

  const handleCellValueChange = (
    columnIdx: number,
    newValue: string,
    rowIdx: number
  ) => {
    changeCellState({ value: newValue }, columnIdx, rowIdx);
  };

  const handleCellClick = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isSelected: true, isEditing: false }, columnIdx, rowIdx);
  };

  const handleDoubleClick = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: true, isSelected: true }, columnIdx, rowIdx);
  };

  const handleKeyDown = (columnIdx: number, event: React.KeyboardEvent<HTMLInputElement>, rowIdx: number) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed");
      const currentCell = spreadsheetState[rowIdx][columnIdx];
      if (currentCell.isSelected && currentCell.isEditing) {
        // TODO: do the following:
        // Set the current cell isEditing to false and isSelected to false.
        // Add focus to the cell below.
      } else if (currentCell.isSelected && !currentCell.isEditing) {
        // Set the current cell isEditing to true.
      }
    }
  };

  return (
    <Flex>
      {spreadsheetState.map((row, rowIdx) => (
        <>
          {/* Add row of column headers */}
          {rowIdx === 0 && (
            <div key={`row-column-headers`} style={{ display: "flex" }}>
              {/* First cell in row has no value (it's empty). */}
              <CellHeader isFirstColumnCell key={`cell-0`} value="" />
              {/* Rest of the cell headers will have alphabet letters as header values. */}
              {row.map((column, columnIdx) => (
                <CellHeader
                  key={`cell-header-${rowIdx}/${columnIdx}`}
                  value={ALPHABET[columnIdx]}
                />
              ))}
            </div>
          )}
          {/* Add rest of the rows */}
          <div key={`row-${rowIdx}`} style={{ display: "flex" }}>
            {row.map((column, columnIdx) => {
              return (
                <>
                  {/* Add row headers. */}
                  {columnIdx === 0 && (
                    <CellHeader
                      isFirstColumnCell
                      key={`row-header-${rowIdx}/${columnIdx}`}
                      value={String(rowIdx + 1)}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <Cell
                    columnIdx={columnIdx}
                    isEditing={column.isEditing}
                    isSelected={column.isSelected}
                    key={`cell-${rowIdx}/${columnIdx}`}
                    onBlur={() => handleCellBlur(columnIdx, rowIdx)}
                    onChange={(newValue) =>
                      handleCellValueChange(columnIdx, newValue, rowIdx)
                    }
                    onClick={() => handleCellClick(columnIdx, rowIdx)}
                    onDoubleClick={() => handleDoubleClick(columnIdx, rowIdx)}
                    onKeyDown={(event) => handleKeyDown(columnIdx, event, rowIdx)}
                    rowIdx={rowIdx}
                    value={column.value}
                  />
                </>
              );
            })}
          </div>
        </>
      ))}
    </Flex>
  );
};

export default Spreadsheet;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
`;
