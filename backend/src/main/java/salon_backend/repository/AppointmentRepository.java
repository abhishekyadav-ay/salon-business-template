package salon_backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import salon_backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByStaffIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long staffId, LocalDate appointmentDate, LocalTime appointmentTime, String status);

    List<Appointment> findByStaffIdAndAppointmentDate(Long staffId, LocalDate appointmentDate);

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:status IS NULL OR LOWER(a.status) = LOWER(:status)) AND " +
           "(:staffId IS NULL OR a.staff.id = :staffId) AND " +
           "(:date IS NULL OR a.appointmentDate = :date)")
    Page<Appointment> findWithFilters(
            @Param("status") String status,
            @Param("staffId") Long staffId,
            @Param("date") LocalDate date,
            Pageable pageable);
}