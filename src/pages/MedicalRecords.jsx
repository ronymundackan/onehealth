import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http', {
          withCredentials: true, // Important to include cookies for sessions
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError('Failed to fetch medical records');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  if (loading) return <p className="text-white">Loading medical records...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-white">Medical Records</h1>

      <div className="grid gap-6">
        {records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4 text-black">{record.disease_name}</h2>
              <p className="text-sm text-black">Date Diagnosed: {record.date_diagnosed}</p>
              <p className="text-sm text-black">Hospital: {record.hospital_name}</p>
              <p className="text-sm text-black">Doctor: {record.doctor_name} ({record.specialization})</p>
              <p className="text-sm text-black">Prescriptions: {record.prescriptions}</p>
              <p className="text-sm text-black">Still on Medication: {record.still_on_medication ? 'Yes' : 'No'}</p>
            </div>
          ))
        ) : (
          <p className="text-black">No medical records found.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
