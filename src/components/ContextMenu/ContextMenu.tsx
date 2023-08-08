import styled from "styled-components";
import MenuItem from "./MenuItem";
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg"; // https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs
import { SelectedCells } from "../Spreadsheet/Spreadsheet";
import { calculateColumns, calculateRows } from "../../utils/utils";

interface ContextMenuProps {
  left: number;
  selectedCells: SelectedCells;
  top: number;
}

const ContextMenu = ({ left, selectedCells, top }: ContextMenuProps) => {
  const { columnIdxEnd, columnIdxStart, rowIdxEnd, rowIdxStart } =
    selectedCells;
  const iconAdd = (
    <IconAdd
      color="green"
      height={14}
      style={{ marginRight: "8px" }}
      width={14}
    ></IconAdd>
  );
  const addColumns = () => {
    const columnsCount = calculateColumns(columnIdxEnd, columnIdxStart);
    const hasZeroColumns = columnsCount === 0;
    const hasOneColumn = columnsCount === 1;
    const hasOneOrMoreColumns = columnsCount >= 1;
    if (hasZeroColumns) return;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 0 6px 8px",
        }}
      >
        {iconAdd}
        {hasOneOrMoreColumns && (
          <ContextMenuItemTextStyled>
            Add{" "}
            {hasOneColumn
              ? "1 column"
              : `${columnsCount} columns`}
          </ContextMenuItemTextStyled>
        )}
      </div>
    );
  };

  const addRows = () => { 
    const rowsCount = calculateRows(rowIdxEnd, rowIdxStart);
    const hasZeroRows = rowsCount === 0;
    const hasOneRow = rowsCount === 1;
    const hasOneOrMoreRows = rowsCount >= 1;
    if (hasZeroRows) return;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 0 6px 8px",
        }}
      >
        {iconAdd}
        {hasOneOrMoreRows && (
          <ContextMenuItemTextStyled>
            Add{" "}
            {hasOneRow
              ? "1 row"
              : `${rowsCount} rows`}
          </ContextMenuItemTextStyled>
        )}
      </div>
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
  background: white; // TODO: Background color doesn't work.
  color: red;
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
