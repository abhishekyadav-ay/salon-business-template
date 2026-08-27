package salon_backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import salon_backend.dto.AppointmentRequest;
import salon_backend.dto.AppointmentResponse;
import salon_backend.entity.Appointment;
import salon_backend.entity.Customer;
import salon_backend.entity.Service;
import salon_backend.entity.Staff;
import salon_backend.exception.ConflictException;
import salon_backend.notification.NotificationService;
import salon_backend.repository.AppointmentRepository;
import salon_backend.repository.CustomerRepository;
import salon_backend.repository.ServiceRepository;
import salon_backend.repository.StaffRepository;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private StaffRepository staffRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AppointmentService appointmentService;

    private Staff staff;
    private Service service;
    private Customer customer;

    @BeforeEach
    void setup() {
        staff = new Staff();
        staff.setId(1L);
        staff.setName("Ava");
        staff.setActive(true);

        customer = new Customer();
        customer.setId(10L);
        customer.setName("John Doe");
        customer.setPhone("1234567890");
        customer.setEmail("john@example.com");

        service = new Service();
        service.setId(5L);
        service.setName("Haircut");
        service.setDescription("Fresh cut");
        service.setPrice(200.0);
        service.setDurationMinutes(45);
    }

    @Test
    void createAppointment_shouldCreateCustomerAndAppointment_whenSlotAvailable() {
    LocalDate futureDate = LocalDate.now().plusDays(1);

    AppointmentRequest request = new AppointmentRequest();
        request.setCustomerName("John Doe");
        request.setCustomerPhone("1234567890");
        request.setCustomerEmail("john@example.com");
        request.setStaffId(1L);
        request.setAppointmentDate(futureDate);
        request.setAppointmentTime(LocalTime.of(10, 0));
        request.setServiceIds(List.of(5L));
        request.setNotes("Trim and style");

        when(customerRepository.findByPhone("1234567890")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(serviceRepository.findAllByIdIn(List.of(5L))).thenReturn(List.of(service));
        when(appointmentRepository.existsByStaffIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
        1L,
        futureDate,
        LocalTime.of(10, 0),
        "CANCELLED"
)).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(99L);
            return appointment;
        });

        AppointmentResponse created = appointmentService.createAppointment(request);

        assertEquals(99L, created.getId());
        assertEquals("John Doe", created.getCustomer().getName());
        assertEquals(200.0, created.getTotalPrice());
        verify(customerRepository).save(any(Customer.class));
        verify(appointmentRepository).save(any(Appointment.class));
    }

   @Test
void createAppointment_shouldRejectDuplicateSlot() {
    LocalDate futureDate = LocalDate.now().plusDays(1);

    AppointmentRequest request = new AppointmentRequest();
        request.setCustomerName("Jane Doe");
        request.setCustomerPhone("5556667777");
        request.setCustomerEmail("jane@example.com");
        request.setStaffId(1L);
        request.setAppointmentDate(futureDate);
        request.setAppointmentTime(LocalTime.of(10, 0));
        request.setServiceIds(List.of(5L));

        when(customerRepository.findByPhone("5556667777")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(new Customer());
        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(serviceRepository.findAllByIdIn(List.of(5L))).thenReturn(List.of(service));
        when(appointmentRepository.existsByStaffIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
        1L,
        futureDate,
        LocalTime.of(10, 0),
        "CANCELLED"
        )).thenReturn(true);

        assertThrows(ConflictException.class, () -> appointmentService.createAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
void getAppointments_shouldCallRepositoryWithFilters() {

    Appointment appt = new Appointment();
    appt.setId(1L);
    appt.setCustomer(customer);
    appt.setStaff(staff);
    appt.setServices(List.of(service));

    Pageable pageable = PageRequest.of(0, 10);

    when(appointmentRepository.findWithFilters(
            "CONFIRMED",
            1L,
            LocalDate.of(2026, 8, 25),
            pageable
    )).thenReturn(new PageImpl<>(List.of(appt)));

    Page<AppointmentResponse> result =
            appointmentService.getAppointments(
                    "CONFIRMED",
                    1L,
                    LocalDate.of(2026, 8, 25),
                    pageable
            );

    assertEquals(1, result.getContent().size());

    verify(appointmentRepository).findWithFilters(
            "CONFIRMED",
            1L,
            LocalDate.of(2026, 8, 25),
            pageable
    );
}

    @Test
void getAppointments_shouldRespectSortDirection() {

    Appointment appt = new Appointment();
    appt.setId(2L);
    appt.setCustomer(customer);
    appt.setStaff(staff);
    appt.setServices(List.of(service));

    Pageable descPageable = PageRequest.of(
            0,
            10,
            Sort.by("appointmentDate").descending()
    );

    when(appointmentRepository.findWithFilters(
            null,
            null,
            null,
            descPageable
    )).thenReturn(new PageImpl<>(List.of(appt)));

    Page<AppointmentResponse> result =
            appointmentService.getAppointments(
                    null,
                    null,
                    null,
                    descPageable
            );

    assertEquals(1, result.getContent().size());

    verify(appointmentRepository).findWithFilters(
            null,
            null,
            null,
            descPageable
    );
}
}
