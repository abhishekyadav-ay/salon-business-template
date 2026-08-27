package salon_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import salon_backend.dto.StaffResponse;
import salon_backend.mapper.StaffMapper;
import salon_backend.repository.StaffRepository;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(StaffMapper::toResponse)
                .toList();
    }
}