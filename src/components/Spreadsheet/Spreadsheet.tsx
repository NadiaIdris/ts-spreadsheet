import { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Cell from "../Cell";
import CellHeader from "../CellHeader";
import CellWrapper from "../CellWrapper";
import ContextMenu from "../ContextMenu";
import cellContextMenu from "../../data/cellContextMenu";

interface SpreadsheetProps {
  columns?: number;
  rows?: number;
}

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// TODO: fix resetting the cells isSelected and isEditing values when move to the next cell.

interface OneCell {
  isEditing?: boolean;
  isSelected?: boolean;
  value?: string;
}

const Spreadsheet = ({ rows = 10, columns = 10 }: SpreadsheetProps) => {
  const grid: OneCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => {
      return {
        isSelected: false,
        isEditing: false,
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
    console.log(
      `%cchangeCellState got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
      "background: #222; color: #DA3C8E"
    );
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
    console.log(
      `%cOnblur got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
      "background: #222; color: #A1E53C"
    );
    changeCellState({ isEditing: false, isSelected: false }, columnIdx, rowIdx);
    setContextMenu({ ...contextMenu, isContextMenuOpen: false });
  };

  // When "Tab" key is pressed, next cell gets focus an handleCellFocus is called.
  const handleCellFocus = (columnIdx: number, rowIdx: number) => {
    console.log(
      `%cOnfocus got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
      "background: #222; color: #00C2FF"
    );
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
      console.log(
        `%cLeft onclick got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
        "color: #E78A00"
      );
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setContextMenu({
        isContextMenuOpen: true,
        locationX: event.clientX,
        locationY: event.clientY,
        rowIdx,
        columnIdx,
      });
      console.log(
        `%cRight onclick got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
        "color: #900"
      );
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
    // If the cell wasn't dragged to another cell, then don't change the cell state.
    if (event.dataTransfer.dropEffect === "none") return;
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

    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed");
      if (currentCell.isSelected && currentCell.isEditing) {
        // Previous cell state: onBlur callback sets the previous cell isEditing and isSelected to false (we don't need to write any extra code for this).

        // If on the last row, then do an early return.
        if (rowIdx === spreadsheetState.length - 1) {
          changeCellState({ isEditing: false }, columnIdx, rowIdx);
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
      } else if (currentCell.isSelected && !currentCell.isEditing) {
        // Set the current cell isEditing to true.
        changeCellState(
          { isEditing: true, isSelected: true },
          columnIdx,
          rowIdx
        );
      }
    }

    if (event.key === "ArrowRight" && currentCell.isEditing === false) {
      console.log(
        `%cArrowRight key pressed. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`
      );
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowRight" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx + 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowLeft" && currentCell.isEditing === false) {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowLeft" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx - 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowUp") {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowUp" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx, rowIdx - 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowDown") {
      // Add preventDefault, so that the input field doesn't add animation when there is overflow of text and  "ArrowDown" focuses input field.
      event.preventDefault();
      moveFocusTo(columnIdx, rowIdx + 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    // Note: Make sure "Tab" + Shift is before "Tab" key. Otherwise, "Tab" key will be triggered first.
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      console.log("Shift enter clicked");
      moveFocusTo(columnIdx - 1, rowIdx);
      return;
    }

    if (event.key === "Tab") {
      // Add preventDefault, so that the input field doesn't add animation when "Tab" focuses input field.
      event.preventDefault();
      console.log(
        `%cTab key pressed. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
        "color: #FF5C00"
      );
      moveFocusTo(columnIdx + 1, rowIdx);
    }
  };

  const handleOnCopy = (columnIdx: number, rowIdx: number) => {
    // Check if any text is selected using getSelection() method.
    // If text is selected, copy only the selected text.
    // Info on JS selection: https://stackoverflow.com/a/53052928/10029397
    const selection = window.getSelection();
    if (selection?.type === "Range") {
      navigator.clipboard.writeText(selection.toString());
      console.log("selection text ---->", selection?.toString());
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
                  value={ALPHABET[columnIdx]}
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
                      value={String(rowIdx + 1)}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <CellWrapper
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
                  {contextMenu.isContextMenuOpen && (
                    <ContextMenu
                      columnIdx={contextMenu.columnIdx}
                      data={cellContextMenu}
                      left={contextMenu.locationX}
                      rowIdx={contextMenu.rowIdx}
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
`;
