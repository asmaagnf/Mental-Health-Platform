package micro.mentalhealth.project.dto;

import micro.mentalhealth.project.model.TypeSeance;

import java.time.LocalDateTime;
import java.util.UUID;

public class BookSeanceRequest {
    private UUID therapistId;
    private UUID patientId;
    private LocalDateTime dateTime;
    private int dureeMinutes;
    private TypeSeance typeSeance;


    // Constructeur
    public BookSeanceRequest(UUID therapistId, UUID patientId, LocalDateTime dateTime, int dureeMinutes, TypeSeance typeSeance) {
        this.therapistId = therapistId;
        this.patientId = patientId;
        this.dateTime = dateTime;
        this.dureeMinutes = dureeMinutes;
        this.typeSeance = typeSeance;
    }

    // Getters
    public UUID getTherapistId() {
        return therapistId;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public int getDureeMinutes() {
        return dureeMinutes;
    }

    public TypeSeance getTypeSeance() {
        return typeSeance;
    }

    // Setters
    public void setTherapistId(UUID therapistId) {
        this.therapistId = therapistId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setDureeMinutes(int dureeMinutes) {
        this.dureeMinutes = dureeMinutes;
    }

    public void setTypeSeance(TypeSeance typeSeance) {
        this.typeSeance = typeSeance;
    }
}
