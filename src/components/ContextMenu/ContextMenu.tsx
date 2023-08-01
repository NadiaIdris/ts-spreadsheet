import styled from "styled-components";
import MenuItem from "./MenuItem";
import type { MenuItemProps } from "./MenuItem";

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
