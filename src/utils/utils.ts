import { SelectedCells } from "../components/Spreadsheet";
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
  rowIdxStart: SelectedCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectedCells["selectionEndCell"]["rowIdx"];
}): number => {
  if (rowIdxStart === null || rowIdxEnd === null) return 0;
  return rowIdxEnd - rowIdxStart + 1;
};

const calculateColumnCount = ({
  columnIdxStart,
  columnIdxEnd,
}: {
  columnIdxStart: SelectedCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectedCells["selectionEndCell"]["columnIdx"];
}): number => {
  if (columnIdxStart === null || columnIdxEnd === null) return 0;
  return columnIdxEnd - columnIdxStart + 1;
};

const calculateColumnRange = ({
  columnIdxStart,
  columnIdxEnd,
}: {
  columnIdxStart: SelectedCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectedCells["selectionEndCell"]["columnIdx"];
}) => {
  if (columnIdxStart === null || columnIdxEnd === null) return "";
  if (columnIdxStart === columnIdxEnd) return `${columnIdxStart! + 1}C`;
  return `${columnIdxStart! + 1}C-${columnIdxEnd! + 1}C`;
};

const calculateRowRange = ({
  rowIdxStart,
  rowIdxEnd,
}: {
  rowIdxStart: SelectedCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectedCells["selectionEndCell"]["rowIdx"];
}) => {
  if (rowIdxStart === null || rowIdxEnd === null) return "";
  if (rowIdxStart === rowIdxEnd) return `${rowIdxStart! + 1}R`;
  return `${rowIdxStart! + 1}R-${rowIdxEnd! + 1}R`;
};

interface Obj {
  [ key: string | number | symbol]: any;
}

// Check for deep equality of objects.
const objectsAreEqual = (obj1: Obj, obj2: Obj) => { 
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) return false;
  for (let key of obj1Keys) {
    if (typeof obj1[ key ] === "object" && typeof obj2[ key ] === "object") {
      if (!objectsAreEqual(obj1[ key ], obj2[ key ])) return false;
    } else if (obj1[ key ] !== obj2[ key ]) return false;
  }
  return true;
};

// Check if an array of objects includes a specific object.
const arrayIncludesObject = (arr: Obj[], obj: Obj) => { 
  for (let i = 0; i < arr.length; i++) {
    if (objectsAreEqual(arr[ i ], obj)) return true;
  }
  return false;
}

export {
  arrayIncludesObject,
  SPREADSHEET_HEADING,
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  calculateRowRange,
  objectsAreEqual,
  setInitialHeading,
};
