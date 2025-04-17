import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Image, TouchableOpacity, useColorScheme, Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// OUR COMPONENTS
import MyText from "@/components/text";

// OUR INTERFACES
import { useCartAnimations } from "@/hooks/Frontend/cartDetailsScreen/useCartAnimation";
import { useQuantity } from "@/hooks/Frontend/cartDetailsScreen/useQuantity";
import { MyCardProps } from "@/interfaces/cardProps";

// OUR UTILS
import { maxLengthText } from "@/utils/maxLengthText";

const CartDetails = ({
  image, //
  bgImageStyle,
  imageStyle,
  name,
  description,
  price,
  quantity,
  detailType,
  rating,
  id,
  onDelete,
}: MyCardProps) => {
  const router = useRouter();
  const isDarkMode = useColorScheme() === "dark";
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const [showDelete, setShowDelete] = useState(false);
  const { slideLeftAnim, animateLeft } = useCartAnimations();
  const { currentQuantity, currentPrice, increaseQuantity, decreaseQuantity } = useQuantity({
    initialQuantity: quantity,
    price: price,
    onZeroQuantity: () => {
      setShowDeleteButton(true);
      animateLeft(-65);
    },
    onResetDelete: () => {
      setShowDeleteButton(true);
      animateLeft(0);
    },
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -65) {
        Animated.timing(translateX, {
          toValue: -65,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setShowDelete(true));
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 20,
        }).start(() => setShowDelete(true));
      }
    },
  });

  const onDetail = () => {
    const routes = {
      vegetable: "/screens/vegetableDetailScreen",
      news: "/screens/newsDetailScreen",
      service: "/screens/servicesDetailScreen",
      facility: "/screens/facilityDetailScreen",
    };

    const path = detailType ? routes[detailType as keyof typeof routes] : undefined;
    if (!path) {
      console.error("Unknown detailType:", detailType);
      return;
    }

    router.push(path as any);
  };

  const getCardBackgroundColor = () => {
    const bgColors: Record<string, string> = {
      vegetable: "#093731",
      news: "#3D081C",
      service: "#071758",
      facility: "#074558",
    };
    return bgColors[detailType ?? "facility"];
  };

  const getBgImageColor = () => {
    const bgColors: Record<string, string> = {
      vegetable: "#159778",
      news: "#5A0B29",
      service: "#1C2D6F",
      facility: "#248EAE",
    };
    return bgColors[detailType ?? "vegetable"];
  };

  return (
    <View>
      {(showDelete || showDeleteButton) && onDelete && (
        <TouchableOpacity onPress={onDelete} className="absolute h-full pl-5 w-24 flex items-center justify-center right-0 bg-[#C40E0E] rounded-tr-[15px] rounded-br-[15px]">
          <View style={{ padding: 10 }}>
            <FontAwesome5 name="trash" size={32} color="white" />
          </View>
        </TouchableOpacity>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { translateX }, // Opsi pertama
            { translateX: slideLeftAnim }, // Opsi kedua
          ],
          backgroundColor: getCardBackgroundColor(),
        }}
        className="px-4 py-3 w-full h-44 rounded-2xl shadow-md flex-row items-center justify-between"
      >
        {/* PEMBUNGKUS GAMBAR */}
        <View className="w-40 h-full flex-row items-center justify-center bg-purple-400 rounded-lg">
          <View className={`w-40 h-full absolute rounded-lg ${bgImageStyle}} style={{ backgroundColor: getBgImageColor() }`} />
          <Image source={image} className={`w-24 h-24 rounded-xl ${imageStyle}`} resizeMode="cover" />
        </View>

        {/* PEMBUNGKUS INFORMASI KERANJANG */}
        <View className="flex-1  px-2 ">
          <MyText fontSize={20} fontFamily="LexBold" color="white">
            {name}
          </MyText>
          <MyText fontSize={14} fontFamily="LexBold" color="gray" textstyle="mt-1">
            {maxLengthText(description, 10)}
          </MyText>

          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={16} color="white" />
            <MyText fontSize={20} fontFamily="LexMedium" color="white" textstyle="ml-1">
              {rating}
              <MyText fontSize={11} fontFamily="LexBold" color="gray">
                {" "}
                (10K/Penilaian)
              </MyText>
            </MyText>
          </View>

          <View className="flex-row items-center mt-1">
            <MyText fontSize={22} fontFamily="LexBlack" color="white">
              Rp{currentPrice.toLocaleString()}
            </MyText>
            <MyText fontSize={12} fontFamily="LexSemiBold" color="gray" textstyle="ml-1">
              x{currentQuantity}
            </MyText>
          </View>
        </View>

        {/* PEMBUNGKUS KUANTITAS */}
        <View className="items-center p-2 border-white border rounded-lg">
          <TouchableOpacity onPress={increaseQuantity} className="w-[32px] h-[32px] rounded-md items-center justify-center">
            <FontAwesome5 name="plus" size={24} color="white" solid />
          </TouchableOpacity>

          <MyText fontSize={16} fontFamily="LexBold" color="white" textstyle="my-1">
            {currentQuantity}
          </MyText>

          <TouchableOpacity onPress={decreaseQuantity} className="w-[32px] h-[32px] rounded-md items-center justify-center">
            <FontAwesome5 name="minus" size={24} color="white" solid />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default CartDetails;
