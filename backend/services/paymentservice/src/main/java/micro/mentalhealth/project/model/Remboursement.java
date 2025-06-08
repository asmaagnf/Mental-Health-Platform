package micro.mentalhealth.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "remboursements")
public class Remboursement {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @Column(name = "paiement_id", nullable = false)
    private UUID paiementId;

    @NotNull
    @Column(name = "montant", nullable = false)
    private Float montant;

    @Column(name = "motif", length = 500)
    private String motif;

    @NotNull
    @Column(name = "date_remboursement", nullable = false)
    private LocalDateTime dateRemboursement;

    // --- Constructeurs ---

    public Remboursement() {
        this.id = UUID.randomUUID();
        this.dateRemboursement = LocalDateTime.now();
    }

    public Remboursement(UUID paiementId, Float montant, String motif) {
        this.id = UUID.randomUUID();
        this.paiementId = paiementId;
        this.montant = montant;
        this.motif = motif;
        this.dateRemboursement = LocalDateTime.now();
    }

    public Remboursement(UUID id, UUID paiementId, Float montant, String motif, LocalDateTime dateRemboursement) {
        this.id = id;
        this.paiementId = paiementId;
        this.montant = montant;
        this.motif = motif;
        this.dateRemboursement = dateRemboursement;
    }

    // --- Getters & Setters ---

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
