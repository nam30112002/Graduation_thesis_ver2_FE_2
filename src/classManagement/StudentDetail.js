import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getData } from '../Utility';
import axios from 'axios';
import { API_URL } from '@env';
import AttendanceFormModal from './forms/AttendanceFormModal';
import { convertTime, formatToView } from '../Utility';

export default function StudentDetail() {
  const Separator = () => {
    return <View style={{ height: 10 }} />; // Adjust height for spacing
  };

  const [studentLogs, setStudentLogs] = useState([]);
  const [studentCode, setStudentCode] = useState();
  const [studentName, setStudentName] = useState();
  const [studentNumberOfAbsent, setStudentNumberOfAbsent] = useState();
  const [studentNumberOfPresent, setStudentNumberOfPresent] = useState();
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const fetchData = async () => {
    console.log('alo ' + await getData('currentStudentId'));
    setStudentCode(await getData('currentStudentCode'));
    setStudentName(await getData('currentStudentName'));
    setStudentNumberOfAbsent(await getData('currentStudentNumberOfAbsent'));
    setStudentNumberOfPresent(await getData('currentStudentNumberOfPresent'));
    let currentClassId = await getData('currentClassId');
    let currentStudentId = await getData('currentStudentId');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/teacher/get-all-attendance-of-student-of-course?courseId=${currentClassId}&studentId=${currentStudentId}`,
      headers: {
        'Authorization': 'Bearer ' + await getData('accessToken')
      }
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        setStudentLogs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log('fetching data');
    fetchData();
    console.log('done fetching data');
  }, []);

  return (
    <>
      <View style={styles.activeBar}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Tạo buổi điểm danh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('Xóa sinh viên khỏi lớp pressed')}>
            <Text style={styles.addButtonText}>Xóa sinh viên khỏi lớp</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã sinh viên:</Text>
            <Text style={styles.infoValue}>{studentCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ và tên:</Text>
            <Text style={styles.infoValue}>{studentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số buổi vắng:</Text>
            <Text style={styles.infoValue}>{studentNumberOfAbsent}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số buổi đi:</Text>
            <Text style={styles.infoValue}>{studentNumberOfPresent}</Text>
          </View>
        </View>
        <View style={styles.containerHeader}>
          <Text style={styles.header}>Thông tin điểm danh sinh viên</Text>
        </View>
      </View>
      <View style={styles.test1}>
        <FlatList
          data={studentLogs}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thời gian điểm danh:</Text>
                <Text style={styles.infoValue}>{formatToView(convertTime(item.attendanceTime))}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Buổi học số:</Text>
                <Text style={styles.infoValue}>{item.lectureNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Đi/Vắng:</Text>
                <Text style={styles.infoValue}>{item.isAttendance ? 'Đi' : 'Vắng'}</Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ItemSeparatorComponent={Separator}
        />
      </View>
      <AttendanceFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={fetchData} // Refresh the data when a new attendance session is created
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 4,
    padding: 20,
    backgroundColor: '#66FF99',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10, // Add border radius for rounded corners
    padding: 15, // Add padding for spacing between content and edges
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add shadow effect
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  containerHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
  },
  test1: {
    backgroundColor: '#99FFFF',
    flex: 11,
  },
  activeBar: {
    flex: 1.25,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to multiple lines if needed
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center', // Center the buttons vertically
    backgroundColor: '#66FF99',
    padding: 10, // Add some padding for better spacing
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});
