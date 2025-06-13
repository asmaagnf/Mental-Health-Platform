import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TherapistRedirector = ({ userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTherapistProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8040/api/therapeutes/profiles/user/${userId}`);
        const profil = response.data;

        switch (profil.statutProfil) {
          case 'EN_ATTENTE':
            navigate('/therapeute/en-attente');
            break;
          case 'REJETE':
            navigate('/therapeute/refuse');
            break;
          case 'VALIDE':
            navigate('/therapist/TherapistDashboard'); 
            break;
          default:
            console.warn("Statut inconnu");
            navigate('/error');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Pas encore de profil
          navigate('/therapeute/creer-profil');
        } else {
          console.error("Erreur lors de la récupération du profil :", error);
          navigate('/error');
        }
      }
    };

    if (userId) {
      checkTherapistProfile();
    }
  }, [userId, navigate]);

  return null; // Ce composant ne rend rien, il redirige simplement
};
export default TherapistRedirector; 
