package micro.mentalhealth.project.controller;

import micro.mentalhealth.project.dto.mood.MoodEntryRequest;
import micro.mentalhealth.project.dto.mood.MoodEntryResponse;
import micro.mentalhealth.project.mapper.MoodEntryMapper;
import micro.mentalhealth.project.model.HumeurJournalisee;
import micro.mentalhealth.project.service.SuiviSanteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health-tracking/mood-entries")
public class MoodEntryController {

    private final SuiviSanteService suiviSanteService;
    private final MoodEntryMapper moodEntryMapper;

    public MoodEntryController(SuiviSanteService suiviSanteService, MoodEntryMapper moodEntryMapper) {
        this.suiviSanteService = suiviSanteService;
        this.moodEntryMapper = moodEntryMapper;
    }

    // For createMoodEntry, accept patientId inside the request body, so define a new DTO for that or extend existing one
    public static class CreateMoodEntryRequest {
        @Valid
        private MoodEntryRequest moodEntryRequest;
        private UUID patientId;

        public MoodEntryRequest getMoodEntryRequest() {
            return moodEntryRequest;
        }

        public void setMoodEntryRequest(MoodEntryRequest moodEntryRequest) {
            this.moodEntryRequest = moodEntryRequest;
        }

        public UUID getPatientId() {
            return patientId;
        }

        public void setPatientId(UUID patientId) {
            this.patientId = patientId;
        }
    }

    @PostMapping
    public ResponseEntity<MoodEntryResponse> createMoodEntry(
            @Valid @RequestBody CreateMoodEntryRequest requestBody) {
        try {
            UUID patientId = requestBody.getPatientId();
            if (patientId == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            HumeurJournalisee humeur = moodEntryMapper.toHumeurJournalisee(requestBody.getMoodEntryRequest());
            HumeurJournalisee savedHumeur = suiviSanteService.enregistrerHumeur(patientId, humeur);
            MoodEntryResponse response = moodEntryMapper.toMoodEntryResponse(savedHumeur, patientId);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // For GET requests, the patientId can remain in the path as UUID
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MoodEntryResponse>> getMoodEntriesByPatient(@PathVariable UUID patientId) {
        try {
            List<HumeurJournalisee> humeurs = suiviSanteService.getHumeurHistory(patientId);
            List<MoodEntryResponse> responses = humeurs.stream()
                    .map(h -> moodEntryMapper.toMoodEntryResponse(h, patientId))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(responses, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/patient/{patientId}/average")
    public ResponseEntity<Double> getMoodAverage(
            @PathVariable UUID patientId,
            @RequestParam(defaultValue = "7") int lastDays) {
        try {
            double average = suiviSanteService.getMoodAverage(patientId, lastDays);
            return new ResponseEntity<>(average, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
