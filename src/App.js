import { useReducer } from 'react';
import './styles/style.css'
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

export const ACTIONS = {
   ADD_DIGIT: 'add-digit',
   CHOOSE_OPERATION : 'choose-operation',
   CLEAR : 'clear',
   DELETE_DIGIT : 'delete-digit',
   EVALUATE : 'evaluate'
}

    function reducer(state, {type, payload}) {
        switch(type) {
          case ACTIONS.ADD_DIGIT : 
          if(state.overwrite) {
            return {
              ...state,
              currentOperand : payload.digit,
              overwrite: false
            }
          }
          if((payload.digit==="0" && state.currentOperand==="0") || (payload.digit==='.' && state.currentOperand==='.')) {
            return state;
          }
          if(payload.digit === "." && state.currentOperand?.includes('.')) {
            return state;
          }
          return {
              ...state,
              currentOperand : `${state.currentOperand || ""}${payload.digit}`
            }
          case ACTIONS.CHOOSE_OPERATION :
            if(state.currentOperand == null && state.previousOperand==null) {
              return state;
            }
            if(state.currentOperand == null) {
              return {
                ...state,
                operation : payload.operation
              }
            }
            if(state.previousOperand == null) {
              return {
               ...state,
               operation : payload.operation,
               previousOperand : state.currentOperand,
               currentOperand : null
              }
            }
            return {
              ...state,
              operation : payload.operation,
              previousOperand : evaluate(state),
              currentOperand : null
            }

            case ACTIONS.DELETE_DIGIT :
              if(state.overwrite) {
                return {
                  ...state,
                  overwrite : false,
                  currentOperand: null
                }
              }
              if(state.currentOperand == null) return state;
              if(state.currentOperand === 1) {
                return {...state, currentOperand : null}
              }
              return {
                ...state,
                currentOperand : state.currentOperand.slice(0, -1)
              }
              case ACTIONS.CLEAR :
                return {}
              case ACTIONS.EVALUATE :
                if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                  return state;
                }  
                return {
                  ...state,
                  overwrite : true,
                  previousOperand : null,
                  operation : null,
                  currentOperand : evaluate(state)
                }
              default : 
              return state;
            }
          
        }

      const INTEGER_FORMAT =  new Intl.NumberFormat("en-us", {
        maximumFractionDigits: 0
      })

      function formatOperand(operand) {
        if(operand == null) return
        const [integer , decimal] = operand.split(".")
        if(decimal == null) return INTEGER_FORMAT.format(integer);
        return `${INTEGER_FORMAT.format(integer)}.${decimal}`
      }
      

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(current)) return 
  let compatetion = "";
  switch(operation) {
    case "+" :
      compatetion = prev + current;
      break;
      case "-" :
        compatetion = prev - current;
        break;
      case "*" :
        compatetion = prev * current;
          break;   
           case "/" :
           compatetion = prev / current;
          break;
        default : 
          return;
  }
  return compatetion.toFixed(compatetion % 1 === 0 ? 0 : 3).toString();
}





function App() {

     const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="output">
         {/* toán hạng trước */}
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        {/* toán hạng hiện tại */}
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
       <button className='span-two' onClick = {()=>dispatch({type : ACTIONS.CLEAR})}>AC</button>
       <button onClick={()=> dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
       <OperationButton operation="+" dispatch={dispatch} />
       <DigitButton digit="1" dispatch={dispatch} />
       <DigitButton digit="2" dispatch={dispatch} />
       <DigitButton digit="3" dispatch={dispatch} />
       <OperationButton operation="-" dispatch={dispatch} />
       <DigitButton digit="4" dispatch={dispatch} />
       <DigitButton digit="5" dispatch={dispatch} />
       <DigitButton digit="6" dispatch={dispatch} />
       <OperationButton operation="*" dispatch={dispatch} />
       <DigitButton digit="7" dispatch={dispatch} />
       <DigitButton digit="8" dispatch={dispatch} />
       <DigitButton digit="9" dispatch={dispatch} />
       <OperationButton operation="/" dispatch={dispatch} />
       <DigitButton digit="." dispatch={dispatch} />
       <DigitButton digit="0" dispatch={dispatch} />
       <button className='span-two' onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
