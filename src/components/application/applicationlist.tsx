import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/BaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { applications } from '../../interfaces/interfaces';
import generateReferralCode from '../../utils/misc';
import * as XLSX from 'xlsx'; // Import the XLSX library

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<applications[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<applications[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<applications | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [interviewApproved, setInterviewApproved] = useState(false);
  const [referralCodeFilter, setReferralCodeFilter] = useState<string>(''); 
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); 

  // Fetch applications from Firestore
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsCollection = collection(db, 'jobApplications');
        const applicationsQuery = query(applicationsCollection, orderBy('createdAt', sortOrder));
        const applicationsSnapshot = await getDocs(applicationsQuery);

        const applicationsList = applicationsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<applications, 'id'>),
          }))
          .filter(
            (application) =>
              (!application.status || 
               (application.status !== 'approved' && application.status !== 'rejected')) &&
              (!referralCodeFilter || application.referralCode.includes(referralCodeFilter))
          );

        setApplications(applicationsList);
        setFilteredApplications(applicationsList); // Initialize filtered list
      } catch (error) {
        console.error('Error fetching applications: ', error);
      }
    };

    fetchApplications();
  }, [referralCodeFilter, sortOrder]); 

  // Filter applications based on the search query
  useEffect(() => {
    const filtered = applications.filter((application) =>
      application.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]); // Runs whenever the search query or applications change

  // Handle Email Sent Status
  const handleEmailSentChange = async (id: string, checked: boolean) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { EmailSend: checked });
      setEmailSent(checked);
      alert(`Email send status updated to: ${checked}`);
    } catch (error) {
      console.error('Error updating EmailSend status: ', error);
    }
  };

  // Approve Application for Interview
  const handleApproveForInterview = async (id: string, approved: boolean) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { approveforinterview: approved });
      alert(`Application ${approved ? 'approved' : 'disapproved'} for interview`);
    } catch (error) {
      console.error('Error approving for interview: ', error);
    }
  };

  // Approve Application
  const handleApprove = async (id: string, application: applications) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { status: 'approved' });

      const referralCode = generateReferralCode(application.name, application.phone);
      await addDoc(collection(db, 'team'), {
        name: application.name,
        projectIds: [],
        referralCode,
        phonenumber: application.phone,
        emailId: application.email,
      });

      alert('Application approved and added to the team');
    } catch (error) {
      console.error('Error approving application: ', error);
    }
  };

  // Reject Application
  const handleReject = async (id: string) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { status: 'rejected' });
      alert('Application rejected');
    } catch (error) {
      console.error('Error rejecting application: ', error);
    }
  };

  // Download Excel File
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(applications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    XLSX.writeFile(workbook, 'applications.xlsx');
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      <button
        onClick={downloadExcel}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Download Excel
      </button>

      <div className="mb-4">
        <label className="mr-2">Filter by Referral Code:</label>
        <input
          type="text"
          value={referralCodeFilter}
          onChange={(e) => setReferralCodeFilter(e.target.value)}
          className="border rounded px-2 py-1 bg-gray-500"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2">Search:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-2 py-1 bg-gray-500"
          placeholder="Search by name, email, or role"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2">Sort by Date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border rounded px-2 py-1 bg-gray-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => {
              setSelectedApplication(application);
              setEmailSent(application.EmailSend || false);
              setInterviewApproved(application.approveforinterview || false);
            }}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {application.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Role: {application.role}</p>
            <p className="text-gray-700 dark:text-gray-300">Email: {application.email}</p>
            <p className="text-gray-700 dark:text-gray-300">
              Referral Code: {application.referralCode}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Date: {application.createdAt.toDate().toString()}
            </p>
          </div>
        ))}
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {selectedApplication.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Role: {selectedApplication.role}</p>
            <p className="text-gray-700 dark:text-gray-300">
              Email: 
              <a href={`mailto:${selectedApplication.email}`} className="text-blue-500">
                Send Email
              </a>
            </p>
            <div className="mt-4">
              <button onClick={() => setSelectedApplication(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
