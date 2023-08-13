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
  if (columnIdxEnd === null || columnIdxStart === null) return "";
  if (columnIdxEnd === columnIdxStart) return `${columnIdxStart! + 1}C`;
  return `${columnIdxStart! + 1}C-${columnIdxEnd! + 1}C`;
};

export {
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  setInitialHeading,
  SPREADSHEET_HEADING,
};
