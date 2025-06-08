package micro.mentalhealth.project.service;

import micro.mentalhealth.project.model.HumeurJournalisee;
import micro.mentalhealth.project.model.SuiviSante;
import micro.mentalhealth.project.repository.SuiviSanteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import micro.mentalhealth.project.model.SymptomeJournalier;
import micro.mentalhealth.project.model.SymptomeSuivi;
import micro.mentalhealth.project.model.valueobjects.IntensiteSymptome;

@Service
public class SuiviSanteService {

    private final SuiviSanteRepository suiviSanteRepository;
    private final CalculTendanceSymptomeService calculTendanceSymptomeService;

    public SuiviSanteService(SuiviSanteRepository suiviSanteRepository,
                             CalculTendanceSymptomeService calculTendanceSymptomeService) {
        this.suiviSanteRepository = suiviSanteRepository;
        this.calculTendanceSymptomeService = calculTendanceSymptomeService;
    }

    @Transactional
    public HumeurJournalisee enregistrerHumeur(UUID patientId, HumeurJournalisee humeur) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    SuiviSante newSuivi = new SuiviSante(patientId);
                    return suiviSanteRepository.save(newSuivi);
                });

        suiviSante.ajouterHumeur(humeur);
        suiviSanteRepository.save(suiviSante);
        return humeur;
    }

    @Transactional(readOnly = true)
    public List<HumeurJournalisee> getHumeurHistory(UUID patientId) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("No health tracking found for patient ID: " + patientId));

        return suiviSante.getHumeurHistory();
    }

    @Transactional(readOnly = true)
    public double getMoodAverage(UUID patientId, int lastDays) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("No health tracking found for patient ID: " + patientId));

        return suiviSante.getMoyenneHumeur(lastDays);
    }

    @Transactional
    public SymptomeSuivi ajouterSymptome(UUID patientId, String nomSymptome) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    SuiviSante newSuivi = new SuiviSante(patientId);
                    return suiviSanteRepository.save(newSuivi);
                });

        SymptomeSuivi symptomeAjoute = suiviSante.ajouterSymptome(nomSymptome);
        suiviSanteRepository.save(suiviSante);

        return symptomeAjoute;
    }

    @Transactional
    public void enregistrerSymptomeObservation(UUID patientId, String nomSymptome, IntensiteSymptome intensite) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("No health tracking found for patient ID: " + patientId));

        suiviSante.enregistrerObservationSymptome(nomSymptome, intensite);
        suiviSanteRepository.save(suiviSante);
    }

    @Transactional(readOnly = true)
    public List<SymptomeJournalier> getSymptomHistory(UUID patientId, String nomSymptome) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("Symptom '" + nomSymptome + "' is not being tracked for patient ID: " + patientId));

        return suiviSante.getHistoriqueSymptome(nomSymptome);
    }

    @Transactional(readOnly = true)
    public double getSymptomTrend(UUID patientId, String nomSymptome, int periodInDays) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("Symptom '" + nomSymptome + "' is not being tracked for patient ID: " + patientId));

        List<SymptomeJournalier> history = suiviSante.getHistoriqueSymptome(nomSymptome);
        return calculTendanceSymptomeService.calculerTendance(history, periodInDays);
    }

    @Transactional(readOnly = true)
    public List<SymptomeSuivi> getAllTrackedSymptoms(UUID patientId) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientIdWithSymptoms(patientId)
                .orElseThrow(() -> new NoSuchElementException("No health tracking found for patient ID: " + patientId));
        return suiviSante.getSymptomes();
    }

    @Transactional(readOnly = true)
    public SymptomeSuivi getSymptomeSuiviByName(UUID patientId, String nomSymptome) {
        SuiviSante suiviSante = suiviSanteRepository.findByPatientId(patientId)
                .orElseThrow(() -> new NoSuchElementException("SuiviSante not found for patient ID: " + patientId));

        return suiviSante.getSymptomes().stream()
                .filter(s -> s.getNom().equalsIgnoreCase(nomSymptome))
                .findFirst()
                .orElse(null);
    }
}
