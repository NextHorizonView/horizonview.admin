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
  const [selectedApplication, setSelectedApplication] =
    useState<applications | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsCollection = collection(db, 'jobApplications');
        const applicationsQuery = query(applicationsCollection, orderBy('createdAt', 'desc'));
        const applicationsSnapshot = await getDocs(applicationsQuery);

        const applicationsList = applicationsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<applications, 'id'>),
          }))
          .filter(
            (application) =>
              !application.status ||
              (application.status !== 'approved' && application.status !== 'rejected')
          );
        setApplications(applicationsList);
      } catch (error) {
        console.error('Error fetching applications: ', error);
      }
    };

    fetchApplications();
  }, []);

  const handleEmailSentChange = async (id: string, checked: boolean) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { EmailSend: checked });
      setEmailSent(checked);
      alert(`Email send status updated to: ${checked}`);
    } catch (error) {
      console.error('Error updating EmailSend status: ', error);
      alert('Error during updating EmailSend status');
    }
  };

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
      alert('Error during the approval process');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const applicationRef = doc(db, 'jobApplications', id);
      await updateDoc(applicationRef, { status: 'rejected' });
      alert('Application rejected');
    } catch (error) {
      console.error('Error rejecting application: ', error);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(applications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

    // Generate a download
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => {
              setSelectedApplication(application);
              setEmailSent(application.EmailSend || false);
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
            <p className="text-gray-700 dark:text-gray-300">
              Email Sent: {application.EmailSend ? 'Bheja hai' : 'Nahi Bheja hai'}
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
            <p className="text-gray-700 dark:text-gray-300">Email: {selectedApplication.email}</p>
            <p className="text-gray-700 dark:text-gray-300">Phone: {selectedApplication.phone}</p>
            <p className="text-gray-700 dark:text-gray-300">LinkedIn: {selectedApplication.linkedin}</p>
            <p className="text-gray-700 dark:text-gray-300">
              Referral Code Used: {selectedApplication.referralCodeUsed ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Resume:{' '}
              <a
                href={selectedApplication.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500">
                View Resume
              </a>
            </p>
            <div className="mt-4">
              <label className="text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={emailSent}
                  onChange={(e) =>
                    handleEmailSentChange(selectedApplication.id!, e.target.checked)
                  }
                  className="mr-2"
                />
                Email Sent
              </label>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleApprove(selectedApplication.id!, selectedApplication)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedApplication.id!)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Reject
              </button>
            </div>
            <button
              onClick={() => setSelectedApplication(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
