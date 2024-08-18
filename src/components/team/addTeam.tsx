import React, { useState } from 'react';
import { db } from '../../firebase/BaseConfig'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';
import generateReferralCode from '../../utils/misc';

const AddTeam: React.FC = () => {
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [emailId, setEmailId] = useState('');
  const [projectIds] = useState<string[]>([]); // Assuming an empty array initially

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const referralCode = generateReferralCode(name, phonenumber);
    // const referralCode = '123'; // Placeholder for referral code
    try {
      await addDoc(collection(db, 'team'), {
        name,
        projectIds,
        referralCode,
        phonenumber,
        emailId,
      });
      alert('Team added successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding team');
    }

    // Reset form
    setName('');
    setPhonenumber('');
    setEmailId('');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Add Team
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Phone Number:
            </label>
            <input
              type="text"
              value={phonenumber}
              onChange={e => setPhonenumber(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email ID:
            </label>
            <input
              type="email"
              value={emailId}
              onChange={e => setEmailId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            Add Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
