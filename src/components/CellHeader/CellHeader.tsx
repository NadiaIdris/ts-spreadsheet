import styled from "styled-components";

interface CellHeaderProps {
  isFirstColumnCell?: boolean;
  style?: React.CSSProperties;
  value: string;
}

const CellHeader = ({
  isFirstColumnCell = false,
  value,
  ...rest
}: CellHeaderProps) => {
  return (
    <OneCell
      isFirstColumnCell={isFirstColumnCell}
      readOnly
      {...rest}
      type="text"
      value={value}
    />
  );
};

export default CellHeader;

const OneCell = styled.input<{ isFirstColumnCell: boolean }>`
  border: 1px solid transparent;
  max-width: ${({ isFirstColumnCell }) =>
    isFirstColumnCell ? "40px" : "98px"};
  // min-width is calculated based on the cell's input width + 8px padding from the div that wraps it.
  min-width: ${({ isFirstColumnCell }) =>
    isFirstColumnCell ? "30px" : "68px"};
  padding: 5px;
  text-align: center;
  color: var(--color-text-header);
  font-weight: bold;
  font-size: 0.65em;

  &:focus {
    outline: none;
  }
`;
