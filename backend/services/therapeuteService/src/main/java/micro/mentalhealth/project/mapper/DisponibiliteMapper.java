package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.model.Disponibilite;
import micro.mentalhealth.project.model.valueobjects.TimeRange;
import micro.mentalhealth.project.dto.disponibilite.DisponibiliteRequest;
import micro.mentalhealth.project.dto.disponibilite.DisponibiliteResponse;
import micro.mentalhealth.project.dto.common.TimeRangeDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DisponibiliteMapper {

    public TimeRange toTimeRangeEntity(TimeRangeDto dto) {
        if (dto == null) {
            return null;
        }
        return new TimeRange(dto.getHeureDebut(), dto.getHeureFin());
    }

    public TimeRangeDto toTimeRangeDto(TimeRange entity) {
        if (entity == null) {
            return null;
        }
        return new TimeRangeDto(entity.getHeureDebut(), entity.getHeureFin());
    }

    public Disponibilite toEntity(DisponibiliteRequest dto) {
        if (dto == null) {
            return null;
        }
        Disponibilite entity = new Disponibilite();
        entity.setJour(dto.getJour());
        entity.setPlageHoraire(toTimeRangeEntity(dto.getPlageHoraire()));
        return entity;
    }

    public DisponibiliteResponse toDto(Disponibilite entity) {
        if (entity == null) {
            return null;
        }
        return new DisponibiliteResponse(
                entity.getId() != null ? entity.getId() : null,
                entity.getTherapeuteId(),
                entity.getJour(),
                toTimeRangeDto(entity.getPlageHoraire())
        );
    }

    public List<DisponibiliteResponse> toDtoList(List<Disponibilite> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream().map(this::toDto).collect(Collectors.toList());
    }
}
