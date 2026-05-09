import React from 'react'; 
import {View, Text} from 'react-native'; 

type statusType = 'success' | 'error' | 'info'; 

export const Notify = (message: string, status: statusType): React.JSX.Element => {

if(!message) return "null";

const getStatusColor = () => {
if(status === 'success') return 'green';
if(status === 'error') return 'red'; 
return 'blue'; // default for info.
};

return (
<View style={{padding: 10, backgroundColor: '#fff', borderRadius: 8}}>
<Text style={{color: getStatusColor(),  fontWeight: 'bold'}}>{message}
</Text>
</View>
);
};