import styled from "styled-components";

interface CellWrapperProps {
  children: React.ReactNode;
}

const CellWrapper = ({ children }: CellWrapperProps) => {
  return <CellWrapperStyledOne>{children}</CellWrapperStyledOne>;
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

  &:focus-within {
    border-radius: 2px;
    cursor: grab;
    outline: 3px solid var(--color-text-cell);
    outline-offset: -2px;
    z-index: 10;
    color: var(--color-white);
  }
`;
