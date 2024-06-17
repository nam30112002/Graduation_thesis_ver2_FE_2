import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Modal } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { Platform } from 'react-native';
import RNFetchBlob from "rn-fetch-blob"; // Nếu bạn sử dụng 'react-native-fs'

const ImageModal = ({ visible, onClose, onSubmit = () => {} }) => {
  
  
  const [imageUri, setImageUri] = useState(null);

  const handleCapturePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
        onSubmit(response.assets[0].uri);
      }
    });
  };

  const confirmAttendance = (imageUri) => {
    RNFetchBlob.fs.readFile(imageUri, 'base64') // Hoặc sử dụng 'fetch' API
        .then((data) => {
          // Chuyển đổi dữ liệu ảnh thành base64 hoặc multipart/form-data
          const imageData = Platform.OS === 'ios' ? data : data.slice(23);
          // Gửi dữ liệu ảnh qua API
          console.log("Doc anh thanh cong")
        })
        .catch((error) => {
          console.log('Error reading image file:', error);
        });
  } 

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chụp Ảnh</Text>
          <Button title="Bắt Đầu Chụp" onPress={handleCapturePhoto} />
          <Button title="Đóng" onPress={onClose} />
          {imageUri && (
            <Modal visible={true} transparent={true} animationType="slide">
              <View style={styles.resultModalContainer}>
                <View style={styles.resultModalContent}>
                  <Image source={{ uri: imageUri }} style={styles.capturedImage} />
                  <Button title="Điểm Danh" onPress={() => confirmAttendance(imageUri)} />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  resultModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  resultModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  capturedImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
});

export default ImageModal;
