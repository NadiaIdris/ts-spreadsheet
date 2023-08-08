import { SelectedCells } from "../components/Spreadsheet/Spreadsheet";
const SPREADSHEET_HEADING = "spreadsheetHeading";

const setInitialHeading = (defaultHeading: string) => {
  const heading = localStorage.getItem(SPREADSHEET_HEADING);
  if (heading) {
    return heading;
  }
  return defaultHeading;
};

const calculateRows = (
  rowIdxEnd: SelectedCells["rowIdxEnd"],
  rowIdxStart: SelectedCells["rowIdxStart"]
): number => {
  if (rowIdxEnd === null || rowIdxStart === null) return 0;
  return rowIdxEnd - rowIdxStart + 1;
};

const calculateColumns = (
  columnIdxEnd: SelectedCells["columnIdxEnd"],
  columnIdxStart: SelectedCells["columnIdxStart"]
): number => {
  if (columnIdxEnd === null || columnIdxStart === null) return 0;
  return columnIdxEnd - columnIdxStart + 1;
};

export {
  calculateColumns,
  calculateRows,
  setInitialHeading,
  SPREADSHEET_HEADING,
};
