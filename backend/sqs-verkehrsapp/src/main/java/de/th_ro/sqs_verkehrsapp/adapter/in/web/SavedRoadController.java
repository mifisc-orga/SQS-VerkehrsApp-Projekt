package de.th_ro.sqs_verkehrsapp.adapter.in.web;


import de.th_ro.sqs_verkehrsapp.application.port.in.SavedRoadUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing roads saved by authenticated users.
 * Provides endpoints to create, retrieve, and delete saved roads.
 */
@RestController
@RequestMapping("/api/saved-roads")
@RequiredArgsConstructor
public class SavedRoadController {

    private final SavedRoadUseCase savedRoadUseCase;

    /**
     * Saves a road for the authenticated user.
     *
     * @param request the request containing the road identifier
     * @param authentication the authentication object containing the user's identity
     * @return the created saved road
     */
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

    /**
     * Retrieves all roads saved by the authenticated user.
     *
     * @param authentication the authentication object containing the user's identity
     * @return a list of saved roads
     */
    @GetMapping
    public List<SavedRoad> getSavedRoads(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());

        return savedRoadUseCase.getSavedRoads(userId);
    }

    /**
     * Deletes a saved road for the authenticated user.
     *
     * @param roadId the identifier of the road to delete
     * @param authentication the authentication object containing the user's identity
     */
    @DeleteMapping("/{roadId}")
    public void deleteRoad(
            @PathVariable String roadId,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        savedRoadUseCase.deleteRoad(userId, roadId);
    }

    /**
     * Request object used to save a road for a user.
     *
     * @param roadId the identifier of the road to save
     */
    public record SaveRoadRequest(
            String roadId
    ) {
    }
}
