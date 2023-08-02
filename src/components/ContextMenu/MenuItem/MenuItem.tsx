import styled from "styled-components";

interface MenuItemProps {
  action: string;
  columnIdx: number;
  icon?: string;
  id: number;
  label: string;
  rowIdx: number;
}

const MenuItem = ({ label }: MenuItemProps) => {
  return <MenuItemStyled>{label}</MenuItemStyled>;
};

export default MenuItem;
export type { MenuItemProps };

const MenuItemStyled = styled.div`
  background-color: white;
  cursor: pointer;
  `;