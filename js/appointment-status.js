const API_BASE_URL = "http://localhost:8081/api";

const form = document.getElementById("statusForm");
const bookingIdInput = document.getElementById("bookingId");

const loading = document.getElementById("statusLoading");
const errorState = document.getElementById("statusError");
const errorMessage = document.getElementById("errorMessage");

const result = document.getElementById("appointmentResult");


/* =========================================
   CHECK APPOINTMENT
   ========================================= */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const bookingId = bookingIdInput.value.trim();

    if (!bookingId) {
        return;
    }

    hideResult();
    hideError();

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            `${API_BASE_URL}/appointments/${bookingId}`
        );

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Appointment not found.");
            }

            throw new Error(
                "Unable to retrieve appointment."
            );
        }

        const appointment = await response.json();

        console.log("Appointment:", appointment);

        displayAppointment(appointment);

    } catch (error) {

        console.error(
            "Error loading appointment:",
            error
        );

        errorMessage.textContent =
            error.message;

        errorState.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");
    }
});


/* =========================================
   DISPLAY APPOINTMENT
   ========================================= */

function displayAppointment(appointment) {

    /* Booking ID */

    document.getElementById("resultId").textContent =
        appointment.id || "—";


    /* Customer */

    document.getElementById("resultCustomer").textContent =
        appointment.customer?.name || "—";


    /* Phone */

    document.getElementById("resultPhone").textContent =
        appointment.customer?.phone || "—";


    /* Services */

    document.getElementById("resultServices").textContent =
        appointment.services
            ?.map(service => service.name)
            .join(", ") || "—";


    /* Staff */

    document.getElementById("resultStaff").textContent =
        appointment.staff?.name || "Not assigned";


    /* Staff Role */

    document.getElementById("resultStaffRole").textContent =
        appointment.staff?.role || "";


    /* Staff Specialization */

    document.getElementById("resultSpecialization").textContent =
        appointment.staff?.specialization || "—";


    /* Date */

    document.getElementById("resultDate").textContent =
        formatDate(
            appointment.appointmentDate
        );


    /* Time */

    document.getElementById("resultTime").textContent =
        formatTime(
            appointment.appointmentTime
        );


    /* Duration */

    document.getElementById("resultDuration").textContent =
        calculateDuration(
            appointment.services
        );


    /* Total */

    document.getElementById("resultTotal").textContent =
        appointment.totalPrice != null
            ? `₹${appointment.totalPrice}`
            : "—";


    /* Status */

    const statusElement =
        document.getElementById("resultStatus");

    const status =
        appointment.status || "PENDING";


    statusElement.textContent =
        status;


    statusElement.className =
        `status-badge ${status.toLowerCase()}`;


    /* Notes */

    const notesBox =
        document.getElementById("resultNotes");


    if (appointment.notes) {

        document.getElementById("notesText").textContent =
            appointment.notes;

        notesBox.classList.remove("hidden");

    } else {

        notesBox.classList.add("hidden");
    }


    /* Status Message */

    updateStatusMessage(status);


    /* Show Result */

    result.classList.remove("hidden");
}


/* =========================================
   STATUS MESSAGE
   ========================================= */

function updateStatusMessage(status) {

    const message =
        document.getElementById("statusMessage");


    const messages = {

        PENDING:
            "Your booking request has been received and is awaiting confirmation from the salon.",

        CONFIRMED:
            "Your appointment has been confirmed by the salon.",

        COMPLETED:
            "This appointment has been completed. Thank you for visiting AURA Atelier.",

        CANCELLED:
            "This appointment has been cancelled."
    };


    message.textContent =
        messages[status] ||
        "Your appointment status has been updated.";
}


/* =========================================
   CALCULATE DURATION
   ========================================= */

function calculateDuration(services) {

    if (!services || services.length === 0) {
        return "—";
    }

    const totalMinutes =
        services.reduce(
            (total, service) =>
                total + (service.durationMinutes || 0),
            0
        );


    if (totalMinutes <= 0) {
        return "—";
    }


    if (totalMinutes < 60) {
        return `${totalMinutes} minutes`;
    }


    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;


    if (minutes === 0) {

        return hours === 1
            ? "1 hour"
            : `${hours} hours`;
    }


    return `${hours}h ${minutes}m`;
}


/* =========================================
   FORMAT DATE
   ========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const date =
        new Date(`${dateString}T00:00:00`);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   FORMAT TIME
   ========================================= */

function formatTime(timeString) {

    if (!timeString) {
        return "—";
    }

    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date(
            2000,
            0,
            1,
            Number(hours),
            Number(minutes)
        );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =========================================
   HIDE RESULT
   ========================================= */

function hideResult() {

    result.classList.add("hidden");
}


/* =========================================
   HIDE ERROR
   ========================================= */

function hideError() {

    errorState.classList.add("hidden");
}