package de.th_ro.sqs_verkehrsapp.application.port.out;

import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;
import java.util.List;

/**
 * Output port for accessing traffic data from the Autobahn API.
 * <p>
 * Defines the operations required to retrieve traffic events and
 * available motorway identifiers from the external Autobahn API.
 */
public interface AutobahnApiPort {

    /**
     * Retrieves traffic events for a specific motorway.
     *
     * @param roadId the motorway identifier
     * @return the traffic events result for the specified motorway
     */
    TrafficEventsResult getTrafficEvents(String roadId);

    /**
     * Retrieves traffic events for all available motorways.
     *
     * @return the traffic events result containing events from all available motorways
     */
    TrafficEventsResult getAllTrafficEvents();

    /**
     * Retrieves all available motorway identifiers from the Autobahn API.
     *
     * @return a list of available motorway identifiers
     */
    List<String> getAvailableRoadIds();
}
