package de.th_ro.sqs_verkehrsapp.application.port.in;

import de.th_ro.sqs_verkehrsapp.domain.model.TrafficEventsResult;

/**
 * Input port for traffic information queries.
 * <p>
 * Defines the application use cases for retrieving traffic events
 * for a specific motorway or for all available motorways.
 */
public interface TrafficQueryUseCase {

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
}
