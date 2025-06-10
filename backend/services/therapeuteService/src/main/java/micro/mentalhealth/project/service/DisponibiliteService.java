package micro.mentalhealth.project.service;

import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.DisponibiliteDto;
import micro.mentalhealth.project.mapper.DisponibiliteMapper;
import micro.mentalhealth.project.model.Disponibilite;
import micro.mentalhealth.project.repository.DisponibiliteRepository;
import micro.mentalhealth.project.repository.ProfilTherapeuteRepository;  // Assuming this exists
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisponibiliteService {

    private final DisponibiliteRepository repository;
    private final ProfilTherapeuteRepository profilRepository; // To check therapist existence

    public List<DisponibiliteDto> getDisponibilitesByTherapeute(UUID therapeuteId) {
        return repository.findByTherapeuteId(therapeuteId)
                .stream()
                .map(DisponibiliteMapper::toDto)
                .collect(Collectors.toList());
    }

    public DisponibiliteDto addDisponibilite(DisponibiliteDto dto) {
        validateTherapeuteExists(dto.getTherapeuteId());
        checkForOverlapOrDuplicate(dto, null);

        Disponibilite saved = repository.save(DisponibiliteMapper.toEntity(dto));
        return DisponibiliteMapper.toDto(saved);
    }

    public DisponibiliteDto updateDisponibilite(UUID id, DisponibiliteDto dto) {
        Disponibilite existing = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Disponibilité non trouvée avec l'ID: " + id));

        validateTherapeuteExists(existing.getTherapeuteId());
        checkForOverlapOrDuplicate(dto, id);

        existing.setJour(dto.getJour());
        existing.setPlageHoraire(dto.getPlageHoraire());

        Disponibilite updated = repository.save(existing);
        return DisponibiliteMapper.toDto(updated);
    }

    public void deleteDisponibilite(UUID id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Disponibilité non trouvée avec l'ID: " + id);
        }
        repository.deleteById(id);
    }

    public DisponibiliteDto getById(UUID id) {
        Disponibilite dispo = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Disponibilité non trouvée avec l'ID: " + id));
        return DisponibiliteMapper.toDto(dispo);
    }

    private void validateTherapeuteExists(UUID therapeuteId) {
        boolean exists = profilRepository.existsById(therapeuteId);
        if (!exists) {
            throw new IllegalArgumentException("Le thérapeute avec l'ID " + therapeuteId + " n'existe pas.");
        }
    }

    /**
     * Check if the new or updated Disponibilite overlaps or duplicates existing ones
     * for the same therapist, day, and time slot.
     *
     * @param dto DisponibiliteDto to add or update
     * @param updatingId UUID of the Disponibilite being updated (null if adding)
     */
    private void checkForOverlapOrDuplicate(DisponibiliteDto dto, UUID updatingId) {
        List<Disponibilite> existingDispos = repository.findByTherapeuteId(dto.getTherapeuteId());

        boolean conflict = existingDispos.stream()
                .anyMatch(d -> {
                    // Skip the availability being updated (if any)
                    if (updatingId != null && d.getId().equals(updatingId)) {
                        return false;
                    }
                    // Check if same day and same time slot
                    return d.getJour() == dto.getJour() && d.getPlageHoraire() == dto.getPlageHoraire();
                });

        if (conflict) {
            throw new IllegalArgumentException("Conflit de disponibilité: cette plage horaire est déjà définie pour ce thérapeute ce jour.");
        }
    }
}
