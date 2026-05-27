import { useState } from "react";
import type { FormEvent } from "react";
import type { User, UserRole } from "../../../types";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { AdminUpdateUserPayload } from "../services/userService";

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: Partial<User>;
  onSubmit: (data: AdminUpdateUserPayload) => void;
}

function getInitialFormData(initialData?: Partial<User>) {
  return {
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || ("student" as UserRole),
    status: initialData?.status || ("Active" as NonNullable<User["status"]>),
  };
}

const UserForm: React.FC<UserFormProps> = ({ mode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form
      id={mode === "edit" ? "edit-user-form" : undefined}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2"> */}
      <div>
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={errors.name ? "border-red-300" : ""}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>
      <div>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "border-red-300" : ""}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      {/* </div> */}
      {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2"> */}
      <div>
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value as UserRole)}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </Select>
      </div>
      <div>
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value as NonNullable<User["status"]>,
            )
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </Select>
      </div>
      {/* </div> */}
    </form>
  );
};

export default UserForm;
