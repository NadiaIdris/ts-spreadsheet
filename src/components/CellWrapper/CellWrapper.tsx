import styled from "styled-components";

interface CellWrapperProps {
  children: React.ReactNode;
  onDrag: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLInputElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLInputElement>) => void;
  onMouseOver: (event: React.MouseEvent<HTMLInputElement>) => void;
}

const CellWrapper = ({
  children,
  onDrag,
  onDragEnd,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onMouseOver
}: CellWrapperProps) => {
  return (
    <CellWrapperStyledOne
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      draggable={true}
      onDragStart={(event: any) => onDragStart(event)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseOver={onMouseOver}
    >
      {children}
    </CellWrapperStyledOne>
  );
};

export default CellWrapper;

const CellWrapperStyledOne = styled.div`
  border-right: 1px solid var(--color-border-spreadsheet);
  border-bottom: 1px solid var(--color-border-spreadsheet);
  border-left: 1px solid transparent;
  border-top: 1px solid transparent;
  max-width: 100%;
  min-width: 20px;
  color: var(--color-text-cell-not-focused);
  transition: background-color 0.1s ease-in-out;
  cursor: grab;

  &:focus-within {
    border-radius: 2px;
    outline: 3px solid var(--color-text-cell);
    outline-offset: -3px;
    z-index: 10;
    color: var(--color-white);
  }
`;
