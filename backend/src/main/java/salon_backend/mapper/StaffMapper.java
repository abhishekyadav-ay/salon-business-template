package salon_backend.mapper;

import salon_backend.dto.StaffResponse;
import salon_backend.entity.Staff;

public class StaffMapper {

    public static StaffResponse toResponse(Staff staff) {

        if (staff == null) {
            return null;
        }

        StaffResponse response = new StaffResponse();

        response.setId(staff.getId());
        response.setName(staff.getName());
        response.setRole(staff.getRole());
        response.setSpecialization(staff.getSpecialization());
        response.setActive(staff.isActive());

        return response;
    }
}