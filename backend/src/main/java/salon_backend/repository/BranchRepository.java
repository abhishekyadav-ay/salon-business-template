package salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import salon_backend.entity.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {

}