package salon_backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import salon_backend.dto.AppointmentRequest;
import salon_backend.entity.Appointment;
import salon_backend.entity.Customer;
import salon_backend.entity.Service;
import salon_backend.entity.Staff;
import salon_backend.exception.ConflictException;
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
        staff.setIsActive(true);

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
        AppointmentRequest request = new AppointmentRequest();
        request.setCustomerName("John Doe");
        request.setCustomerPhone("1234567890");
        request.setCustomerEmail("john@example.com");
        request.setStaffId(1L);
        request.setAppointmentDate(LocalDate.of(2026, 8, 25));
        request.setAppointmentTime(LocalTime.of(10, 0));
        request.setServiceIds(List.of(5L));
        request.setNotes("Trim and style");

        when(customerRepository.findByPhone("1234567890")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(serviceRepository.findAllByIdIn(List.of(5L))).thenReturn(List.of(service));
        when(appointmentRepository.existsByStaffIdAndAppointmentDateAndAppointmentTime(1L,
                LocalDate.of(2026, 8, 25), LocalTime.of(10, 0))).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(99L);
            return appointment;
        });

        Appointment created = appointmentService.createAppointment(request);

        assertEquals(99L, created.getId());
        assertEquals("John Doe", created.getCustomer().getName());
        assertEquals(200.0, created.getTotalPrice());
        verify(customerRepository).save(any(Customer.class));
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void createAppointment_shouldRejectDuplicateSlot() {
        AppointmentRequest request = new AppointmentRequest();
        request.setCustomerName("Jane Doe");
        request.setCustomerPhone("5556667777");
        request.setCustomerEmail("jane@example.com");
        request.setStaffId(1L);
        request.setAppointmentDate(LocalDate.of(2026, 8, 25));
        request.setAppointmentTime(LocalTime.of(10, 0));
        request.setServiceIds(List.of(5L));

        when(customerRepository.findByPhone("5556667777")).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(new Customer());
        when(staffRepository.findById(1L)).thenReturn(Optional.of(staff));
        when(serviceRepository.findAllByIdIn(List.of(5L))).thenReturn(List.of(service));
        when(appointmentRepository.existsByStaffIdAndAppointmentDateAndAppointmentTime(1L,
                LocalDate.of(2026, 8, 25), LocalTime.of(10, 0))).thenReturn(true);

        assertThrows(ConflictException.class, () -> appointmentService.createAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
