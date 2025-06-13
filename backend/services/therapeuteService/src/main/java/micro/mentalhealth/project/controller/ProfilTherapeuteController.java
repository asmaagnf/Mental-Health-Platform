package micro.mentalhealth.project.controller;

import jakarta.persistence.EntityNotFoundException;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteRequest;
import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteResponse;
import micro.mentalhealth.project.service.ProfilTherapeuteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/therapeutes/profiles")
@Validated
public class ProfilTherapeuteController {

    private final ProfilTherapeuteService profilTherapeuteService;

    @Autowired
    public ProfilTherapeuteController(ProfilTherapeuteService profilTherapeuteService) {
        this.profilTherapeuteService = profilTherapeuteService;
    }

    @PostMapping("/initial-create/{userId}")
    public ResponseEntity<ProfilTherapeuteResponse> createInitialProfil(
            @PathVariable UUID userId,
            @Valid @RequestBody ProfilTherapeuteRequest request) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.createInitialProfil(userId, request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }
    // New endpoint for uploading diploma images
    @PostMapping("/{userId}/diplomas/upload")
    public ResponseEntity<String> uploadDiplomaImage(
            @PathVariable UUID userId,
            @RequestParam("diplomaTitle") String diplomaTitle,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = profilTherapeuteService.uploadDiplomaImage(userId, diplomaTitle, file);
            return new ResponseEntity<>(imageUrl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/all/valides")
    public ResponseEntity<List<ProfilTherapeuteResponse>> getProfilsValides() {
        List<ProfilTherapeuteResponse> responses = profilTherapeuteService.getProfilsByStatutValide();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<ProfilTherapeuteResponse>> getAllProfils() {
        List<ProfilTherapeuteResponse> responses = profilTherapeuteService.getAllProfils();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<ProfilTherapeuteResponse> updateProfil(@PathVariable UUID userId,
                                                                 @Valid @RequestBody ProfilTherapeuteRequest request) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.updateProfil(userId, request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ProfilTherapeuteResponse> getProfilByUserId(@PathVariable UUID userId) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.getProfilByUserId(userId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{userId}/price")
    public ResponseEntity<Double> getPrixParHeureByUserId(@PathVariable UUID userId) {
        try {
            Double prixParHeure = profilTherapeuteService.getPrixParHeureByUserId(userId);
            return new ResponseEntity<>(prixParHeure, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{profilId}")
    public ResponseEntity<ProfilTherapeuteResponse> getProfilById(@PathVariable UUID profilId) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.getProfilById(profilId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/{profilId}/validate")
    public ResponseEntity<ProfilTherapeuteResponse> validateProfil(@PathVariable UUID profilId) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.validateProfil(profilId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{profilId}/reject")
    public ResponseEntity<ProfilTherapeuteResponse> rejectProfil(@PathVariable UUID profilId,
                                                                 @RequestParam(required = false) String reason) {
        try {
            ProfilTherapeuteResponse response = profilTherapeuteService.rejectProfil(profilId, reason);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}
