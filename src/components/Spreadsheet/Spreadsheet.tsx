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

  const handleCellValueChange = (
    columnIdx: number,
    event: React.ChangeEvent<HTMLInputElement>,
    rowIdx: number
  ) => {
    console.log(event.target.value);
    console.log(event.target);
    const { rowidx, columnidx } = event.target.dataset;
    const row = spreadsheetState.find(() => rowIdx === Number(rowidx));
    const cell = row?.find(() => columnIdx === Number(columnidx));
    console.log("cell --> ", cell)
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
