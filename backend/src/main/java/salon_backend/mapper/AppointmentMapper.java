package salon_backend.mapper;

import java.util.List;

import salon_backend.dto.AppointmentResponse;
import salon_backend.dto.CustomerResponse;
import salon_backend.dto.ServiceResponse;
import salon_backend.dto.StaffResponse;
import salon_backend.entity.Appointment;
import salon_backend.entity.Customer;
import salon_backend.entity.Service;
import salon_backend.entity.Staff;

public class AppointmentMapper {

    public static AppointmentResponse toResponse(Appointment appointment) {

        AppointmentResponse response = new AppointmentResponse();

        response.setId(appointment.getId());
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setStatus(appointment.getStatus());
        response.setNotes(appointment.getNotes());
        response.setTotalPrice(appointment.getTotalPrice());

        response.setCustomer(toCustomerResponse(appointment.getCustomer()));
        response.setStaff(toStaffResponse(appointment.getStaff()));

        List<ServiceResponse> services = appointment.getServices()
                .stream()
                .map(AppointmentMapper::toServiceResponse)
                .toList();

        response.setServices(services);

        return response;
    }

    private static CustomerResponse toCustomerResponse(Customer customer) {

        CustomerResponse response = new CustomerResponse();

        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());

        return response;
    }

    private static StaffResponse toStaffResponse(Staff staff) {

        if (staff == null) {
            return null;
        }

        StaffResponse response = new StaffResponse();

        response.setId(staff.getId());
        response.setName(staff.getName());
        response.setRole(staff.getRole());
        response.setSpecialization(staff.getSpecialization());

        return response;
    }

    private static ServiceResponse toServiceResponse(Service service) {

        ServiceResponse response = new ServiceResponse();

        response.setId(service.getId());
        response.setName(service.getName());
        response.setDescription(service.getDescription());
        response.setPrice(service.getPrice());
        response.setDurationMinutes(service.getDurationMinutes());

        return response;
    }
}