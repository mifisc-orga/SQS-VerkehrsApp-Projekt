package de.th_ro.sqs_verkehrsapp.domain.model;

/**
 * Represents traffic information for a motorway saved by a user.
 *
 * @param roadId identifier of the saved motorway
 * @param trafficEvents traffic events associated with the motorway
 */
public record SavedRoadTrafficResult( String roadId,
                                      TrafficEventsResult trafficEvents) {
}
