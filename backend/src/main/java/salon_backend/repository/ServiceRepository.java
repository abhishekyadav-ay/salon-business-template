package salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import salon_backend.entity.Service;

public interface ServiceRepository
        extends JpaRepository<Service, Long> {

        java.util.List<Service> findAllByIdIn(java.util.Collection<Long> ids);
}