import styled from "styled-components";

interface CellHeaderProps {
  isFirstColumnCell?: boolean;
  value: string;
}

const CellHeader = ({ isFirstColumnCell = false, value }: CellHeaderProps) => {
  return (
    <OneCell
      isFirstColumnCell={isFirstColumnCell}
      readOnly
      type="text"
      value={value}
    />
  );
};

export default CellHeader;

const OneCell = styled.input<{ isFirstColumnCell: boolean }>`
  border: 1px solid transparent;
  max-width: ${({ isFirstColumnCell }) =>
    isFirstColumnCell ? "40px" : "100%"};
  min-width: 20px;
  padding: 5px;
  text-align: center;
  color: var(--color-header-text);
  font-weight: bold;
  font-size: 0.65em;

  &:focus {
    outline: none;
  }
`;
