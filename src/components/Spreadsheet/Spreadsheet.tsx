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
    <Grid>
      {spreadsheetState.map((row, rowIdx) => (
        <>
          {/* Add column headers */}
          {rowIdx === 0 && (
            <>
              {row.map((column, columnIdx) => (
                <CellHeader
                  key={`${rowIdx - 1}/${columnIdx}`}
                  value={ALPHABET[columnIdx]}
                />
              ))}
            </>
          )}
          <>
            {row.map((column, columnIdx) => {
              return (
                <>
                  {/* Add row headers */}
                  {columnIdx === 0 && (
                    <CellHeader
                      key={`${rowIdx + 1}/${columnIdx}`}
                      value={String(rowIdx + 1)}
                    />
                  )}
                  <Cell
                    key={`${rowIdx}/${columnIdx}`}
                    isEditing={column.isEditing}
                    isSelected={column.isSelected}
                    value={column.value}
                  />
                </>
              );
            })}
          </>
        </>
      ))}
    </Grid>
  );
};

export default Spreadsheet;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
`;
