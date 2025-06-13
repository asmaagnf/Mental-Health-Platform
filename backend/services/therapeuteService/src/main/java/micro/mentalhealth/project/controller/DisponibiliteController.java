package micro.mentalhealth.project.controller;

import micro.mentalhealth.project.dto.disponibilite.DisponibiliteRequest;
import micro.mentalhealth.project.dto.disponibilite.DisponibiliteResponse;
import micro.mentalhealth.project.service.DisponibiliteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/therapeutes")
@Validated
public class DisponibiliteController {

    private final DisponibiliteService disponibiliteService;

    @Autowired
    public DisponibiliteController(DisponibiliteService disponibiliteService) {
        this.disponibiliteService = disponibiliteService;
    }

    @PostMapping("/{therapeuteId}/disponibilites")
    public ResponseEntity<DisponibiliteResponse> addDisponibilite(@PathVariable UUID therapeuteId,
                                                                  @Valid @RequestBody DisponibiliteRequest request) {
        try {
            DisponibiliteResponse response = disponibiliteService.addDisponibilite(therapeuteId, request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/disponibilites/{disponibiliteId}")
    public ResponseEntity<DisponibiliteResponse> updateDisponibilite(@PathVariable UUID disponibiliteId,
                                                                     @Valid @RequestBody DisponibiliteRequest request) {
        try {
            DisponibiliteResponse response = disponibiliteService.updateDisponibilite(disponibiliteId, request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/disponibilites/{disponibiliteId}")
    public ResponseEntity<Void> deleteDisponibilite(@PathVariable UUID disponibiliteId) {
        try {
            disponibiliteService.deleteDisponibilite(disponibiliteId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{therapeuteId}/disponibilites")
    public ResponseEntity<List<DisponibiliteResponse>> getDisponibilitesByTherapeuteId(@PathVariable UUID therapeuteId) {
        try {
            List<DisponibiliteResponse> response = disponibiliteService.getDisponibilitesByTherapeuteId(therapeuteId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/disponibilites/{id}")
    public ResponseEntity<DisponibiliteResponse> getDisponibiliteById(@PathVariable UUID id) {
        try {
            DisponibiliteResponse response = disponibiliteService.getDisponibiliteById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
