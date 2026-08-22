package salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import salon_backend.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
}