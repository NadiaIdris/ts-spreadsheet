import { SelectedCell } from "./Spreadsheet";

const addCellAboveToAllSelectedCells = (
  cell: SelectedCell,
  allSelectedCells: SelectedCell[]
) => {
  allSelectedCells.push({
    rowIdx: cell.rowIdx! - 1,
    columnIdx: cell.columnIdx!,
  });
};

const addCellBelowToAllSelectedCells = (
  cell: SelectedCell,
  allSelectedCells: SelectedCell[]
) => {
  allSelectedCells.push({
    rowIdx: cell.rowIdx! + 1,
    columnIdx: cell.columnIdx!,
  });
};

const addCellInRightColumnToAllSelectedCells = (
  cell: SelectedCell,
  allSelectedCells: SelectedCell[]
) => {
  allSelectedCells.push({
    rowIdx: cell.rowIdx!,
    columnIdx: cell.columnIdx! + 1,
  });
};

const addCellInLeftColumnToAllSelectedCells = (
  cell: SelectedCell,
  allSelectedCells: SelectedCell[]
) => {
  allSelectedCells.push({
    rowIdx: cell.rowIdx!,
    columnIdx: cell.columnIdx! - 1,
  });
};

const removeCellsFromAllSelectedCells = (
  cellsToRemove: SelectedCell[],
  allSelectedCells: SelectedCell[]
) => {
  cellsToRemove.forEach((cell) =>
    removeCellFromAllSelectedCells(cell, allSelectedCells)
  );
};

const removeCellFromAllSelectedCells = (
  cell: SelectedCell,
  allSelectedCells: SelectedCell[]
) => {
  const prevCellIdx = allSelectedCells.findIndex(
    (selectedCell: SelectedCell) =>
      selectedCell.rowIdx === cell.rowIdx &&
      selectedCell.columnIdx === cell.columnIdx
  );
  allSelectedCells.splice(prevCellIdx, 1);
};

const selectedCellToTheRightOfPrevCell = (
  selectedCell: SelectedCell,
  previousCell: SelectedCell
) => {
  const cellIsOnTheSameRowAsPrevCell =
    selectedCell.rowIdx! === previousCell.rowIdx!;
  const cellIsOnTheRightOfPrevCell =
    selectedCell.columnIdx! > previousCell.columnIdx!;

  return cellIsOnTheSameRowAsPrevCell && cellIsOnTheRightOfPrevCell;
};

const selectedCellToTheLeftOfPrevCell = (
  selectedCell: SelectedCell,
  previousCell: SelectedCell
) => {
  const cellIsOnTheSameRowAsPrevCell =
    selectedCell.rowIdx! === previousCell.rowIdx!;
  const cellIsOnTheLeftOfPrevCell =
    selectedCell.columnIdx! < previousCell.columnIdx!;

  return cellIsOnTheSameRowAsPrevCell && cellIsOnTheLeftOfPrevCell;
};

const selectedCellAbovePrevCell = (
  cell: SelectedCell,
  previousCell: SelectedCell
) => {
  const cellIsOnTheSameColumnAsPrevCell =
    cell.columnIdx! === previousCell.columnIdx!;
  const cellIsAboveThePrevCell = cell.rowIdx! < previousCell.rowIdx!;

  return cellIsOnTheSameColumnAsPrevCell && cellIsAboveThePrevCell;
};

const selectedCellBelowPrevCell = (
  cell: SelectedCell,
  previousCell: SelectedCell
) => {
  const cellIsOnTheSameColumnAsPrevCell =
    cell.columnIdx! === previousCell.columnIdx!;
  const cellIsBelowThePrevCell = cell.rowIdx! > previousCell.rowIdx!;

  return cellIsOnTheSameColumnAsPrevCell && cellIsBelowThePrevCell;
};

export {
  addCellAboveToAllSelectedCells,
  addCellBelowToAllSelectedCells,
  addCellInLeftColumnToAllSelectedCells,
  addCellInRightColumnToAllSelectedCells,
  removeCellFromAllSelectedCells,
  removeCellsFromAllSelectedCells,
  selectedCellAbovePrevCell,
  selectedCellBelowPrevCell,
  selectedCellToTheLeftOfPrevCell,
  selectedCellToTheRightOfPrevCell,
};
