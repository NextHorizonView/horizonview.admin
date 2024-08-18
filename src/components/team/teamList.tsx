import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/BaseConfig'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { team } from '../../interfaces/interfaces';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamCollection = collection(db, 'team');
        const teamSnapshot = await getDocs(teamCollection);
        const teamList = teamSnapshot.docs.map(doc => doc.data() as team);
        setTeams(teamList);
        console.log('Team ', fetchTeams);
      } catch (error) {
        console.error('Error fetching teams: ', error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {teams.map((team, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
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
              Projects:{' '}
              {Array.isArray(team.projectIds) && team.projectIds.length > 0
                ? team.projectIds.join(', ')
                : 'No projects assigned'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
