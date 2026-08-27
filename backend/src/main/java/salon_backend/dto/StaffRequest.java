package salon_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class StaffRequest {

    @NotBlank(message = "Staff name is required")
    @Size(max = 100, message = "Staff name must not exceed 100 characters")
    private String name;

    @Size(max = 100, message = "Role must not exceed 100 characters")
    private String role;

    @Size(max = 150, message = "Specialization must not exceed 150 characters")
    private String specialization;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}