package salon_backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class AppointmentRequest {
    @NotBlank private String customerName;
    @NotBlank private String customerPhone;
    @Email private String customerEmail;
    @NotNull private Long staffId;
    @NotNull private LocalDate appointmentDate;
    @NotNull private LocalTime appointmentTime;
    @NotEmpty private List<Long> serviceIds;
    private String notes;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String value) { customerName = value; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String value) { customerPhone = value; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String value) { customerEmail = value; }
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long value) { staffId = value; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate value) { appointmentDate = value; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime value) { appointmentTime = value; }
    public List<Long> getServiceIds() { return serviceIds; }
    public void setServiceIds(List<Long> value) { serviceIds = value; }
    public String getNotes() { return notes; }
    public void setNotes(String value) { notes = value; }
}