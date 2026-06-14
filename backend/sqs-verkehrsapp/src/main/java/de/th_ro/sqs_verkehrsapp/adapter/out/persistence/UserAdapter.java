package de.th_ro.sqs_verkehrsapp.adapter.out.persistence;

import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.entity.UserEntity;
import de.th_ro.sqs_verkehrsapp.adapter.out.persistence.repository.UserRepository;
import de.th_ro.sqs_verkehrsapp.application.port.out.UserPort;
import de.th_ro.sqs_verkehrsapp.domain.model.AppUser;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Persistence adapter for application users.
 * <p>
 * Implements {@link UserPort} using Spring Data JPA and is responsible
 * for mapping between domain models and persistence entities.
 */
@Component
@RequiredArgsConstructor
public class UserAdapter implements UserPort {

    private final UserRepository repository;

    @Override
    public AppUser save(AppUser user) {

        UserEntity entity = UserEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .passwordHash(user.getPasswordHash())
                .build();

        return mapToDomain(repository.save(entity));
    }

    @Override
    public Optional<AppUser> findByUsername(String username) {
        return repository.findByUsername(username)
                .map(this::mapToDomain);
    }

    @Override
    public boolean existsByUsername(String username) {
        return repository.existsByUsername(username);
    }

    /**
     * Converts a user entity into the corresponding domain model.
     *
     * @param entity the persistence entity
     * @return the domain model
     */
    private AppUser mapToDomain(UserEntity entity) {
        return AppUser.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .passwordHash(entity.getPasswordHash())
                .build();
    }
}
