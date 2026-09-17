const API_BASE_URL = "http://localhost:8081/api";

let appointments = [];

/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadAppointments();

    // Refresh every 5 seconds
    setInterval(loadAppointments, 15000);
});


/* =========================================================
   LOAD PENDING APPOINTMENTS
========================================================= */

async function loadAppointments() {

    document.getElementById("loadingState")?.classList.remove("hidden");
    document.getElementById("errorState")?.classList.add("hidden");

    try {

        const response = await fetch(
            `${API_BASE_URL}/appointments?status=PENDING`
        );

        if (!response.ok) {
            throw new Error("Failed to load appointments");
        }

        const data = await response.json();

        appointments = Array.isArray(data)
            ? data
            : (data.content || []);

        renderAppointments(appointments);
        updateSummary(appointments);

        document.getElementById("loadingState")?.classList.add("hidden");
        document.getElementById("errorState")?.classList.add("hidden");

    } catch (error) {

        console.error("Error loading appointments:", error);

        document.getElementById("loadingState")?.classList.add("hidden");
        document.getElementById("errorState")?.classList.remove("hidden");

        showToast(
            "Unable to load appointments",
            "error"
        );
    }
}


/* =========================================================
   RENDER APPOINTMENTS
========================================================= */

function renderAppointments(data) {

    const container = document.getElementById("appointmentsList");
    if (!container) {
        console.error(
            "Appointments container not found."
        );
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No pending appointments</h3>
                <p>New booking requests will appear here.</p>
            </div>
        `;

        return;
    }

    data.forEach(appointment => {

        const card =
            createAppointmentCard(appointment);

        container.appendChild(card);

    });
}


/* =========================================================
   CREATE APPOINTMENT CARD
========================================================= */

function createAppointmentCard(appointment) {

    const card = document.createElement("div");

    card.className = "appointment-card";

    const customer =
        appointment.customer || {};

    const staff =
        appointment.staff || {};

    const services =
        appointment.services || [];

    const serviceNames =
        services.length > 0
            ? services.map(service => service.name).join(", ")
            : "No service";

    const totalPrice =
        appointment.totalPrice != null
            ? `₹${appointment.totalPrice}`
            : "₹0";

    const duration =
        services.reduce(
            (total, service) =>
                total + (service.durationMinutes || 0),
            0
        );

    const formattedDate =
        formatDate(appointment.appointmentDate);

    const formattedTime =
        formatTime(appointment.appointmentTime);

    card.innerHTML = `

        <div class="appointment-header">

            <div>
                <span class="booking-label">
                    BOOKING
                </span>

                <h3>
                    #${appointment.id}
                </h3>
            </div>

            <span class="status-badge pending">
                ${appointment.status}
            </span>

        </div>


        <div class="appointment-details">

            <div class="detail-row">
                <strong>Customer</strong>
                <span>
                    ${escapeHtml(customer.name || "N/A")}
                </span>
            </div>

            <div class="detail-row">
                <strong>Phone</strong>
                <span>
                    ${escapeHtml(customer.phone || "N/A")}
                </span>
            </div>

            <div class="detail-row">
                <strong>Service</strong>
                <span>
                    ${escapeHtml(serviceNames)}
                </span>
            </div>

            <div class="detail-row">
                <strong>Staff</strong>
                <span>
                    ${escapeHtml(staff.name || "N/A")}
                </span>
            </div>

            <div class="detail-row">
                <strong>Role</strong>
                <span>
                    ${escapeHtml(staff.role || "N/A")}
                </span>
            </div>

            <div class="detail-row">
                <strong>Specialization</strong>
                <span>
                    ${escapeHtml(
                        staff.specialization || "N/A"
                    )}
                </span>
            </div>

            <div class="detail-row">
                <strong>Date</strong>
                <span>
                    ${formattedDate}
                </span>
            </div>

            <div class="detail-row">
                <strong>Time</strong>
                <span>
                    ${formattedTime}
                </span>
            </div>

            <div class="detail-row">
                <strong>Duration</strong>
                <span>
                    ${duration > 0
                        ? `${duration} minutes`
                        : "N/A"}
                </span>
            </div>

            <div class="detail-row">
                <strong>Total</strong>
                <span>
                    ${totalPrice}
                </span>
            </div>

            ${
                appointment.notes
                    ? `
                        <div class="detail-row notes-row">
                            <strong>Notes</strong>
                            <span>
                                ${escapeHtml(
                                    appointment.notes
                                )}
                            </span>
                        </div>
                    `
                    : ""
            }

        </div>


        <div class="appointment-actions">

            <button
                class="btn-confirm"
                onclick="confirmAppointment(${appointment.id})"
            >
                CONFIRM
            </button>

            <button
                class="btn-adjust"
                onclick="openAdjustModal(${appointment.id})"
            >
                ADJUST
            </button>

            <button
                class="btn-cancel"
                onclick="cancelAppointment(${appointment.id})"
            >
                CANCEL
            </button>

        </div>
    `;

    return card;
}


/* =========================================================
   CONFIRM APPOINTMENT
========================================================= */

async function confirmAppointment(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/appointments/${id}/confirm`,
            {
                method: "PATCH"
            }
        );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(
                message || "Failed to confirm appointment"
            );
        }

        showToast(
            `Appointment #${id} confirmed`,
            "success"
        );

        await loadAppointments();

    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Unable to confirm appointment",
            "error"
        );
    }
}


/* =========================================================
   CANCEL APPOINTMENT
========================================================= */

async function cancelAppointment(id) {

    const confirmed =
        confirm(
            `Are you sure you want to cancel appointment #${id}?`
        );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/appointments/${id}/cancel`,
            {
                method: "PATCH"
            }
        );

        if (!response.ok) {

            const message =
                await response.text();

            throw new Error(
                message || "Failed to cancel appointment"
            );
        }

        showToast(
            `Appointment #${id} cancelled`,
            "success"
        );

        await loadAppointments();

    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Unable to cancel appointment",
            "error"
        );
    }
}


/* =========================================================
   OPEN ADJUST MODAL
========================================================= */

async function openAdjustModal(id) {

    const appointment =
        appointments.find(
            appointment =>
                appointment.id === id
        );

    if (!appointment) {

        showToast(
            "Appointment not found",
            "error"
        );

        return;
    }

    try {

        const staffResponse =
            await fetch(
                `${API_BASE_URL}/staff`
            );

        if (!staffResponse.ok) {
            throw new Error(
                "Unable to load staff members"
            );
        }

        const staffList =
            await staffResponse.json();

        createAdjustModal(
            appointment,
            staffList
        );

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to open adjustment form",
            "error"
        );
    }
}


/* =========================================================
   CREATE ADJUST MODAL
========================================================= */

function createAdjustModal(
    appointment,
    staffList
) {

    removeExistingModal();

    const currentStaffId =
        appointment.staff?.id || "";

    const modal =
        document.createElement("div");

    modal.id = "adjustModal";

    modal.className =
        "adjust-modal-overlay";

    modal.innerHTML = `

        <div class="adjust-modal">

            <div class="adjust-modal-header">

                <div>
                    <span class="booking-label">
                        ADJUST APPOINTMENT
                    </span>

                    <h2>
                        Booking #${appointment.id}
                    </h2>
                </div>

                <button
                    class="modal-close"
                    onclick="closeAdjustModal()"
                >
                    &times;
                </button>

            </div>


            <div class="adjust-current-info">

                <p>
                    <strong>Customer:</strong>
                    ${escapeHtml(
                        appointment.customer?.name ||
                        "N/A"
                    )}
                </p>

                <p>
                    <strong>Service:</strong>
                    ${escapeHtml(
                        (appointment.services || [])
                            .map(service => service.name)
                            .join(", ")
                    )}
                </p>

            </div>


            <form
                id="adjustForm"
                onsubmit="submitAdjustment(event, ${appointment.id})"
            >

                <div class="form-group">

                    <label for="adjustStaff">
                        Staff Member
                    </label>

                    <select
                        id="adjustStaff"
                        required
                    >

                        <option value="">
                            Select staff member
                        </option>

                        ${staffList.map(staff => `

                            <option
                                value="${staff.id}"
                                ${
                                    Number(staff.id) ===
                                    Number(currentStaffId)
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${escapeHtml(
                                    staff.name
                                )}
                                ${
                                    staff.role
                                        ? ` - ${escapeHtml(
                                            staff.role
                                          )}`
                                        : ""
                                }
                            </option>

                        `).join("")}

                    </select>

                </div>


                <div class="form-group">

                    <label for="adjustDate">
                        Appointment Date
                    </label>

                    <input
                        type="date"
                        id="adjustDate"
                        value="${appointment.appointmentDate}"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="adjustTime">
                        Appointment Time
                    </label>

                    <input
                        type="time"
                        id="adjustTime"
                        value="${appointment.appointmentTime.substring(0, 5)}"
                        required
                    >

                </div>


                <div class="adjust-warning">

                    <strong>
                        Important
                    </strong>

                    <p>
                        The system will check whether the
                        selected staff member is already
                        booked for this date and time.
                    </p>

                </div>


                <div class="adjust-modal-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="closeAdjustModal()"
                    >
                        BACK
                    </button>

                    <button
                        type="submit"
                        class="btn-primary"
                        id="saveAdjustmentBtn"
                    >
                        SAVE ADJUSTMENT
                    </button>

                </div>

            </form>

        </div>
    `;

    document.body.appendChild(modal);


    // Close when clicking outside modal
    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                closeAdjustModal();
            }

        }
    );
}


/* =========================================================
   SUBMIT ADJUSTMENT
========================================================= */

async function submitAdjustment(
    event,
    appointmentId
) {

    event.preventDefault();

    const staffId =
        document.getElementById(
            "adjustStaff"
        ).value;

    const appointmentDate =
        document.getElementById(
            "adjustDate"
        ).value;

    const appointmentTime =
        document.getElementById(
            "adjustTime"
        ).value;


    if (
        !staffId ||
        !appointmentDate ||
        !appointmentTime
    ) {

        showToast(
            "Please fill all fields",
            "error"
        );

        return;
    }


    const saveButton =
        document.getElementById(
            "saveAdjustmentBtn"
        );

    saveButton.disabled = true;
    saveButton.textContent = "SAVING...";


    const requestBody = {

        staffId: Number(staffId),

        appointmentDate:
            appointmentDate,

        appointmentTime:
            appointmentTime

    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/appointments/${appointmentId}/reschedule`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Unable to adjust appointment";

            try {

                const errorData =
                    await response.json();

                if (
                    errorData.message
                ) {
                    errorMessage =
                        errorData.message;
                }

            } catch {

                const text =
                    await response.text();

                if (text) {
                    errorMessage = text;
                }
            }

            throw new Error(
                errorMessage
            );
        }


        await response.json();


        closeAdjustModal();


        showToast(
            `Appointment #${appointmentId} adjusted successfully`,
            "success"
        );


        await loadAppointments();


    } catch (error) {

        console.error(
            "Adjustment error:",
            error
        );


        showToast(
            error.message ||
            "Unable to adjust appointment",
            "error"
        );


        saveButton.disabled = false;

        saveButton.textContent =
            "SAVE ADJUSTMENT";
    }
}


/* =========================================================
   CLOSE ADJUST MODAL
========================================================= */

function closeAdjustModal() {

    removeExistingModal();
}


function removeExistingModal() {

    const modal =
        document.getElementById(
            "adjustModal"
        );

    if (modal) {
        modal.remove();
    }
}


/* =========================================================
   SUMMARY COUNTS
========================================================= */

function updateSummary(data) {

    const pendingCount =
        data.length;


    const pendingElement =
        document.getElementById(
            "pendingCount"
        );

    if (pendingElement) {
        pendingElement.textContent =
            pendingCount;
    }


    const totalElement =
        document.getElementById(
            "totalCount"
        );

    if (totalElement) {
        totalElement.textContent =
            pendingCount;
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "toastContainer";

        container.style.position =
            "fixed";

        container.style.bottom =
            "25px";

        container.style.right =
            "25px";

        container.style.zIndex =
            "99999";

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement("div");

    toast.className =
        `admin-toast ${type}`;

    toast.textContent =
        message;


    container.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3500);
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "N/A";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(timeString) {

    if (!timeString) {
        return "N/A";
    }

    const parts =
        timeString.split(":");

    const hour =
        Number(parts[0]);

    const minute =
        parts[1] || "00";

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    const displayHour =
        hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   MANUAL REFRESH
========================================================= */

function refreshAppointments() {

    loadAppointments();

}


/* =========================================================
   EXPOSE FUNCTIONS FOR HTML ONCLICK
========================================================= */

window.confirmAppointment =
    confirmAppointment;

window.cancelAppointment =
    cancelAppointment;

window.openAdjustModal =
    openAdjustModal;

window.closeAdjustModal =
    closeAdjustModal;

window.submitAdjustment =
    submitAdjustment;

window.refreshAppointments =
    refreshAppointments;