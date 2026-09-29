"use client";

import * as React from "react";
import { Campaign, DistributionPlatform, CampaignStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Campaign, "id" | "createdAt">) => void;
}

interface FormState {
  name: string;
  description: string;
  platform: DistributionPlatform | "";
  status: CampaignStatus | "";
  campaignDate: string;
  contentObjective: string;
  targetAudience: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  platform?: string;
  status?: string;
  campaignDate?: string;
}

const platforms: { value: DistributionPlatform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "cross_platform", label: "Cross-platform" },
];

const statuses: { value: CampaignStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const empty: FormState = {
  name: "",
  description: "",
  platform: "",
  status: "",
  campaignDate: "",
  contentObjective: "",
  targetAudience: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Campaign name is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (!form.platform) errors.platform = "Select a platform.";
  if (!form.status) errors.status = "Select a status.";
  if (!form.campaignDate) errors.campaignDate = "Campaign date is required.";
  return errors;
}

export function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
  const [form, setForm] = React.useState<FormState>(empty);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);



  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    // Brief delay to give feedback
    setTimeout(() => {
      onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        platform: form.platform as DistributionPlatform,
        status: form.status as CampaignStatus,
        campaignDate: form.campaignDate,
        contentObjective: form.contentObjective.trim() || undefined,
        targetAudience: form.targetAudience.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create new campaign"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              New Campaign Record
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Add a campaign record for Northstar Brand Co.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] focus-ring transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Campaign Name */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-name" className="text-sm font-medium text-[var(--text-primary)]">
              Campaign Name <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              id="campaign-name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Productivity Without the Noise"
              className={cn(
                "w-full h-10 rounded-md border bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring transition-colors",
                errors.name
                  ? "border-[var(--status-error)]"
                  : "border-[var(--border)] focus:border-[var(--accent)]"
              )}
            />
            {errors.name && (
              <p className="text-xs text-[var(--status-error)]">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-description" className="text-sm font-medium text-[var(--text-primary)]">
              Description <span className="text-[var(--status-error)]">*</span>
            </label>
            <textarea
              id="campaign-description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief description of the campaign purpose and content."
              rows={3}
              className={cn(
                "w-full rounded-md border bg-[var(--surface-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring resize-none transition-colors",
                errors.description
                  ? "border-[var(--status-error)]"
                  : "border-[var(--border)] focus:border-[var(--accent)]"
              )}
            />
            {errors.description && (
              <p className="text-xs text-[var(--status-error)]">{errors.description}</p>
            )}
          </div>

          {/* Platform and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Platform */}
            <div className="space-y-1.5">
              <label htmlFor="campaign-platform" className="text-sm font-medium text-[var(--text-primary)]">
                Platform <span className="text-[var(--status-error)]">*</span>
              </label>
              <select
                id="campaign-platform"
                value={form.platform}
                onChange={(e) => update("platform", e.target.value)}
                className={cn(
                  "w-full h-10 rounded-md border bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] focus-ring appearance-none cursor-pointer transition-colors",
                  errors.platform
                    ? "border-[var(--status-error)]"
                    : "border-[var(--border)] focus:border-[var(--accent)]"
                )}
              >
                <option value="">Select platform...</option>
                {platforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="text-xs text-[var(--status-error)]">{errors.platform}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="campaign-status" className="text-sm font-medium text-[var(--text-primary)]">
                Status <span className="text-[var(--status-error)]">*</span>
              </label>
              <select
                id="campaign-status"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className={cn(
                  "w-full h-10 rounded-md border bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] focus-ring appearance-none cursor-pointer transition-colors",
                  errors.status
                    ? "border-[var(--status-error)]"
                    : "border-[var(--border)] focus:border-[var(--accent)]"
                )}
              >
                <option value="">Select status...</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-[var(--status-error)]">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Campaign Date */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-date" className="text-sm font-medium text-[var(--text-primary)]">
              Campaign Date <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              id="campaign-date"
              type="date"
              value={form.campaignDate}
              onChange={(e) => update("campaignDate", e.target.value)}
              className={cn(
                "w-full h-10 rounded-md border bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] focus-ring transition-colors",
                errors.campaignDate
                  ? "border-[var(--status-error)]"
                  : "border-[var(--border)] focus:border-[var(--accent)]"
              )}
            />
            {errors.campaignDate && (
              <p className="text-xs text-[var(--status-error)]">{errors.campaignDate}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Optional
            </p>

            <div className="space-y-1.5">
              <label htmlFor="campaign-objective" className="text-sm font-medium text-[var(--text-primary)]">
                Content Objective
              </label>
              <input
                id="campaign-objective"
                type="text"
                value={form.contentObjective}
                onChange={(e) => update("contentObjective", e.target.value)}
                placeholder="What should this campaign achieve?"
                className="w-full h-10 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="campaign-audience" className="text-sm font-medium text-[var(--text-primary)]">
                Target Audience
              </label>
              <input
                id="campaign-audience"
                type="text"
                value={form.targetAudience}
                onChange={(e) => update("targetAudience", e.target.value)}
                placeholder="e.g. Young professionals and knowledge workers"
                className="w-full h-10 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-ring focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-subtle)]">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Create Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
