import React, { Fragment } from "react";
import { View, Text, Image } from "react-native";

// OUR INTERFACES
import { UserProfileProps } from "@/interfaces/UserProfileProps";

const UserProfile = ({
  imageUrl = "https://i.pravatar.cc/100", // Default image
  name = "Adrian Musa Alfauzan", // Default name
  email = "emailPengguna@gmail.com", // Default email
  containerImageClassName = "",
  ImageClassName = "",
  nameClassName = "",
  emailClassName = "",
}: UserProfileProps) => {
  return (
    // User Profile Component
    <Fragment>
      {/* IMAGE */}
      <View className={containerImageClassName}>
        <Image source={{ uri: imageUrl }} className={ImageClassName} />
      </View>

      {/* NAME */}
      <Text className={nameClassName}>{name}</Text>

      {/* EMAIL */}
      <Text className={emailClassName}>{email}</Text>
    </Fragment>
  );
};

export default UserProfile;
