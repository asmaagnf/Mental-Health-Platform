package micro.mentalhealth.project.mapper;

import micro.mentalhealth.project.dto.CreateRemboursementRequest;
import micro.mentalhealth.project.dto.RemboursementDTO;
import micro.mentalhealth.project.model.Remboursement;
import org.springframework.stereotype.Component;


@Component
public class RemboursementMapper {

    public static Remboursement toEntity(CreateRemboursementRequest dto) {
        Remboursement remboursement = new Remboursement();
        remboursement.setPaiementId(dto.getPaiementId());
        remboursement.setMontant(dto.getMontant());
        remboursement.setMotif(dto.getMotif());
        remboursement.setDateRemboursement(java.time.LocalDateTime.now());
        return remboursement;
    }

    public static RemboursementDTO toDTO(Remboursement remboursement) {
        RemboursementDTO dto = new RemboursementDTO();
        dto.setId(remboursement.getId());
        dto.setPaiementId(remboursement.getPaiementId());
        dto.setMontant(remboursement.getMontant());
        dto.setMotif(remboursement.getMotif());
        dto.setDateRemboursement(remboursement.getDateRemboursement());
        return dto;
    }
}
