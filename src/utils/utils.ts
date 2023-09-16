import { SelectionRangeStartAndEndCells } from "../components/Spreadsheet/Spreadsheet";
const SPREADSHEET_HEADING = "spreadsheetHeading";

const setInitialHeading = (defaultHeading: string) => {
  const heading = localStorage.getItem(SPREADSHEET_HEADING);
  if (heading) {
    return heading;
  }
  return defaultHeading;
};

const calculateRowCount = ({
  rowIdxStart,
  rowIdxEnd,
}: {
  rowIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectionRangeStartAndEndCells["selectionEndCell"]["rowIdx"];
}): number => {
  if (rowIdxStart === null || rowIdxEnd === null) return 0;
  return rowIdxEnd - rowIdxStart + 1;
};

const calculateColumnCount = ({
  columnIdxStart,
  columnIdxEnd,
}: {
  columnIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectionRangeStartAndEndCells["selectionEndCell"]["columnIdx"];
}): number => {
  if (columnIdxStart === null || columnIdxEnd === null) return 0;
  return columnIdxEnd - columnIdxStart + 1;
};

const calculateColumnRange = ({
  columnIdxStart,
  columnIdxEnd,
}: {
  columnIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectionRangeStartAndEndCells["selectionEndCell"]["columnIdx"];
}) => {
  if (columnIdxStart === null || columnIdxEnd === null) return "";
  if (columnIdxStart === columnIdxEnd) return `${columnIdxStart! + 1}C`;
  return `${columnIdxStart! + 1}C-${columnIdxEnd! + 1}C`;
};

const calculateRowRange = ({
  rowIdxStart,
  rowIdxEnd,
}: {
  rowIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectionRangeStartAndEndCells["selectionEndCell"]["rowIdx"];
}) => {
  if (rowIdxStart === null || rowIdxEnd === null) return "";
  if (rowIdxStart === rowIdxEnd) return `${rowIdxStart! + 1}R`;
  return `${rowIdxStart! + 1}R-${rowIdxEnd! + 1}R`;
};

export {
  SPREADSHEET_HEADING,
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  calculateRowRange,
  setInitialHeading,
};
