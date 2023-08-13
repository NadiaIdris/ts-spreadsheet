import styled from "styled-components";
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ReactComponent as IconDelete } from "../../assets/icons/delete.svg";
import {
  calculateColumnCount,
  calculateColumnRange,
  calculateRowCount,
  calculateRowRange,
} from "../../utils/utils";
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
    const columnsCount = calculateColumnCount({ columnIdxEnd, columnIdxStart });
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
    const rowsCount = calculateRowCount({ rowIdxEnd, rowIdxStart });
    const zeroRowsSelected = rowsCount === 0;
    const oneRowSelected = rowsCount === 1;
    if (zeroRowsSelected) return;
    return (
      <MenuItem
        icon={iconAdd}
        onClick={() => addRowsOnClick({ rowIdxStart, rowsCount })}
      >
        <ContextMenuItemTextStyled>
          Add {oneRowSelected ? "1 row" : `${rowsCount} rows`} above
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteColumns = () => {
    const columnsCount = calculateColumnCount({ columnIdxEnd, columnIdxStart });
    const zeroColumnsSelected = columnsCount === 0;
    const oneColumnSelected = columnsCount === 1;
    if (zeroColumnsSelected) return;
    // TODO: Add onClick handler
    const columnRange = calculateColumnRange({ columnIdxEnd, columnIdxStart });
    return (
      <MenuItem icon={iconDelete} onClick={() => {}}>
        <ContextMenuItemTextStyled>
          Delete{" "}
          {oneColumnSelected
            ? `column ${columnRange}`
            : `columns ${columnRange}`}
        </ContextMenuItemTextStyled>
      </MenuItem>
    );
  };

  const deleteRows = () => {
    const rowsCount = calculateRowCount({ rowIdxEnd, rowIdxStart });
    const zeroRowsSelected = rowsCount === 0;
    const oneRowSelected = rowsCount === 1;
    if (zeroRowsSelected) return;
    const rowRange = calculateRowRange({ rowIdxEnd, rowIdxStart });
    // TODO: Add onClick handler
    return (
      <MenuItem icon={iconDelete} onClick={() => {}}>
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
    <ContextMenuStyled left={left} top={top}>
      {addColumns()}
      {addRows()}
      {horizontalLine({ color: "lightgray", margin: "2px 4px" })}
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
  width: 200px;
  z-index: 11;
`;

const ContextMenuItemTextStyled = styled.div`
  font-size: 0.8em;
`;
