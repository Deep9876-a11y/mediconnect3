import React, { useState } from 'react';
import { PatientHome } from './PatientHome.jsx';
import { DoctorSearch } from './DoctorSearch.jsx';
import { BookingModal } from './BookingModal.jsx';
import { HealthRecords } from './HealthRecords.jsx';
import { HomeSampleTracker } from './HomeSampleTracker.jsx';
import { PatientProfile } from './PatientProfile.jsx';
import { Icons } from '../../components/Icons.jsx';

export function PatientPortal({
  patient,
  appointments,
  doctors,
  departments,
  prescriptions,
  labReports,
  sampleOrders,
  labPackages,
  onBookAppointment,
  onUpdatePatientProfile,
  onRequestSampleOrder,
  onAdvanceSampleStatus,
  onOpenAiModal,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleStartBooking = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  const handleBookingCompleted = async (bookingData) => {
    const created = await onBookAppointment(bookingData);
    showToast({
      type: 'success',
      title: 'Appointment Booked!',
      message: `Token #${created.tokenNumber} reserved with ${created.doctorName}.`
    });
    return created;
  };

  const handleSampleRequest = async (data) => {
    const created = await onRequestSampleOrder(data);
    showToast({
      type: 'success',
      title: 'Sample Collection Scheduled!',
      message: `Order #${created.id} confirmed. Phlebotomist will visit at your selected slot.`
    });
    return created;
  };

  const handleProfileUpdated = async (data) => {
    await onUpdatePatientProfile(data);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal and medical information was saved.'
    });
  };

  const navItems = [
    { id: 'home', label: 'Home / OPD', icon: Icons.Building },
    { id: 'doctors', label: 'Find Doctors', icon: Icons.Stethoscope },
    { id: 'sample', label: 'Home Lab Tests', icon: Icons.FlaskConical },
    { id: 'records', label: 'Health Records', icon: Icons.FileText },
    { id: 'profile', label: 'My Profile', icon: Icons.User }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-navigation bar for Patient */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <PatientHome
            patient={patient}
            appointments={appointments}
            doctors={doctors}
            departments={departments}
            onNavigateTab={setActiveTab}
            onSelectDoctorForBooking={handleStartBooking}
            onOpenAiModal={onOpenAiModal}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorSearch
            doctors={doctors}
            departments={departments}
            onSelectDoctorForBooking={handleStartBooking}
          />
        )}

        {activeTab === 'sample' && (
          <HomeSampleTracker
            orders={sampleOrders}
            packages={labPackages}
            onRequestSample={handleSampleRequest}
            onAdvanceStatus={onAdvanceSampleStatus}
            patient={patient}
          />
        )}

        {activeTab === 'records' && (
          <HealthRecords
            appointments={appointments}
            prescriptions={prescriptions}
            labReports={labReports}
            patient={patient}
            showToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <PatientProfile
            patient={patient}
            onUpdateProfile={handleProfileUpdated}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDoctor={selectedDoctorForBooking}
        onBookingComplete={handleBookingCompleted}
        patient={patient}
      />
    </div>
  );
}
