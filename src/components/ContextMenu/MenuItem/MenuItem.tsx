interface MenuItemProps {
  id: number;
  label: string;
  action: string;
}

const MenuItem = ({ label }: MenuItemProps) => {
  return <div>{label}</div>;
};

export default MenuItem;
export type { MenuItemProps };
