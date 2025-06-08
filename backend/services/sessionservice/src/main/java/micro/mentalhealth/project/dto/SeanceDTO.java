package micro.mentalhealth.project.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class SeanceDTO {

    private UUID seanceId;
    private UUID therapeuteId;
    private UUID patientId;
    private LocalDateTime dateHeure;
    private int dureeMinutes;
    private String typeSeance;
    private String statutSeance;
    private String lienVisio;
    private String urlEnregistrement;
    private String noteTherapeute;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SeanceDTO() {}

    public SeanceDTO(UUID seanceId, UUID therapeuteId, UUID patientId, LocalDateTime dateHeure,
                     int dureeMinutes, String typeSeance, String statutSeance,
                     String lienVisio, String urlEnregistrement, String noteTherapeute,
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

    // Getters and Setters

    public UUID getSeanceId() {
        return seanceId;
    }

    public void setSeanceId(UUID seanceId) {
        this.seanceId = seanceId;
    }

    public UUID getTherapeuteId() {
        return therapeuteId;
    }

    public void setTherapeuteId(UUID therapeuteId) {
        this.therapeuteId = therapeuteId;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getDateHeure() {
        return dateHeure;
    }

    public void setDateHeure(LocalDateTime dateHeure) {
        this.dateHeure = dateHeure;
    }

    public int getDureeMinutes() {
        return dureeMinutes;
    }

    public void setDureeMinutes(int dureeMinutes) {
        this.dureeMinutes = dureeMinutes;
    }

    public String getTypeSeance() {
        return typeSeance;
    }

    public void setTypeSeance(String typeSeance) {
        this.typeSeance = typeSeance;
    }

    public String getStatutSeance() {
        return statutSeance;
    }

    public void setStatutSeance(String statutSeance) {
        this.statutSeance = statutSeance;
    }

    public String getLienVisio() {
        return lienVisio;
    }

    public void setLienVisio(String lienVisio) {
        this.lienVisio = lienVisio;
    }

    public String getUrlEnregistrement() {
        return urlEnregistrement;
    }

    public void setUrlEnregistrement(String urlEnregistrement) {
        this.urlEnregistrement = urlEnregistrement;
    }

    public String getNoteTherapeute() {
        return noteTherapeute;
    }

    public void setNoteTherapeute(String noteTherapeute) {
        this.noteTherapeute = noteTherapeute;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
