import React, { useState, useEffect } from "react";
import { fetchPatients, createPatient } from "../api/patientApi";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Modal from "../components/Modal";
import PatientForm from "../components/PatientForm";

// PUBLIC_INTERFACE
function PatientListPage() {
  /**
   * Lists and allows searching/filtering patients,
   * adding new patient, and export to PDF.
   */
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPatients({ search, filter });
      setPatients(data);
    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [search]);

  async function handlePatientCreate(values) {
    try {
      await createPatient(values);
      setShowModal(false);
      await loadData();
    } catch (e) {
      setError("Failed to create patient.");
    }
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    doc.text("Patient List", 14, 18);
    let y = 30;
    patients.forEach((p, idx) => {
      doc.text(
        `${idx + 1}. ${p.name} (${p.dob || "N/A"}) - ${p.gender || ""}`,
        14,
        y
      );
      y += 9;
      if (y > 270) {
        doc.addPage();
        y = 18;
      }
    });
    doc.save("patients.pdf");
  }

  return (
    <div>
      <h1 style={{ color: "var(--primary)" }}>Patients</h1>
      <div className="flex justify-between align-center mb-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            loadData();
          }}
          style={{ display: "flex", gap: 10, alignItems: "center" }}
        >
          <input
            placeholder="Search name, email or MRN"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Filter: Add more filter UI if required */}
        </form>
        <div>
          <button className="btn btn-accent" onClick={() => setShowModal(true)}>
            + New Patient
          </button>
          <button
            className="btn btn-outline"
            style={{ marginLeft: 12 }}
            onClick={handleExportPDF}
          >
            Export PDF
          </button>
        </div>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "#c91d1d" }}>{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Email</th>
            <th>Gender</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 && !loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          ) : (
            patients.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.dob}</td>
                <td>{p.email}</td>
                <td>{p.gender}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/patient/${p.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
        <Modal title="Add New Patient" onClose={() => setShowModal(false)}>
          <PatientForm onSubmit={handlePatientCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

export default PatientListPage;
