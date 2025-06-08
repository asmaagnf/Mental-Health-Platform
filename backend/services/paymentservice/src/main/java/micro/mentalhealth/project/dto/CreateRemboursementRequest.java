package micro.mentalhealth.project.dto;

import java.util.UUID;

public class CreateRemboursementRequest {
    private UUID paiementId;
    private Float montant;
    private String motif;

    public CreateRemboursementRequest() {}

    public CreateRemboursementRequest(UUID paiementId, Float montant, String motif) {
        this.paiementId = paiementId;
        this.montant = montant;
        this.motif = motif;
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
}
