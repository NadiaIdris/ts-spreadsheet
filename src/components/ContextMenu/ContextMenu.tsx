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
  RowsToAdd,
  ColumnsToDelete,
  RowsToDelete,
  SelectedCellOrCells,
} from "../Spreadsheet";
import MenuItem from "./MenuItem";

interface ContextMenuProps {
  addColumns: ({ columnIdxStart, columnsCount }: ColumnsToAdd) => void;
  addRows: ({ rowIdxStart, rowsCount }: RowsToAdd) => void;
  deleteSelectedColumns: ({
    columnIdxEnd,
    columnIdxStart,
    columnsCount,
  }: ColumnsToDelete) => void;
  deleteSelectedRows: ({
    rowIdxEnd,
    rowIdxStart,
    rowsCount,
  }: RowsToDelete) => void;
  left: number;
  selectedCells: SelectedCellOrCells;
  top: number;
}

const ContextMenu = ({
  addColumns,
  addRows,
  deleteSelectedColumns,
  deleteSelectedRows,
  left,
  selectedCells,
  top,
}: ContextMenuProps) => {
  // TODO: I restructured this DS. Rewrite this logic.
  const { rowIdxStart, rowIdxEnd, columnIdxStart, columnIdxEnd } =
    selectedCells;
  const iconAdd = (
    <IconAdd color="#1d2c37" height={10} width={10} title="plus-icon" />
  );
  const iconDelete = (
    <IconDelete color="#1d2c37" height={10} width={10} title="delete-icon" />
  );

  const addColumnsMenuItem = () => {
    const columnsCount = calculateColumnCount({ columnIdxEnd, columnIdxStart });
    const hasZeroColumns = columnsCount === 0;
    const hasOneColumn = columnsCount === 1;
    const hasOneOrMoreColumns = columnsCount >= 1;
    if (hasZeroColumns) return;
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addColumns({ columnIdxStart, columnsCount })}
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
        onClick={() => addRows({ rowIdxStart, rowsCount })}
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
    <ContextMenuStyled left={left} onContextMenu={() => {}} top={top}>
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
