package micro.mentalhealth.project.controller;

import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.SeanceDTO;
import micro.mentalhealth.project.model.TypeSeance;
import micro.mentalhealth.project.service.SeanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/seances")
@RequiredArgsConstructor
public class SeanceController {
    @Autowired
    private  SeanceService seanceService;

    @GetMapping
    public List<SeanceDTO> getAllSeances() {
        return seanceService.getAllSeances();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeanceDTO> getSeanceById(@PathVariable UUID id) {
        return seanceService.getSeanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/therapeute/{therapeuteId}")
    public List<SeanceDTO> getSeancesByTherapeuteId(@PathVariable UUID therapeuteId) {
        return seanceService.getSeancesByTherapeuteId(therapeuteId);
    }

    @GetMapping("/patient/{patientId}")
    public List<SeanceDTO> getSeancesByPatientId(@PathVariable UUID patientId) {
        return seanceService.getSeancesByPatientId(patientId);
    }

    @PostMapping
    public SeanceDTO createSeance(@RequestBody SeanceDTO dto) {
        return seanceService.createSeance(dto);
    }

    @PutMapping("/{id}")
    public SeanceDTO updateSeance(@PathVariable UUID id, @RequestBody SeanceDTO dto) {
        return seanceService.updateSeance(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSeance(@PathVariable UUID id) {
        seanceService.deleteSeance(id);
    }

    @GetMapping("/preview-price")
    public ResponseEntity<Float> previewPrice(
            @RequestParam UUID therapistId,
            @RequestParam int dureeMinutes) {
        float amount = seanceService.calculateAmount(therapistId, dureeMinutes);
        return ResponseEntity.ok(amount);
    }

    /**
     * Create a pending seance before payment (you should expose this endpoint to create the seance in EN_ATTENTE_PAIEMENT status).
     */
    @PostMapping("/pending")
    public ResponseEntity<SeanceDTO> createPendingSeance(
            @RequestParam UUID therapistId,
            @RequestParam UUID patientId,
            @RequestParam String dateTime,
            @RequestParam int dureeMinutes,
            @RequestParam TypeSeance typeSeance
    ) {
        try {
            LocalDateTime dt = LocalDateTime.parse(dateTime);
            SeanceDTO seanceDTO = seanceService.createPendingSeance(therapistId, patientId, dt, dureeMinutes, typeSeance);
            return ResponseEntity.ok(seanceDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Confirm seance after payment is done (only needs seanceId and paymentId now).
     */
    @PostMapping("/confirm")
    public ResponseEntity<SeanceDTO> confirmSeance(
            @RequestParam UUID seanceId,
            @RequestParam UUID paymentId
    ) {
        try {
            SeanceDTO seanceDTO = seanceService.confirmSeanceAfterPayment(seanceId, paymentId);
            return ResponseEntity.ok(seanceDTO);
        } catch (IllegalArgumentException | DateTimeParseException ex) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}/note")
    public SeanceDTO ajouterNoteTherapeute(@PathVariable UUID id, @RequestBody String note) {
        return seanceService.ajouterNote(id, note);
    }

    @PutMapping("/{id}/annuler")
    public SeanceDTO annulerSeance(@PathVariable UUID id, @RequestParam String motif) {
        return seanceService.annulerSeance(id, motif);
    }

    @PutMapping("/{id}/terminer")
    public SeanceDTO terminerSeance(@PathVariable UUID id) {
        return seanceService.terminerSeance(id);
    }
}
