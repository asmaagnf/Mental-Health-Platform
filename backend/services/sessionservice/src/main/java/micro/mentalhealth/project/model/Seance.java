package micro.mentalhealth.project.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seances")
public class Seance {

    @Id
    @GeneratedValue
    @Column(nullable = false)
    private UUID seanceId;

    @Column(nullable = false)
    private UUID therapeuteId;

    @Column(nullable = false)
    private UUID patientId;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(nullable = false)
    private int dureeMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeSeance typeSeance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSeance statutSeance;

    @Embedded
    private LienVisio lienVisio;

    private String urlEnregistrement;

    @Column(columnDefinition = "TEXT")
    private String noteTherapeute;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // --- Constructors ---
    public Seance() {}

    public Seance(UUID seanceId, UUID therapeuteId, UUID patientId, LocalDateTime dateHeure,
                  int dureeMinutes, TypeSeance typeSeance, StatutSeance statutSeance,
                  LienVisio lienVisio, String urlEnregistrement, String noteTherapeute,
                  LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.seanceId = seanceId;
        this.therapeuteId = therapeuteId;
        this.patientId = patientId;
        this.dateHeure = dateHeure;
        this.dureeMinutes = dureeMinutes;
        this.typeSeance = typeSeance;
        this.statutSeance = statutSeance;
        this.lienVisio = lienVisio;
        this.urlEnregistrement = urlEnregistrement;
        this.noteTherapeute = noteTherapeute;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getters and Setters ---
    public UUID getSeanceId() { return seanceId; }
    public void setSeanceId(UUID seanceId) { this.seanceId = seanceId; }

    public UUID getTherapeuteId() { return therapeuteId; }
    public void setTherapeuteId(UUID therapeuteId) { this.therapeuteId = therapeuteId; }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public LocalDateTime getDateHeure() { return dateHeure; }
    public void setDateHeure(LocalDateTime dateHeure) { this.dateHeure = dateHeure; }

    public int getDureeMinutes() { return dureeMinutes; }
    public void setDureeMinutes(int dureeMinutes) { this.dureeMinutes = dureeMinutes; }

    public TypeSeance getTypeSeance() { return typeSeance; }
    public void setTypeSeance(TypeSeance typeSeance) { this.typeSeance = typeSeance; }

    public StatutSeance getStatutSeance() { return statutSeance; }
    public void setStatutSeance(StatutSeance statutSeance) { this.statutSeance = statutSeance; }

    public LienVisio getLienVisio() { return lienVisio; }
    public void setLienVisio(LienVisio lienVisio) { this.lienVisio = lienVisio; }

    public String getUrlEnregistrement() { return urlEnregistrement; }
    public void setUrlEnregistrement(String urlEnregistrement) { this.urlEnregistrement = urlEnregistrement; }

    public String getNoteTherapeute() { return noteTherapeute; }
    public void setNoteTherapeute(String noteTherapeute) { this.noteTherapeute = noteTherapeute; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // --- Lifecycle Callbacks ---
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Manual Builder Implementation ---
    public static class Builder {
        private UUID seanceId;
        private UUID therapeuteId;
        private UUID patientId;
        private LocalDateTime dateHeure;
        private int dureeMinutes;
        private TypeSeance typeSeance;
        private StatutSeance statutSeance;
        private LienVisio lienVisio;
        private String urlEnregistrement;
        private String noteTherapeute;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder seanceId(UUID seanceId) {
            this.seanceId = seanceId;
            return this;
        }

        public Builder therapeuteId(UUID therapeuteId) {
            this.therapeuteId = therapeuteId;
            return this;
        }

        public Builder patientId(UUID patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder dateHeure(LocalDateTime dateHeure) {
            this.dateHeure = dateHeure;
            return this;
        }

        public Builder dureeMinutes(int dureeMinutes) {
            this.dureeMinutes = dureeMinutes;
            return this;
        }

        public Builder typeSeance(TypeSeance typeSeance) {
            this.typeSeance = typeSeance;
            return this;
        }

        public Builder statutSeance(StatutSeance statutSeance) {
            this.statutSeance = statutSeance;
            return this;
        }

        public Builder lienVisio(LienVisio lienVisio) {
            this.lienVisio = lienVisio;
            return this;
        }

        public Builder urlEnregistrement(String urlEnregistrement) {
            this.urlEnregistrement = urlEnregistrement;
            return this;
        }

        public Builder noteTherapeute(String noteTherapeute) {
            this.noteTherapeute = noteTherapeute;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Seance build() {
            return new Seance(seanceId, therapeuteId, patientId, dateHeure,
                    dureeMinutes, typeSeance, statutSeance, lienVisio,
                    urlEnregistrement, noteTherapeute, createdAt, updatedAt);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
