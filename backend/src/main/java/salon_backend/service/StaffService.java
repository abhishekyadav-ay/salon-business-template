package salon_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import salon_backend.entity.Staff;
import salon_backend.repository.StaffRepository;

@Service
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
}