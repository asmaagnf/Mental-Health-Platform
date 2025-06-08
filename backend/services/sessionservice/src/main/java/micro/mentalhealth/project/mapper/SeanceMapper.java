package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.SeanceDTO;
import micro.mentalhealth.project.model.LienVisio;
import micro.mentalhealth.project.model.Seance;
import micro.mentalhealth.project.model.StatutSeance;
import micro.mentalhealth.project.model.TypeSeance;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class SeanceMapper {

    public SeanceDTO toDTO(Seance seance) {
        SeanceDTO dto = new SeanceDTO();
        dto.setSeanceId(seance.getSeanceId());
        dto.setTherapeuteId(seance.getTherapeuteId());
        dto.setPatientId(seance.getPatientId());
        dto.setDateHeure(seance.getDateHeure());
        dto.setTypeSeance(seance.getTypeSeance().name());
        dto.setStatutSeance(seance.getStatutSeance().name());
        dto.setLienVisio(seance.getLienVisio() != null ? seance.getLienVisio().getUrl() : null);
        dto.setUrlEnregistrement(seance.getUrlEnregistrement());
        dto.setNoteTherapeute(seance.getNoteTherapeute());
        dto.setCreatedAt(seance.getCreatedAt());
        dto.setUpdatedAt(seance.getUpdatedAt());
        dto.setDureeMinutes(seance.getDureeMinutes()); // ajout du champ
        return dto;
    }

    public Seance toEntity(SeanceDTO dto) {
        return Seance.builder()
                .seanceId(dto.getSeanceId() != null ? dto.getSeanceId() : UUID.randomUUID())
                .therapeuteId(dto.getTherapeuteId())
                .patientId(dto.getPatientId())
                .dateHeure(dto.getDateHeure())
                .typeSeance(TypeSeance.valueOf(dto.getTypeSeance()))
                .statutSeance(StatutSeance.valueOf(dto.getStatutSeance()))
                .lienVisio(dto.getLienVisio() != null ? new LienVisio(dto.getLienVisio()) : null)
                .urlEnregistrement(dto.getUrlEnregistrement())
                .noteTherapeute(dto.getNoteTherapeute())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .dureeMinutes(dto.getDureeMinutes()) // ajout du champ
                .build();
    }

    public List<SeanceDTO> toDTOList(List<Seance> seances) {
        return seances.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<Seance> toEntityList(List<SeanceDTO> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
