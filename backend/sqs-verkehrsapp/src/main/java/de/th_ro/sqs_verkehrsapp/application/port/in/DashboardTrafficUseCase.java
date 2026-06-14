package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoadTrafficResult;
import java.util.List;
import java.util.UUID;

/**
 * Input port for dashboard-related traffic use cases.
 * <p>
 * Defines the application use case for retrieving traffic information
 * for a user's saved motorways.
 */
public interface DashboardTrafficUseCase {

    /**
     * Retrieves traffic information for all motorways saved by a user.
     *
     * @param userId the user identifier
     * @return a list containing traffic information for the user's saved motorways
     */
    List<SavedRoadTrafficResult> getTrafficForSavedRoads(UUID userId);
}
