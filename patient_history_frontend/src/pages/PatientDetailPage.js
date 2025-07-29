import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPatient,
  updatePatient,
  fetchPatientHistory,
  addHistoryEvent,
} from "../api/patientApi";
import Modal from "../components/Modal";
import PatientForm from "../components/PatientForm";
import jsPDF from "jspdf";

// Timeline event form
function HistoryEventForm({ onSubmit, onCancel }) {
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ description: desc, date });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="date">Event Date</label>
      <input required id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label htmlFor="desc">Description</label>
      <textarea required id="desc" value={desc} onChange={e => setDesc(e.target.value)} rows={4}/>
      <div className="flex" style={{ justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <button className="btn" disabled={loading}>{loading ? "Saving…" : "Save"}</button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// PUBLIC_INTERFACE
function PatientDetailPage() {
  /**
   * Displays details of selected patient: info, history timeline, edit patient,
   * add history event, and export patient history to PDF.
   */
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [histLoading, setHistLoading] = useState(true);

  async function loadPatient() {
    setLoading(true);
    const p = await fetchPatient(id);
    setPatient(p);
    setLoading(false);
  }
  async function loadHistory() {
    setHistLoading(true);
    const h = await fetchPatientHistory(id);
    setHistory(h);
    setHistLoading(false);
  }

  useEffect(() => {
    loadPatient();
    loadHistory();
    // eslint-disable-next-line
  }, [id]);

  async function handleEdit(values) {
    await updatePatient(id, values);
    setShowEdit(false);
    await loadPatient();
  }
  async function handleAddEvent(values) {
    await addHistoryEvent(id, values);
    setShowEvent(false);
    await loadHistory();
  }

  function handleExportHistoryPDF() {
    const doc = new jsPDF();
    doc.text(`Patient: ${patient?.name || ""}`, 14, 18);
    doc.text(`DOB: ${patient?.dob || ""}   Email: ${patient?.email || ""}`, 14, 28);
    doc.text("History Events:", 14, 40);
    let y = 56;
    for (const e of history) {
      doc.text(`${e.date}: ${e.description}`, 14, y);
      y += 12;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
    doc.save(`${patient?.name || "patient"}-history.pdf`);
  }

  return (
    <div>
      <div className="flex justify-between align-center mb-2">
        <h1 style={{ color: "var(--primary)" }}>Patient Details</h1>
        <div>
          <button className="btn btn-accent" onClick={handleExportHistoryPDF}>
            Export History PDF
          </button>
        </div>
      </div>
      {loading && <div>Loading…</div>}
      {patient && (
        <div>
          <div className="flex align-center mb-2">
            <div style={{ fontSize: 22, fontWeight: 700, marginRight: 20 }}>{patient.name}</div>
            <button className="btn btn-outline" onClick={() => setShowEdit(true)}>
              Edit
            </button>
          </div>
          <div>
            <strong>DOB:</strong> {patient.dob} <span style={{ marginLeft: 23 }} />
            <strong>Email:</strong> {patient.email}
            <span style={{ marginLeft: 23 }} />
            <strong>Gender:</strong> {patient.gender}
          </div>
        </div>
      )}

      <h3 className="mt-3" style={{ color: "var(--secondary)" }}>History Timeline</h3>
      <div style={{ textAlign: "right" }}>
        <button className="btn btn-secondary" onClick={() => setShowEvent(true)}>+ Add Event</button>
      </div>
      {histLoading ? (
        <div>Loading events…</div>
      ) : (
        <div className="timeline">
          {history.length === 0 && (
            <div style={{ color: "var(--text-muted)" }}>No recorded events.</div>
          )}
          {history.map((ev, i) => (
            <div className="timeline-event" key={ev.id || i}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div>
                  <strong style={{ color: "var(--primary)" }}>{ev.date}</strong>
                </div>
                <div>{ev.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEdit && (
        <Modal title="Edit Patient" onClose={() => setShowEdit(false)}>
          <PatientForm initialValues={patient} onSubmit={handleEdit} onCancel={() => setShowEdit(false)} />
        </Modal>
      )}
      {showEvent && (
        <Modal title="Add History Event" onClose={() => setShowEvent(false)}>
          <HistoryEventForm onSubmit={handleAddEvent} onCancel={() => setShowEvent(false)} />
        </Modal>
      )}
    </div>
  );
}

export default PatientDetailPage;
