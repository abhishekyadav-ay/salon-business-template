package salon_backend.service;

import java.util.List;

import salon_backend.entity.Service;
import salon_backend.repository.ServiceRepository;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    public Service getServiceById(Long id) {
    return serviceRepository.findById(id).orElse(null);
}
   public Service createService(Service service) {
    return serviceRepository.save(service);
}
   public Service updateService(Long id, Service service) {
    Service existingService = serviceRepository.findById(id).orElse(null);

    if (existingService == null) {
        return null;
    }

    existingService.setName(service.getName());
    existingService.setDescription(service.getDescription());
    existingService.setPrice(service.getPrice());
    existingService.setDurationMinutes(service.getDurationMinutes());

    return serviceRepository.save(existingService);
}
}