package salon_backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import salon_backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByStaffIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long staffId, LocalDate appointmentDate, LocalTime appointmentTime, String status);

    List<Appointment> findByStaffIdAndAppointmentDate(Long staffId, LocalDate appointmentDate);
}