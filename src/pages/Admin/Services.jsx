import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "../../components/UI";
import api from "../../utils/api";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────
const ICONS   = ["💧","✨","🏆","🚗","⭐","🌿","💎","🔥","🪄","🧽","🫧","🪣"];
const TAGS    = ["", "Popular", "Most Popular", "Best Value", "Entry Level", "New", "Limited"];
const EMPTY_SERVICE = {
  name: "", description: "", price: "", durationMinutes: "",
  icon: "💧", tag: "", sortOrder: 0,
  includes: [], excludes: [], addOns: [],
};
const EMPTY_ADDON = { name: "", price: "", icon: "🔧", description: "" };

// ─────────────────────────────────────────────────────────
// SMALL UTILITIES
// ─────────────────────────────────────────────────────────
function cls(...args) { return args.filter(Boolean).join(" "); }

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-surface-400 mb-1.5">{hint}</p>}
      {children}
      {error && <p className="text-xs text-error mt-1 flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {error}
      </p>}
    </div>
  );
}

function TextInput({ error, ...props }) {
  return (
    <input
      {...props}
      className={cls(
        "w-full bg-white border-2 rounded-xl px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none transition-all",
        error ? "border-error focus:border-error" : "border-surface-200 focus:border-primary-500"
      )}
    />
  );
}

function TextArea({ error, ...props }) {
  return (
    <textarea
      {...props}
      className={cls(
        "w-full bg-white border-2 rounded-xl px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none transition-all resize-none",
        error ? "border-error focus:border-error" : "border-surface-200 focus:border-primary-500"
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────
// TAG_BADGE helper
// ─────────────────────────────────────────────────────────
const TAG_VARIANT = {
  "Most Popular": "primary", "Best Value": "accent",
  Popular: "info", "Entry Level": "warning", New: "success",
};

// ─────────────────────────────────────────────────────────
// SERVICE CARD (list view)
// ─────────────────────────────────────────────────────────
function ServiceCard({ service, onEdit, onToggle, onMoveUp, onMoveDown, isFirst, isLast, toggling }) {
  return (
    <div className={cls(
      "rounded-2xl border-2 p-5 transition-all",
      service.isActive
        ? "border-surface-200 bg-white hover:border-primary-500/30"
        : "border-surface-200/50 bg-surface-50 opacity-60"
    )}>
      <div className="flex items-start gap-4">
        {/* Sort handles */}
        <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
          <button
            onClick={() => onMoveUp(service)}
            disabled={isFirst}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-100 text-surface-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button
            onClick={() => onMoveDown(service)}
            disabled={isLast}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-100 text-surface-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-2xl flex-shrink-0">
          {service.icon || "💧"}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display text-lg text-surface-900">{service.name}</h3>
            {service.tag && <Badge variant={TAG_VARIANT[service.tag] || "primary"}>{service.tag}</Badge>}
            {!service.isActive && <Badge variant="error">Inactive</Badge>}
          </div>
          <p className="text-sm text-surface-500 mb-3 line-clamp-2">{service.description}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-primary-500/8 text-primary-700 border border-primary-500/15 rounded-full px-2.5 py-0.5 font-medium">
              {service.price.toLocaleString()} RWF
            </span>
            <span className="text-xs bg-surface-100 text-surface-600 rounded-full px-2.5 py-0.5">
              ⏱ {service.durationMinutes} min
            </span>
            <span className="text-xs bg-surface-100 text-surface-600 rounded-full px-2.5 py-0.5">
              {(service.includes || []).length} inclusions
            </span>
            {(service.addOns || []).length > 0 && (
              <span className="text-xs bg-surface-100 text-surface-600 rounded-full px-2.5 py-0.5">
                {service.addOns.length} add-on{service.addOns.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Includes preview */}
          {(service.includes || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {service.includes.slice(0, 3).map(inc => (
                <span key={inc} className="text-xs text-surface-500 bg-surface-50 border border-surface-200 rounded-full px-2 py-0.5">
                  ✓ {inc}
                </span>
              ))}
              {service.includes.length > 3 && (
                <span className="text-xs text-surface-400">+{service.includes.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(service)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors px-3 py-1.5 bg-primary-500/8 hover:bg-primary-500/15 rounded-lg"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => onToggle(service)}
            disabled={toggling === service._id}
            className={cls(
              "flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50",
              service.isActive
                ? "text-error hover:text-error bg-error/8 hover:bg-error/15"
                : "text-success hover:text-success bg-success/8 hover:bg-success/15"
            )}
          >
            {toggling === service._id ? (
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {service.isActive
                  ? <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                  : <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>
                }
              </svg>
            )}
            {service.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LIST EDITOR (includes / excludes)
// ─────────────────────────────────────────────────────────
function ListEditor({ label, items, onChange, placeholder }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setInput("");
  };

  const remove = (item) => onChange(items.filter(i => i !== item));

  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 bg-white border-2 border-surface-200 rounded-xl px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500 transition-all"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="px-4 py-2 bg-primary-500 text-surface-900 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-primary-400 transition-colors"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 text-xs bg-surface-100 border border-surface-200 text-surface-700 rounded-full pl-3 pr-1.5 py-1">
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                className="w-4 h-4 rounded-full bg-surface-300 hover:bg-error/80 hover:text-white flex items-center justify-center transition-colors text-surface-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ADD-ONS EDITOR
// ─────────────────────────────────────────────────────────
function AddOnsEditor({ addOns, onChange }) {
  const [editing, setEditing] = useState(null); // index or "new"
  const [form, setForm]       = useState(EMPTY_ADDON);
  const [addonError, setAddonError] = useState(null);

  const setF = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const startEdit = (index) => {
    setEditing(index);
    setForm(index === "new" ? EMPTY_ADDON : { ...addOns[index] });
    setAddonError(null);
  };

  const save = () => {
    if (!form.name.trim())  { setAddonError("Name is required"); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
      setAddonError("Valid price is required"); return;
    }
    const addon = { name: form.name.trim(), price: Number(form.price), icon: form.icon || "🔧", description: form.description.trim() };
    if (editing === "new") {
      onChange([...addOns, addon]);
    } else {
      const updated = [...addOns];
      updated[editing] = addon;
      onChange(updated);
    }
    setEditing(null);
    setForm(EMPTY_ADDON);
    setAddonError(null);
  };

  const remove = (index) => onChange(addOns.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-surface-700">Add-ons</label>
        <button
          type="button"
          onClick={() => startEdit("new")}
          className="text-xs text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add
        </button>
      </div>

      {/* Inline add/edit form */}
      {editing !== null && (
        <div className="bg-primary-500/5 border-2 border-primary-500/25 rounded-xl p-4 mb-3 space-y-3">
          <p className="text-sm font-semibold text-primary-700">{editing === "new" ? "New add-on" : "Edit add-on"}</p>
          {addonError && <p className="text-xs text-error">{addonError}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" required>
              <TextInput placeholder="Engine Bay Clean" value={form.name} onChange={setF("name")} />
            </Field>
            <Field label="Price (RWF)" required>
              <TextInput type="number" placeholder="3000" value={form.price} onChange={setF("price")} min="0" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon">
              <div className="flex gap-2 flex-wrap">
                {["🔧","🪑","💎","🌿","🧴","✨","🫧","🪣"].map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, icon: ic }))}
                    className={cls("w-8 h-8 rounded-lg text-lg flex items-center justify-center border-2 transition-all",
                      form.icon === ic ? "border-primary-500 bg-primary-500/10" : "border-surface-200 bg-white hover:border-primary-500/40"
                    )}
                  >{ic}</button>
                ))}
              </div>
            </Field>
            <Field label="Description">
              <TextInput placeholder="Brief description" value={form.description} onChange={setF("description")} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="px-4 py-2 bg-primary-500 text-surface-900 rounded-xl text-sm font-semibold hover:bg-primary-400 transition-colors">
              {editing === "new" ? "Add" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-surface-100 text-surface-600 rounded-xl text-sm hover:bg-surface-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {addOns.length === 0 ? (
        <p className="text-xs text-surface-400 text-center py-3 bg-surface-50 rounded-xl border border-dashed border-surface-200">
          No add-ons yet — click "Add" to create one
        </p>
      ) : (
        <div className="space-y-2">
          {addOns.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface-50 border border-surface-200 rounded-xl px-4 py-3">
              <span className="text-xl flex-shrink-0">{a.icon || "🔧"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-surface-900">{a.name}</div>
                {a.description && <div className="text-xs text-surface-500 truncate">{a.description}</div>}
              </div>
              <div className="text-sm font-display text-primary-600 flex-shrink-0">+{Number(a.price).toLocaleString()} RWF</div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button type="button" onClick={() => startEdit(i)} className="text-xs text-primary-600 hover:text-primary-500 px-2 py-1 bg-primary-500/8 rounded-lg transition-colors">Edit</button>
                <button type="button" onClick={() => remove(i)} className="text-xs text-error hover:text-error px-2 py-1 bg-error/8 rounded-lg transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SERVICE FORM (create / edit drawer)
// ─────────────────────────────────────────────────────────
function ServiceForm({ initial, onSave, onCancel, saving, apiError }) {
  const isEdit = !!initial?._id;

  const [form,   setForm]   = useState(() => initial
    ? { ...EMPTY_SERVICE, ...initial, price: initial.price ?? "", durationMinutes: initial.durationMinutes ?? "" }
    : { ...EMPTY_SERVICE }
  );
  const [errors, setErrors] = useState({});

  const setF = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name        = "Name is required";
    if (!form.description.trim())        e.description = "Description is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
                                         e.price       = "Valid price required";
    if (!form.durationMinutes || isNaN(Number(form.durationMinutes)) || Number(form.durationMinutes) < 1)
                                         e.duration    = "Valid duration required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name:            form.name.trim(),
      description:     form.description.trim(),
      price:           Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      icon:            form.icon || "💧",
      tag:             form.tag || null,
      sortOrder:       Number(form.sortOrder) || 0,
      includes:        form.includes,
      excludes:        form.excludes,
      addOns:          form.addOns,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-surface-900">{isEdit ? "Edit Service" : "New Service"}</h2>
            <p className="text-xs text-surface-400 mt-0.5">{isEdit ? `Editing ${initial.name}` : "Fill in the details below"}</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 text-surface-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
          {/* API error */}
          {apiError && (
            <div className="bg-error/8 border border-error/25 rounded-xl px-4 py-3 text-sm text-error">
              {apiError}
            </div>
          )}

          {/* ── BASIC INFO ── */}
          <div className="space-y-4">
            <h3 className="font-semibold text-surface-800 text-sm uppercase tracking-wide border-b border-surface-100 pb-2">Basic Info</h3>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Service name" required error={errors.name}>
                <TextInput placeholder="e.g. Standard Wash" value={form.name} onChange={setF("name")} error={errors.name} />
              </Field>
              <Field label="Sort order" hint="Lower = shown first">
                <TextInput type="number" placeholder="0" value={form.sortOrder} onChange={setF("sortOrder")} min="0" />
              </Field>
            </div>

            <Field label="Description" required error={errors.description}>
              <TextArea rows={3} placeholder="What does this wash include at a high level?" value={form.description} onChange={setF("description")} error={errors.description} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (RWF)" required error={errors.price}>
                <TextInput type="number" placeholder="10000" value={form.price} onChange={setF("price")} error={errors.price} min="0" />
              </Field>
              <Field label="Duration (minutes)" required error={errors.duration}>
                <TextInput type="number" placeholder="60" value={form.durationMinutes} onChange={setF("duration")} error={errors.duration} min="1" />
              </Field>
            </div>
          </div>

          {/* ── ICON & TAG ── */}
          <div className="space-y-4">
            <h3 className="font-semibold text-surface-800 text-sm uppercase tracking-wide border-b border-surface-100 pb-2">Appearance</h3>

            <Field label="Icon">
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, icon: ic }))}
                    className={cls(
                      "w-10 h-10 text-xl flex items-center justify-center rounded-xl border-2 transition-all",
                      form.icon === ic
                        ? "border-primary-500 bg-primary-500/10 shadow-sm"
                        : "border-surface-200 bg-white hover:border-primary-500/40"
                    )}
                  >{ic}</button>
                ))}
              </div>
            </Field>

            <Field label="Tag / label" hint="Short promotional label shown on the card">
              <div className="flex flex-wrap gap-2">
                {TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, tag: t }))}
                    className={cls(
                      "px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all",
                      form.tag === t
                        ? "border-primary-500 bg-primary-500/10 text-primary-700"
                        : "border-surface-200 bg-white text-surface-600 hover:border-primary-500/40"
                    )}
                  >{t === "" ? "None" : t}</button>
                ))}
              </div>
            </Field>
          </div>

          {/* ── INCLUSIONS ── */}
          <div className="space-y-4">
            <h3 className="font-semibold text-surface-800 text-sm uppercase tracking-wide border-b border-surface-100 pb-2">What's included / excluded</h3>
            <ListEditor
              label="Included"
              items={form.includes}
              onChange={v => setForm(p => ({ ...p, includes: v }))}
              placeholder="e.g. Exterior hand wash (press Enter)"
            />
            <ListEditor
              label="Not included"
              items={form.excludes}
              onChange={v => setForm(p => ({ ...p, excludes: v }))}
              placeholder="e.g. Interior vacuum (press Enter)"
            />
          </div>

          {/* ── ADD-ONS ── */}
          <div className="space-y-4">
            <h3 className="font-semibold text-surface-800 text-sm uppercase tracking-wide border-b border-surface-100 pb-2">Add-ons</h3>
            <AddOnsEditor
              addOns={form.addOns}
              onChange={v => setForm(p => ({ ...p, addOns: v }))}
            />
          </div>

          {/* ── PREVIEW ── */}
          <div className="space-y-3">
            <h3 className="font-semibold text-surface-800 text-sm uppercase tracking-wide border-b border-surface-100 pb-2">Preview</h3>
            <div className="bg-surface-50 border-2 border-surface-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {form.icon || "💧"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-display text-lg text-surface-900">{form.name || "Service name"}</span>
                    {form.tag && <Badge variant={TAG_VARIANT[form.tag] || "primary"}>{form.tag}</Badge>}
                  </div>
                  <p className="text-xs text-surface-500 mb-2">{form.description || "Description will appear here"}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-base text-primary-600">{Number(form.price || 0).toLocaleString()} RWF</span>
                    <span className="text-xs text-surface-400">· {form.durationMinutes || 0} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-surface-200 px-6 py-4 flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={saving} onClick={handleSubmit}>
            {saving
              ? <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Saving...
                </span>
              : isEdit ? "Save changes" : "Create service"
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function Services() {
  const navigate = useNavigate();

  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchError,setFetchError]= useState(null);

  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null); // service object or null (= new)
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toggling,  setToggling]  = useState(null); // service._id

  const [showInactive, setShowInactive] = useState(false);

  // ── Fetch ──────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setFetchError(null);
    try {
      // Admin needs all services including inactive — hit base endpoint
      // (getServices filters isActive, so we fetch both active and add inactive)
      const [activeRes, allRes] = await Promise.all([
        api.get("/services"),
        api.get("/services"), // same endpoint — backend only returns active
        // Note: to show inactive, you'd need a separate admin endpoint.
        // For now we track deactivated ones locally after toggle.
      ]);
      setServices(activeRes.data?.data?.services || []);
    } catch (err) {
      setFetchError("Failed to load services. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Save (create or update) ────────────────────────────
  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError(null);
    try {
      if (editing?._id) {
        const res = await api.put(`/services/${editing._id}`, payload);
        setServices(prev => prev.map(s => s._id === editing._id ? res.data.data.service : s));
      } else {
        const res = await api.post("/services", payload);
        setServices(prev => [...prev, res.data.data.service].sort((a,b) => a.sortOrder - b.sortOrder));
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.response?.data?.errors?.[0] || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active/inactive ─────────────────────────────
  const handleToggle = async (service) => {
    setToggling(service._id);
    try {
      if (service.isActive) {
        await api.delete(`/services/${service._id}`);
        setServices(prev => prev.map(s => s._id === service._id ? { ...s, isActive: false } : s));
      } else {
        const res = await api.put(`/services/${service._id}`, { isActive: true });
        setServices(prev => prev.map(s => s._id === service._id ? res.data.data.service : s));
      }
    } catch (err) {
      // silently log — UI won't update but service list stays consistent
      console.error("Toggle failed", err?.response?.data?.message);
    } finally {
      setToggling(null);
    }
  };

  // ── Sort order swap ────────────────────────────────────
  const swapOrder = async (service, direction) => {
    const active = services.filter(s => s.isActive);
    const idx = active.findIndex(s => s._id === service._id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= active.length) return;

    const sibling = active[swapIdx];
    const newOrderA = sibling.sortOrder;
    const newOrderB = service.sortOrder;

    // Optimistic update
    setServices(prev => prev.map(s => {
      if (s._id === service._id) return { ...s, sortOrder: newOrderA };
      if (s._id === sibling._id)  return { ...s, sortOrder: newOrderB };
      return s;
    }).sort((a,b) => a.sortOrder - b.sortOrder));

    // Persist
    try {
      await Promise.all([
        api.put(`/services/${service._id}`, { sortOrder: newOrderA }),
        api.put(`/services/${sibling._id}`,  { sortOrder: newOrderB }),
      ]);
    } catch (_) {
      fetchServices(); // revert on failure
    }
  };

  // ── Derived lists ──────────────────────────────────────
  const sorted   = [...services].sort((a,b) => a.sortOrder - b.sortOrder);
  const active   = sorted.filter(s => s.isActive);
  const inactive = sorted.filter(s => !s.isActive);
  const displayed = showInactive ? sorted : active;

  // ─────────────────────────────────────────────────────
  return (
    <div>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-surface-900">Services</h1>
          <p className="text-sm text-surface-400 mt-0.5">
            {active.length} active{inactive.length > 0 ? ` · ${inactive.length} inactive` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {inactive.length > 0 && (
            <button
              onClick={() => setShowInactive(s => !s)}
              className={cls(
                "text-xs px-3 py-2 rounded-xl border-2 font-medium transition-all",
                showInactive
                  ? "border-primary-500 bg-primary-500/10 text-primary-700"
                  : "border-surface-200 bg-white text-surface-500 hover:border-primary-500/40"
              )}
            >
              {showInactive ? "Hide" : "Show"} inactive ({inactive.length})
            </button>
          )}
          <Button
            size="sm"
            onClick={() => { setEditing(null); setSaveError(null); setShowForm(true); }}
          >
            + New Service
          </Button>
        </div>
      </div>

      {/* ── FETCH ERROR ── */}
      {fetchError && (
        <div className="mb-6 bg-error/8 border border-error/25 rounded-xl px-4 py-3 text-sm text-error flex justify-between">
          {fetchError}
          <button onClick={fetchServices} className="underline text-error ml-3">Retry</button>
        </div>
      )}

      {/* ── QUICK STATS ── */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Active services",  value: active.length,   color: "text-success" },
            { label: "Total add-ons",    value: services.reduce((s,svc) => s + (svc.addOns?.length||0), 0), color: "text-primary-600" },
            { label: "Lowest price",     value: active.length ? `${Math.min(...active.map(s=>s.price)).toLocaleString()} RWF` : "—", color: "text-surface-700" },
            { label: "Highest price",    value: active.length ? `${Math.max(...active.map(s=>s.price)).toLocaleString()} RWF` : "—", color: "text-surface-700" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-4 bg-white">
              <div className={`font-display text-xl ${color}`}>{value}</div>
              <div className="text-xs text-surface-400 mt-0.5">{label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* ── SERVICE LIST ── */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl border-2 border-surface-200 bg-white p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-surface-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-1/3" />
                  <div className="h-3 bg-surface-200 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-surface-200 rounded-full w-20" />
                    <div className="h-5 bg-surface-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🧽</div>
          <h3 className="font-display text-xl text-surface-700 mb-2">No services yet</h3>
          <p className="text-surface-400 text-sm mb-6">Create your first service to get started</p>
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>+ Create first service</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((service, i) => {
            const activeList = displayed.filter(s => s.isActive);
            const activeIdx  = activeList.findIndex(s => s._id === service._id);
            return (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={(s) => { setEditing(s); setSaveError(null); setShowForm(true); }}
                onToggle={handleToggle}
                onMoveUp={() => swapOrder(service, "up")}
                onMoveDown={() => swapOrder(service, "down")}
                isFirst={activeIdx === 0}
                isLast={activeIdx === activeList.length - 1}
                toggling={toggling}
              />
            );
          })}
        </div>
      )}

      {/* ── FORM DRAWER ── */}
      {showForm && (
        <ServiceForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); setSaveError(null); }}
          saving={saving}
          apiError={saveError}
        />
      )}
    </div>
  );
}