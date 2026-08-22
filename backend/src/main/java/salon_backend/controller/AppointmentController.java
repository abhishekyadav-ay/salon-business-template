package salon_backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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
import salon_backend.entity.Appointment;
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
    public Appointment create(@Valid @RequestBody AppointmentRequest request) {
        return appointmentService.createAppointment(request);
    }

    @GetMapping
    public List<Appointment> getAll() { return appointmentService.getAllAppointments(); }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) { return appointmentService.getAppointment(id); }

    @PatchMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable Long id) { return appointmentService.cancelAppointment(id); }

    @GetMapping("/available-slots")
    public List<LocalTime> availableSlots(@RequestParam Long staffId, @RequestParam LocalDate date) {
        return appointmentService.getAvailableSlots(staffId, date);
    }
}