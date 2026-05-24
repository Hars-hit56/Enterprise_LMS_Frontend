import { Camera, FileText, Mail, Save, UserRound } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { initials } from "../../../utils/format";
import type { AuthUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

interface ProfileFormState {
  name: string;
  email: string;
  description: string;
  photoUrl: File | null;
}

export function EditProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <ProfileEditor key={user._id} user={user} />;
}

function ProfileEditor({ user }: { user: AuthUser }) {
  const navigate = useNavigate();
  const { isLoading, saveProfile } = useAuth();
  const [form, setForm] = useState<ProfileFormState>({
    name: user.name ?? "",
    email: user.email ?? "",
    description: user.description ?? "",
    photoUrl: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string>(user.photoUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const homePath = useMemo(
    () => (user ? `/${user.role}/dashboard` : "/login"),
    [user],
  );

  function updateField(field: keyof ProfileFormState, value: string | File | null) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError(null);
    setSuccess(null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    updateField("photoUrl", file);

    if (!file) {
      setPhotoPreview(user?.photoUrl ?? "");
      return;
    }

    if (photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      await saveProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        description: form.description.trim(),
        photoUrl: form.photoUrl,
      });
      setSuccess("Profile updated successfully.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update profile.",
      );
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-[20px] font-medium tracking-tight text-ink-950">
            Edit Profile
          </h1>
          <p className="mt-1 max-w-2xl text-[12px] text-ink-500">
            Keep your learner profile details and display photo up to date.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-2 text-[12px]"
          onClick={() => navigate(homePath)}
        >
          Back to dashboard
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]"
      >
        <Card className="space-y-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-brand-100 text-[28px] font-semibold text-brand-600 ring-4 ring-brand-50">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={form.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(form.name || user.name)
              )}
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-ink-950">
                {form.name || user.name}
              </h2>
              <p className="mt-1 text-[12px] capitalize text-ink-500">
                {user.role}
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line-200 bg-white px-3 py-2 text-[12px] font-medium text-ink-900 transition hover:border-brand-200 hover:bg-brand-50">
              <Camera size={14} />
              Change photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[12px] font-medium text-ink-900">
                <UserRound size={14} className="text-brand-600" />
                Full name
              </div>
              <Input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Harshi"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[12px] font-medium text-ink-900">
                <Mail size={14} className="text-brand-600" />
                Email address
              </div>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="harshit56@gmail.com"
              />
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-ink-900">
            <span className="flex items-center gap-2">
              <FileText size={14} className="text-brand-600" />
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Software Developer"
              rows={5}
              className="resize-none rounded-lg border border-line-200 bg-gray-50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-[12px] font-medium text-danger-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-success-100 bg-success-100 px-4 py-3 text-[12px] font-medium text-success-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2.5 text-[12px]"
              onClick={() => navigate(homePath)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2 px-4 py-2.5 text-[12px]"
              disabled={isLoading}
            >
              <Save size={14} />
              {isLoading ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}
