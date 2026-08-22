package salon_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import salon_backend.entity.Staff;
import salon_backend.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffService staffService;

    public StaffController(StaffService staffService) { this.staffService = staffService; }

    @GetMapping
    public List<Staff> getAllStaff() { return staffService.getAllStaff(); }
}