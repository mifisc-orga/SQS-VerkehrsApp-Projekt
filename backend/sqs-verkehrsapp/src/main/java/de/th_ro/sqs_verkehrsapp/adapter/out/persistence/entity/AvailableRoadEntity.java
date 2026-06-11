package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * JPA entity for persisting available motorways.
 * <p>
 * Each instance represents a motorway identifier (e.g. A3, A8)
 * that is retrieved from the Autobahn API and stored locally.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "available_roads")
public class AvailableRoadEntity {

    @Id
    private String roadId;
}
