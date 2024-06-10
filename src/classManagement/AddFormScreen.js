import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import QuestionModal from './forms/QuestionModal';
import QuestionCard from './QuestionCard';
import UpdateQuestionModal from './forms/UpdateQuestionModal';
import { getData } from '../Utility';
import axios from 'axios';
import { API_URL } from '@env';

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
  const [codeForm, setCodeForm] = useState(''); // Trạng thái cho "Code Form"
  const [sessionNumber, setSessionNumber] = useState(''); // Trạng thái cho "Buổi học số"

  const inverseQuestionsDTO = (questionsDTO) => {
    return questionsDTO.map(question => ({
      question: question.content,
      answers: question.answers.map(answer => ({
        text: answer.content,
        correct: answer.isTrue
      }))
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy dữ liệu
        const response = await axios.get(`${API_URL}/teacher/get-form-by-course?courseId=${await getData('currentClassId')}`, {
          headers: {
            'Authorization': 'Bearer ' + await getData('accessToken'),
          }
        });
        if(response.status != 200) {
          alert("Không thể lấy dữ liệu từ server!");
        }else { 
          setCourseCode(response.data.courseCode);
          setSessionNumber(response.data.lectureNumber.toString());
          setCodeForm(response.data.code);
          setHours(Math.floor(response.data.timeOfPeriod / 3600).toString());
          setMinutes(Math.floor((response.data.timeOfPeriod % 3600) / 60).toString());
        }
        // Nếu có dữ liệu trả về từ API, cập nhật state
        if (response.data.questions) {
          console.log(response.data.questions);
          const formattedQuestions = response.data.questions.map(question => {
            // Generate temporary id for each question if it doesn't have an id
            if (!question.id) {
              question.id = new Date().getTime();
            }
            return question;
          });
          setQuestionsList(inverseQuestionsDTO(formattedQuestions));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // Gọi hàm fetchData ngay lập tức
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
    console.log(questionsList);
  };

  const handleSubmit = async () => {
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

    const expiryTime = parseInt(hours) * 3600 + parseInt(minutes) * 60;

    const questionsDTO = questionsList.map(question => ({
      content: question.question,
      answers: question.answers.map(answer => ({
        content: answer.text,
        isTrue: answer.correct
      }))
    }));

    // Thực hiện logic để tạo form ở đây
    let data = JSON.stringify({
      "lectureNumber": sessionNumber,
      "timeOfPeriod": expiryTime,
      "questions": questionsDTO
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/teacher/create-form?courseId=${await getData('currentClassId')}`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + await getData('accessToken')
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      if(response.status === 200) {
        alert("Tạo form điểm danh thành công! Code: " + response.data);
        setCodeForm(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });

    //navigation.goBack();
  };

  const toggleCorrectness = (questionIndex, answerIndex) => {
    const newQuestionsList = [...questionsList];
    newQuestionsList[questionIndex].answers[answerIndex].correct = !newQuestionsList[questionIndex].answers[answerIndex].correct;
    setQuestionsList(newQuestionsList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.modalTitle}>Form Điểm Danh</Text>
        <Text style={styles.modalTitle1}>Code Form: {codeForm}</Text>
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
          keyExtractor={(item) => item.id} // Sử dụng id làm key
          style={styles.questionsList}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tạo/Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
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
  modalTitle1: {
    fontSize: 15,
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
