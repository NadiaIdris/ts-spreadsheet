import { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Cell from "../Cell";
import CellHeader from "../CellHeader";
import CellWrapper from "../CellWrapper";
import ContextMenu from "../ContextMenu";
import { calculateColumnCount } from "../../utils/utils";

interface SpreadsheetProps {
  columns?: number;
  rows?: number;
}

// TODO: fix resetting the cells isSelected and isEditing values when move to the next cell.

interface OneCell {
  columnIdx?: number;
  isEditing?: boolean;
  isSelected?: boolean;
  rowIdx?: number;
  value?: string;
}

export interface SelectedCells {
  columnIdxEnd: number | null;
  columnIdxStart: number | null;
  rowIdxEnd: number | null;
  rowIdxStart: number | null;
}

interface RowAndColumnCount {
  columnsCount: number;
  rowsCount: number;
}

export interface ColumnsToAdd {
  columnIdxStart: SelectedCells["columnIdxStart"];
  columnsCount: RowAndColumnCount["columnsCount"];
}

export interface ColumnsToDelete {
  columnIdxEnd: SelectedCells["columnIdxEnd"];
  columnIdxStart: SelectedCells["columnIdxStart"];
  columnsCount: RowAndColumnCount["columnsCount"];
}

export interface RowsToAdd {
  rowIdxStart: SelectedCells["rowIdxStart"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

export interface RowsToDelete {
  rowIdxEnd: SelectedCells["rowIdxEnd"];
  rowIdxStart: SelectedCells["rowIdxStart"];
  rowsCount: RowAndColumnCount["rowsCount"];
}

const Spreadsheet = ({ rows = 10, columns = 10 }: SpreadsheetProps) => {
  const grid: OneCell[][] = Array.from({ length: rows }, (v, rowI) =>
    Array.from({ length: columns }, (v, columnI) => {
      return {
        columnIdx: columnI,
        isSelected: false,
        isEditing: false,
        rowIdx: rowI,
        value: "",
      } as OneCell;
    })
  );
  const [spreadsheetState, setSpreadsheetState] = useState<OneCell[][]>(grid);
  const [contextMenu, setContextMenu] = useState({
    isContextMenuOpen: false,
    locationX: 0,
    locationY: 0,
    rowIdx: 0,
    columnIdx: 0,
  });
  const [selectedCells, setSelectedCells] = useState({
    columnIdxEnd: null,
    columnIdxStart: null,
    rowIdxEnd: null,
    rowIdxStart: null,
  } as SelectedCells);
  const [previousCell, setPreviousCell] = useState({
    columnIdx: null as number | null,
    rowIdx: null as number | null,
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

  // TODO: is it possible to make this function a custom hook?
  const changeCellState = (
    cellUpdate: OneCell,
    columnIdx: number,
    rowIdx: number
  ) => {
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

  const handleCellBlur = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: false, isSelected: false }, columnIdx, rowIdx);
  };

  // When "Tab" key is pressed, next cell gets focus an handleCellFocus is called.
  const handleCellFocus = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: false, isSelected: true }, columnIdx, rowIdx);
  };

  const handleCellValueChange = (
    columnIdx: number,
    newValue: string,
    rowIdx: number
  ) => {
    const currentCell = spreadsheetState[rowIdx][columnIdx];
    // If the new value is the same as the current value, then don't update the cell value.
    if (currentCell.value === newValue) return;
    // When calling moveFocusTo function we end up calling setSpreadsheetState more than once. In order for all the setSpreadsheetState calls to work as intended, we need to use the functional form of setState.
    changeCellState({ value: newValue }, columnIdx, rowIdx);
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
    if (event.type === "click") {
      // If context menu is open, then close it.
      if (contextMenu.isContextMenuOpen)
        setContextMenu({ ...contextMenu, isContextMenuOpen: false });
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setContextMenu({
        isContextMenuOpen: true,
        locationX: event.clientX,
        locationY: event.clientY,
        rowIdx,
        columnIdx,
      });
      setSelectedCells({
        columnIdxEnd: columnIdx,
        columnIdxStart: columnIdx,
        rowIdxEnd: rowIdx,
        rowIdxStart: rowIdx,
      });
    }
    const cell = spreadsheetState[rowIdx][columnIdx];
    if (cell.isEditing) return;
    if (cell.isSelected) return;
    changeCellState({ isEditing: false, isSelected: true }, columnIdx, rowIdx);
    moveFocusTo(columnIdx, rowIdx);
  };

  const handleDoubleClick = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: true, isSelected: true }, columnIdx, rowIdx);
  };

  /* Drag and drop */
  const handleCellWrapperDragEnd = (
    columnIdx: number,
    event: React.DragEvent<HTMLDivElement>,
    rowIdx: number
  ) => {
    console.log(`onDragEnd ---> columnIdx: ${columnIdx} rowIdx: ${rowIdx}`);
    console.log(
      `onDragEnd event.dataTransfer.dropEffect ---->`,
      event.dataTransfer.dropEffect
    );
    // If cell was dragged to a cell that is not droppable, then early return.
    if (event.dataTransfer.dropEffect === "none") return;
    // If the cell was dropped on the same cell, then don't change the cell state.
    if (previousCell.columnIdx === columnIdx && previousCell.rowIdx === rowIdx)
      return;
    changeCellState(
      { isEditing: false, isSelected: false, value: "" },
      columnIdx,
      rowIdx
    );
  };

  const handleCellWrapperDragStart = (
    columnIdx: number,
    event: React.DragEvent<HTMLDivElement>,
    rowIdx: number
  ) => {
    const dt = event.dataTransfer;
    dt.setData("text/plain", spreadsheetState[rowIdx][columnIdx].value!);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    console.log("drag start");
    console.log("onDragStart event.dataTransfer ---->", event.dataTransfer);
  };

  const handleCellWrapperDrop = (
    columnIdx: number,
    event: React.DragEvent<HTMLDivElement>,
    rowIdx: number
  ) => {
    const data = event.dataTransfer.getData("text/plain");
    console.log("onDrop columnIdx ---->", columnIdx);
    console.log("onDrop rowIdx ---->", rowIdx);
    console.log("onDrop data ---->", data);
    setPreviousCell({ columnIdx, rowIdx });
    changeCellState(
      { isEditing: false, isSelected: true, value: data },
      columnIdx,
      rowIdx
    );
    moveFocusTo(columnIdx, rowIdx);
  };

  // Update the whole spreadsheet in the database.
  const handleDBUpdate = async (spreadsheetState: OneCell[][]) => {
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

    // TODO: check this if statement.
    // If user is typing, then set the cell isEditing to true.
    if (event.key.length === 1) {
      if (currentCell.isSelected && !currentCell.isEditing) {
        // Clear the cell value.
        changeCellState(
          { isEditing: true, isSelected: true, value: "" },
          columnIdx,
          rowIdx
        );
      }
    }

    if (event.key === "Enter") {
      // event.preventDefault();
      if (currentCell.isSelected && currentCell.isEditing) {
        // Previous cell state: onBlur callback sets the previous cell isEditing and isSelected to false (we don't need to write any extra code for this).

        // If on the last row, then do an early return.
        if (rowIdx === spreadsheetState.length - 1) {
          changeCellState(
            { isEditing: false, isSelected: true },
            columnIdx,
            rowIdx
          );
          closeContextMenu();
          return;
        }
        // Add focus to the cell below. We need to use the spreadSheetRefMap to get the cell below.
        moveFocusTo(columnIdx, rowIdx + 1);
        // Set the cell below state (isSelected to true).
        changeCellState(
          { isEditing: false, isSelected: true },
          columnIdx,
          rowIdx + 1
        );
        closeContextMenu();
      } else if (currentCell.isSelected && !currentCell.isEditing) {
        // Set the current cell isEditing to true.
        changeCellState(
          { isEditing: true, isSelected: true },
          columnIdx,
          rowIdx
        );
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

  const handleOnCut = (columnIdx: number, rowIdx: number) => {
    navigator.clipboard.writeText(spreadsheetState[rowIdx][columnIdx].value!);
    changeCellState(
      { isEditing: false, isSelected: true, value: "" },
      columnIdx,
      rowIdx
    );
  };

  const handleOnPaste = (columnIdx: number, rowIdx: number) => {
    // If isEditing is false, then paste the clipboard text to the cell.
    if (!spreadsheetState[rowIdx][columnIdx].isEditing) {
      navigator.clipboard.readText().then((clipText) => {
        handleCellValueChange(columnIdx, clipText, rowIdx);
      });
    }
  };

  /** Add "columnsCount" number of new empty columns at the columnIdxStart. */
  const addColumns = ({ columnIdxStart, columnsCount }: ColumnsToAdd) => {
    console.log("addColumns, columnIdxStart --->", columnIdxStart);
    // Loop over the spreadSheetCopy and for each row, add "x" new empty cells at the columnIdxStart.
    const newSpreadSheetState = spreadsheetState.map((row, rowIndex) => {
      const startChunkOfTheRow = row.slice(0, columnIdxStart!);
      const newCellsChunk = Array.from({ length: columnsCount }, (v, i) => {
        return {
          columnIdx: columnIdxStart! + i,
          isSelected: false,
          isEditing: false,
          rowIdx: rowIndex,
          value: "",
        } as OneCell;
      });
      // Update the column indices of the rest of the cells in the row.
      const endChunkOfTheRow = [];
      for (let i = columnIdxStart!; i < row.length; i++) {
        const newColumnIdxStart = i! + columnsCount;
        endChunkOfTheRow.push({
          ...row[i],
          columnIdx: newColumnIdxStart,
        } as OneCell);
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
  const addRows = ({ rowIdxStart, rowsCount }: RowsToAdd) => {
    const firstChunkOfRows = spreadsheetState.slice(0, rowIdxStart!);
    const columnsCount = spreadsheetState[0].length;
    const newRowsChunk = Array.from({ length: rowsCount }, (v, rowI) => {
      return Array.from({ length: columnsCount }, (v, columnI) => {
        return {
          columnIdx: columnI,
          isSelected: false,
          isEditing: false,
          rowIdx: rowIdxStart! + rowI,
          value: "",
        };
      });
    });
    // Update the row indices of the rest of the rows.
    const endChunkOfRows = [];
    for (let i = rowIdxStart!; i < spreadsheetState.length; i++) {
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
    // Fetch for the data from the server.
    let spreadsheetData;
    const fetchData = async () => {
      const responseBody = await fetch("/sp/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response ---> ", responseBody);
      // Check if the response is not ok.
      if (!responseBody.ok)
        throw new Error(
          `🪷🪷🪷 Error fetching data from the server. HTTP status ${responseBody.status}`
        );
      const data = await responseBody.json();
      console.log("data ----> ", data);
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
              {/* <CellHeader
                key={`cell-header-new-column-button`}
                style={{
                  backgroundColor: "red",
                  borderRight: "none",
                  width: "20px",
                }}
                value="+"
              /> */}
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
                      handleCellWrapperDragEnd(columnIdx, event, rowIdx)
                    }
                    onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
                      handleCellWrapperDragStart(columnIdx, event, rowIdx);
                    }}
                    /* Do not remove onDragOver. We need it. */
                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      handleCellWrapperDrop(columnIdx, event, rowIdx);
                    }}
                    onMouseOver={(event: any) => {
                      if (event.target !== event.currentTarget) {
                        return;
                      }
                    }}
                  >
                    <Cell
                      columnIdx={columnIdx}
                      isEditing={column.isEditing}
                      isSelected={column.isSelected}
                      key={`cell-${rowIdx}/${columnIdx}`}
                      onBlur={() => handleCellBlur(columnIdx, rowIdx)}
                      onChange={(newValue) => {
                        handleCellValueChange(columnIdx, newValue, rowIdx);
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
                      onMouseDown={(
                        event: React.MouseEvent<HTMLInputElement>
                      ) => {
                        // event.stopPropagation();
                      }}
                      onMouseOver={(
                        event: React.MouseEvent<HTMLInputElement>
                      ) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onPaste={() => handleOnPaste(columnIdx, rowIdx)}
                      ref={(element: HTMLInputElement) =>
                        handleAddRef(element, columnIdx, rowIdx)
                      }
                      rowIdx={rowIdx}
                      value={column.value}
                    />
                  </CellWrapper>
                  {/* TODO: maintain focus after rows/cols have been deleted/added. */}
                  {contextMenu.isContextMenuOpen && (
                    <ContextMenu
                      addColumns={addColumns}
                      addRows={addRows}
                      deleteSelectedColumns={deleteSelectedColumns}
                      deleteSelectedRows={deleteSelectedRows}
                      selectedCells={selectedCells}
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
