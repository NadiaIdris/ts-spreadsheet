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

const Spreadsheet = ({ rows = 10, columns = 10 }: SpreadsheetProps) => {
  const grid: ICell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
      return {
        isSelected: false,
        isEditing: false,
        value: "",
      } as ICell;
    })
  );
  const [spreadsheetState, setSpreadsheetState] = useState<ICell[][]>(grid);

  const handleCellValueChange = (
    columnIdx: number,
    event: React.ChangeEvent<HTMLInputElement>,
    rowIdx: number
  ) => {
    console.log("cell value changed event.target.value-->", event.target.value)
    setSpreadsheetState((prevState) => {
      const newState = [...prevState];
      newState[rowIdx][columnIdx].value = event.target.value;
      return newState;
    });
  };

  const handleCellClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const { columnidx, rowidx } = event.currentTarget.dataset;
    setSpreadsheetState((previousState) => {
      const newState = [...previousState];
      newState[Number(rowidx)][Number(columnidx)].isSelected = true;
      return newState;
    });
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const { columnidx, rowidx } = event.currentTarget.dataset;
    setSpreadsheetState((previousState) => {
      const newState = [...previousState];
      newState[Number(rowidx)][Number(columnidx)].isEditing = true;
      return newState;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => { 
    const { columnidx, rowidx } = event.currentTarget.dataset;
    if (event.key === "Enter") { 
      console.log("Enter key pressed")
      setSpreadsheetState(previousState => { 
        const newState = [ ...previousState ]; 
        newState[ Number(rowidx) ][ Number(columnidx) ].isEditing = true;
        newState[Number(rowidx)][Number(columnidx)].isSelected = true;
        return newState; 
      })
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
                    onChange={(event) =>
                      handleCellValueChange(columnIdx, event, rowIdx)
                    }
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => handleCellClick(event)}
                    onDoubleClick={(
                      event: React.MouseEvent<HTMLInputElement>
                    ) => handleDoubleClick(event)}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event)}
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
