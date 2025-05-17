import { User } from "@/types/user";

interface UserListProps {
  roleFilter: string;
}

export const UserList: React.FC<UserListProps> = ({ roleFilter }) => {
  // TODO: Implement the actual user list component
  // This is a placeholder implementation
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users ({roleFilter})</h2>
      {/* Implement your user list here */}
    </div>
  );
};
