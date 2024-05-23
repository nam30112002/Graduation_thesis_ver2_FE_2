import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function StudentDetail() {
  const Separator = () => {
    return <View style={{ height: 10 }} />; // Adjust height for spacing
  };
  const studentLogs =
    [
      {
        "id": 7,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-05T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": true
      },
      {
        "id": 8,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-06T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      },
      {
        "id": 9,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-07T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": true
      },
      {
        "id": 10,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-08T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      },
      {
        "id": 11,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-10T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      },
      {
        "id": 12,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-14T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      },
      {
        "id": 13,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-14T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      },
      {
        "id": 14,
        "student": null,
        "course": null,
        "attendanceTime": "2024-05-15T09:38:00Z",
        "lectureNumber": 6,
        "isAttendance": false
      }
    ]
  return (
    <>
      <View style={styles.activeBar}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('Sửa thông tin lớp pressed')}>
            <Text style={styles.addButtonText}>Tạo buổi điểm danh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('Chụp ảnh điểm danh pressed')}>
            <Text style={styles.addButtonText}>Xóa sinh viên khỏi lớp</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã sinh viên:</Text>
            <Text style={styles.infoValue}>123456</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ và tên:</Text>
            <Text style={styles.infoValue}>Nguyễn Văn A</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số buổi vắng:</Text>
            <Text style={styles.infoValue}>3</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số buổi đi:</Text>
            <Text style={styles.infoValue}>5</Text>
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
                <Text style={styles.infoValue}>{item.attendanceTime}</Text>
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
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 4,
    padding: 20,
    backgroundColor: '#66FF99',
  },
  card : {
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
  test1 : {
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
