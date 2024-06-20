import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Modal } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { HOST } from '@env'; 
import axios from 'axios'; 

const ImageModal = ({ visible, onClose}) => {
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);

  useEffect(() => {
    setImageUri(null);
  }, [visible]);

  const handleCapturePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
        setImageName(response.assets[0].fileName);
        setImageType(response.assets[0].type);
        console.log('Image URI:', response.assets[0].uri);
        console.log('Image Name:', response.assets[0].fileName);
        console.log('Image Type:', response.assets[0].type);
      }
    });
  };

  const confirmAttendance = (imageUri) => {
    onClose(); // Đóng modal con sau khi xác nhận
    // Chuẩn bị dữ liệu ảnh để gửi lên API
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: imageName,
      type: imageType,
    });
    console.log(formData);

    let config = {
      method: 'post',
      url: `${HOST}:8888/recognize`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };

    // Gửi request lên API bằng axios
    axios(config)
      .then((response) => {
        console.log('API Response:', response.data);
      })
      .catch((error) => {
        //console.log(error.response.status);
        console.log('API Error:', error);
        console.log(error.response);
      });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chụp Ảnh</Text>
          {imageUri && (
            <Modal visible={true} transparent={true} animationType="slide">
              <View style={styles.resultModalContainer}>
                <View style={styles.resultModalContent}>
                  <Image source={{ uri: imageUri }} style={styles.capturedImage} />
                  <Button title="Điểm Danh" onPress={() => confirmAttendance(imageUri)} />
                  <Button title="Đóng" onPress={onClose} />
                </View>
              </View>
            </Modal>
          )}
          <Button title="Bắt Đầu Chụp" onPress={handleCapturePhoto} />
          <Button title="Đóng" onPress={onClose} />
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
