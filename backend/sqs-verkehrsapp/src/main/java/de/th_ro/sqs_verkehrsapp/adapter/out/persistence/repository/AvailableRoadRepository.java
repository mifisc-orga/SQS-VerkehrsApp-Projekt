package de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.AvailableRoadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing cached available motorways.
 * <p>
 * Provides CRUD operations for {@link AvailableRoadEntity}
 * using Spring Data JPA.
 */
public interface AvailableRoadRepository extends JpaRepository<AvailableRoadEntity, String> {
}
