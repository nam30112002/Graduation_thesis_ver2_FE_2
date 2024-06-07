import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import QuestionModal from './forms/QuestionModal';
import QuestionCard from './QuestionCard';
import UpdateQuestionModal from './forms/UpdateQuestionModal';
import { getData } from '../Utility';

const AddFormScreen = ({ navigation }) => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [sessionNumber, setSessionNumber] = useState(''); // Trạng thái cho "Buổi học số"

  useEffect(() => {
    setCourseCode(getData('currentClassCode'));
  }, []);

  const hasCorrectAnswer = (answers) => {
    return answers.some(answer => answer.correct);
  };

  const handleAddQuestion = () => {
    if (question.trim() === '') {
      alert('Vui lòng nhập câu hỏi.');
      return;
    }

    if (answers.length === 0 || !hasCorrectAnswer(answers)) {
      alert('Vui lòng nhập ít nhất một câu trả lời đúng.');
      return;
    }

    if (question.trim() !== '') {
      const newQuestion = { id: new Date().getTime(), question, answers }; // Gán id duy nhất
      setQuestionsList([...questionsList, newQuestion]);
      setQuestion('');
      setAnswers([]);
      setModalVisible(false);
    }
  };

  const handleSubmit = () => {
    // Kiểm tra nếu "Buổi học số" không được nhập
    if (sessionNumber.trim() === '') {
      alert('Vui lòng nhập buổi học số ...');
      return;
    }

    // Kiểm tra nếu không có câu hỏi nào được thêm vào
    if (questionsList.length === 0) {
      alert('Vui lòng thêm ít nhất một câu hỏi!');
      return;
    }

    const expiryTime = `${hours}:${minutes}`;
    // Thực hiện logic để tạo form ở đây

    navigation.goBack();
  };

  const toggleCorrectness = (questionIndex, answerIndex) => {
    const newQuestionsList = [...questionsList];
    newQuestionsList[questionIndex].answers[answerIndex].correct = !newQuestionsList[questionIndex].answers[answerIndex].correct;
    setQuestionsList(newQuestionsList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.modalTitle}>Tạo Form Điểm Danh Lớp {courseCode}</Text>
        <View style={styles.sessionNumberContainer}>
          <Text style={styles.label}>Buổi học số</Text>
          <TextInput
            style={[styles.input, styles.sessionNumberInput]}
            placeholder="Buổi học số"
            keyboardType="numeric"
            value={sessionNumber}
            onChangeText={setSessionNumber}
          />
        </View>
        <View style={styles.expiryTimeContainer}>
          <Text style={styles.label}>Thời gian hết hạn</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              placeholder="Giờ"
              value={hours}
              onChangeText={setHours}
              keyboardType="numeric"
            />
            <Text style={styles.timeLabel}>Giờ</Text>
          </View>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              placeholder="Phút"
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="numeric"
            />
            <Text style={styles.timeLabel}>Phút</Text>
          </View>
          
        </View>
        <View style={styles.questionHeader}>
          <Text style={styles.label}>Danh sách câu hỏi</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={questionsList}
          renderItem={({ item, index }) => (
            <QuestionCard
              questionInfo={item}
              onPress={() => {
                setSelectedQuestion(item); // Lưu thông tin câu hỏi được chọn
                setUpdateModalVisible(true);
              }}
              toggleCorrectness={(answerIndex) => toggleCorrectness(index, answerIndex)}
            />
          )}
          keyExtractor={(item) => item.id.toString()} // Sử dụng id làm key
          style={styles.questionsList}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tạo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <QuestionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        question={question}
        setQuestion={setQuestion}
        answers={answers}
        setAnswers={setAnswers}
        handleAddQuestion={handleAddQuestion}
      />

      <UpdateQuestionModal
        modalVisible={updateModalVisible}
        setModalVisible={setUpdateModalVisible}
        currentQuestion={selectedQuestion}
        setQuestionsList={setQuestionsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Căn giữa text và input
    alignItems: 'center', // Căn giữa dọc theo hàng
    marginBottom: 20,
  },
  expiryTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  label: {
    fontSize: 18,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    width: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 5,
  },
  timeLabel: {
    fontSize: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    flex: 1, // Để input mở rộng trong sessionNumberContainer
  },
  addButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -5,
    bottom: 7,
  },
  questionsList: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
  },
});


export default AddFormScreen;
