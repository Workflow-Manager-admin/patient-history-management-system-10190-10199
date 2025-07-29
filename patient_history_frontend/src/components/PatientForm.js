import React, { useState } from "react";

// PUBLIC_INTERFACE
function PatientForm({ initialValues, onSubmit, onCancel }) {
  /** Form fields for patient record create/edit */
  const [values, setValues] = useState({
    name: initialValues?.name || "",
    dob: initialValues?.dob || "",
    email: initialValues?.email || "",
    gender: initialValues?.gender || "",
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Full Name</label>
      <input required name="name" id="name" value={values.name} onChange={handleChange} />

      <label htmlFor="dob">Date of Birth</label>
      <input required type="date" name="dob" id="dob" value={values.dob} onChange={handleChange} />

      <label htmlFor="email">Email</label>
      <input required type="email" name="email" id="email" value={values.email} onChange={handleChange} />

      <label htmlFor="gender">Gender</label>
      <select required name="gender" id="gender" value={values.gender} onChange={handleChange}>
        <option value="">Select ...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <div className="flex" style={{ justifyContent: "flex-end", gap: 12 }}>
        <button className="btn" disabled={loading}>{loading ? "Saving…" : "Save"}</button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PatientForm;
