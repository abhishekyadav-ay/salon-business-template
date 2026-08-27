package salon_backend.notification;

import org.springframework.stereotype.Service;

import salon_backend.entity.Appointment;

@Service
public class ConsoleNotificationService implements NotificationService {

    @Override
    public void sendNewAppointmentNotification(Appointment appointment) {

        System.out.println("=================================");
        System.out.println("NEW APPOINTMENT");
        System.out.println("Appointment ID: " + appointment.getId());
        System.out.println("Customer: " + appointment.getCustomer().getName());
        System.out.println("Phone: " + appointment.getCustomer().getPhone());
        System.out.println("Staff: " + appointment.getStaff().getName());
        System.out.println("Date: " + appointment.getAppointmentDate());
        System.out.println("Time: " + appointment.getAppointmentTime());
        System.out.println("=================================");
    }

    @Override
    public void sendAppointmentConfirmedNotification(Appointment appointment) {

        System.out.println("=================================");
        System.out.println("APPOINTMENT CONFIRMED");
        System.out.println("Customer: " + appointment.getCustomer().getName());
        System.out.println("Phone: " + appointment.getCustomer().getPhone());
        System.out.println("Appointment ID: " + appointment.getId());
        System.out.println("=================================");
    }

    @Override
    public void sendAppointmentCancelledNotification(Appointment appointment) {

        System.out.println("=================================");
        System.out.println("APPOINTMENT CANCELLED");
        System.out.println("Customer: " + appointment.getCustomer().getName());
        System.out.println("Appointment ID: " + appointment.getId());
        System.out.println("=================================");
    }
}