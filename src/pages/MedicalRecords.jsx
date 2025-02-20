import React from 'react';

const MedicalRecords = () => {
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-white">Medical Records</h1>
      
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-black">Recent Hospital Visits</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-black">General Check-up</p>
                  <p className="text-sm text-black">Dr. Sarah Johnson</p>
                </div>
                <p className="text-sm text-black">Jan 15, 2025</p>
              </div>
              <p className="mt-2 text-sm text-black">Annual physical examination. All vitals normal.</p>
            </div>
            
            <div className="border-b pb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-black">Respiratory Infection</p>
                  <p className="text-sm text-black">Dr. Michael Chang</p>
                </div>
                <p className="text-sm text-black">Nov 3, 2024</p>
              </div>
              <p className="mt-2 text-sm text-black">Prescribed antibiotics for 7 days. Follow-up required.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-black">Lab Results</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-black">Test</th>
                <th className="text-left py-2 font-medium text-black">Result</th>
                <th className="text-left py-2 font-medium text-black">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-black">Blood Panel</td>
                <td className="py-2 text-black">Normal</td>
                <td className="py-2 text-black">Jan 14, 2025</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-black">Cholesterol</td>
                <td className="py-2 text-black">180 mg/dL</td>
                <td className="py-2 text-black">Jan 14, 2025</td>
              </tr>
              <tr>
                <td className="py-2 text-black">Blood Pressure</td>
                <td className="py-2 text-black">120/80</td>
                <td className="py-2 text-black">Jan 14, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
