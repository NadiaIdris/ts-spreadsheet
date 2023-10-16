import styled from "styled-components";

interface CellWrapperProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDrag?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const CellWrapper = ({
  children,
  onClick,
  onContextMenu,
  onDrag,
  onDragEnd,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFocus,
  onMouseDown,
  onMouseOver,
}: CellWrapperProps) => {
  return (
    <CellWrapperStyledOne
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onFocus={onFocus}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
    >
      {children}
    </CellWrapperStyledOne>
  );
};

export default CellWrapper;

const CellWrapperStyledOne = styled.div`
  // border-right: 1px solid var(--color-border-spreadsheet);
  // border-bottom: 1px solid var(--color-border-spreadsheet);
  // border-left: 1px solid transparent;
  // border-top: 1px solid transparent;
  color: var(--color-text-cell-not-focused);
  cursor: default;
  padding: 3px;
  // Remove the border below.
  border: 1px solid green;

  &:focus-within {
    border-radius: 2px;
    color: var(--color-white);
    cursor: grab;
    outline: 3px solid var(--color-text-cell);
    outline-offset: -3px;
    z-index: 10;
  }
`;
