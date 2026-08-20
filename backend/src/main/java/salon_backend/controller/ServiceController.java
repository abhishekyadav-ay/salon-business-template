package salon_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import salon_backend.entity.Service;
import salon_backend.service.ServiceService;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public List<Service> getAllServices() {
        return serviceService.getAllServices();
    }
    @GetMapping("/{id}")
    public Service getServiceById(@PathVariable Long id) {
    return serviceService.getServiceById(id);
} 
    @PostMapping
     public Service createService(@RequestBody Service service) {
     return serviceService.createService(service);
     }
     @PutMapping("/{id}")
    public Service updateService(
        @PathVariable Long id,
        @RequestBody Service service) {

    return serviceService.updateService(id, service);
}
}