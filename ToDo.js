import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native'

const { height, width } = Dimensions.get("window") //폰 화면 크기를 알아오는 법

//state사용을 위해 class방식으로 작업
class ToDo extends React.Component { 
    state = {
        isEditing: false, //편집모드가 아닌 상태
        isCompleted: false,
        toDoValue: ""
    }
    
    render(){ 
        const {isCompleted, isEditing, toDoValue} = this.state
        const {text} = this.props
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
                                style={[styles.input, styles.text, 
                                    isCompleted ? styles.completedText : styles.uncompletedText ]} 
                                value={toDoValue} 
                                multiline={true}/>
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
                            <TouchableOpacity>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
        )
    }
    _togglecomplete = () => {
        this.setState(prevState => {
            return {
                isCompleted: !prevState.isCompleted
            }
        })
    }
    _startEditing = () => {
        const {text} = this.props
        this.setState({
            isEditing: true,
            toDoValue: text
        })
    }
    _finishEditing = () => {
        this.setState({
            isEditing: false
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
        marginVertical: 20 //마진 상단과 하단을 뜻함
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width /2,
        justifyContent: 'space-between'
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
    }
})

export default ToDo

