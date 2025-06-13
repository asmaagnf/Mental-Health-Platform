package micro.mentalhealth.project.service;

import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import micro.mentalhealth.project.repository.ProfilTherapeuteRepository;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteResponse;
import micro.mentalhealth.project.dto.profiltherapeute.TherapeuteSearchRequest;
import micro.mentalhealth.project.mapper.ProfilTherapeuteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TherapeuteSearchService {

    private final ProfilTherapeuteRepository profilTherapeuteRepository;
    private final ProfilTherapeuteMapper profilTherapeuteMapper;

    @Autowired
    public TherapeuteSearchService(ProfilTherapeuteRepository profilTherapeuteRepository, ProfilTherapeuteMapper profilTherapeuteMapper) {
        this.profilTherapeuteRepository = profilTherapeuteRepository;
        this.profilTherapeuteMapper = profilTherapeuteMapper;
    }

    @Transactional(readOnly = true)
    public List<ProfilTherapeuteResponse> searchTherapeutes(TherapeuteSearchRequest request) {
        List<ProfilTherapeute> therapeutes;

        if (request.getSpecialty() != null || request.getLocalisation() != null || request.getLangue() != null) {
            // Complex search based on specialty, location, language for VALID profiles
            String specialty = request.getSpecialty() != null ? request.getSpecialty() : "";
            String localisation = request.getLocalisation() != null ? request.getLocalisation() : "";
            String langue = request.getLangue() != null ? request.getLangue() : "";

            therapeutes = profilTherapeuteRepository.findBySpecialitesContainingIgnoreCaseAndLocalisationContainingIgnoreCaseAndLanguesParleesContainingIgnoreCaseAndStatutProfil(
                    specialty, localisation, langue, StatutProfil.VALIDE
            );
        } else {
            // Default to all validated profiles if no specific criteria
            therapeutes = profilTherapeuteRepository.findByStatutProfil(StatutProfil.VALIDE);
        }

        // Apply additional filtering for experience and price if provided, using in-memory filtering
        if (request.getMinExperience() != null) {
            therapeutes = therapeutes.stream()
                    .filter(p -> p.getAnneesExperience() != null && p.getAnneesExperience() >= request.getMinExperience())
                    .collect(Collectors.toList());
        }

        if (request.getMaxPricePerHour() != null) {
            therapeutes = therapeutes.stream()
                    .filter(p -> p.getPrixParHeure() != null && p.getPrixParHeure() <= request.getMaxPricePerHour())
                    .collect(Collectors.toList());
        }

        return profilTherapeuteMapper.toDtoList(therapeutes);
    }

    @Transactional(readOnly = true)
    public List<ProfilTherapeuteResponse> getAllValidatedTherapeutes() {
        List<ProfilTherapeute> therapeutes = profilTherapeuteRepository.findByStatutProfil(StatutProfil.VALIDE);
        return profilTherapeuteMapper.toDtoList(therapeutes);
    }
}
