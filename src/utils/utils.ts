import { SelectedCellOrCells } from "../components/Spreadsheet/Spreadsheet";
const SPREADSHEET_HEADING = "spreadsheetHeading";

const setInitialHeading = (defaultHeading: string) => {
  const heading = localStorage.getItem(SPREADSHEET_HEADING);
  if (heading) {
    return heading;
  }
  return defaultHeading;
};

const calculateRowCount = ({
  rowIdxEnd,
  rowIdxStart,
}: {
  rowIdxEnd: SelectedCellOrCells["rowIdxEnd"];
  rowIdxStart: SelectedCellOrCells["rowIdxStart"];
}): number => {
  if (rowIdxStart === null || rowIdxEnd === null) return 0;
  return rowIdxEnd - rowIdxStart + 1;
};

const calculateColumnCount = ({
  columnIdxEnd,
  columnIdxStart,
}: {
  columnIdxEnd: SelectedCellOrCells["columnIdxEnd"];
  columnIdxStart: SelectedCellOrCells["columnIdxStart"];
}): number => {
  if (columnIdxStart === null || columnIdxEnd === null) return 0;
  return columnIdxEnd - columnIdxStart + 1;
};

const calculateColumnRange = ({
  columnIdxEnd,
  columnIdxStart,
}: {
  columnIdxEnd: SelectedCellOrCells["columnIdxEnd"];
  columnIdxStart: SelectedCellOrCells["columnIdxStart"];
}) => {
  if (columnIdxStart === null || columnIdxEnd === null) return "";
  if (columnIdxStart === columnIdxEnd) return `${columnIdxStart! + 1}C`;
  return `${columnIdxStart! + 1}C-${columnIdxEnd! + 1}C`;
};

const calculateRowRange = ({
  rowIdxEnd,
  rowIdxStart,
}: {
  rowIdxEnd: SelectedCellOrCells["rowIdxEnd"];
  rowIdxStart: SelectedCellOrCells["rowIdxStart"];
}) => {
  if (rowIdxStart === null || rowIdxEnd === null) return "";
  if (rowIdxStart === rowIdxEnd) return `${rowIdxStart! + 1}R`;
  return `${rowIdxStart! + 1}R-${rowIdxEnd! + 1}R`;
};

const calculateCurrentDirection = ({
  previousCell,
  currentCell,
}: {
  previousCell: SelectedCellOrCells;
  currentCell: SelectedCellOrCells;
}): "direction didn't change" | "up" | "right" | "down" | "left" => {
  if (
    previousCell.rowIdxStart === currentCell.rowIdxStart &&
    previousCell.columnIdxStart === currentCell.columnIdxStart
  ) {
    return "direction didn't change";
  }

  if (previousCell.rowIdxStart! < currentCell.rowIdxStart!) {
    return "up";
  }
  if (previousCell.columnIdxStart! < currentCell.columnIdxStart!) {
    return "right";
  }
  if (previousCell.rowIdxStart! > currentCell.rowIdxStart!) {
    return "down";
  }
  if (previousCell.columnIdxStart! > currentCell.columnIdxStart!) {
    return "left";
  }

  return "left";
};

export {
  SPREADSHEET_HEADING,
  calculateColumnCount,
  calculateColumnRange,
  calculateCurrentDirection,
  calculateRowCount,
  calculateRowRange,
  setInitialHeading,
};
