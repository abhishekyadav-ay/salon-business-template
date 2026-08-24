package salon_backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import salon_backend.dto.AppointmentRequest;
import salon_backend.entity.Appointment;
import salon_backend.entity.Customer;
import salon_backend.entity.Service;
import salon_backend.entity.Staff;
import salon_backend.exception.ConflictException;
import salon_backend.exception.ResourceNotFoundException;
import salon_backend.repository.AppointmentRepository;
import salon_backend.repository.CustomerRepository;
import salon_backend.repository.ServiceRepository;
import salon_backend.repository.StaffRepository;

@org.springframework.stereotype.Service
public class AppointmentService {
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final ServiceRepository serviceRepository;
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(CustomerRepository customerRepository,
            StaffRepository staffRepository, ServiceRepository serviceRepository,
            AppointmentRepository appointmentRepository) {
        this.customerRepository = customerRepository;
        this.staffRepository = staffRepository;
        this.serviceRepository = serviceRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        validateDateAndTime(request.getAppointmentDate(), request.getAppointmentTime());

        Customer customer = customerRepository.findByPhone(request.getCustomerPhone())
            .orElseGet(Customer::new);
        customer.setName(request.getCustomerName());
        customer.setPhone(request.getCustomerPhone());
        customer.setEmail(request.getCustomerEmail());
        customer = customerRepository.save(customer);

        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));

        List<Long> requestedIds = request.getServiceIds();
        Set<Long> uniqueIds = new HashSet<>(requestedIds);
        List<Service> services = serviceRepository.findAllByIdIn(requestedIds);
        if (services.size() != uniqueIds.size()) {
            throw new ResourceNotFoundException("One or more selected services were not found");
        }

        if (appointmentRepository.existsByStaffIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                staff.getId(), request.getAppointmentDate(), request.getAppointmentTime(), "CANCELLED")) {
            throw new ConflictException("The selected staff member is already booked for this slot");
        }

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setStaff(staff);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setNotes(request.getNotes());
        appointment.setStatus("PENDING");
        appointment.setServices(services);
        return appointmentRepository.save(appointment);
    }

    public Page<Appointment> getAppointments(String status, Long staffId, LocalDate date, Pageable pageable) {
        return appointmentRepository.findWithFilters(status, staffId, date, pageable);
    }

    public Page<Appointment> getAllAppointments(Pageable pageable) { return getAppointments(null, null, null, pageable); }

    public Appointment getAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    @Transactional
    public Appointment confirmAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        if (!"PENDING".equalsIgnoreCase(appointment.getStatus())) {
            throw new IllegalArgumentException("Only PENDING appointments can be confirmed");
        }
        appointment.setStatus("CONFIRMED");
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment completeAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        if (!"CONFIRMED".equalsIgnoreCase(appointment.getStatus())) {
            throw new IllegalArgumentException("Only CONFIRMED appointments can be completed");
        }
        appointment.setStatus("COMPLETED");
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment cancelAppointment(Long id) {
        Appointment appointment = getAppointment(id);
        String currentStatus = appointment.getStatus();
        if ("COMPLETED".equalsIgnoreCase(currentStatus) || "CANCELLED".equalsIgnoreCase(currentStatus)) {
            throw new IllegalArgumentException("Cannot cancel an appointment that is " + (currentStatus != null ? currentStatus.toUpperCase() : "invalid"));
        }
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    public List<LocalTime> getAvailableSlots(Long staffId, LocalDate date) {
        staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));
        Set<LocalTime> occupied = new HashSet<>();
        appointmentRepository.findByStaffIdAndAppointmentDate(staffId, date).stream()
                .filter(appointment -> !"CANCELLED".equalsIgnoreCase(appointment.getStatus()))
                .map(Appointment::getAppointmentTime)
                .forEach(occupied::add);

        List<LocalTime> slots = new ArrayList<>();
        for (int hour = 9; hour < 18; hour++) {
            LocalTime slot = LocalTime.of(hour, 0);
            if (!occupied.contains(slot)) {
                slots.add(slot);
            }
        }
        return slots;
    }

    private void validateDateAndTime(LocalDate date, LocalTime time) {
        if (date == null || time == null || date.isBefore(LocalDate.now())
            || (date.equals(LocalDate.now()) && time.isBefore(LocalTime.now()))) {
            throw new IllegalArgumentException("Appointment date and time must be valid and not in the past");
        }
    }
}