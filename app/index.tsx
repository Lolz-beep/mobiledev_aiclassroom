import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import usersData from '../app/users';
import '../app/global.css'

const getInitialUserState = (user) => ({
  ...user,
  originalAge: user.age
});


export default function App() {
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const initialUser = getInitialUserState(usersData[activeUserIndex]);
  const [currentUser, setCurrentUser] = useState(initialUser);

  React.useEffect(() => {
    const user = getInitialUserState(usersData[activeUserIndex]);
    setCurrentUser(user);
  }, [activeUserIndex]);


  // Toggle between two different users
  const toggleUser = useCallback(() => {
    const nextIndex = (activeUserIndex + 1) % usersData.length;
    setActiveUserIndex(nextIndex);
  }, [activeUserIndex]);

  // Increment age by 1
  const incrementAge = useCallback(() => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  }, []);

  // Reset to original info
  const resetInfo = useCallback(() => {

    const originalData = usersData[activeUserIndex];
    setCurrentUser(getInitialUserState(originalData));
  }, [activeUserIndex]);

  const Button = ({ title, onPress, className = "" }) => (
    <TouchableOpacity 
      onPress={onPress} 
      className={`py-3 rounded-lg mx-1 flex-1 ${className}`} 
    >
      <Text className="text-white text-center font-bold text-sm">{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullCenterView} className="bg-gray-100 p-6">
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text className="text-4xl font-extrabold text-gray-800 mb-10 mt-6 text-center">
          Profile Card
        </Text>

        {/* PROFILE CARD */}
        <View className="bg-white rounded-xl shadow-2xl p-6 mb-10 w-full max-w-sm self-center">
          
          {/* Profile Photo */}
          <View className="items-center -mt-16 mb-4"> 
            <Image
              source={currentUser.photoUrl}
              style={{ width: 128, height: 128, borderRadius: 64 }}
              className="rounded-full border-4 border-white shadow-lg ring-4 ring-indigo-400"
              accessibilityLabel="Profile photo"
            />
          </View>
          
          {/* Profile Details */}
          <Text className="text-3xl font-extrabold text-gray-900 mb-1 text-center">
            {currentUser.name}
          </Text>
          
          <Text className="text-lg font-semibold text-indigo-600 mb-6 text-center">
            Age: {currentUser.age}
          </Text>
          
          <View className="border-t border-gray-200 pt-4">
            {/* Email */}
            <Text className="text-base text-gray-700 mb-1">
              <Text className="font-bold">Email:</Text> {currentUser.email}
            </Text>
            
            {/* Bio */}
            <Text className="text-base text-gray-700">
              <Text className="font-bold">Bio:</Text> {currentUser.bio}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between w-full max-w-sm self-center">
          
          <Button 
            title="Toggle User" 
            onPress={toggleUser} 
            className="bg-indigo-600 active:bg-indigo-700"
          />
          
          <Button 
            title="Increment Age"
            onPress={incrementAge} 
            className="bg-teal-600 active:bg-teal-700"
          />
          
          <Button 
            title="Reset Info" 
            onPress={resetInfo} 
            className="bg-red-500 active:bg-red-600"
          />
        </View>

      </ScrollView>
    </View>
  );
}

// Updated styles to ensure vertical centering
const styles = StyleSheet.create({
  fullCenterView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
});