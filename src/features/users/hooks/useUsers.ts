import { useEffect } from "react";
import { useUserStore } from "../store/userStore";

export function useUsers() {
  const users = useUserStore((state) => state.users);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, updateUser, deleteUser };
}
