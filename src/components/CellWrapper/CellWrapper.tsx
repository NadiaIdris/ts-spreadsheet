import styled from "styled-components";

interface CellWrapperProps {
  children: React.ReactNode;
  isSelected: boolean;
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
  isSelected,
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
      isSelected={isSelected}
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

const CellWrapperStyledOne = styled.div<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "var(--color-cell-focused-bg) !important" : "")};
  color: var(--color-text-cell-not-focused);
  cursor: default;
  padding: 3px;
  border: 1px solid var(--color-border-spreadsheet);

  // Add background color to all the elements inside the cell
  & * {
    background-color: ${(props) => (props.isSelected ? "var(--color-cell-focused-bg) !important" : "")};
  }

  &:focus-within {
    border-radius: 2px;
    color: var(--color-white);
    cursor: grab;
    outline: 2px solid var(--color-text-cell);
    outline-offset: -2px;
    z-index: 10;
  }
`;
