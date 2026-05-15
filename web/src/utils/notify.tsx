import React from 'react';  

type statusType = 'success' | 'error' | 'info'; 

interface NotifyProps {
	message: 'sting', 
	status: statusType
	}

export const Notify = ({message, status}: NotifyProps): React.JSX.Element | null => {

if(!message) return null;

const getStatusColor = () => {
if(status === 'success') return text-green-500, border-green-500;
if(status === 'error') return text-red-500, border-red-500;
return text-blue-500, border-blue-500;// default for info.
};

return (
<div className={`p-4 bg-white rounded-lg shadow-lg border-2 ${getStatusColor()}`}>
<p className="font-bold">
{message}
</p>
</div>
);
};