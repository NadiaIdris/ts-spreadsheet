import { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Cell from "../Cell";
import CellHeader from "../CellHeader";
import CellWrapper from "../CellWrapper";

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
      const newRow = [
        ...spreadsheet[rowIdx].slice(0, columnIdx),
        { ...spreadsheet[rowIdx][columnIdx], ...cellUpdate },
        ...spreadsheet[rowIdx].slice(columnIdx + 1),
      ];
      return [
        ...spreadsheet.slice(0, rowIdx),
        newRow,
        ...spreadsheet.slice(rowIdx + 1),
      ];
    });
  };

  const handleCellBlur = (columnIdx: number, rowIdx: number) => {
    console.log(
      `%cOnblur got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
      "background: #222; color: #A1E53C"
    );
    changeCellState({ isEditing: false, isSelected: false }, columnIdx, rowIdx);
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
    changeCellState(
      { isSelected: true, isEditing: true, value: newValue },
      columnIdx,
      rowIdx
    );
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

  const handleCellClick = (columnIdx: number, rowIdx: number) => {
    console.log(
      `%cOnclick got called. columnIdx: ${columnIdx} rowIdx: ${rowIdx}`,
      "color: #E78A00"
    );
    const cell = spreadsheetState[rowIdx][columnIdx];
    if (cell.isEditing) return;
    changeCellState({ isEditing: false, isSelected: true }, columnIdx, rowIdx);
  };

  const handleDoubleClick = (columnIdx: number, rowIdx: number) => {
    changeCellState({ isEditing: true, isSelected: true }, columnIdx, rowIdx);
  };

  /* Drag and drop */
  const handleDragEnd = (
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
      moveFocusTo(columnIdx + 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowLeft" && currentCell.isEditing === false) {
      moveFocusTo(columnIdx - 1, rowIdx);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowUp") {
      moveFocusTo(columnIdx, rowIdx - 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
    }

    if (event.key === "ArrowDown") {
      moveFocusTo(columnIdx, rowIdx + 1);
      // Note: we don't need to update the spreadsheetState here, because the onFocus callback will do that for us.
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
    navigator.clipboard.readText().then((clipText) => {
      changeCellState(
        { isEditing: false, isSelected: true, value: clipText },
        columnIdx,
        rowIdx
      );
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
                  value={ALPHABET[columnIdx]}
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
                      value={String(rowIdx + 1)}
                    />
                  )}
                  {/* Add the rest of row items.  */}
                  <CellWrapper
                    onDrag={(event) => {
                      // console.log("onDrag");
                      // console.log("event.dataTransfer ---->", event.dataTransfer  )
                    }}
                    onDragEnd={(event: React.DragEvent<HTMLDivElement>) =>
                      handleDragEnd(columnIdx, event, rowIdx)
                    }
                    onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
                      // event.preventDefault();
                      // event.stopPropagation();
                      const dt = event.dataTransfer;
                      dt.setData(
                        "text/plain",
                        spreadsheetState[rowIdx][columnIdx].value!
                      );
                      event.dataTransfer.effectAllowed = "move";
                      console.log("drag start");
                      console.log(
                        "onDragStart event.dataTransfer ---->",
                        event.dataTransfer
                      );
                    }}
                    onDragEnter={(e) => console.log("onDragEnter")}
                    onDragLeave={(e) => console.log("onDragLeave")}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(event) => {
                      const data = event.dataTransfer.getData("text/plain");
                      console.log("onDrop columnIdx ---->", columnIdx);
                      console.log("onDrop rowIdx ---->", rowIdx);
                      changeCellState(
                        { isEditing: false, isSelected: true, value: data },
                        columnIdx,
                        rowIdx
                      );
                      moveFocusTo(columnIdx, rowIdx);
                    }}
                    onMouseOver={(event: any) => {
                      if (event.target !== event.currentTarget) return;
                      console.log("onMouseOver event ---->", event);
                      console.log(
                        "onMouseOver event.target ---->",
                        event.target
                      );
                      console.log(
                        "onMouseOver event.currentTarget ---->",
                        event.currentTarget
                      );

                      // If any of the children are focused, then don't change the background color.
                      // if (event.target.contains(document.activeElement)) return;
                    }}
                  >
                    <Cell
                      columnIdx={columnIdx}
                      isEditing={column.isEditing}
                      isSelected={column.isSelected}
                      key={`cell-${rowIdx}/${columnIdx}`}
                      onBlur={() => handleCellBlur(columnIdx, rowIdx)}
                      onChange={(newValue) =>
                        handleCellValueChange(columnIdx, newValue, rowIdx)
                      }
                      onClick={() => handleCellClick(columnIdx, rowIdx)}
                      onCopy={() => handleOnCopy(columnIdx, rowIdx)}
                      onCut={() => handleOnCut(columnIdx, rowIdx)}
                      onDoubleClick={() => handleDoubleClick(columnIdx, rowIdx)}
                      onDrag={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDrag");
                        // console.log("onDrag");
                        // console.log("event.dataTransfer ---->", event.dataTransfer  )
                      }}
                      onDragEnd={(event: React.DragEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDragEnd");
                      }}
                      onDragStart={(
                        event: React.DragEvent<HTMLInputElement>
                      ) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDragStart");
                        // const dt = event.dataTransfer;
                        // dt.setData(
                        //   "text/plain",
                        //   spreadsheetState[rowIdx][columnIdx].value!
                        // );
                        // event.dataTransfer.effectAllowed = "move";
                        // console.log("drag start");
                        // console.log(
                        //   "onDragStart event.dataTransfer ---->",
                        //   event.dataTransfer
                        // );
                      }}
                      onDragEnter={(event: React.DragEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDragEnter");
                      }}
                      onDragLeave={(event: React.DragEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDragLeave");
                      }}
                      onDragOver={(event: React.DragEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDragOver");
                      }}
                      onDrop={(event: React.DragEvent<HTMLInputElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("Input onDrop");
                        // const data = event.dataTransfer.getData("text/plain");
                        // console.log("onDrop columnIdx ---->", columnIdx);
                        // console.log("onDrop rowIdx ---->", rowIdx);
                        // changeCellState(
                        //   { isEditing: false, isSelected: true, value: data },
                        //   columnIdx,
                        //   rowIdx
                        // );
                        // moveFocusTo(columnIdx, rowIdx);
                      }}
                      onFocus={() => handleCellFocus(columnIdx, rowIdx)}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLInputElement>
                      ) => handleKeyDown(columnIdx, event, rowIdx)}
                      onMouseDown={(event: React.MouseEvent<HTMLInputElement>) => { 
                        event.stopPropagation();
                      }}
                      onMouseOver={(event: React.MouseEvent<HTMLInputElement>) => { 
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
