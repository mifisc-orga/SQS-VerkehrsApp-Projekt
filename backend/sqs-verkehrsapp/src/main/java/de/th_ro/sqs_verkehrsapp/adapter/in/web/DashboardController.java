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

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardTrafficUseCase dashboardTrafficUseCase;

    @GetMapping("/saved-road-traffic")
    public List<SavedRoadTrafficResult> getSavedRoadTraffic(
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        return dashboardTrafficUseCase.getTrafficForSavedRoads(userId);
    }
}
