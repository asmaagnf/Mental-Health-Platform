package micro.mentalhealth.project.service;

import micro.mentalhealth.project.model.Disponibilite;
import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.events.TherapistAvailabilityChangedEvent;
import micro.mentalhealth.project.repository.DisponibiliteRepository;
import micro.mentalhealth.project.repository.ProfilTherapeuteRepository;
import micro.mentalhealth.project.dto.disponibilite.DisponibiliteRequest;
import micro.mentalhealth.project.dto.disponibilite.DisponibiliteResponse;
import micro.mentalhealth.project.mapper.DisponibiliteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

@Service
public class DisponibiliteService {

    private final DisponibiliteRepository disponibiliteRepository;
    private final ProfilTherapeuteRepository profilTherapeuteRepository;
    private final DisponibiliteMapper disponibiliteMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public DisponibiliteService(DisponibiliteRepository disponibiliteRepository,
                                ProfilTherapeuteRepository profilTherapeuteRepository,
                                DisponibiliteMapper disponibiliteMapper,
                                ApplicationEventPublisher eventPublisher) {
        this.disponibiliteRepository = disponibiliteRepository;
        this.profilTherapeuteRepository = profilTherapeuteRepository;
        this.disponibiliteMapper = disponibiliteMapper;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public DisponibiliteResponse addDisponibilite(UUID therapeuteId, DisponibiliteRequest request) {
        // Ensure the therapeuteId exists
        profilTherapeuteRepository.findByUserId(therapeuteId)
                .orElseThrow(() -> new EntityNotFoundException("Therapist profile not found with id: " + therapeuteId));

        // Check if availability for this day already exists
        disponibiliteRepository.findByTherapeuteIdAndJour(therapeuteId, request.getJour())
                .ifPresent(d -> {
                    throw new IllegalArgumentException("Availability for this day already exists for the therapist: " + request.getJour());
                });

        Disponibilite disponibilite = disponibiliteMapper.toEntity(request);
        disponibilite.setTherapeuteId(therapeuteId);
        Disponibilite savedDisponibilite = disponibiliteRepository.save(disponibilite);
        eventPublisher.publishEvent(new TherapistAvailabilityChangedEvent(therapeuteId, savedDisponibilite.getId()));
        return disponibiliteMapper.toDto(savedDisponibilite);
    }

    @Transactional
    public DisponibiliteResponse updateDisponibilite(UUID disponibiliteId, DisponibiliteRequest request) {
        Disponibilite existingDisponibilite = disponibiliteRepository.findById(disponibiliteId)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + disponibiliteId));

        existingDisponibilite.setJour(request.getJour());
        existingDisponibilite.setPlageHoraire(disponibiliteMapper.toTimeRangeEntity(request.getPlageHoraire()));

        Disponibilite updatedDisponibilite = disponibiliteRepository.save(existingDisponibilite);
        eventPublisher.publishEvent(new TherapistAvailabilityChangedEvent(updatedDisponibilite.getTherapeuteId(), updatedDisponibilite.getId()));
        return disponibiliteMapper.toDto(updatedDisponibilite);
    }

    @Transactional
    public void deleteDisponibilite(UUID disponibiliteId) {
        Disponibilite existingDisponibilite = disponibiliteRepository.findById(disponibiliteId)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + disponibiliteId));

        disponibiliteRepository.delete(existingDisponibilite);
        eventPublisher.publishEvent(new TherapistAvailabilityChangedEvent(existingDisponibilite.getTherapeuteId(), existingDisponibilite.getId()));
    }

    @Transactional(readOnly = true)
    public List<DisponibiliteResponse> getDisponibilitesByTherapeuteId(UUID therapeuteId) {
        List<Disponibilite> disponibilites = disponibiliteRepository.findByTherapeuteId(therapeuteId);
        return disponibiliteMapper.toDtoList(disponibilites);
    }

    @Transactional(readOnly = true)
    public DisponibiliteResponse getDisponibiliteById(UUID id) {
        Disponibilite disponibilite = disponibiliteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + id));
        return disponibiliteMapper.toDto(disponibilite);
    }
}
