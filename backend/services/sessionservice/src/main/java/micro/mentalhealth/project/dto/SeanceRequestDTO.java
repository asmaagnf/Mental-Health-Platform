package micro.mentalhealth.project.dto;

import micro.mentalhealth.project.model.StatutSeance;
import micro.mentalhealth.project.model.TypeSeance;

import java.time.LocalDateTime;
import java.util.UUID;

public class SeanceRequestDTO {

    private UUID therapeuteId;
    private UUID patientId;
    private LocalDateTime dateHeure;
    private int dureeMinutes;
    private TypeSeance typeSeance;
    private StatutSeance statutSeance;
    private String lienVisioUrl;
    private String urlEnregistrement;
    private String noteTherapeute;

    public SeanceRequestDTO() {}

    public SeanceRequestDTO(UUID therapeuteId, UUID patientId, LocalDateTime dateHeure,
                            int dureeMinutes, TypeSeance typeSeance, StatutSeance statutSeance,
                            String lienVisioUrl, String urlEnregistrement, String noteTherapeute) {
        this.therapeuteId = therapeuteId;
        this.patientId = patientId;
        this.dateHeure = dateHeure;
        this.dureeMinutes = dureeMinutes;
        this.typeSeance = typeSeance;
        this.statutSeance = statutSeance;
        this.lienVisioUrl = lienVisioUrl;
        this.urlEnregistrement = urlEnregistrement;
        this.noteTherapeute = noteTherapeute;
    }

    // Getters and Setters

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

    public TypeSeance getTypeSeance() {
        return typeSeance;
    }

    public void setTypeSeance(TypeSeance typeSeance) {
        this.typeSeance = typeSeance;
    }

    public StatutSeance getStatutSeance() {
        return statutSeance;
    }

    public void setStatutSeance(StatutSeance statutSeance) {
        this.statutSeance = statutSeance;
    }

    public String getLienVisioUrl() {
        return lienVisioUrl;
    }

    public void setLienVisioUrl(String lienVisioUrl) {
        this.lienVisioUrl = lienVisioUrl;
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
}
