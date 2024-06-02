import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '@env';
import { getData } from '../../Utility';

export default function AttendanceFormModal({ visible, onClose, onSubmit }) {
  const [lectureNumber, setLectureNumber] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceHour, setAttendanceHour] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAttendance, setIsAttendance] = useState(true);
  const [isSelectingDate, setIsSelectingDate] = useState(false); // Biến trạng thái xác định trường ngày đang được chọn
  const [isSelectingTime, setIsSelectingTime] = useState(false); // Biến trạng thái xác định trường giờ đang được chọn

  const handleCreateAttendance = async () => {
    const currentClassId = await getData('currentClassId');
    const data = JSON.stringify({
      "lectureNumber": lectureNumber,
      "attendanceTime": attendanceHour.toISOString(), // Thay đổi attendanceTime thành attendanceHour để chỉ lấy giờ
      "isAttendance": isAttendance,
      "courseId": currentClassId,
      "studentId": await getData('currentStudentId') // Thêm trường studentId vào dữ liệu gửi đi
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/teacher/add-attendance`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await getData('accessToken')
      },
      data: data
    };
    console.log(data);

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        onSubmit(); // Gọi hàm onSubmit để làm mới dữ liệu trong StudentDetail
        onClose(); // Đóng modal
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || attendanceDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAttendanceDate(currentDate);
    setIsSelectingDate(false); // Sau khi chọn xong ngày, đặt isSelectingDate thành false
  };

  const onChangeHour = (event, selectedDate) => {
    const currentDate = selectedDate || attendanceHour;
    setShowDatePicker(Platform.OS === 'ios');
    setAttendanceHour(currentDate);
    setIsSelectingTime(false); // Sau khi chọn xong giờ, đặt isSelectingTime thành false
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Tạo buổi điểm danh</Text>
        <TextInput
          style={styles.input}
          placeholder="Buổi học số"
          value={lectureNumber}
          onChangeText={setLectureNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => {
          setShowDatePicker(true);
          setIsSelectingDate(true); // Khi nhấn vào trường ngày, đặt isSelectingDate thành true
          setIsSelectingTime(false); // Đồng thời đặt isSelectingTime thành false
        }} style={styles.input}>
          <Text>{attendanceDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {Platform.OS === 'android' && showDatePicker && isSelectingDate && (
          <DateTimePicker
            value={attendanceDate}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
          />
        )}
        <TouchableOpacity onPress={() => {
          setShowDatePicker(true);
          setIsSelectingDate(false); // Khi nhấn vào trường giờ, đặt isSelectingDate thành false
          setIsSelectingTime(true); // Đồng thời đặt isSelectingTime thành true
        }} style={styles.input}>
          <Text>{attendanceHour.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {Platform.OS === 'android' && showDatePicker && isSelectingTime && (
          <DateTimePicker
            value={attendanceHour}
            mode="time"
            display="spinner"
            onChange={onChangeHour}
          />
        )}
        <View style={styles.radioContainer}>
          <TouchableOpacity onPress={() => setIsAttendance(true)} style={styles.radio}>
            <Text style={isAttendance ? styles.radioSelected : styles.radioText}>Đi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAttendance(false)} style={styles.radio}>
            <Text style={!isAttendance ? styles.radioSelected : styles.radioText}>Vắng</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateAttendance}>
          <Text style={styles.buttonText}>Tạo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  input: {
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '80%'
  },
  radio: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 5
  },
  radioText: {
    fontSize: 16,
    color: '#000'
  },
  radioSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF'
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
