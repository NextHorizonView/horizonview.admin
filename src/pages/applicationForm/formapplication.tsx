import ApplicationsList from '../../components/application/applicationlist';

const Formapplicationlist = () => {
  return (
    <>
      <div className="flex-1 h-full">
        <h2 className="align-top text-center text-2xl">All Employees</h2>
        <ApplicationsList />
      </div>
    </>
  );
};

export default Formapplicationlist;
