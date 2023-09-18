import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Cell from "../Cell";
import CellHeader from "../CellHeader";
import CellWrapper from "../CellWrapper";
import ContextMenu from "../ContextMenu";
import { IContextMenu } from "../../App";

interface SpreadsheetProps {
  columns?: number;
  contextMenu: IContextMenu;
  rows?: number;
  setContextMenu: Dispatch<SetStateAction<IContextMenu>>;
}

// TODO: fix resetting the cells isSelected and isEditing values when move to the next cell.

export interface ICellData {
  rowIdx?: number;
  columnIdx?: number;
  isEditing?: boolean;
  isFocused?: boolean;
  value?: string;
}

export interface SelectedCell {
  rowIdx: number | null;
  columnIdx: number | null;
}

// We need SelectionRange for ContextMenu component.
export interface SelectionRangeStartAndEndCells {
  selectionStartCell: SelectedCell;
  selectionEndCell: SelectedCell;
}

export interface Selected {
  previousCell: SelectedCell;
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
  columnIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["columnIdx"];
  columnIdxEnd: SelectionRangeStartAndEndCells["selectionEndCell"]["columnIdx"];
  columnsCount: RowAndColumnCount["columnsCount"];
}

export interface RowsToAdd {
  rowIdx: SelectedCell["rowIdx"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

export interface RowsToDelete {
  rowIdxStart: SelectionRangeStartAndEndCells["selectionStartCell"]["rowIdx"];
  rowIdxEnd: SelectionRangeStartAndEndCells["selectionStartCell"]["rowIdx"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

const Spreadsheet = ({
  columns = 10,
  contextMenu,
  rows = 10,
  setContextMenu,
}: SpreadsheetProps) => {
  const grid: ICellData[][] = Array.from({ length: rows }, (v, rowI) =>
    Array.from({ length: columns }, (v, columnI) => {
      return {
        columnIdx: columnI,
        isFocused: false,
        isEditing: false,
        rowIdx: rowI,
        value: "",
      } as ICellData;
    })
  );
  const [spreadsheetState, setSpreadsheetState] = useState<ICellData[][]>(grid);
  const [selectionStartAndEndCells, setSelectionStartAndEndCells] =
    useState<SelectionRangeStartAndEndCells>({
      selectionStartCell: { rowIdx: null, columnIdx: null },
      selectionEndCell: { rowIdx: null, columnIdx: null },
    });
  const [selectedCells, setSelectedCells] = useState<Selected>({
    previousCell: { rowIdx: null, columnIdx: null },
    allSelectedCells: [],
  });
  const [selecting, setSelecting] = useState(false);
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
      handleDBUpdate(newSpreadsheet);
      return newSpreadsheet;
    });
  };

  const handleCellBlur = ({
    rowIdx,
    columnIdx,
  }: {
    rowIdx: number;
    columnIdx: number;
  }) => {
    // Change all the selectedCells isEditing and isFocused values to false.
    const newSpreadsheet = spreadsheetState.map((row) => {
      const newRow = row.map((cell: ICellData) => {
        return { ...cell, isFocused: false, isEditing: false };
      });
      return newRow;
    });
    setSpreadsheetState(newSpreadsheet);
    handleDBUpdate(newSpreadsheet);
  };

  // When "Tab" key is pressed, next cell gets focus an handleCellFocus is called.
  const handleCellFocus = (columnIdx: number, rowIdx: number) => {
    changeCellState({
      columnIdx,
      rowIdx,
      cellUpdate: { isEditing: false, isFocused: true },
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

  const handleCellClick = (
    columnIdx: number,
    event: React.MouseEvent,
    rowIdx: number
  ) => {
    console.log("cell's onClick got called --> ", columnIdx, "/", rowIdx);
    if (event.type === "click") {
      // If context menu is open, then close it.
      if (contextMenu.isContextMenuOpen)
        setContextMenu({ ...contextMenu, isContextMenuOpen: false });
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setContextMenu({
        columnIdx,
        isContextMenuOpen: true,
        locationX: event.clientX,
        locationY: event.clientY,
        rowIdx,
      });
    }

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
    handleDBUpdate(newSpreadSheetState);
    setSpreadsheetState(newSpreadSheetState);

    setSelectedCells((selectedCells) => {
      const currentCell = { rowIdx, columnIdx };
      return {
        previousCell: currentCell,
        allSelectedCells: [currentCell],
      };
    });

    setSelectionStartAndEndCells({
      selectionStartCell: { rowIdx, columnIdx },
      selectionEndCell: { rowIdx, columnIdx },
    });

    moveFocusTo(columnIdx, rowIdx);
  };

  const handleDoubleClick = (columnIdx: number, rowIdx: number) => {
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
    console.log("drag start");
    console.log("onDragStart event.dataTransfer ---->", event.dataTransfer);
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
    console.log(`onDragEnd ---> columnIdx: ${columnIdx} rowIdx: ${rowIdx}`);
    // console.log(
    //   `onDragEnd event.dataTransfer.dropEffect ---->`,
    //   event.dataTransfer.dropEffect
    // );
    // If cell was dragged to a cell that is not droppable, then early return.
    if (event.dataTransfer.dropEffect === "none") return;
    // If the cell was dropped on the same cell, then don't change the cell state.
    console.log("currentCell on DragEnd ---->", currentCell);
    if (currentCell.columnIdx === columnIdx && currentCell.rowIdx === rowIdx)
      return;

    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: false, value: "" },
    });
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
    console.log("onDrop columnIdx ---->", columnIdx);
    console.log("onDrop rowIdx ---->", rowIdx);
    console.log("onDrop data ---->", data);
    setCurrentCell({ columnIdx, rowIdx });
    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: true, value: data },
    });
    moveFocusTo(columnIdx, rowIdx);
  };

  // Update the whole spreadsheet in the database.
  const handleDBUpdate = async (spreadsheetState: ICellData[][]) => {
    try {
      const responseBody = await fetch("/sp/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spreadsheetState),
      });
      if (!responseBody.ok)
        throw new Error(
          `🪷🪷🪷 Error fetching data from the server. HTTP status ${responseBody.status}`
        );
    } catch (error) {
      console.log("error in updating db ---->", error);
    }
  };

  const handleKeyDown = (
    columnIdx: number,
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number
  ) => {
    const currentCell = spreadsheetState[rowIdx][columnIdx];

    const closeContextMenu = () => {
      if (contextMenu.isContextMenuOpen) {
        setContextMenu({ ...contextMenu, isContextMenuOpen: false });
      }
    };

    // Keep ctrlKey combinations at the top.
    if (event.ctrlKey && event.key === "c") {
      handleOnCopy(columnIdx, rowIdx);
      closeContextMenu();
      return;
    }

    if (event.ctrlKey && event.key === "x") {
      handleOnCut(columnIdx, rowIdx);
      closeContextMenu();
      return;
    }

    if (event.ctrlKey && event.key === "v") {
      handleOnPaste(columnIdx, rowIdx);
      closeContextMenu();
      return;
    }

    // If `isEditing` is `false` when user starts to type, then set the cell `isEditing` to `true`.
    if (event.key.length === 1) {
      if (currentCell.isFocused && !currentCell.isEditing) {
        // Clear the cell value.
        console.log("isEditing is false and event.key is --->", event.key);
        changeCellState({
          rowIdx,
          columnIdx,
          cellUpdate: { isEditing: true, isFocused: true, value: "" },
        });
      }
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
  };

  const handleMouseDown = ({
    rowIdx,
    columnIdx,
    event,
  }: {
    rowIdx: number;
    columnIdx: number;
    event: React.MouseEvent;
  }) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(
      "cell's onMouseDown called on columnIdx/rowIdx --->",
      columnIdx,
      "/",
      rowIdx
    );
    setSelecting(true);
    const cell = spreadsheetState[rowIdx][columnIdx];
    // If the cell is already selected, then don't update the cell state.
    if (cell.isFocused) return;

    const currentCell = { rowIdx, columnIdx };
    // Add state update function inside setTimeout, so that setSelecting(true) will be called first.
    setTimeout(
      () =>
        setSelectedCells({
          previousCell: currentCell,
          allSelectedCells: [currentCell],
        }),
      0
    );
  };

  const handleOnMouseOver = (
    columnIdx: number,
    event: React.MouseEvent,
    rowIdx: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (selecting) {
      console.log(
        "cell's onMouseOver got called on columnIdx/rowIdx ---->",
        columnIdx,
        "/",
        rowIdx
      );
      // TODO: Update the selectionEndCell or selectionStartCell based on the direction of the mouse movement.
      // setSelectionStartAndEndCells((selectionStartAndEndCells) => {
      //   const { selectionStartCell } = selectionStartAndEndCells;
      //   const selectionEndCell = { rowIdx, columnIdx };
      //   return {
      //     selectionStartCell,
      //     selectionEndCell,
      //   };
      // });
      setSelectedCells((selectedCells) => {
        const { allSelectedCells } = selectedCells;
        const currentCell = { rowIdx, columnIdx };
        console.log("onMouseOver currentCell --->", currentCell);
        const newSelectedCells = [...allSelectedCells, currentCell];
        if (newSelectedCells.length === 1) {
          return {
            previousCell: currentCell,
            allSelectedCells: newSelectedCells,
          };
        }
        return {
          previousCell: newSelectedCells[newSelectedCells.length - 2],
          allSelectedCells: newSelectedCells,
        };
      });
    }
  };

  const handleOnMouseUp = ({
    columnIdx,
    rowIdx,
  }: {
    columnIdx: number;
    rowIdx: number;
  }) => {
    console.log(
      "cell's onMouseUp called on columnIdx/rowIdx --->",
      columnIdx,
      "/",
      rowIdx
    );
    console.log(
      "onMouseUp current cell is selected -->",
      spreadsheetState[rowIdx][columnIdx].isFocused
    );
    setSelecting(false);
  };

  const handleOnCopy = (columnIdx: number, rowIdx: number) => {
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

  const handleOnCut = async (columnIdx: number, rowIdx: number) => {
    await navigator.clipboard.writeText(
      spreadsheetState[rowIdx][columnIdx].value!
    );
    changeCellState({
      rowIdx,
      columnIdx,
      cellUpdate: { isEditing: false, isFocused: true, value: "" },
    });
  };

  const handleOnPaste = (columnIdx: number, rowIdx: number) => {
    // If isEditing is false, then paste the clipboard text to the cell.
    if (!spreadsheetState[rowIdx][columnIdx].isEditing) {
      navigator.clipboard.readText().then((clipText) => {
        handleCellValueChange({ rowIdx, columnIdx, newValue: clipText });
      });
    }
  };

  /** Add "columnsCount" number of new empty columns at the columnIdxStart. */
  const addColumns = ({ columnIdx, columnsCount }: ColumnsToAdd) => {
    console.log("addColumns, columnIdxStart --->", columnIdx);
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
    handleDBUpdate(newSpreadSheetState);
    setContextMenu({ ...contextMenu, isContextMenuOpen: false });
  };

  // TODO: fix this
  /** Delete selected columns from the spreadsheet. */
  const deleteSelectedColumns = ({
    columnIdxEnd,
    columnIdxStart,
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
    handleDBUpdate(newSpreadSheetState);
    setContextMenu({ ...contextMenu, isContextMenuOpen: false });
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
    handleDBUpdate(newSpreadsheet);
    setContextMenu({ ...contextMenu, isContextMenuOpen: false });
  };

  /** Delete the selected rows from the spreadsheet. */
  const deleteSelectedRows = ({
    rowIdxEnd,
    rowIdxStart,
    rowsCount,
  }: RowsToDelete) => {
    console.log("deleteSelectedRows, rowIdxStart --->", rowIdxStart);
    const firstChunkOfRows = spreadsheetState.slice(0, rowIdxStart!);
    console.log("deleteSelectedRows, firstChunkOfRows --->", firstChunkOfRows);
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
    handleDBUpdate(newSpreadsheet);
    setContextMenu({ ...contextMenu, isContextMenuOpen: false });
  };

  useEffect(() => {
    // TODO: this code fetches data every time we reload the page. Update this to use cache, so
    // TODO: we don't make a call to our API unnecessarily.
    // Fetch for the data from the server.
    let spreadsheetData;
    const fetchData = async () => {
      const responseBody = await fetch("/sp/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("response ---> ", responseBody);
      // Check if the response is not ok.
      if (!responseBody.ok)
        throw new Error(
          `🪷🪷🪷 Error fetching data from the server. HTTP status ${responseBody.status}`
        );
      const data = await responseBody.json();
      // console.log("data ----> ", data);
      spreadsheetData = data;
      // Empty array means there is no data in the database.
      if (data.length === 0) return;
      setSpreadsheetState(spreadsheetData);
    };

    fetchData();
  }, []);

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
                  value={`${columnIdx + 1}C`}
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
                      value={`${rowIdx + 1}R`}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <CellWrapper
                    key={`cell-wrapper-${rowIdx}/${columnIdx}`}
                    onContextMenu={(event: React.MouseEvent<HTMLDivElement>) =>
                      handleCellClick(columnIdx, event, rowIdx)
                    }
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
                        value: column.value,
                      }}
                      key={`cell-${rowIdx}/${columnIdx}`}
                      onBlur={() => handleCellBlur({ rowIdx, columnIdx })}
                      onChange={(newValue) => {
                        handleCellValueChange({ rowIdx, columnIdx, newValue });
                      }}
                      onClick={(event: React.MouseEvent) =>
                        handleCellClick(columnIdx, event, rowIdx)
                      }
                      onContextMenu={(event: React.MouseEvent) =>
                        handleCellClick(columnIdx, event, rowIdx)
                      }
                      onCopy={() => handleOnCopy(columnIdx, rowIdx)}
                      onCut={() => handleOnCut(columnIdx, rowIdx)}
                      onDoubleClick={() => handleDoubleClick(columnIdx, rowIdx)}
                      onDragStart={(
                        event: React.DragEvent<HTMLInputElement>
                      ) => {
                        // Set the input prop "draggable={true}" in Cell and prevent default in onDragStart event.
                        // More info here: https://stackoverflow.com/a/44049369/10029397
                        event.preventDefault();
                      }}
                      onFocus={() => handleCellFocus(columnIdx, rowIdx)}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLInputElement>
                      ) => handleKeyDown(columnIdx, event, rowIdx)}
                      onMouseDown={(event: React.MouseEvent) => {
                        handleMouseDown({ rowIdx, columnIdx, event });
                      }}
                      onMouseOver={(
                        event: React.MouseEvent<HTMLInputElement>
                      ) => {
                        handleOnMouseOver(columnIdx, event, rowIdx);
                      }}
                      onMouseUp={(
                        event: React.MouseEvent<HTMLInputElement>
                      ) => {
                        handleOnMouseUp({ rowIdx, columnIdx });
                      }}
                      onPaste={() => handleOnPaste(columnIdx, rowIdx)}
                      ref={(element: HTMLInputElement) =>
                        handleAddRef(element, columnIdx, rowIdx)
                      }
                    />
                  </CellWrapper>
                  {/* TODO: maintain focus after rows/cols have been deleted/added. */}
                  {contextMenu.isContextMenuOpen && (
                    <ContextMenu
                      addColumns={addColumns}
                      addRows={addRows}
                      deleteSelectedColumns={deleteSelectedColumns}
                      deleteSelectedRows={deleteSelectedRows}
                      selectionStartAndEndCells={{
                        selectionStartCell: {
                          rowIdx:
                            selectionStartAndEndCells.selectionStartCell.rowIdx,
                          columnIdx:
                            selectionStartAndEndCells.selectionStartCell
                              .columnIdx,
                        },
                        selectionEndCell: {
                          rowIdx:
                            selectionStartAndEndCells.selectionEndCell.rowIdx,
                          columnIdx:
                            selectionStartAndEndCells.selectionEndCell
                              .columnIdx,
                        },
                      }}
                      left={contextMenu.locationX}
                      top={contextMenu.locationY}
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
