package de.th_ro.sqs_verkehrsapp.adapter.in.web;


import de.th_ro.sqs_verkehrsapp.application.port.in.SavedRoadUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saved-roads")
@RequiredArgsConstructor
public class SavedRoadController {

    private final SavedRoadUseCase savedRoadUseCase;

    @PostMapping
    public SavedRoad saveRoad(
            @RequestBody SaveRoadRequest request,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        return savedRoadUseCase.saveRoad(
                userId,
                request.roadId()
        );
    }

    @GetMapping
    public List<SavedRoad> getSavedRoads(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());

        return savedRoadUseCase.getSavedRoads(userId);
    }

    @DeleteMapping("/{roadId}")
    public void deleteRoad(
            @PathVariable String roadId,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        savedRoadUseCase.deleteRoad(userId, roadId);
    }

    public record SaveRoadRequest(
            String roadId
    ) {
    }
}
