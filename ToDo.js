import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native'
import PropTypes from 'prop-types'

const { height, width } = Dimensions.get("window") //폰 화면 크기를 알아오는 법

//state사용을 위해 class방식으로 작업
class ToDo extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false, //편집모드가 아닌 상태
            toDoValue: props.text
        }
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        completeToDo: PropTypes.func.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired 
    }
    
    render(){ 
        const {isEditing, toDoValue} = this.state
        const {text, id, deleteToDo, isCompleted} = this.props
        return( 
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._togglecomplete}>
                        <View 
                            style={[ styles.circle, 
                            isCompleted ? styles.completedCircle : styles.uncompletedCircle ]}/>
                    </TouchableOpacity>
                        { isEditing ? (
                            <TextInput 
                                style={[
                                    styles.text, 
                                    styles.input, 
                                    isCompleted ? styles.completedText : styles.uncompletedText ]} 
                                    value={toDoValue}
                                    multiline={true}
                                    onChangeText={this._controlInput}
                                    returnKeyType={"done"}
                                    onBlur={this._finishEditing} //바깥쪽을 탭하면 수정역역이 닫힘
                                    underlineColorAndroid={"transparent"}
                                />
                            ) : (
                            <Text style={[
                                styles.text,
                                isCompleted ? styles.completedText : styles.uncompletedText ]}>{text}</Text>
                        )}        
                </View>
                    { isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✅</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPressOut={(e) => {
                                    e.stopPropagation
                                    deleteToDo(id)
                                    }}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
        )
    }
    _togglecomplete = (e) => {
        e.stopPropagation
        const {isCompleted, completeToDo, uncompleteToDo, id} =this.props
        if(isCompleted){
            uncompleteToDo(id)
        } else {
            completeToDo(id)
        }           
    }
    _startEditing = (e) => {
        e.stopPropagation
        this.setState({
            isEditing: true
        })
    }
    _finishEditing = (e) => {
        e.stopPropagation
        const {toDoValue} = this.state //from TextInput
        const { id, updateToDo } = this.props
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        })
    }    
    _controlInput = (text) => {
        this.setState({
            toDoValue: text
        })
    }    
}

const styles = StyleSheet.create({
    container: {
        width: width -50,
        borderBottomColor:'#bbb',
        borderBottomWidth:StyleSheet.hairlineWidth,
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        //borderColor: '#552583',
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle: {
        borderColor: '#bbb'
    },
    uncompletedCircle: {
        borderColor: '#552583'
    },
    completedText: {
        color:'#bbb',
        textDecorationLine:'line-through'
    },
    uncompletedText: {
        borderColor: '#353839'
    },
    text: {
        fontWeight: '600',
        fontSize: 20,
        marginVertical: 20, //마진 상단과 하단을 뜻함
        marginRight: 9
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width /2,
    },
    actions: {
        flexDirection: 'row'
    },
    actionContainer: {
        // 손가락으로 주변의 영역을 클릭했을 때도 감지를 할 수있도록 마진을 설정
        marginVertical: 10,
        marginHorizontal: 10
    },
    input: {
        marginVertical: 15,
        width: width /2,
        paddingBottom: 5,
    }
})

export default ToDo

