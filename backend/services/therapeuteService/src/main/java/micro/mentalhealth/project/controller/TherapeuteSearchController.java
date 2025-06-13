package micro.mentalhealth.project.controller;

import micro.mentalhealth.project.dto.profiltherapeute.ProfilTherapeuteResponse;
import micro.mentalhealth.project.dto.profiltherapeute.TherapeuteSearchRequest;
import micro.mentalhealth.project.service.TherapeuteSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/therapeutes/search")
public class TherapeuteSearchController {

    private final TherapeuteSearchService therapeuteSearchService;

    @Autowired
    public TherapeuteSearchController(TherapeuteSearchService therapeuteSearchService) {
        this.therapeuteSearchService = therapeuteSearchService;
    }

    @GetMapping
    public ResponseEntity<List<ProfilTherapeuteResponse>> searchTherapeutes(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String localisation,
            @RequestParam(required = false) String langue,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Double maxPricePerHour) {

        TherapeuteSearchRequest request = new TherapeuteSearchRequest(specialty, localisation, langue, minExperience, maxPricePerHour);
        List<ProfilTherapeuteResponse> response = therapeuteSearchService.searchTherapeutes(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all-valid")
    public ResponseEntity<List<ProfilTherapeuteResponse>> getAllValidatedTherapeutes() {
        List<ProfilTherapeuteResponse> response = therapeuteSearchService.getAllValidatedTherapeutes();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
