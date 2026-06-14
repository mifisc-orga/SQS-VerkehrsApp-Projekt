package de.th_ro.sqs_verkehrsapp.domain.model;

/**
 * Represents a geographic coordinate consisting of latitude and longitude.
 *
 * @param latitude the geographic latitude
 * @param longitude the geographic longitude
 */
public record Coordinate(double latitude, double longitude) {
}
