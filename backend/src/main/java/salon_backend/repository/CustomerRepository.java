package salon_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import salon_backend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}