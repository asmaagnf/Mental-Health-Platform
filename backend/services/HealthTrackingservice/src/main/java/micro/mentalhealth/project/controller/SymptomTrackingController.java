package micro.mentalhealth.project.controller;

import micro.mentalhealth.project.dto.symptom.SymptomHistoryResponse;
import micro.mentalhealth.project.dto.symptom.SymptomObservationRequest;
import micro.mentalhealth.project.dto.symptom.SymptomRequest;
import micro.mentalhealth.project.dto.symptom.SymptomResponse;
import micro.mentalhealth.project.mapper.SymptomMapper;
import micro.mentalhealth.project.model.SymptomeJournalier;
import micro.mentalhealth.project.model.SymptomeSuivi;
import micro.mentalhealth.project.model.valueobjects.IntensiteSymptome;
import micro.mentalhealth.project.service.SuiviSanteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping("/api/health-tracking/symptoms")
public class SymptomTrackingController {

    private final SuiviSanteService suiviSanteService;
    private final SymptomMapper symptomMapper;

    public SymptomTrackingController(SuiviSanteService suiviSanteService, SymptomMapper symptomMapper) {
        this.suiviSanteService = suiviSanteService;
        this.symptomMapper = symptomMapper;
    }

    // Wrapper DTO for addSymptomToTrack POST request
    public static class AddSymptomRequest {
        @Valid
        private SymptomRequest symptomRequest;
        private UUID patientId;

        public SymptomRequest getSymptomRequest() {
            return symptomRequest;
        }

        public void setSymptomRequest(SymptomRequest symptomRequest) {
            this.symptomRequest = symptomRequest;
        }

        public UUID getPatientId() {
            return patientId;
        }

        public void setPatientId(UUID patientId) {
            this.patientId = patientId;
        }
    }

    @PostMapping
    public ResponseEntity<SymptomResponse> addSymptomToTrack(@Valid @RequestBody AddSymptomRequest request) {
        UUID patientId = request.getPatientId();
        if (patientId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            SymptomeSuivi addedSymptom = suiviSanteService.ajouterSymptome(patientId, request.getSymptomRequest().getNom());
            SymptomResponse response = symptomMapper.toSymptomResponse(addedSymptom, patientId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Wrapper DTO for logSymptomObservation POST request
    public static class LogSymptomObservationRequest {
        @Valid
        private SymptomObservationRequest symptomObservationRequest;
        private UUID patientId;

        public SymptomObservationRequest getSymptomObservationRequest() {
            return symptomObservationRequest;
        }

        public void setSymptomObservationRequest(SymptomObservationRequest symptomObservationRequest) {
            this.symptomObservationRequest = symptomObservationRequest;
        }

        public UUID getPatientId() {
            return patientId;
        }

        public void setPatientId(UUID patientId) {
            this.patientId = patientId;
        }
    }

    @PostMapping("/observation")
    public ResponseEntity<String> logSymptomObservation(@Valid @RequestBody LogSymptomObservationRequest request) {
        UUID patientId = request.getPatientId();
        if (patientId == null) {
            return ResponseEntity.badRequest().body("Patient ID cannot be null.");
        }

        try {
            SymptomObservationRequest obs = request.getSymptomObservationRequest();
            IntensiteSymptome intensite = new IntensiteSymptome(obs.getIntensite());
            suiviSanteService.enregistrerSymptomeObservation(patientId, obs.getNomSymptome(), intensite);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());  // <-- include error message here
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<SymptomResponse>> getAllTrackedSymptoms(@PathVariable UUID patientId) {
        try {
            List<SymptomeSuivi> symptomes = suiviSanteService.getAllTrackedSymptoms(patientId);
            List<SymptomResponse> responses = symptomes.stream()
                    .map(symptom -> symptomMapper.toSymptomResponse(symptom, patientId))
                    .toList();
            return ResponseEntity.ok(responses);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // GET endpoints keep UUID patientId in path
    @GetMapping("/patient/{patientId}/history/{nomSymptome}")
    public ResponseEntity<SymptomHistoryResponse> getSymptomHistory(
            @PathVariable UUID patientId,
            @PathVariable String nomSymptome,
            @RequestParam(defaultValue = "30") int periodInDays) {
        try {
            List<SymptomeJournalier> history = suiviSanteService.getSymptomHistory(patientId, nomSymptome);
            double trend = suiviSanteService.getSymptomTrend(patientId, nomSymptome, periodInDays);

            SymptomHistoryResponse response = new SymptomHistoryResponse(
                    nomSymptome,
                    patientId,
                    symptomMapper.toSymptomHistoryEntryList(history),
                    trend
            );
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}