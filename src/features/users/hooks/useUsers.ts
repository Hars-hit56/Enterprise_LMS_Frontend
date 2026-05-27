import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  deleteUser as deleteUserThunk,
  fetchInstructorStudents,
  fetchUsers,
  updateInstructorUser as updateInstructorUserThunk,
  updateUser as updateUserThunk,
} from "../store/userStore";
import type {
  AdminUpdateUserPayload,
  InstructorUpdateUserPayload,
} from "../services/userService";

export function useUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  const updateUser = (id: string, updates: AdminUpdateUserPayload) =>
    dispatch(updateUserThunk({ id, updates })).unwrap();

  const deleteUser = (id: string) => dispatch(deleteUserThunk(id)).unwrap();

  return { users, isLoading, error, updateUser, deleteUser };
}

export function useInstructorStudents() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    void dispatch(fetchInstructorStudents());
  }, [dispatch]);

  const updateUser = (id: string, updates: InstructorUpdateUserPayload) =>
    dispatch(updateInstructorUserThunk({ id, updates })).unwrap();

  const deleteUser = (id: string) => dispatch(deleteUserThunk(id)).unwrap();

  return { users, isLoading, error, updateUser, deleteUser };
}
