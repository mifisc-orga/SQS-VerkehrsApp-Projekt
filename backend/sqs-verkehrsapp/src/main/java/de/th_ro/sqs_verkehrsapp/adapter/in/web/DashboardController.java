package de.th_ro.sqs_verkehrsapp.adapter.in.web;


import de.th_ro.sqs_verkehrsapp.application.port.in.DashboardTrafficUseCase;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoadTrafficResult;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller providing dashboard-related traffic information.
 * Allows authenticated users to retrieve traffic data for their saved roads.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardTrafficUseCase dashboardTrafficUseCase;

    /**
     * Retrieves current traffic information for all roads saved by the
     * authenticated user.
     *
     * @param authentication the authentication object containing the user's identity
     * @return a list of traffic results for the user's saved roads
     */
    @GetMapping("/saved-road-traffic")
    public List<SavedRoadTrafficResult> getSavedRoadTraffic(
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        return dashboardTrafficUseCase.getTrafficForSavedRoads(userId);
    }
}
