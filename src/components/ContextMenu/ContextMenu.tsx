import styled from "styled-components";
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconDelete } from "../../assets/icons/delete.svg";
import { calculateColumnCount, calculateColumnRange, calculateRowCount } from "../../utils/utils";
import { ColumnsToAdd, RowsToAdd, SelectedCells } from "../Spreadsheet";
import MenuItem from "./MenuItem";

interface ContextMenuProps {
  addColumnsOnClick: ({ columnIdxStart, columnsCount }: ColumnsToAdd) => void;
  addRowsOnClick: ({ rowIdxStart, rowsCount }: RowsToAdd) => void;
  left: number;
  selectedCells: SelectedCells;
  top: number;
}

const ContextMenu = ({
  addColumnsOnClick,
  addRowsOnClick,
  left,
  selectedCells,
  top,
}: ContextMenuProps) => {
  const { columnIdxEnd, columnIdxStart, rowIdxEnd, rowIdxStart } =
    selectedCells;
  const iconAdd = (
    <IconAdd color="#1d2c37" height={10} width={10} title="plus-icon" />
  );
  const iconDelete = (
    <IconDelete color="#1d2c37" height={10} width={10} title="delete-icon" />
  );

  const addColumns = () => {
    const columnsCount = calculateColumnCount(columnIdxEnd, columnIdxStart);
    const hasZeroColumns = columnsCount === 0;
    const hasOneColumn = columnsCount === 1;
    const hasOneOrMoreColumns = columnsCount >= 1;
    if (hasZeroColumns) return;
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addColumnsOnClick({ columnIdxStart, columnsCount })}
      >
        {hasOneOrMoreColumns && (
          <ContextMenuItemTextStyled>
            Add {hasOneColumn ? "1 column" : `${columnsCount} columns`} left
          </ContextMenuItemTextStyled>
        )}
      </MenuItem>
    );
  };

  const addRows = () => {
    const rowsCount = calculateRowCount(rowIdxEnd, rowIdxStart);
    const hasZeroRows = rowsCount === 0;
    const hasOneRow = rowsCount === 1;
    if (hasZeroRows) return;
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addRowsOnClick({ rowIdxStart, rowsCount })}
      >
        <ContextMenuItemTextStyled>
          Add {hasOneRow ? "1 row" : `${rowsCount} rows`} above
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteColumns = () => {
    const columnsCount = calculateColumnCount(columnIdxEnd, columnIdxStart);
    const hasZeroColumns = columnsCount === 0;
    const hasOneColumn = columnsCount === 1;
    if (hasZeroColumns) return;
    // TODO: Add onClick handler
    const columnRange = calculateColumnRange({columnIdxEnd, columnIdxStart})
    return (
      <MenuItem icon={iconDelete} onClick={() => {}}>
        <ContextMenuItemTextStyled>
          Delete{" "}
          {hasOneColumn
            ? `column ${columnRange}`
            : `columns ${columnRange}`}
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteRows = () => {
    const rowsCount = calculateRowCount(rowIdxEnd, rowIdxStart);
    const hasZeroRows = rowsCount === 0;
    const hasOneRow = rowsCount === 1;
    if (hasZeroRows) return;
    // TODO: Add "Delete row 3" or "Delete rows 3-5"
    return (
      <MenuItem icon={iconDelete} onClick={() => {}}>
        <ContextMenuItemTextStyled>
          Delete selected {hasOneRow ? "row" : `${rowsCount} rows`}
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const horizontalLine = ({ color = "black", margin = "4px 0" }) => {
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
    <ContextMenuStyled left={left} top={top}>
      {addColumns()}
      {addRows()}
      {horizontalLine({ color: "lightgray", margin: "0 8px" })}
      {deleteColumns()}
      {deleteRows()}
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
  width: 300px;
  z-index: 11;
`;

const ContextMenuItemTextStyled = styled.div`
  font-size: 0.8em;
`;
