import styled from "styled-components";

interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconMarginRight?: string;
  onClick?: () => void;
}

const MenuItem = ({
  children,
  icon,
  iconMarginRight = "10px",
  onClick,
}: MenuItemProps) => {
  return (
    <MenuItemStyled onClick={onClick}>
      <div style={{ marginRight: iconMarginRight }}>{icon}</div>
      {children}
    </MenuItemStyled>
  );
};

export default MenuItem;
export type { MenuItemProps };

const MenuItemStyled = styled.div`
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: flex;
  padding: 6px 0 6px 8px;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: var(--color-hover-over-white);
    border-radius: var(--border-radius-medium);
  }
`;
