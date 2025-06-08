package micro.mentalhealth.project.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class RemboursementDTO {
    private UUID id;
    private UUID paiementId;
    private Float montant;
    private String motif;
    private LocalDateTime dateRemboursement;

    public RemboursementDTO() {}

    public RemboursementDTO(UUID id, UUID paiementId, Float montant, String motif, LocalDateTime dateRemboursement) {
        this.id = id;
        this.paiementId = paiementId;
        this.montant = montant;
        this.motif = motif;
        this.dateRemboursement = dateRemboursement;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPaiementId() {
        return paiementId;
    }

    public void setPaiementId(UUID paiementId) {
        this.paiementId = paiementId;
    }

    public Float getMontant() {
        return montant;
    }

    public void setMontant(Float montant) {
        this.montant = montant;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public LocalDateTime getDateRemboursement() {
        return dateRemboursement;
    }

    public void setDateRemboursement(LocalDateTime dateRemboursement) {
        this.dateRemboursement = dateRemboursement;
    }
}
