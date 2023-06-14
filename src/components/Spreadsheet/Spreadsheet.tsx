import { MutableRefObject, useRef, useState } from "react";
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
  const formatKeyOfSpreadsheetRefMap = (rowIdx: number, columnIdx: number) =>
    `${rowIdx}/${columnIdx}`;
  // This is a ref container to hold all the spreadsheet cells refs. We populate this Map with the
  // cell refs as we create them below(<Cell />) using ref prop and passing it a ref callback.
  const spreadSheetRefMap: MutableRefObject<Map<string, HTMLInputElement> | null> =
    useRef(new Map());
  // Ref callback which will be passed to the <Cell /> component. This callback will be called
  // immediately after the component is mounted or unmounted with the element argument.
  const handleAddRef = (
    element: HTMLInputElement,
    columnIdx: number,
    rowIdx: number
  ) => {
    // Add the element to the Map.
    spreadSheetRefMap.current?.set(
      formatKeyOfSpreadsheetRefMap(rowIdx, columnIdx),
      element
    );
  };

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

  const handleKeyDown = (
    columnIdx: number,
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number
  ) => {
    if (event.key === "Enter") {
      // console.log("Enter key pressed");
      const currentCell = spreadsheetState[rowIdx][columnIdx];
      const { columnidx, rowidx } = event.currentTarget.dataset;
      if (currentCell.isSelected && currentCell.isEditing) {
        // onBlur callback sets the current cell isEditing and isSelected to false (we don't need to write any extra code for this).
        // Add focus to the cell below.
        spreadSheetRefMap.current
          ?.get(formatKeyOfSpreadsheetRefMap(rowIdx + 1, columnIdx))
          ?.focus();
        changeCellState(
          { isEditing: false, isSelected: true },
          columnIdx,
          rowIdx + 1
        );
        // Set the cell below isSelected to true.

        console.log("columnidx -->", columnidx, "rowidx -->", rowidx);
      } else if (currentCell.isSelected && !currentCell.isEditing) {
        // Set the current cell isEditing to true.
        changeCellState({ isEditing: true }, columnIdx, rowIdx);
      }
    }

    if (event.key === "Tab") {
      console.log("Tab key pressed");
      // Update the state of the next cell to isSelected: true.
      changeCellState({ isSelected: true }, columnIdx + 1, rowIdx);
    }
  };

  return (
    <Flex>
      {spreadsheetState.map((row, rowIdx) => (
        <>
          {/* Add column headers */}
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
                    onKeyDown={(event) =>
                      handleKeyDown(columnIdx, event, rowIdx)
                    }
                    ref={(element: HTMLInputElement) =>
                      handleAddRef(element, columnIdx, rowIdx)
                    }
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
