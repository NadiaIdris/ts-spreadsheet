import styled from "styled-components";
import MenuItem from "./MenuItem";
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";
import { ColumnsToAdd, RowsToAdd, SelectedCells } from "../Spreadsheet";
import { calculateColumns, calculateRows } from "../../utils/utils";

interface ContextMenuProps {
  addColumnsOnClick: ({ columnIdxStart, columnsCount }: ColumnsToAdd) => void;
  addRowsOnClick: ({ rowIdxStart, rowsCount }: RowsToAdd) => void;
  left: number;
  selectedCells: SelectedCells;
  top: number;
}

const ContextMenu = ({
  addColumnsOnClick,
  left,
  selectedCells,
  top,
}: ContextMenuProps) => {
  const { columnIdxEnd, columnIdxStart, rowIdxEnd, rowIdxStart } =
    selectedCells;
  const iconAdd = <IconAdd color="#1d2c37" height={10} width={10} title="plus-icon"/>;
  const addColumns = () => {
    const columnsCount = calculateColumns(columnIdxEnd, columnIdxStart);
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
    const rowsCount = calculateRows(rowIdxEnd, rowIdxStart);
    const hasZeroRows = rowsCount === 0;
    const hasOneRow = rowsCount === 1;
    const hasOneOrMoreRows = rowsCount >= 1;
    if (hasZeroRows) return;
    return (
      <MenuItem icon={iconAdd} onClick={() => addRowsOnClick({})}>
        {hasOneOrMoreRows && (
          <ContextMenuItemTextStyled>
            Add {hasOneRow ? "1 row" : `${rowsCount} rows`} above
          </ContextMenuItemTextStyled>
        )}
      </MenuItem>
    );
  };

  return (
    <ContextMenuStyled left={left} top={top}>
      {addColumns()}
      {addRows()}
    </ContextMenuStyled>
  );
};

export default ContextMenu;

const ContextMenuStyled = styled.div<{ left: number; top: number }>`
  background-color: white;
  border-radius: var(--border-radius-medium);
  color: var(--color-background);
  left: ${({ left }) => left}px;
  padding: 10px;
  position: absolute;
  top: ${({ top }) => top}px;
  width: 300px;
  z-index: 11;
`;

const ContextMenuItemTextStyled = styled.div`
  font-size: 0.8em;
`;
