import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, FlatList, Alert,TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { HOST } from '@env';

const ImageModal = ({ visible, onClose, studentList }) => {
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [studentResults, setStudentResults] = useState([]);
  const [lectureNumber, setLectureNumber] = useState('');

  useEffect(() => {
    if (visible) {
      setImageUri(null);
      setImageName(null);
      setImageType(null);
      setSelectedStudents([]);
    }
  }, [visible]);

  const handleCapturePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setImageName(asset.fileName);
        setImageType(asset.type);
      }
    });
  };

  const handleSelectPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setImageName(asset.fileName);
        setImageType(asset.type);
      }
    });
  };

  const confirmAttendance = () => {
    if (imageUri) {
      const formData = new FormData();
      // Add selected students IDs to the form data
      const imageIdsString = selectedStudents.join(',');
      // Append the comma-separated string to formData
      formData.append('image_ids', imageIdsString);
      // Append image file to form data
      formData.append('image_file', {
        uri: imageUri,
        name: imageName,
        type: imageType,
      });

      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
      };

      fetch(`${HOST}:8888/attendance`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setAttendanceResult(result);
          const updatedStudentResults = studentList.map(student => ({
            id: student.id,
            name: student.name,
            studentCode: student.studentCode,
            result: result.find(r => r.id === student.id)?.isAttendance ?? 'Không rõ',
          }));
          setStudentResults(updatedStudentResults);
          setShowSavePrompt(true);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Đã xảy ra lỗi khi điểm danh');
          return;
        });

    }
  };

  const handleSaveResult = () => {
    // Ví dụ, gửi request lưu vào cơ sở dữ liệu
    // Sau khi lưu thành công, có thể đóng modal hoặc hiển thị thông báo lưu thành công
    
    setShowSavePrompt(false); // Ẩn thông báo sau khi lưu thành công
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <CheckBox
        value={selectedStudents.includes(item.id)}
        onValueChange={() => toggleStudentSelection(item.id)}
      />
      <Text style={styles.studentText}>{`${item.name} (${item.studentCode})`}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chụp ảnh điểm danh</Text>
          {imageUri ? (
            <View style={styles.resultModalContent}>
              <Image source={{ uri: imageUri }} style={styles.capturedImage} />
              <FlatList
                data={studentList}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.equalButton]} onPress={confirmAttendance}>
                  <Text style={styles.buttonText}>Điểm Danh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.equalButton, styles.backButton]} onPress={() => setImageUri(null)}>
                  <Text style={styles.buttonText}>Quay lại</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Buổi học số:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={lectureNumber.toString()}
                  onChangeText={(text) => setLectureNumber(parseInt(text) || '')}
                />
              </View>
              <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'red' }]} onPress={onClose}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleCapturePhoto}>
                  <Text style={styles.buttonText}>Bắt Đầu Chụp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSelectPhoto}>
                  <Text style={styles.buttonText}>Chọn Ảnh Thư Viện</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'red' }]} onPress={onClose}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {showSavePrompt && (
        <View style={styles.savePromptContainer}>
          <Text style={styles.savePromptText}>Kết quả điểm danh:</Text>
          <View>
            {studentResults.map((studentResult) => (
              <Text key={studentResult.id} style={styles.studentResultText}>
                {`${studentResult.name} (${studentResult.studentCode}): ${studentResult.result ? 'Đi' : 'Vắng'}`}
              </Text>
            ))}
          </View>
          <View style={styles.savePromptButtonRow}>
            <TouchableOpacity style={[styles.savePromptButton, { backgroundColor: '#2196F3' }]} onPress={handleSaveResult}>
              <Text style={styles.savePromptButtonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.savePromptButton, { backgroundColor: '#FFA500' }]} onPress={() => setShowSavePrompt(false)}>
              <Text style={styles.savePromptButtonText}>Không</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    flex: 1, // Ensure modal content takes up entire space
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  resultModalContent: {
    alignItems: 'center',
    width: '100%',
    flex: 1, // Ensure content area is flexible
  },
  capturedImage: {
    width: 300,
    height: 400,
    marginBottom: 20,
  },
  flatList: {
    width: '100%',
    flex: 1, // Ensure FlatList takes up entire container
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  equalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentText: {
    fontSize: 16,
    marginLeft: 10,
  },
  savePromptContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
    elevation: 5, // For Android elevation
  },
  savePromptText: {
    fontSize: 18,
    marginBottom: 10,
  },
  savePromptButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  savePromptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  savePromptButtonText: {
    fontSize: 16,
    color: 'white',
  },
  studentResultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default ImageModal;
