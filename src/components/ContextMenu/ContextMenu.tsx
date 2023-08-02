import styled from "styled-components";
import MenuItem from "./MenuItem";
import type { MenuItemProps } from "./MenuItem";
import { ReactComponent as AddIcon } from "../../assets/icons/add.svg";

interface ContextMenuProps {
  columnIdx: number;
  data: any[];
  left: number;
  rowIdx: number;
  top: number;
}

const ContextMenu = ({
  columnIdx,
  data,
  left,
  rowIdx,
  top,
}: ContextMenuProps) => {
  return (
    <ContextMenuStyled left={left} top={top}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <AddIcon color="green" height={14} width={14}></AddIcon>
        <ContextMenuItemTextStyled>
          Add {data.length} {data.length > 1 ? "rows" : "row"} above
        </ContextMenuItemTextStyled>
      </div>
      {data.map((item) => (
        <MenuItem
          action={item.action}
          columnIdx={columnIdx}
          id={item.id}
          key={item.id}
          label={item.label}
          rowIdx={rowIdx}
        />
      ))}
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
