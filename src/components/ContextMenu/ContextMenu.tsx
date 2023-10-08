import styled from "styled-components";
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconDelete } from "../../assets/icons/delete.svg";
import {
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  calculateRowRange,
} from "../../utils/utils";
import {
  ColumnsToAdd,
  ColumnsToDelete,
  RowsToAdd,
  RowsToDelete,
  SelectedCells,
} from "../Spreadsheet";
import MenuItem from "./MenuItem";

interface ContextMenuProps {
  addColumns: ({ columnIdx, columnsCount }: ColumnsToAdd) => void;
  addRows: ({ rowIdx, rowsCount }: RowsToAdd) => void;
  deleteSelectedColumns: ({
    columnIdxStart,
    columnIdxEnd,
    columnsCount,
  }: ColumnsToDelete) => void;
  deleteSelectedRows: ({
    rowIdxEnd,
    rowIdxStart,
    rowsCount,
  }: RowsToDelete) => void;
  selectionStartCell: SelectedCells[ "selectionStartCell" ];
  selectionEndCell: SelectedCells[ "selectionEndCell" ];
  left: number;
  top: number;
}

const ContextMenu = ({
  addColumns,
  addRows,
  deleteSelectedColumns,
  deleteSelectedRows,
  selectionStartCell,
  selectionEndCell,
  left,
  top,
}: ContextMenuProps) => {
  const { columnIdx: columnIdxStart, rowIdx: rowIdxStart } = selectionStartCell;
  const { columnIdx: columnIdxEnd, rowIdx: rowIdxEnd } = selectionEndCell;
  const iconAdd = (
    <IconAdd color="#1d2c37" height={10} width={10} title="plus-icon" />
  );
  const iconDelete = (
    <IconDelete color="#1d2c37" height={10} width={10} title="delete-icon" />
  );

  const addColumnsMenuItem = () => {
    const columnsCount = calculateColumnCount({ columnIdxStart, columnIdxEnd });
    const hasZeroColumns = columnsCount === 0;
    const hasOneColumn = columnsCount === 1;
    const hasOneOrMoreColumns = columnsCount >= 1;
    if (hasZeroColumns) return;
    if (hasZeroColumns) { 
      console.log("hasZeroColumns")
    }
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addColumns({ columnIdx: columnIdxStart, columnsCount })}
      >
        {hasOneOrMoreColumns && (
          <ContextMenuItemTextStyled>
            Add {hasOneColumn ? "1 column" : `${columnsCount} columns`} left
          </ContextMenuItemTextStyled>
        )}
      </MenuItem>
    );
  };

  const addRowsMenuItem = () => {
    const rowsCount = calculateRowCount({ rowIdxEnd, rowIdxStart });
    const zeroRowsSelected = rowsCount === 0;
    const oneRowSelected = rowsCount === 1;
    if (zeroRowsSelected) return;
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addRows({ rowIdx: rowIdxStart, rowsCount })}
      >
        <ContextMenuItemTextStyled>
          Add {oneRowSelected ? "1 row" : `${rowsCount} rows`} above
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteColumnsMenuItem = () => {
    const columnsCount = calculateColumnCount({ columnIdxEnd, columnIdxStart });
    const zeroColumnsSelected = columnsCount === 0;
    const oneColumnSelected = columnsCount === 1;
    if (zeroColumnsSelected) return;
    const columnRange = calculateColumnRange({ columnIdxEnd, columnIdxStart });
    return (
      <MenuItem
        icon={iconDelete}
        onClick={() =>
          deleteSelectedColumns({ columnIdxEnd, columnIdxStart, columnsCount })
        }
      >
        <ContextMenuItemTextStyled>
          Delete{" "}
          {oneColumnSelected
            ? `column ${columnRange}`
            : `columns ${columnRange}`}
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteRowsMenuItem = () => {
    const rowsCount = calculateRowCount({ rowIdxEnd, rowIdxStart });
    const zeroRowsSelected = rowsCount === 0;
    const oneRowSelected = rowsCount === 1;
    if (zeroRowsSelected) return;
    const rowRange = calculateRowRange({ rowIdxEnd, rowIdxStart });
    return (
      <MenuItem
        icon={iconDelete}
        onClick={() =>
          deleteSelectedRows({ rowIdxEnd, rowIdxStart, rowsCount })
        }
      >
        <ContextMenuItemTextStyled>
          Delete {oneRowSelected ? `row ${rowRange}` : `rows ${rowRange}`}
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const horizontalLine = ({ color = "black", margin = "0 4px" }) => {
    return (
      <hr
        style={{
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
          borderTop: `1px solid ${color}`,
          margin: margin,
        }}
      />
    );
  };

  return (
    <ContextMenuStyled left={left} onContextMenu={() => { }} top={top}>
      {addColumnsMenuItem()}
      {addRowsMenuItem()}
      {horizontalLine({ color: "lightgray", margin: "2px 4px" })}
      {deleteColumnsMenuItem()}
      {deleteRowsMenuItem()}
    </ContextMenuStyled>
  );
};

export default ContextMenu;

const ContextMenuStyled = styled.div<{ left: number; top: number }>`
  background-color: white;
  border-radius: var(--border-radius-medium);
  color: var(--color-background);
  left: ${({ left }) => left}px;
  padding: 4px;
  position: absolute;
  top: ${({ top }) => top}px;
  width: 200px;
  z-index: 11;
`;

const ContextMenuItemTextStyled = styled.div`
  font-size: 0.8em;
`;
