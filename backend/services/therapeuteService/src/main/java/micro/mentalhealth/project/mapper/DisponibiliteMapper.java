package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.DisponibiliteDto;
import micro.mentalhealth.project.model.Disponibilite;

public class DisponibiliteMapper {

    public static DisponibiliteDto toDto(Disponibilite d) {
        return DisponibiliteDto.builder()
                .id(d.getId())
                .therapeuteId(d.getTherapeuteId())
                .jour(d.getJour())
                .plageHoraire(d.getPlageHoraire())
                .build();
    }

    public static Disponibilite toEntity(DisponibiliteDto dto) {
        return Disponibilite.builder()
                .id(dto.getId())
                .therapeuteId(dto.getTherapeuteId())
                .jour(dto.getJour())
                .plageHoraire(dto.getPlageHoraire())
                .build();
    }
}

