import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { IContextMenu } from "../../App";
import { arrayIncludesObject } from "../../utils/utils";
import Cell from "../Cell";
import CellHeader from "../CellHeader";
import CellWrapper from "../CellWrapper";
import ContextMenu from "../ContextMenu";
import { sampleData } from "../../data/sampleData";

interface SpreadsheetProps {
  rows?: number;
  columns?: number;
  contextMenu: IContextMenu;
  isSelecting: boolean;
  setIsSelecting: Dispatch<SetStateAction<boolean>>;
  setContextMenu: Dispatch<SetStateAction<IContextMenu>>;
}

export interface ICellData {
  rowIdx?: number;
  columnIdx?: number;
  isEditing?: boolean;
  isFocused?: boolean;
  isSelected?: boolean;
  value?: string;
}

export interface SelectedCell {
  rowIdx: number | null;
  columnIdx: number | null;
}

export interface SelectedCells {
  previousCell: SelectedCell;
  selectionStartCell: SelectedCell;
  selectionEndCell: SelectedCell;
  allSelectedCells: SelectedCell[];
}

export interface RowAndColumnCount {
  columnsCount: number;
  rowsCount: number;
}

export interface ColumnsToAdd {
  columnIdx: SelectedCell["columnIdx"];
  columnsCount: RowAndColumnCount["columnsCount"];
}

export interface ColumnsToDelete {
  columnIdxStart: SelectedCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectedCells["selectionEndCell"]["columnIdx"];
  columnsCount: RowAndColumnCount["columnsCount"];
}

export interface RowsToAdd {
  rowIdx: SelectedCell["rowIdx"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

export interface RowsToDelete {
  rowIdxStart: SelectedCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectedCells["selectionStartCell"]["rowIdx"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

const Spreadsheet = ({
  rows = 10,
  columns = 10,
  contextMenu,
  isSelecting,
  setIsSelecting,
  setContextMenu,
}: SpreadsheetProps) => {
  const localStorageData = localStorage.getItem("spreadsheetData");
  // const emptyDefaultData: ICellData[][] = Array.from(
  //   { length: rows },
  //   (v, rowI) =>
  //     Array.from({ length: columns }, (v, columnI) => {
  //       return {
  //         columnIdx: columnI,
  //         isFocused: false,
  //         isEditing: false,
  //         rowIdx: rowI,
  //         value: "",
  //       } as ICellData;
  //     })
  // );

  const defaultExampleData: ICellData[][] = sampleData;

  const grid: ICellData[][] = localStorageData
    ? JSON.parse(localStorageData)
    : defaultExampleData;

  const [spreadsheetState, setSpreadsheetState] = useState<ICellData[][]>(grid);
  const [selectedCells, setSelectedCells] = useState<SelectedCells>({
    previousCell: { rowIdx: null, columnIdx: null },
    selectionStartCell: { rowIdx: null, columnIdx: null },
    selectionEndCell: { rowIdx: null, columnIdx: null },
    allSelectedCells: [],
  });

  const [currentCell, setCurrentCell] = useState<SelectedCell>({
    rowIdx: null,
    columnIdx: null,
  });
  const formatKeyOfSpreadsheetRefMap = (columnIdx: number, rowIdx: number) =>
    `${rowIdx}/${columnIdx}`;
  // This is a ref container to hold all the spreadsheet cells refs. We populate this Map with the
  // cell refs as we create them below(<Cell />) using ref prop and passing it a ref callback.
  const spreadSheetRefMap: MutableRefObject<Map<
    string,
    HTMLInputElement
  > | null> = useRef(new Map());
  // Ref callback which will be passed to the <Cell /> component. This callback will be called
  // immediately after the component is mounted or unmounted with the element argument.
  const handleAddRef = (
    element: HTMLInputElement,
    columnIdx: number,
    rowIdx: number
  ) => {
    // Add the element to the Map.
    spreadSheetRefMap.current?.set(
      formatKeyOfSpreadsheetRefMap(columnIdx, rowIdx),
      element
    );
  };

  const changeCellState = ({
    rowIdx,
    columnIdx,
    cellUpdate,
  }: {
    rowIdx: number;
    columnIdx: number;
    cellUpdate: ICellData;
  }) => {
    // When calling moveFocusTo function we end up calling setSpreadsheetState more than once. In order for all the setSpreadsheetState calls to work as intended, we need to use the functional form of setState.
    setSpreadsheetState((spreadsheet) => {
      let newSpreadsheet;
      const newRow = [
        ...spreadsheet[rowIdx].slice(0, columnIdx),
        { ...spreadsheet[rowIdx][columnIdx], ...cellUpdate },
        ...spreadsheet[rowIdx].slice(columnIdx + 1),
      ];
      newSpreadsheet = [
        ...spreadsheet.slice(0, rowIdx),
        newRow,
        ...spreadsheet.slice(rowIdx + 1),
      ];
      updateDataInLocalStorage(newSpreadsheet);
      return newSpreadsheet;
    });
  };

  const handleCellBlur = ({
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.FocusEvent;
  }) => {
    event.preventDefault();
    // Change all the selectedCells isEditing and isFocused values to false.
    const newSpreadsheet = spreadsheetState.map((row) => {
      const newRow = row.map((cell: ICellData) => {
        return { ...cell, isFocused: false, isEditing: false };
      });
      return newRow;
    });
    setSpreadsheetState(newSpreadsheet);
    updateDataInLocalStorage(newSpreadsheet);

    if (contextMenu.isContextMenuOpen) return;

    setSelectedCells({
      previousCell: { rowIdx: null, columnIdx: null },
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
      allSelectedCells: [],
    });
  };

  // When "Tab" key is pressed, next cell gets focus an handleCellFocus is called.
  const handleCellFocus = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.FocusEvent<HTMLInputElement>;
  }) => {
    event.stopPropagation();
    changeCellState({
      columnIdx,
      rowIdx,
      cellUpdate: { isEditing: false, isFocused: true },
    });

    // Update the selectedCells state.
    const currentCell = { rowIdx, columnIdx };
    // If the current cell is already selected, then don't update the selectedCells state.
    if (arrayIncludesObject(selectedCells.allSelectedCells, currentCell)) {
      return;
    }
    setSelectedCells({
      previousCell: currentCell,
      selectionStartCell: currentCell,
      selectionEndCell: currentCell,
      allSelectedCells: [currentCell],
    });
  };

  const handleCellValueChange = ({
    rowIdx,
    columnIdx,
    newValue,
  }: {
    rowIdx: number;
    columnIdx: number;
    newValue: string;
  }) => {
    const currentCell = spreadsheetState[rowIdx][columnIdx];
    // If the new value is the same as the current value, then don't update the cell value.
    if (currentCell.value === newValue) return;
    // When calling moveFocusTo function we end up calling setSpreadsheetState more than once. In order for all the setSpreadsheetState calls to work as intended, we need to use the functional form of setState.
    changeCellState({ columnIdx, rowIdx, cellUpdate: { value: newValue } });
  };

  const moveFocusTo = (columnIdx: number, rowIdx: number) => {
    const spreadSheetRefCellKey = formatKeyOfSpreadsheetRefMap(
      columnIdx,
      rowIdx
    );
    if (spreadSheetRefMap.current?.has(spreadSheetRefCellKey)) {
      const nextCell = spreadSheetRefMap.current.get(spreadSheetRefCellKey);
      nextCell?.focus();
      nextCell?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCellClick = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.MouseEvent;
  }) => {
    event.stopPropagation();
    // Update spreadsheet state: the cell selected is set to true, the rest of the cells selected value will be false.
    const spreadSheetCopy = [...spreadsheetState];
    const newSpreadSheetState = spreadSheetCopy.map((row, rowI) => {
      const newRow = row.map((column, colI) => {
        if (rowI === rowIdx && colI === columnIdx) {
          return { ...column, isFocused: true };
        }
        return { ...column, isFocused: false };
      });
      return newRow;
    });
    updateDataInLocalStorage(newSpreadSheetState);
    setSpreadsheetState(newSpreadSheetState);
    moveFocusTo(columnIdx, rowIdx);
    const currentCell = { rowIdx, columnIdx };
    setSelectedCells({
      previousCell: currentCell,
      selectionStartCell: currentCell,
      selectionEndCell: currentCell,
      allSelectedCells: [currentCell],
    });
  };

  const handleCellOnContextMenu = ({ event }: { event: React.MouseEvent }) => {
    event.preventDefault();
    event.stopPropagation();
    moveFocusTo(
      selectedCells.selectionStartCell.columnIdx!,
      selectedCells.selectionStartCell.rowIdx!
    );
  };

  const handleDoubleClick = ({
    rowIdx,
    columnIdx,
  }: {
    rowIdx: number;
    columnIdx: number;
  }) => {
    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: true, isFocused: true },
    });
  };

  /* Drag and drop */
  const handleCellWrapperDragStart = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.DragEvent<HTMLDivElement>;
  }) => {
    // TODO: write code to ignore drag start if dragging from the inner cell and not the cell wrapper.
    const dt = event.dataTransfer;
    dt.setData("text/plain", spreadsheetState[rowIdx][columnIdx].value!);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";

    // Add styling to the cell being dragged.
    const cellWrapper = event.currentTarget;
    cellWrapper.style.backgroundColor = "var(--color-background)";
  };

  const handleCellWrapperDragEnd = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.DragEvent<HTMLDivElement>;
  }) => {
    // If cell was dragged to a cell that is not droppable, then early return.
    if (event.dataTransfer.dropEffect === "none") return;
    // If the cell was dropped on the same cell, then don't change the cell state.
    if (currentCell.columnIdx === columnIdx && currentCell.rowIdx === rowIdx)
      return;

    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: false, value: "" },
    });
    setIsSelecting(false);
  };

  const handleCellWrapperDrop = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.DragEvent<HTMLDivElement>;
  }) => {
    const data = event.dataTransfer.getData("text/plain");
    setCurrentCell({ columnIdx, rowIdx });
    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: true, value: data },
    });
    moveFocusTo(columnIdx, rowIdx);
    const currentCell = { rowIdx, columnIdx };
    setSelectedCells({
      previousCell: currentCell,
      selectionStartCell: currentCell,
      selectionEndCell: currentCell,
      allSelectedCells: [currentCell],
    });
    setIsSelecting(false);
  };

  // Update the whole spreadsheet in the database.
  // const handleDBUpdate = async (spreadsheetState: ICellData[][]) => {
  //   try {
  //     const responseBody = await fetch("/sp/set", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(spreadsheetState),
  //     });
  //     if (!responseBody.ok)
  //       throw new Error(
  //         `🪷🪷🪷 Error fetching data from the server. HTTP status ${responseBody.status}`
  //       );
  //   } catch (error) {
  //     console.error("error in updating db ---->", error);
  //   }
  // };

  const updateDataInLocalStorage = (spreadsheetState: ICellData[][]) => {
    localStorage.setItem("spreadsheetData", JSON.stringify(spreadsheetState));
  };

  const closeContextMenu = () => {
    if (contextMenu.isContextMenuOpen) {
      setContextMenu({ ...contextMenu, isContextMenuOpen: false });
    }
  };

  const handleKeyDown = (
    columnIdx: number,
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number
  ) => {
    const currentCell = spreadsheetState[rowIdx][columnIdx];

    // Keep ctrlKey combinations at the top.
    if (event.ctrlKey && event.key === "c") {
      handleOnCopy({ rowIdx, columnIdx });
      closeContextMenu();
      return;
    }

    if (event.ctrlKey && event.key === "x") {
      handleOnCut({ rowIdx, columnIdx });
      closeContextMenu();
      return;
    }

    if (event.ctrlKey && event.key === "v") {
      handleOnPaste({ rowIdx, columnIdx });
      closeContextMenu();
      return;
    }

    // If `isEditing` is `false` when user starts to type, then set the cell `isEditing` to `true`.
    if (event.key.length === 1) {
      if (currentCell.isFocused && !currentCell.isEditing) {
        // Clear the cell value.
        changeCellState({
          rowIdx,
          columnIdx,
          cellUpdate: { isEditing: true, isFocused: true, value: "" },
        });
      }
    }

    // Close context menu if it is open and the user IS typing.
    if (currentCell.isFocused && currentCell.isEditing) {
      closeContextMenu();
    }
    // Close context menu if it is open and the user IS NOT typing.
    if (currentCell.isFocused && !currentCell.isEditing) {
      closeContextMenu();
    }

    if (event.key === "Enter") {
      // event.preventDefault();
      if (currentCell.isFocused && currentCell.isEditing) {
        // Previous cell state: onBlur callback sets the previous cell isEditing and isFocused to false (we don't need to write any extra code for this).

        // If on the last row, then do an early return.
        if (rowIdx === spreadsheetState.length - 1) {
          changeCellState({
            rowIdx,
            columnIdx,
            cellUpdate: { isEditing: false, isFocused: true },
          });
          closeContextMenu();
          return;
        }
        // Add focus to the cell below. We need to use the spreadSheetRefMap to get the cell below.
        moveFocusTo(columnIdx, rowIdx + 1);
        // Set the cell below state (isFocused to true).
        changeCellState({
          rowIdx: rowIdx + 1,
          columnIdx,
          cellUpdate: { isEditing: false, isFocused: true },
        });
        closeContextMenu();
      } else if (currentCell.isFocused && !currentCell.isEditing) {
        // Set the current cell isEditing to true.
        changeCellState({
          rowIdx,
          columnIdx,
          cellUpdate: { isEditing: true, isFocused: true },
        });
        closeContextMenu();
      }
    }

    if (event.key === "ArrowRight" && currentCell.isEditing === false) {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowRight" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx + 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
      closeContextMenu();
    }

    if (event.key === "ArrowLeft" && currentCell.isEditing === false) {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowLeft" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx - 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
      closeContextMenu();
    }

    if (event.key === "ArrowUp") {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowUp" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx, rowIdx - 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
      closeContextMenu();
    }

    if (event.key === "ArrowDown") {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowDown" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx, rowIdx + 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
      closeContextMenu();
    }

    // Note: Make sure "Tab" + Shift is before "Tab" key. Otherwise, "Tab" key will be triggered first.
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      moveFocusTo(columnIdx - 1, rowIdx);
      closeContextMenu();
      return;
    }

    if (event.key === "Tab") {
      // Add preventDefault, so that the input field doesn't add animation when "Tab" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx + 1, rowIdx);
      closeContextMenu();
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      changeCellState({
        rowIdx,
        columnIdx,
        cellUpdate: { isEditing: true, isFocused: true, value: "" },
      });
      closeContextMenu();
    }
  };

  const handleOnMouseDown = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.MouseEvent;
  }) => {
    event.stopPropagation();
    // Close contextMenu
    closeContextMenu();

    // If the current cell is already selected, then don't update the selectedCells state.
    const currentCell = { rowIdx, columnIdx };

    if (event.button === 2) {
      // Right-click detected
      setContextMenu({
        isContextMenuOpen: true,
        locationX: event.clientX,
        locationY: event.clientY,
      });
      if (arrayIncludesObject(selectedCells.allSelectedCells, currentCell)) {
        return;
      }
    }

    setIsSelecting(true);

    if (arrayIncludesObject(selectedCells.allSelectedCells, currentCell)) {
      return;
    }

    moveFocusTo(columnIdx, rowIdx);

    setSelectedCells({
      previousCell: currentCell,
      selectionStartCell: currentCell,
      selectionEndCell: currentCell,
      allSelectedCells: [currentCell],
    });
  };

  function handleMouseMove(currentCell: SelectedCell) {
    const { selectionStartCell, previousCell } = selectedCells;
    if (isSelecting) {
      if (
        currentCell.rowIdx === previousCell.rowIdx &&
        currentCell.columnIdx === previousCell.columnIdx
      ) {
        return;
      }

      const selectedCells: SelectedCell[] = [];

      // If on the same row or moved down a row.
      if (currentCell.rowIdx! >= selectionStartCell.rowIdx!) {
        // Start looping over the row.
        for (
          let rowIdx = selectionStartCell.rowIdx!;
          currentCell.rowIdx! >= rowIdx!;
          rowIdx!++
        ) {
          // If moved right or on the same column as selectionStartCell.
          if (currentCell.columnIdx! >= selectionStartCell.columnIdx!) {
            for (
              let columnIdx = selectionStartCell.columnIdx;
              currentCell.columnIdx! >= columnIdx!;
              columnIdx!++
            ) {
              selectedCells.push({ rowIdx, columnIdx });
            }
          }
          // If moved left.
          else if (currentCell.columnIdx! < selectionStartCell.columnIdx!) {
            for (
              let columnIdx = selectionStartCell.columnIdx;
              currentCell.columnIdx! <= columnIdx!;
              columnIdx!--
            ) {
              selectedCells.push({ rowIdx, columnIdx });
            }
          }
        }
      }

      // If moved up a row.
      if (currentCell.rowIdx! < selectionStartCell.rowIdx!) {
        for (
          let rowIdx = selectionStartCell.rowIdx;
          currentCell.rowIdx! <= rowIdx!;
          rowIdx!--
        ) {
          // If moved right or on the same column as selectionStartCell.
          if (currentCell.columnIdx! >= selectionStartCell.columnIdx!) {
            for (
              let columnIdx = selectionStartCell.columnIdx;
              currentCell.columnIdx! >= columnIdx!;
              columnIdx!++
            ) {
              selectedCells.push({ rowIdx, columnIdx });
            }
          }
          // Moved left
          else if (currentCell.columnIdx! < selectionStartCell.columnIdx!) {
            for (
              let columnIdx = selectionStartCell.columnIdx;
              currentCell.columnIdx! <= columnIdx!;
              columnIdx!--
            ) {
              selectedCells.push({ rowIdx, columnIdx });
            }
          }
        }
      }

      setSelectedCells({
        previousCell: currentCell,
        selectionStartCell,
        selectionEndCell: currentCell,
        allSelectedCells: selectedCells,
      });
    }
  }

  const handleOnMouseUp = ({
    columnIdx,
    rowIdx,
  }: {
    columnIdx: number;
    rowIdx: number;
  }) => {
    if (isSelecting) {
      setIsSelecting(false);
    }
  };

  const handleOnCopy = ({
    rowIdx,
    columnIdx,
  }: {
    rowIdx: number;
    columnIdx: number;
  }) => {
    // Check if any text is selected using getSelection() method.
    // If text is selected, copy only the selected text.
    // Info on JS selection: https://stackoverflow.com/a/53052928/10029397
    const selection = window.getSelection();

    if (selection?.type === "Range") {
      navigator.clipboard.writeText(selection.toString());
      return;
    }

    // Copy the whole cell value.
    navigator.clipboard.writeText(spreadsheetState[rowIdx][columnIdx].value!);
  };

  const handleOnCut = async ({
    rowIdx,
    columnIdx,
  }: {
    rowIdx: number;
    columnIdx: number;
  }) => {
    await navigator.clipboard.writeText(
      spreadsheetState[rowIdx][columnIdx].value!
    );
    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: true, value: "" },
    });
  };

  const handleOnPaste = ({
    rowIdx,
    columnIdx,
  }: {
    rowIdx: number;
    columnIdx: number;
  }) => {
    // If isEditing is false, then paste the clipboard text to the cell.
    if (!spreadsheetState[rowIdx][columnIdx].isEditing) {
      navigator.clipboard.readText().then((clipText) => {
        handleCellValueChange({ rowIdx, columnIdx, newValue: clipText });
      });
    }
  };

  /** Add "columnsCount" number of new empty columns at the columnIdxStart. */
  const addColumns = ({ columnIdx, columnsCount }: ColumnsToAdd) => {
    // Loop over the spreadSheetCopy and for each row, add "x" new empty cells at the columnIdxStart.
    const newSpreadSheetState = spreadsheetState.map((row, rowIndex) => {
      const startChunkOfTheRow = row.slice(0, columnIdx!);
      const newCellsChunk = Array.from({ length: columnsCount }, (v, i) => {
        return {
          columnIdx: columnIdx! + i,
          rowIdx: rowIndex,
          isFocused: false,
          isEditing: false,
          value: "",
        } as ICellData;
      });
      // Update the column indices of the rest of the cells in the row.
      const endChunkOfTheRow = [];
      for (let i = columnIdx!; i < row.length; i++) {
        const newColumnIdxStart = i! + columnsCount;
        endChunkOfTheRow.push({
          ...row[i],
          columnIdx: newColumnIdxStart,
        } as ICellData);
      }
      // Construct new row.
      const newRow = [
        ...startChunkOfTheRow,
        ...newCellsChunk,
        ...endChunkOfTheRow,
      ];
      return newRow;
    });
    setSpreadsheetState(newSpreadSheetState);
    updateDataInLocalStorage(newSpreadSheetState);
    closeContextMenu();
    setSelectedCells({
      previousCell: { rowIdx: null, columnIdx: null },
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
      allSelectedCells: [],
    });
  };

  /** Delete selected columns from the spreadsheet. */
  const deleteSelectedColumns = ({
    columnIdxStart,
    columnIdxEnd,
    columnsCount,
  }: ColumnsToDelete) => {
    const newSpreadSheetState = spreadsheetState.map((row) => {
      const startChunkOfTheRow = row.slice(0, columnIdxStart!);
      const endChunkOfTheRow = [];
      for (let i = columnIdxEnd! + 1; i < row.length; i++) {
        endChunkOfTheRow.push({
          ...row[i],
          columnIdx: i - columnsCount,
        });
      }
      const newRow = [...startChunkOfTheRow, ...endChunkOfTheRow];
      return newRow;
    });
    setSpreadsheetState(newSpreadSheetState);
    updateDataInLocalStorage(newSpreadSheetState);
    closeContextMenu();
    setSelectedCells({
      previousCell: { rowIdx: null, columnIdx: null },
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
      allSelectedCells: [],
    });
  };

  /** Add "rowsCount" number of new empty rows at the rowIdxStart. */
  const addRows = ({ rowIdx, rowsCount }: RowsToAdd) => {
    const firstChunkOfRows = spreadsheetState.slice(0, rowIdx!);
    const columnsCount = spreadsheetState[0].length;
    const newRowsChunk = Array.from({ length: rowsCount }, (v, rowI) => {
      return Array.from({ length: columnsCount }, (v, columnI) => {
        return {
          columnIdx: columnI,
          isFocused: false,
          isEditing: false,
          rowIdx: rowIdx! + rowI,
          value: "",
        };
      });
    });
    // Update the row indices of the rest of the rows.
    const endChunkOfRows = [];
    for (let i = rowIdx!; i < spreadsheetState.length; i++) {
      const newRowIdxStart = i + rowsCount;
      endChunkOfRows.push(
        spreadsheetState[i].map((cell) => {
          return {
            ...cell,
            rowIdx: newRowIdxStart,
          };
        })
      );
    }
    const newSpreadsheet = [
      ...firstChunkOfRows,
      ...newRowsChunk,
      ...endChunkOfRows,
    ];
    setSpreadsheetState(newSpreadsheet);
    updateDataInLocalStorage(newSpreadsheet);
    closeContextMenu();
    setSelectedCells({
      previousCell: { rowIdx: null, columnIdx: null },
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
      allSelectedCells: [],
    });
  };

  /** Delete the selected rows from the spreadsheet. */
  const deleteSelectedRows = ({
    rowIdxEnd,
    rowIdxStart,
    rowsCount,
  }: RowsToDelete) => {
    const firstChunkOfRows = spreadsheetState.slice(0, rowIdxStart!);
    const endChunkOfRows = [];
    for (let i = rowIdxEnd! + 1; i < spreadsheetState.length; i++) {
      endChunkOfRows.push(
        spreadsheetState[i].map((cell) => {
          return { ...cell, rowIdx: i - rowsCount };
        })
      );
    }
    const newSpreadsheet = [...firstChunkOfRows, ...endChunkOfRows];
    setSpreadsheetState(newSpreadsheet);
    updateDataInLocalStorage(newSpreadsheet);
    closeContextMenu();
    setSelectedCells({
      previousCell: { rowIdx: null, columnIdx: null },
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
      allSelectedCells: [],
    });
  };

  return (
    <Flex>
      {spreadsheetState.map((row, rowIdx) => (
        <>
          {/* Add column headers */}
          {rowIdx === 0 && (
            <div key={`row-column-headers`} style={{ display: "flex" }}>
              {/* First cell in row has no value (it's empty). */}
              <CellHeader isFirstColumnCell key={`cell-0`} value="" />
              {/* Rest of the cell headers will have alphabet letters as header values. */}
              {row.map((column, columnIdx) => (
                <CellHeader
                  key={`cell-header-${rowIdx}/${columnIdx}`}
                  value={`C${columnIdx + 1}`}
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
                      value={`R${rowIdx + 1}`}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <CellWrapper
                    key={`cell-wrapper-${rowIdx}/${columnIdx}`}
                    isSelected={arrayIncludesObject(
                      selectedCells.allSelectedCells,
                      { rowIdx, columnIdx }
                    )}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      handleCellClick({ rowIdx, columnIdx, event });
                    }}
                    onContextMenu={(event: React.MouseEvent) => {
                      handleCellOnContextMenu({ event });
                    }}
                    onDragEnd={(event: React.DragEvent<HTMLDivElement>) =>
                      handleCellWrapperDragEnd({ rowIdx, columnIdx, event })
                    }
                    onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
                      handleCellWrapperDragStart({ rowIdx, columnIdx, event });
                    }}
                    /* Do not remove onDragOver. We need it. */
                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      handleCellWrapperDrop({ rowIdx, columnIdx, event });
                    }}
                    onMouseDown={(event: React.MouseEvent) => {
                      handleOnMouseDown({ rowIdx, columnIdx, event });
                    }}
                    onMouseOver={(event: any) => {
                      if (event.target !== event.currentTarget) {
                        return;
                      }
                    }}
                  >
                    <Cell
                      cellData={{
                        rowIdx,
                        columnIdx,
                        isEditing: column.isEditing,
                        isFocused: column.isFocused,
                        isSelected: arrayIncludesObject(
                          selectedCells.allSelectedCells,
                          { rowIdx, columnIdx }
                        ),
                        value: column.value,
                      }}
                      key={`cell-${rowIdx}/${columnIdx}`}
                      onBlur={(event: React.FocusEvent) => {
                        handleCellBlur({ rowIdx, columnIdx, event });
                      }}
                      onFocus={(
                        event: React.FocusEvent<HTMLInputElement, Element>
                      ) => {
                        handleCellFocus({ rowIdx, columnIdx, event });
                      }}
                      onChange={(newValue) => {
                        handleCellValueChange({ rowIdx, columnIdx, newValue });
                      }}
                      onClick={(event: React.MouseEvent) => {
                        handleCellClick({ rowIdx, columnIdx, event });
                      }}
                      onContextMenu={(event: React.MouseEvent) => {
                        handleCellOnContextMenu({ event });
                      }}
                      onCopy={() => {
                        handleOnCopy({ rowIdx, columnIdx });
                      }}
                      onCut={() => {
                        handleOnCut({ rowIdx, columnIdx });
                      }}
                      onDoubleClick={() =>
                        handleDoubleClick({ rowIdx, columnIdx })
                      }
                      onDragStart={(
                        event: React.DragEvent<HTMLInputElement>
                      ) => {
                        // Set the input prop "draggable={true}" in Cell and prevent default in onDragStart event.
                        // More info here: https://stackoverflow.com/a/44049369/10029397
                        event.preventDefault();
                      }}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLInputElement>
                      ) => {
                        handleKeyDown(columnIdx, event, rowIdx);
                      }}
                      onMouseDown={(event: React.MouseEvent) => {
                        handleOnMouseDown({ rowIdx, columnIdx, event });
                      }}
                      onMouseMove={() => {
                        handleMouseMove({ rowIdx, columnIdx });
                      }}
                      onMouseUp={(
                        event: React.MouseEvent<HTMLInputElement>
                      ) => {
                        handleOnMouseUp({ rowIdx, columnIdx });
                      }}
                      onPaste={() => {
                        handleOnPaste({ rowIdx, columnIdx });
                      }}
                      ref={(element: HTMLInputElement) =>
                        handleAddRef(element, columnIdx, rowIdx)
                      }
                    />
                  </CellWrapper>
                  {/* TODO: maintain focus after rows/cols have been deleted/added. */}
                  {contextMenu.isContextMenuOpen && (
                    <ContextMenu
                      id="cell-context-menu"
                      addColumns={addColumns}
                      addRows={addRows}
                      deleteSelectedColumns={deleteSelectedColumns}
                      deleteSelectedRows={deleteSelectedRows}
                      selectionStartCell={{
                        rowIdx: selectedCells.selectionStartCell.rowIdx,
                        columnIdx: selectedCells.selectionStartCell.columnIdx,
                      }}
                      selectionEndCell={{
                        rowIdx: selectedCells.selectionEndCell.rowIdx,
                        columnIdx: selectedCells.selectionEndCell.columnIdx,
                      }}
                      left={contextMenu.locationX}
                      top={contextMenu.locationY}
                      onCopy={handleOnCopy}
                      onCut={handleOnCut}
                      onPaste={handleOnPaste}
                    />
                  )}
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
  overflow: auto;
`;
