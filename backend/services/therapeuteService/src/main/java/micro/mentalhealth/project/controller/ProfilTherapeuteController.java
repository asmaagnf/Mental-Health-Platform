package micro.mentalhealth.project.controller;

import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.ProfilTherapeuteDTO;
import micro.mentalhealth.project.model.StatutTherapeute;
import micro.mentalhealth.project.service.ProfilTherapeuteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/therapeutes")
@RequiredArgsConstructor
public class ProfilTherapeuteController {

    private final ProfilTherapeuteService service;

    @PostMapping
    public ResponseEntity<ProfilTherapeuteDTO> createProfil(@RequestBody ProfilTherapeuteDTO dto) {
        ProfilTherapeuteDTO created = service.createProfil(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfilTherapeuteDTO> updateProfil(@PathVariable UUID id, @RequestBody ProfilTherapeuteDTO dto) {
        ProfilTherapeuteDTO updated = service.updateProfil(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfilTherapeuteDTO> getProfil(@PathVariable UUID id) {
        ProfilTherapeuteDTO profil = service.getById(id);
        return ResponseEntity.ok(profil);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Void> changerStatut(@PathVariable UUID id, @RequestParam StatutTherapeute statut) {
        service.changerStatut(id, statut);
        return ResponseEntity.noContent().build();  // 204 No Content
    }

    @PutMapping("/{id}/localisation")
    public ResponseEntity<Void> updateLocalisation(@PathVariable UUID id, @RequestParam String adresse) {
        service.updateLocalisation(id, adresse);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/certifications")
    public ResponseEntity<Void> ajouterCertification(@PathVariable UUID id, @RequestParam MultipartFile file) throws IOException {
        service.addCertification(id, file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<ProfilTherapeuteDTO>> getAll() {
        List<ProfilTherapeuteDTO> profils = service.getAllProfils();
        return ResponseEntity.ok(profils);
    }

    @GetMapping("/statut")
    public ResponseEntity<List<ProfilTherapeuteDTO>> getByStatut(@RequestParam StatutTherapeute statut) {
        List<ProfilTherapeuteDTO> profils = service.getByStatut(statut);
        return ResponseEntity.ok(profils);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfil(@PathVariable UUID id) {
        service.deleteProfil(id);
        return ResponseEntity.noContent().build();
    }
}
