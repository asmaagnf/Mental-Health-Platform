import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const UserProfile = () => {
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    profilePictureUrl: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      fetch(`http://localhost:8090/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setUserData(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            dateOfBirth: data.dateOfBirth?.split("T")[0] || "",
            address: data.address || "",
            gender: data.gender || "",
            profilePictureUrl: data.profilePictureUrl || ""
          });
        })
        .catch(err => {
          console.error("Loading error:", err);
          toast.error("Error loading profile.");
        });
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

 const handleUpload = async () => {
  console.log("handleUpload called");
  if (!selectedFile) {
    console.warn("No file selected!");
    toast.error("Please select a file first.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Uploading file for user:", user?.id);
  
  const formData = new FormData();
  formData.append("file", selectedFile);

  setIsUploading(true);

  try {
    const response = await fetch(
      `http://localhost:8090/api/user/${user.id}/upload-profile-picture`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();
    console.log("Response:", data);

    if (!response.ok) throw new Error(data.message || "Upload failed");

    toast.success("Profile picture uploaded successfully!");
    setFormData(prev => ({ ...prev, profilePictureUrl: data.imageUrl }));

  } catch (error) {
    console.error("Upload error:", error);
    toast.error(error.message || "Error uploading profile picture");
  } finally {
    setIsUploading(false);
    setSelectedFile(null);
  }
};

  const handleSubmit = async e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const response = await fetch(`http://localhost:8090/api/user/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth || null,
          address: formData.address || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const data = await response.json();
      toast.success("Profile updated!");
      setUserData(data);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Error updating profile.");
    }
  };

  if (!userData)
    return (
      <div className="text-center mt-10 text-gray-600">Loading profile...</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit My Profile</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Full name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phoneNumber", type: "text" },
          { label: "Birth date", name: "dateOfBirth", type: "date" },
          { label: "Address(street,city,postcode,country)", name: "address", type: "text" }
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Profile Picture Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {formData.profilePictureUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={`http://localhost:8090${formData.profilePictureUrl}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="profilePictureInput"
              />
              <label
                htmlFor="profilePictureInput"
                className="inline-block px-4 py-2 bg-gray-100 rounded-xl border border-gray-300 cursor-pointer hover:bg-gray-200"
              >
                {selectedFile ? selectedFile.name : "Choose file"}
              </label>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
