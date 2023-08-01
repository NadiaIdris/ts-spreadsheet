interface MenuItemProps {
  action: string;
  columnIdx: number;
  icon?: string;
  id: number;
  label: string;
  rowIdx: number;
}

const MenuItem = ({ label }: MenuItemProps) => {
  return <div>{label}</div>;
};

export default MenuItem;
export type { MenuItemProps };
