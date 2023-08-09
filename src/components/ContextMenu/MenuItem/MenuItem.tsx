import styled from "styled-components";

interface MenuItemProps {
  children: React.ReactNode;
}

const MenuItem = ({ children }: MenuItemProps) => {
  return <MenuItemStyled>{children}</MenuItemStyled>;
};

export default MenuItem;
export type { MenuItemProps };

const MenuItemStyled = styled.div`
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: flex;
  padding: 6px 0 6px 8px;

  &:hover {
    background-color: purple;
  }
  `;