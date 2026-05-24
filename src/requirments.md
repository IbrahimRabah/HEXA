Hexa Care
System Requirements Specification (SRS)
Detailed Requirements Guide for Development and Implementation Teams
Product: Hexa Care - Healthcare Operating Platform
Scope: Clinics, Hospital, Operations, Pharmacy, and Specialized Departments
Version: v1.0
Purpose: Convert all previous screens and workflows into clear implementation requirements.
This document is intended for the analysis, design, development, testing, and management teams.
 
1. General Project Objective
Hexa Care is an integrated Healthcare Operating Platform designed to manage the patient journey inside clinics and hospitals, from registration to discharge and follow-up, while supporting medical, administrative, financial, operational, and specialized departments.
•	Unify patient, visit, and medical record data in one file.
•	Reduce dependency on paper and improve operational speed.
•	Provide a clear workflow for each department inside the system.
•	Provide real-time operational, financial, and medical reports for management.
2. Scope of Work
•	Outpatient clinics: Reception, Nursing, Doctor, Lab, Radiology, Pharmacy, and Billing.
•	Hospital operations: Admissions, Rooms, Housekeeping, Maintenance, and Inpatient Follow-up.
•	Surgical operations management.
•	Specialized departments: Ophthalmology and Dental.
•	Security compliance, auditing, and audit logs.
•	Reports, dashboards, and analytics.
3. Users, Roles, and Actors
Role	Primary Permissions	Notes
Admin	User management, permissions, settings, and reports	Full access
Reception	Patient registration, bookings, visit opening, and insurance handling	Fast reception interface
Nurse	Vitals, assessment, queue preparation, and patient preparation	Limited clinical access
Doctor	Diagnosis, prescription, requests, and follow-up	Medical access
Lab Technician	Receive requests, enter results, and approve results	Laboratory access
Radiology	Receive radiology requests, upload images, and enter reports	Radiology access
Pharmacist	Dispensing, inventory management, and pharmacy invoices	Pharmacy access
Accounting	Invoices, payments, settlements, and financial reports	Financial access
Operations Team	Operation management, teams, equipment, and scheduling	Operations access
Maintenance / Housekeeping	Room readiness, sterilization, faults, and repair timing	Operational access
Patient	Booking, appointment viewing, results, and messages	Patient portal

4. Core Data Entities
Entity	Entity
Patient	Patient Identifier / Medical ID
Appointment	Visit / Encounter
Nursing Assessment	Vital Signs
Diagnosis	Prescription
Prescription Item	Lab Request
Lab Result	Radiology Request
Radiology Result	Invoice
Payment	Operation
Admission / Stay	Room
Housekeeping Task	Maintenance Ticket
Audit Log	Notification
User / Role / Permission	

Note: Each entity must have a unique ID, creation and modification timestamps, and a reference to the user who performed each action according to permissions.
5. Comprehensive Map of Required Screens
Domain	Screens	Implementation Priority
Core	Login / Dashboard / User Management / Settings	High
Patients	Add Patient / Patient Profile / Medical History / Medical ID	High
Booking	Appointments / Online Booking / Calendar / Check-in	High
Nursing	Nursing Queue / Vitals / Assessment / Notes	High
Doctor	Consultation / Diagnosis / Prescription / Follow-up	High
Laboratory	Lab Requests / Results / Review / Attachments	High
Radiology	Radiology Requests / Upload / Report / Review	High
Pharmacy	Prescriptions / Dispensing / Inventory / Purchases / Returns	High
Billing	Billing / Payments / Insurance / Receipts	High
Operations	Operation Setup / Steps / Team / Schedule / Review	High
Admissions	Admissions / Rooms / Stay Status / Nursing Follow-up	High
Rooms and Services	Housekeeping / Cleaning / Maintenance / Repair Timing	Medium
Specialties	Ophthalmology / Dental	Medium
Audit and Compliance	Audit Logs / Access / Security / Backup	High
Reports	Operational / Financial / Clinical / Inventory / KPIs	High

6. Patient Registration and Medical ID
•	Enter basic patient data: name, phone, email, gender, date of birth, address, national ID / residency ID, marital status, occupation, and nationality.
•	Generate a unified medical number, referred to as UMID (Unique Medical ID), that must not be duplicated for any patient.
•	Link the personal photo and documents, where available.
•	Define the patient status: New / Existing / Duplicate / Needs Review.
•	Record a brief medical history: allergies, chronic diseases, and long-term medications.
•	Allow patient data edits while preserving the previous record in the audit log.
7. Appointment and Online Booking
•	Allow online booking by the patient or booking by reception.
•	Select specialty, doctor, date, time, and channel (Walk-in / Online).
•	Validate appointment conflicts and clinic capacity.
•	Send automatic reminders before the appointment through WhatsApp, Email, or SMS according to configuration.
•	Support appointment statuses: Pending / Confirmed / Checked-in / Completed / Cancelled / No Show.
8. Reception and Check-in
•	Confirm patient arrival.
•	Open a new Encounter / Visit or link it to a previous booking.
•	Issue a queue token.
•	Transfer the patient to nursing with a clear waiting status.
•	Validate insurance coverage or required documents before starting the visit.
9. Nursing Module
•	Measure vital signs: BP, Temperature, Pulse, SpO2, Weight, Height, and BMI.
•	Record the chief complaint and pain scale.
•	Save initial nursing notes.
•	Support patient statuses: Waiting / Under Assessment / Ready for Doctor.
•	Support nursing attachments, where available, such as images, files, or preliminary results.
10. Doctor Module
•	Display the full patient file, including previous visits, allergies, chronic diseases, lab results, and radiology results.
•	Record Chief Complaint, HPI, Physical Examination, and Diagnosis.
•	Create an electronic prescription with dose, frequency, duration, and instructions.
•	Request lab tests, radiology, consultation, or follow-up.
•	Close the visit or transfer it to Follow-up, Operation, or Admission.
11. Laboratory Module
•	Receive lab requests from the doctor.
•	Classify requests by priority: STAT / Urgent / Routine.
•	Enter or import results for each test item.
•	Attach PDFs or result files.
•	Notify the doctor immediately after results are approved.
•	Support request statuses: Pending / In Progress / Result Ready / Completed / Cancelled.
12. Radiology Module
•	Receive the radiology request and link it to the visit.
•	Define the radiology type according to specialty, such as X-Ray, CT, MRI, Ultrasound, OCT, Fundus, and others.
•	Upload images and reports and link them to the medical record.
•	Review and approve the report by the relevant specialist.
•	Send the result to the doctor and patient according to the institution policy.
13. Pharmacy Module
•	Receive the electronic prescription from the doctor.
•	Validate medicine availability, expiry date, and alternatives.
•	Dispense medicine and record the dispensed quantity and inventory change.
•	Manage purchases, returns, wastage, and near-expiry items.
•	Provide inventory, sales, and medication-warning reports.
14. Billing, Payment, and Insurance
•	Create invoices automatically based on delivered services.
•	Aggregate line items such as consultation, lab tests, radiology, medicines, operations, and admission.
•	Register payment methods: Cash / Card / Online / Insurance.
•	Support settlements, discounts, cancellations, and refunds.
•	Provide electronic receipts and daily/monthly financial reports.
15. Operations Module (Surgery)
•	Add an operation with multiple steps: operation details, diagnosis, surgical team, anesthesia, scheduling, equipment, review, and approval.
•	Link the operation to the patient, visit, and surgeon.
•	Record operating room, operation duration, consumption, equipment, and outcomes.
•	Save Pre-op, Intra-op, and Post-op notes.
•	Provide operation reports and indicators for occupancy, duration, and cancellation.
16. Admissions, Inpatient Stay, and Rooms
•	Define admission class according to hospital policy: VIP / Private / Semi-private / Shared / General.
•	Record admission date and expected discharge date.
•	Display available, occupied, under-maintenance, under-sterilization, and ready-for-admission rooms.
•	Track inpatient nursing follow-up: notes, examinations, medications, doctor visits, and vital signs.
•	Calculate the actual length of stay and compare the plan with actual progress.
•	Manage transfers between rooms and departments.
17. Housekeeping and Maintenance
•	Track room readiness from the cleaning and sterilization perspective.
•	Support room statuses: Available / Occupied / Cleaning / Sanitizing / Under Maintenance / Out of Service.
•	Record cleaning start time, end time, and readiness time.
•	Maintenance tickets must include fault type, report time, response time, repair time, and closure status.
•	Allow assignment of the task to a maintenance technician with a clear SLA.
•	Display occupied, ready, and maintenance-closed rooms in real time.
18. Ophthalmology Module
•	Record eye examinations, including Visual Acuity, Refraction, Fundus, OCT, and Visual Field.
•	Store right-eye and left-eye results separately.
•	Document treatment plan, glasses prescription, and clinical decisions.
•	Link examinations to the visit and medical record.
19. Dental Module
•	Support Dental Charting, Periodontal Chart, X-Ray/Imaging, Treatment Plan, Procedures, and Prescription.
•	Track the status of each tooth and gum condition.
•	Plan treatment, follow-up, and upcoming visits.
20. Audit, Security, and Compliance
•	Create an audit log for every operation: who performed it, when, from which device, and what changed.
•	Apply role-based access control with the least-privilege principle wherever possible.
•	Support session timeout, password policy, and MFA where possible.
•	Provide regular backups and a restore plan.
•	Track login, logout, and changes to sensitive data.
21. Comprehensive Operational Workflow
1.	Patient Registration / Medical ID Creation
2.	Appointment Booking or Walk-in Check-in
3.	Nursing Assessment
4.	Doctor Consultation
5.	Lab / Radiology Request, if needed
6.	Pharmacy Dispensing, if a prescription exists
7.	Billing and Payment
8.	Admission / Operation / Referral, if required
9.	Follow-up and Patient Engagement
10.	Reports, Audit, and Analytics
Note: The system must support alternative paths, such as direct lab requests, direct operation flow, or transfer from clinic to inpatient admission.
22. Functional Requirements
Requirement	Description	Acceptance Criteria	Priority
Unified Medical Number	Generate a unique identifier for each patient and link it to all visits.	The number is not duplicated for any patient.	High
Visit Management	Open and close visits and link them to medical resources.	Each visit is saved and traceable.	High
Lab and Radiology	Send requests and receive results.	The result appears in the patient file.	High
Electronic Prescription	Create, save, and dispense prescriptions.	The doctor and pharmacy can view the prescription.	High
Billing	Calculate services automatically.	The invoice matches the registered services.	High
Admissions and Rooms	Manage room status, sterilization, and maintenance.	Room status appears in real time.	High
Operations	Manage operation steps, team, and schedule.	Each stage can be tracked.	High
Reports	Operational, financial, and medical reports.	Reports can be exported to PDF/Excel.	High
24. Proposed Record Status Model
Module	Statuses	Notes
Appointment	Pending / Confirmed / Checked-in / Completed / Cancelled / No Show	Supports reminders and modifications
Visit	Open / In Progress / On Hold / Closed / Referred	Linked to doctor and nursing
Lab Request	Pending / In Progress / Result Ready / Completed / Cancelled	Continues until result approval
Radiology Request	Pending / Scheduled / Imaging / Result Ready / Completed / Cancelled	Can be linked to images
Invoice	Draft / Issued / Partially Paid / Paid / Cancelled / Refunded	For financial settlement
Room	Available / Occupied / Cleaning / Sanitizing / Under Maintenance / Out of Service	Very important for housing/room management
Maintenance Ticket	Open / Assigned / In Progress / Fixed / Closed / Reopened	SLA must be recorded
Operation	Draft / Scheduled / In Progress / Completed / Cancelled / Post-op	Passes through multiple stages

26. Required Reports
•	Management dashboard for KPIs.
•	Visit and appointment reports.
•	Doctor and nursing reports.
•	Lab and radiology reports.
•	Pharmacy, inventory, and expiry reports.
•	Operations and operating-room reports.
•	Admissions, rooms, and readiness reports.
•	Maintenance and SLA reports.
•	Daily, weekly, and monthly financial reports.
•	Audit and compliance reports.
•	
