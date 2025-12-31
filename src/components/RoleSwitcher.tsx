import { Building2, Package, Truck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "admin" | "vendor" | "driver";

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <Select value={currentRole} onValueChange={(value) => onRoleChange(value as Role)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Admin Panel</span>
          </div>
        </SelectItem>
        <SelectItem value="vendor">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Vendor Portal</span>
          </div>
        </SelectItem>
        <SelectItem value="driver">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Driver Portal</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
