"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "checkbox"
    | "select"
    | "array";
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  required?: boolean;
}

/* ─────────────────────────────────────────────────────────────────
   FormField is intentionally declared OUTSIDE CRUDManager so that
   React never treats it as a "new" component on each re-render.
   Defining it inside would unmount/remount on every keystroke,
   causing inputs to lose focus after typing a single character.
───────────────────────────────────────────────────────────────── */
const INPUT_CLS = `w-full px-4 py-2.5 rounded-xl text-sm
  dark:bg-dark-muted bg-gray-100 border border-dark-border/40
  dark:text-white text-gray-900 placeholder-gray-400
  focus:outline-none focus:border-violet-500 focus:ring-2
  focus:ring-violet-500/20 transition-all`;

interface FieldProps {
  f: FieldConfig;
  val: unknown;
  setField: (key: string, value: unknown) => void;
}

function FormField({ f, val, setField }: FieldProps) {
  if (f.type === "checkbox")
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={f.key}
          checked={Boolean(val)}
          onChange={(e) => setField(f.key, e.target.checked)}
          className="w-4 h-4 accent-violet-600 rounded"
        />
        <label
          htmlFor={f.key}
          className="text-sm dark:text-gray-300 cursor-pointer"
        >
          {f.label}
        </label>
      </div>
    );

  if (f.type === "select")
    return (
      <div>
        <label className="text-xs font-medium text-gray-400 mb-1.5 block">
          {f.label}
        </label>
        <select
          value={String(val ?? "")}
          onChange={(e) => setField(f.key, e.target.value)}
          className={INPUT_CLS + " cursor-pointer"}
        >
          <option value="">Select…</option>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );

  if (f.type === "textarea")
    return (
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-gray-400 mb-1.5 block">
          {f.label}
          {f.required && " *"}
        </label>
        <textarea
          rows={3}
          value={String(val ?? "")}
          onChange={(e) => setField(f.key, e.target.value)}
          placeholder={f.placeholder}
          className={INPUT_CLS + " resize-none"}
        />
      </div>
    );

  if (f.type === "array") {
    const arr = Array.isArray(val) ? (val as string[]) : [];
    return (
      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-gray-400 mb-1.5 block">
          {f.label}
        </label>
        <div className="space-y-2">
          {arr.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const n = [...arr];
                  n[i] = e.target.value;
                  setField(f.key, n);
                }}
                placeholder={f.placeholder}
                className={INPUT_CLS + " flex-1"}
              />
              <button
                onClick={() =>
                  setField(
                    f.key,
                    arr.filter((_, j) => j !== i),
                  )
                }
                className="p-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setField(f.key, [...arr, ""])}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <FiPlus size={12} /> Add item
          </button>
        </div>
      </div>
    );
  }

  // default: text / number
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1.5 block">
        {f.label}
        {f.required && " *"}
      </label>
      <input
        type={f.type === "number" ? "number" : "text"}
        value={String(val ?? "")}
        min={f.min}
        max={f.max}
        onChange={(e) =>
          setField(
            f.key,
            f.type === "number" ? Number(e.target.value) : e.target.value,
          )
        }
        placeholder={f.placeholder}
        className={INPUT_CLS}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

interface Props<T extends Record<string, unknown>> {
  section: string;
  title: string;
  items: T[];
  fields: FieldConfig[];
  onSave: () => void;
  defaultItem: Partial<T>;
  renderCard?: (item: T) => React.ReactNode;
  extraFields?: (
    form: Partial<T>,
    setField: (key: string, value: unknown) => void,
  ) => React.ReactNode;
}

export default function CRUDManager<
  T extends { id?: string } & Record<string, unknown>,
>({
  section,
  title,
  items,
  fields,
  onSave,
  defaultItem,
  renderCard,
  extraFields,
}: Props<T>) {
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<T>>({ ...defaultItem });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openCreate = () => {
    setForm({ ...defaultItem });
    setCreating(true);
    setEditing(null);
  };
  const openEdit = (item: T) => {
    setForm({ ...item });
    setEditing(item);
    setCreating(false);
  };
  const closeForm = () => {
    setEditing(null);
    setCreating(false);
    setForm({ ...defaultItem });
  };

  const setField = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, item: form }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editing ? "Updated!" : "Created!");
      closeForm();
      onSave();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/portfolio?section=${section}&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted!");
      onSave();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const isOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl dark:text-white">
          {title}
        </h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <FiPlus size={15} /> Add {title.replace(/s$/, "")}
        </motion.button>
      </div>

      {/* ── Create / Edit form ──────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="card border border-violet-500/30"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg dark:text-white">
                {editing
                  ? `Edit ${title.replace(/s$/, "")}`
                  : `New ${title.replace(/s$/, "")}`}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {fields.map((f) => (
                <FormField
                  key={f.key}
                  f={f}
                  val={form[f.key]}
                  setField={setField}
                />
              ))}
              {extraFields?.(form, setField)}
            </div>

            <div className="flex gap-3 pt-2 border-t border-dark-border/30">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <FiSave size={14} /> {editing ? "Update" : "Create"}
                  </>
                )}
              </motion.button>
              <button
                onClick={closeForm}
                className="btn-outline text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Item grid ───────────────────────────────────── */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          No {title.toLowerCase()} yet. Click &ldquo;Add&rdquo; to create one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <motion.div
              key={String(item.id ?? Math.random())}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card relative group overflow-hidden"
            >
              {renderCard?.(item)}

              <div
                className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100
                transition-all duration-200 translate-y-1 group-hover:translate-y-0"
              >
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-xl glass text-violet-400 hover:bg-violet-500/20 transition-colors shadow-sm"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  onClick={() => item.id && handleDelete(String(item.id))}
                  disabled={deleting === String(item.id)}
                  className="p-2 rounded-xl glass text-red-400 hover:bg-red-500/20 transition-colors shadow-sm"
                >
                  {deleting === String(item.id) ? (
                    <span className="animate-spin w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full block" />
                  ) : (
                    <FiTrash2 size={13} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
