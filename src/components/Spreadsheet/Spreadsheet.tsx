import { useState } from "react";
import styled from "styled-components";
import Cell from "../Cell";
import { ICell } from "../Cell";

interface SpreadsheetProps {
  rows?: number;
  columns?: number;
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
      {spreadsheetState.map((row, rowIdx) => {
        return row.map((column, columnIdx) => (
          <Cell key={`${rowIdx}/${columnIdx}`}></Cell>
        ));
      })}
    </Grid>
  );
};

export default Spreadsheet;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  border: 1px solid black;
`;
