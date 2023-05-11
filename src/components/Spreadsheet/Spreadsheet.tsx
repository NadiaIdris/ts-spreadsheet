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

  console.log(grid);
  return (
    <Flex>
      {spreadsheetState.map((row, rowIdx) => (
        <>
          {/* Add column headers */}
          {rowIdx === 0 && (
            <div style={{ display: "flex" }}>
              {/* First cell in cell header has no value (it's empty). */}
              <CellHeader isFirstColumnCell key={`cell-0`} value="" />
              {/* Rest of the cell headers will have alphabet letters as headers. */}
              {row.map((column, columnIdx) => (
                <CellHeader
                  key={`${rowIdx - 1}/${columnIdx}`}
                  value={ALPHABET[columnIdx]}
                />
              ))}
            </div>
          )}
          <div style={{ display: "flex" }}>
            {row.map((column, columnIdx) => {
              return (
                <>
                  {/* Add row headers. */}
                  {columnIdx === 0 && (
                    <CellHeader
                      isFirstColumnCell
                      key={`${rowIdx + 1}/${columnIdx}`}
                      value={String(rowIdx + 1)}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <Cell
                    key={`${rowIdx}/${columnIdx}`}
                    isEditing={column.isEditing}
                    isSelected={column.isSelected}
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
