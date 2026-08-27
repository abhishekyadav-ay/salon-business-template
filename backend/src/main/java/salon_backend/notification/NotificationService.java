package salon_backend.notification;

import salon_backend.entity.Appointment;

public interface NotificationService {

    void sendNewAppointmentNotification(Appointment appointment);

    void sendAppointmentConfirmedNotification(Appointment appointment);

    void sendAppointmentCancelledNotification(Appointment appointment);
}