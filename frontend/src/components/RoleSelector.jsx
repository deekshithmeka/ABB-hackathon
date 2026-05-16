export const RoleSelector = ({ role, onRoleChange }) => {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => onRoleChange('operator')}
        className={`px-6 py-2 rounded font-semibold transition-colors ${
          role === 'operator'
            ? 'bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-800'
        }`}
      >
        Operator
      </button>
      <button
        onClick={() => onRoleChange('engineer')}
        className={`px-6 py-2 rounded font-semibold transition-colors ${
          role === 'engineer'
            ? 'bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-800'
        }`}
      >
        Engineer
      </button>
    </div>
  );
};
