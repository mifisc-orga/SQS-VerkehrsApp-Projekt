package de.th_ro.sqs_verkehrsapp.adapter.out.autobahn.dto.wrapper;

import java.util.List;

/**
 * Response wrapper containing the list of available road identifiers
 * returned by the Autobahn API.
 *
 * @param roads the available roads
 */
public record AutobahnRoadsResponse(List<String> roads) {
}
