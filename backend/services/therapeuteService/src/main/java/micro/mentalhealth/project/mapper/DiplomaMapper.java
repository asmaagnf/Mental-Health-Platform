package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.model.valueobjects.Diploma;
import micro.mentalhealth.project.dto.common.DiplomaDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DiplomaMapper {

    public Diploma toEntity(DiplomaDto dto) {
        if (dto == null) {
            return null;
        }
        return new Diploma(
                dto.getTitle(),
                dto.getInstitution(),
                dto.getYear(),
                dto.getImageUrl()
        );
    }

    public DiplomaDto toDto(Diploma entity) {
        if (entity == null) {
            return null;
        }
        return new DiplomaDto(
                entity.getTitle(),
                entity.getInstitution(),
                entity.getYear(),
                entity.getImageUrl()
        );
    }

    public List<Diploma> toEntityList(List<DiplomaDto> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream().map(this::toEntity).collect(Collectors.toList());
    }

    public List<DiplomaDto> toDtoList(List<Diploma> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream().map(this::toDto).collect(Collectors.toList());
    }
}