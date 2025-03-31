import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Allergies = () => {
  const [allergies, setAllergies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAllergy, setCurrentAllergy] = useState(null);
  const [formData, setFormData] = useState({
    allergyName: '',
    severity: 'Mild'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API calls
  const API_BASE_URL = 'http://localhost:5000';

  // Fetch allergies when component mounts
  useEffect(() => {
    fetchAllergies();
  }, []);

  const fetchAllergies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/allergies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAllergies(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch allergies. Please try again later.');
      console.error('Error fetching allergies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      allergyName: '',
      severity: 'Mild'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (allergy) => {
    setIsEditMode(true);
    setCurrentAllergy(allergy);
    setFormData({
      allergyName: allergy.allergy_name,
      severity: allergy.severity
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.allergyName.trim()) {
      alert('Please enter an allergy name');
      return;
    }
    
    try {
      const payload = {
        allergyName: formData.allergyName,
        severity: formData.severity
      };
      
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/allergies/${currentAllergy.allergy_id}`, payload, headers);
      } else {
        await axios.post(`${API_BASE_URL}/allergies`, payload, headers);
      }
      
      // Refresh the allergies list
      fetchAllergies();
      
      // Close modal and reset form
      setIsModalOpen(false);
    } catch (err) {
      const action = isEditMode ? 'update' : 'add';
      setError(`Failed to ${action} allergy. Please try again.`);
      console.error(`Error ${action}ing allergy:`, err);
    }
  };

  const handleDelete = async (allergyId) => {
    if (!window.confirm('Are you sure you want to delete this allergy?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/allergies/${allergyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh the allergies list
      fetchAllergies();
    } catch (err) {
      setError('Failed to delete allergy. Please try again.');
      console.error('Error deleting allergy:', err);
    }
  };

  // Function to get severity color class
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'mild':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">My Allergies</h1>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Allergy
        </button>
      </div>

      {/* Loading and error states */}
      {loading && <p className="text-gray-600">Loading allergies...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Empty state */}
      {!loading && !error && allergies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No allergies recorded.</p>
          <button 
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Allergy
          </button>
        </div>
      )}

      {/* Allergies list - changed from grid to flex column */}
      <div className="flex flex-col space-y-3">
        {allergies.map((allergy) => (
          <div 
            key={allergy.allergy_id} 
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-medium text-lg">{allergy.allergy_name}</h3>
                <div className="mt-2">
                  <span 
                    className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${getSeverityColor(allergy.severity)}`}
                  >
                    {allergy.severity}
                  </span>
                </div>
              </div>
              
              {/* Action buttons clearly positioned to the right */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => openEditModal(allergy)}
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  aria-label="Edit allergy"
                >
                  <FaEdit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(allergy.allergy_id)}
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  aria-label="Delete allergy"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Allergy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit Allergy' : 'Add New Allergy'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="allergyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergy Name
                </label>
                <input
                  type="text"
                  id="allergyName"
                  name="allergyName"
                  value={formData.allergyName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter allergy name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditMode ? 'Update' : 'Add'} Allergy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allergies;