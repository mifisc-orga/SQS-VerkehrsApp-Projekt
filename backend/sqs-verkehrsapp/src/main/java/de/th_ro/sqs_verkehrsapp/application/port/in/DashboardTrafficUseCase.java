package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.SavedRoadTrafficResult;

import java.util.List;
import java.util.UUID;

public interface DashboardTrafficUseCase {

    List<SavedRoadTrafficResult> getTrafficForSavedRoads(UUID userId);
}
