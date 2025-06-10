package micro.mentalhealth.project.controller;

import lombok.RequiredArgsConstructor;
import micro.mentalhealth.project.dto.DisponibiliteDto;
import micro.mentalhealth.project.service.DisponibiliteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/disponibilites")
@RequiredArgsConstructor
public class DisponibiliteController {

    private final DisponibiliteService service;

    @GetMapping("/therapeute/{id}")
    public List<DisponibiliteDto> getByTherapeute(@PathVariable UUID id) {
        return service.getDisponibilitesByTherapeute(id);
    }

    @PostMapping
    public DisponibiliteDto create(@RequestBody DisponibiliteDto dto) {
        return service.addDisponibilite(dto);
    }
    @PutMapping("/{id}")
    public DisponibiliteDto updateDisponibilite(@PathVariable UUID id, @RequestBody DisponibiliteDto dto) {
        return service.updateDisponibilite(id, dto);
    }

    @GetMapping("/{id}")
    public DisponibiliteDto getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.deleteDisponibilite(id);
    }

}

