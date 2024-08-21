import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/BaseConfig'; // Adjust the path as necessary
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { team } from '../../interfaces/interfaces';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<team[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTeam, setEditedTeam] = useState<team | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamCollection = collection(db, 'team');
        const teamSnapshot = await getDocs(teamCollection);
        const teamList = teamSnapshot.docs.map(
          doc => ({ ...doc.data(), id: doc.id } as unknown as team)
        );
        setTeams(teamList);
      } catch (error) {
        console.error('Error fetching teams: ', error);
      }
    };

    fetchTeams();
  }, []);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedTeam({ ...teams[index] });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof team
  ) => {
    if (editedTeam) {
      setEditedTeam({ ...editedTeam, [field]: e.target.value });
    }
  };

  const handleSaveClick = async () => {
    if (editedTeam && typeof editedTeam.id === 'string') {
      try {
        const teamDocRef = doc(db, 'team', editedTeam.id);

        const teamUpdate = {
          name: editedTeam.name,
          referralCode: editedTeam.referralCode,
          phonenumber: editedTeam.phonenumber,
          emailId: editedTeam.emailId,
          role: editedTeam.role,
          projectIds: editedTeam.projectIds,
        };

        await updateDoc(teamDocRef, teamUpdate);

        // Update the local state
        const updatedTeams = [...teams];
        updatedTeams[editingIndex!] = editedTeam;
        setTeams(updatedTeams);

        // Reset editing state
        setEditingIndex(null);
        setEditedTeam(null);
      } catch (error) {
        console.error('Error updating team member: ', error);
      }
    } else {
      console.error('Invalid team ID or team is undefined');
    }
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditedTeam(null);
  };
  const handleDeleteClick = async (id: any, index: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this team member?'
    );

    if (confirmed) {
      try {
        const teamDocRef = doc(db, 'team', id);
        await deleteDoc(teamDocRef);

        // Remove the deleted team from the state
        const updatedTeams = [...teams];
        updatedTeams.splice(index, 1);
        setTeams(updatedTeams);
      } catch (error) {
        console.error('Error deleting team member: ', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {teams.map((team, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            {editingIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editedTeam?.name || ''}
                  onChange={e => handleInputChange(e, 'name')}
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                />
                <input
                  type="text"
                  value={editedTeam?.referralCode || ''}
                  onChange={e => handleInputChange(e, 'referralCode')}
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                />
                <input
                  type="text"
                  value={editedTeam?.phonenumber || ''}
                  onChange={e => handleInputChange(e, 'phonenumber')}
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                />
                <input
                  type="email"
                  value={editedTeam?.emailId || ''}
                  onChange={e => handleInputChange(e, 'emailId')}
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                />
                <input
                  type="text"
                  value={editedTeam?.role || ''}
                  onChange={e => handleInputChange(e, 'role')}
                  className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
                />
                <button
                  onClick={handleSaveClick}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {team.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Referral Code: {team.referralCode}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Phone Number: {team.phonenumber}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Email ID: {team.emailId}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Role: {team.role}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Projects:{' '}
                  {Array.isArray(team.projectIds) && team.projectIds.length > 0
                    ? team.projectIds.join(', ')
                    : 'No projects assigned'}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(team!.id, index)}
                    className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
