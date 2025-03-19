interface UserTypeSelectorProps {
    userType: string;
    setUserType: (userType: string) => void;
    onClick: () => void;
}

const UserTypeSelector = (
    {
        userType,
        setUserType,
        onClick
    }: UserTypeSelectorProps
) => {
  return (
    <div>
      <h1>User Type Selector</h1>
      {userType}
      <button onClick={onClick}>Click me</button>
      <button onClick={() => setUserType('user')}>Set user</button>
    </div>
  );
};


export default UserTypeSelector;