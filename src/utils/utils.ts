import { SelectedCells } from "../components/Spreadsheet/Spreadsheet";
const SPREADSHEET_HEADING = "spreadsheetHeading";

const setInitialHeading = (defaultHeading: string) => {
  const heading = localStorage.getItem(SPREADSHEET_HEADING);
  if (heading) {
    return heading;
  }
  return defaultHeading;
};

const calculateRowCount = (
  rowIdxEnd: SelectedCells["rowIdxEnd"],
  rowIdxStart: SelectedCells["rowIdxStart"]
): number => {
  if (rowIdxEnd === null || rowIdxStart === null) return 0;
  return rowIdxEnd - rowIdxStart + 1;
};

const calculateColumnCount = (
  columnIdxEnd: SelectedCells["columnIdxEnd"],
  columnIdxStart: SelectedCells["columnIdxStart"]
): number => {
  if (columnIdxEnd === null || columnIdxStart === null) return 0;
  return columnIdxEnd - columnIdxStart + 1;
};

const calculateColumnRange = ({
  columnIdxEnd,
  columnIdxStart,
}: {
  columnIdxEnd: SelectedCells["columnIdxEnd"];
  columnIdxStart: SelectedCells["columnIdxStart"];
}) => {
  if (columnIdxStart === null || columnIdxEnd === null) return "";
  if (columnIdxStart === columnIdxEnd) return `${columnIdxStart! + 1}C`;
  return `${columnIdxStart! + 1}C-${columnIdxEnd! + 1}C`;
};

const calculateRowRange = ({
  rowIdxEnd,
  rowIdxStart,
}: {
  rowIdxEnd: SelectedCells["rowIdxEnd"];
  rowIdxStart: SelectedCells["rowIdxStart"];
}) => {
  if (rowIdxStart === null || rowIdxEnd === null) return "";
  if (rowIdxStart === rowIdxEnd) return `${rowIdxStart! + 1}R`;
  return `${rowIdxStart! + 1}R-${rowIdxEnd! + 1}R`;
};

export {
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  calculateRowRange,
  setInitialHeading,
  SPREADSHEET_HEADING,
};
