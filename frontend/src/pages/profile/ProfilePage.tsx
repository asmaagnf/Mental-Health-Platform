import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserProfile = () => {
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

  // Charger les données utilisateur depuis le backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetch(`http://localhost:8090/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setUserData(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            dateOfBirth: data.dateOfBirth || "",
            address: data.address || "",
            gender: data.gender || "",
            profilePictureUrl: data.profilePictureUrl || ""
          });
        })
        .catch(err => {
          console.error("Erreur de chargement :", err);
          toast.error("Erreur lors du chargement du profil.");
        });
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:8090/api/user/update/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Échec de la mise à jour");
        return res.json();
      })
      .then(data => {
        toast.success("Profil mis à jour !");
        setUserData(data);
      })
      .catch(err => {
        console.error("Erreur :", err);
        toast.error("Une erreur est survenue lors de la mise à jour.");
      });
  };

  if (!userData)
    return (
      <div className="text-center mt-10 text-gray-600">
        Chargement du profil...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier mon profil</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Nom complet", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Téléphone", name: "phoneNumber", type: "text" },
          { label: "Date de naissance", name: "dateOfBirth", type: "date" },
          { label: "Adresse", name: "address", type: "text" },
          { label: "URL Photo de profil", name: "profilePictureUrl", type: "text", full: true }
        ].map(({ label, name, type, full }) => (
          <div className={full ? "md:col-span-2" : ""} key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Entrez votre ${label.toLowerCase()}`}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            <option value="FEMALE">Femme</option>
            <option value="MALE">Homme</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow transition"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
