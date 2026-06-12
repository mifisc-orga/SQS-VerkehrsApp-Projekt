package de.th_ro.sqs_verkehrsapp.domain.model;

/**
 * Represents the type of a traffic event.
 * <p>
 * Used to categorize traffic events and determine their impact
 * on traffic conditions and risk assessment.
 */
public enum RoadEventType {
    WARNING,
    ROADWORK,
    CLOSURE
}
