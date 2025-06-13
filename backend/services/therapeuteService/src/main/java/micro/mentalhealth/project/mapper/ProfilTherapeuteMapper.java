package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.model.ProfilTherapeute;
import micro.mentalhealth.project.model.valueobjects.StatutProfil;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteRequest;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteResponse;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfilTherapeuteMapper {

    private final DiplomaMapper diplomaMapper;

    @Autowired
    public ProfilTherapeuteMapper(DiplomaMapper diplomaMapper) {
        this.diplomaMapper = diplomaMapper;
    }

    public ProfilTherapeute toEntity(ProfilTherapeuteRequest dto) {
        if (dto == null) {
            return null;
        }
        ProfilTherapeute entity = new ProfilTherapeute();
        entity.setSpecialites(dto.getSpecialites());
        entity.setDescription(dto.getDescription());
        entity.setAnneesExperience(dto.getAnneesExperience());
        entity.setDiplomas(diplomaMapper.toEntityList(dto.getDiplomas()));
        entity.setLanguesParlees(dto.getLanguesParlees());
        entity.setLocalisation(dto.getLocalisation());
        entity.setAvailable(dto.getAvailable());
        entity.setPrixParHeure(dto.getPrixParHeure());
        // StatutProfil is set by service logic, not from request directly
        return entity;
    }

    public ProfilTherapeuteResponse toDto(ProfilTherapeute entity) {
        if (entity == null) {
            return null;
        }
        return new ProfilTherapeuteResponse(
                entity.getId() != null ? entity.getId() : null,
                entity.getUserId(),
                entity.getSpecialites(),
                entity.getDescription(),
                entity.getAnneesExperience(),
                diplomaMapper.toDtoList(entity.getDiplomas()),
                entity.getLanguesParlees(),
                entity.getLocalisation(),
                entity.getAvailable(),
                entity.getPrixParHeure(),
                entity.getStatutProfil()
        );
    }

    public List<ProfilTherapeuteResponse> toDtoList(List<ProfilTherapeute> entityList) {
        if (entityList == null) {
            return null;
        }
        return entityList.stream().map(this::toDto).collect(Collectors.toList());
    }
}
