package de.th_ro.sqs_verkehrsapp.application.service;

import de.th_ro.sqs_verkehrsapp.application.port.in.DashboardTrafficUseCase;
import de.th_ro.sqs_verkehrsapp.application.port.out.SavedRoadPort;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoad;
import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoadTrafficResult;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service implementation of {@link DashboardTrafficUseCase}.
 * <p>
 * Retrieves traffic information for all motorways saved by a user
 * and prepares the data for display on the dashboard.
 */
@Service
@RequiredArgsConstructor
public class DashboardTrafficService implements DashboardTrafficUseCase {

    private final SavedRoadPort savedRoadPort;
    private final TrafficService trafficService;

    /**
     * Retrieves traffic information for all motorways saved by a user.
     *
     * @param userId the user identifier
     * @return a list containing traffic information for the user's saved motorways
     */
    @Override
    public List<SavedRoadTrafficResult> getTrafficForSavedRoads(UUID userId) {

        List<SavedRoad> savedRoads =
                savedRoadPort.findByUserId(userId);

        return savedRoads.stream()
                .map(savedRoad -> new SavedRoadTrafficResult(
                        savedRoad.getRoadId(),
                        trafficService.getTrafficEvents(savedRoad.getRoadId())
                ))
                .toList();
    }
}
