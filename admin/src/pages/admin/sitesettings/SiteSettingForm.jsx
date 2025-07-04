import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "../../../features/siteSetting/siteSettingSlice";
import { toast } from "react-toastify";

const SiteSettingForm = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.siteSetting);

  const [formData, setFormData] = useState({
    siteName: "",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        logoUrl: null,
      });
      setLogoPreview(settings.logoUrl || "");
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });

    if (name === "logoUrl") {
      setLogoPreview(URL.createObjectURL(files[0]));
    } else if (name === "favicon") {
      setFaviconPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("siteName", formData.siteName);
    data.append("contactEmail", formData.contactEmail);
    data.append("contactPhone", formData.contactPhone);
  if (formData.logoUrl) data.append("logoUrl", formData.logoUrl); // match multer key

    await dispatch(updateSiteSettings(data));
    toast.success("Site settings updated!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md p-6 rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">Site Settings</h2>

      <input
        type="text"
        name="siteName"
        value={formData.siteName}
        onChange={handleChange}
        placeholder="Site Name"
        className="w-full border px-3 py-2 rounded"
        required
      />

    
      <input
        type="email"
        name="contactEmail"
        value={formData.contactEmail}
        onChange={handleChange}
        placeholder="Contact Email"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="contactPhone"
        value={formData.contactPhone}
        onChange={handleChange}
        placeholder="Contact Phone"
        className="w-full border px-3 py-2 rounded"
      />

      {/* Logo Upload */}
      <div>
        <label className="block font-medium">Logo</label>
        <input
          type="file"
          name="logoUrl"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" className="h-20 mt-2" />
        )}
      </div>

      

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Updating..." : "Update Settings"}
      </button>
    </form>
  );
};

export default SiteSettingForm;
