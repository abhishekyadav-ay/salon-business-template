package salon_backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import salon_backend.dto.AppointmentRequest;
import salon_backend.dto.AppointmentResponse;
import salon_backend.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse create(
            @Valid @RequestBody AppointmentRequest request) {

        return appointmentService.createAppointment(request);
    }

    @GetMapping
    public Page<AppointmentResponse> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDate") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return appointmentService.getAppointments(
                status,
                staffId,
                date,
                pageable
        );
    }

    @GetMapping("/{id}")
    public AppointmentResponse getById(@PathVariable Long id) {
        return appointmentService.getAppointment(id);
    }

    @PatchMapping("/{id}/confirm")
    public AppointmentResponse confirm(@PathVariable Long id) {
        return appointmentService.confirmAppointment(id);
    }

    @PatchMapping("/{id}/complete")
    public AppointmentResponse complete(@PathVariable Long id) {
        return appointmentService.completeAppointment(id);
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }

    @GetMapping("/available-slots")
    public List<LocalTime> availableSlots(
            @RequestParam Long staffId,
            @RequestParam LocalDate date) {

        return appointmentService.getAvailableSlots(staffId, date);
    }
}