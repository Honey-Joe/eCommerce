import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSellerDocuments } from "../../features/seller/sellerSlice";

const SellerDocument = () => {
  const [documents, setDocuments] = useState([]); // For doc upload
  const [uploadMessage, setUploadMessage] = useState("");
  const {loading} = useSelector((state)=> state.seller)
  const dispatch = useDispatch();
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => ({
      file,
      expiryDate: "",
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleExpiryDateChange = (index, value) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index].expiryDate = value;
      return updated;
    });
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (documents.length === 0) return;

    const form = new FormData();
    documents.forEach(({ file }) => {
      form.append("documents", file);
    });

    const expiryDates = {};
    documents.forEach(({ file, expiryDate }) => {
      if (expiryDate) expiryDates[file.name] = expiryDate;
    });
    form.append("expiryDates", JSON.stringify(expiryDates));

    await dispatch(uploadSellerDocuments(form));
    setDocuments([]);
    setUploadMessage("Documents uploaded successfully!");
    setTimeout(() => setUploadMessage(""), 3000);
  };
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-purple-800">
          📁 Upload Documents
        </h2>
        <form
          onSubmit={handleDocUpload}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Select Files
            </label>
            <input
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
            />
          </div>

          {documents.length > 0 && (
            <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-md shadow-sm">
              {documents.map(({ file, expiryDate }, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <p className="flex-1 text-gray-700 font-medium">
                    {file.name}
                  </p>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) =>
                      handleExpiryDateChange(idx, e.target.value)
                    }
                    className="border border-gray-300 px-3 py-1 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeDocument(idx)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-5 py-2 rounded-md shadow disabled:opacity-50"
            disabled={documents.length === 0}
          >
            ⬆️{loading ? (<>Uploading</>) :(<>Upload Documents</>)} 
          </button>

          {uploadMessage && (
            <p className="text-green-600 font-medium">{uploadMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SellerDocument;
