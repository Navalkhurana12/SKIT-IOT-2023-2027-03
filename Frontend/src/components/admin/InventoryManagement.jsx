import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  X,
  ImagePlus,
  RefreshCw,
  Trash2,
  Pencil,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  name: "",
  category: "",
  quantity: "",
  minStock: "",
  location: "IoT Lab",
  description: "",
  image: null,
};

export default function InventoryManagement() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingComponent, setEditingComponent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputKey, setImageInputKey] = useState(0);

  // Fetch all components from backend
  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/components");
      setComponents(response.data.components || []);
    } catch (err) {
      console.error("Fetch Components Error:", err);
      setError(err.response?.data?.message || "Unable to fetch components");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // Handle text fields and image selection
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const selectedFile = files?.[0];
      if (!selectedFile) return;

      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5 MB");
        return;
      }

      setError("");
      setForm((prev) => ({ ...prev, image: selectedFile }));
      setImagePreview(URL.createObjectURL(selectedFile));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form and return to add mode
  const resetForm = () => {
    setForm(initialForm);
    setEditingComponent(null);
    setError("");
    setImagePreview("");
    setImageInputKey((prev) => prev + 1);
  };

  // Open form with selected component details
  const openEditForm = (component) => {
    setError("");
    setSuccess("");
    setEditingComponent(component);
    setForm({
      name: component.name || "",
      category: component.category || "",
      quantity: String(component.quantity ?? ""),
      minStock: String(component.minStock ?? ""),
      location: component.location || "IoT Lab",
      description: component.description || "",
      image: null,
    });
    setImagePreview(component.image?.url || "");
    setImageInputKey((prev) => prev + 1);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add a new component or update an existing component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editingComponent && !form.image) {
      setError("Please select a component image");
      return;
    }

    if (
      form.quantity === "" ||
      form.minStock === "" ||
      !Number.isInteger(Number(form.quantity)) ||
      !Number.isInteger(Number(form.minStock)) ||
      Number(form.quantity) < 0 ||
      Number(form.minStock) < 0
    ) {
      setError("Enter valid non-negative whole numbers for stock");
      return;
    }

    if (!form.name.trim() || !form.category.trim()) {
      setError("Component name and category are required");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("category", form.category.trim());
      formData.append("quantity", String(Number(form.quantity)));
      formData.append("minStock", String(Number(form.minStock)));
      formData.append("location", form.location.trim());
      formData.append("description", form.description.trim());

      // On edit, image is optional. If no new file is selected,
      // backend keeps the existing Cloudinary image.
      if (form.image) {
        formData.append("image", form.image);
      }

      let response;
      if (editingComponent) {
        response = await api.put(
          `/components/${editingComponent._id}`,
          formData
        );
      } else {
        response = await api.post("/components", formData);
      }

      setSuccess(
        response.data.message ||
          (editingComponent
            ? "Component updated successfully"
            : "Component added successfully")
      );
      setShowForm(false);
      resetForm();
      await fetchComponents();
    } catch (err) {
      console.error("Save Component Error:", err);
      console.error("Backend Error Response:", err.response?.data);
      setError(err.response?.data?.message || "Unable to save component. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete selected component after confirmation
  const handleDelete = async (component) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${component.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      setDeletingId(component._id);
      const response = await api.delete(`/components/${component._id}`);
      setSuccess(response.data.message || "Component deleted successfully");
      await fetchComponents();
    } catch (err) {
      console.error("Delete Component Error:", err);
      setError(err.response?.data?.message || "Unable to delete component");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredComponents = components.filter((component) =>
    `${component.name} ${component.category} ${component.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#102C57]">
            Inventory Management
          </h2>
          <p className="mt-2 text-slate-500">
            Add, search and manage IoT lab components.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setSuccess("");
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Component
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#102C57]">
              {editingComponent ? "Edit Component" : "Add New Component"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              disabled={saving}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            {/* COMPONENT NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Component Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Arduino Uno"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Microcontroller"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="Available quantity"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* MINIMUM STOCK */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Minimum Stock *
              </label>
              <input
                type="number"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="e.g. 5"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* LOCATION */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="IoT Lab"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Component description..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Component Image {editingComponent ? "(Optional)" : "*"}
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8 transition hover:border-blue-500 hover:bg-blue-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Component preview"
                    className="mb-4 h-40 w-40 rounded-lg object-cover"
                  />
                ) : (
                  <ImagePlus size={35} className="text-blue-600" />
                )}
                <span className="mt-3 text-sm font-medium text-slate-700">
                  {form.image
                    ? form.image.name
                    : editingComponent
                      ? "Click to replace current image (optional)"
                      : "Click to upload component image"}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG or JPEG (Maximum 5 MB)
                </span>
                <input
                  key={imageInputKey}
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg"
                  onChange={handleChange}
                  required={!editingComponent}
                  className="hidden"
                />
              </label>
            </div>

            {/* FORM BUTTONS */}
            <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : editingComponent ? (
                  <>
                    <Pencil size={18} />
                    Update Component
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Save Component
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH */}
      <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* COMPONENTS TABLE */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="font-bold text-[#102C57]">
            All Components ({filteredComponents.length})
          </h3>
          <button
            type="button"
            onClick={fetchComponents}
            disabled={loading}
            title="Refresh inventory"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading components...
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={42} className="mx-auto text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">
              No components found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first component using the Add Component button.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-600">
                <tr>
                  <th className="px-6 py-4">Component</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Min Stock</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredComponents.map((component) => {
                  const isLowStock =
                    Number(component.quantity) <= Number(component.minStock);

                  return (
                    <tr
                      key={component._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* COMPONENT IMAGE AND NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {component.image?.url ? (
                            <img
                              src={component.image.url}
                              alt={component.name}
                              className="h-12 w-12 rounded-lg border object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="text-slate-400" />
                            </div>
                          )}
                          <span className="font-semibold text-slate-800">
                            {component.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {component.category}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {component.quantity}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {component.minStock}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {component.location}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isLowStock
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(component)}
                            title="Edit Component"
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(component)}
                            disabled={deletingId === component._id}
                            title="Delete Component"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === component._id ? (
                              <RefreshCw size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
