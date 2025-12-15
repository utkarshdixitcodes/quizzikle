import './App.scss';
import { useState  , useEffect} from 'react';

function App() {

  const [selectedOption , setSelectedOption] = useState()
  const [loading , setLoading] = useState(false)
  const[quizData  , setQuizData] = useState({})
  const [options , setOptions] = useState([])
  const [ submit , setSumbitted] = useState(false)
  const [ correct , setCorrect] = useState()

  function selectOption(index){
    if(submit) return
    setSelectedOption(index)
      
  }

   function shuffleArray(array){
      let arr = [...array]
      for(let i = arr.length-1 ; i> 0 ; i--){
        let j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];

      }
    return arr
    }
    
   async function  fetchData (){
      setLoading(true)
       const data = await fetch(
        "https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple"
      )
      const apiData = await data.json()


      if(apiData.results && apiData.results.length>0){
      console.log(apiData.results[0])
       setQuizData(apiData.results[0])  
      }

      setLoading(false)
    }  
 
  useEffect(()=>{
   

      fetchData()
    
  } , [])
  
  useEffect(()=>{
      if(quizData.incorrect_answers && quizData.correct_answer){
    let options = [...quizData.incorrect_answers , quizData.correct_answer]
    console.log("Options are " , options)
   let shuffledOptions = shuffleArray(options)
    console.log(shuffledOptions)
    setOptions(shuffledOptions)
      
  }


  } , [quizData])

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

if(loading || !quizData.question){
  return (
    <h2  style={{textAlign :"center"}}>Loading... Please wait </h2>
  )
}

function formSubmit(event){
  event.preventDefault()
  setSumbitted(true)
  if((options[selectedOption]) ===(quizData.correct_answer)){
    console.log("Correct Answer")
    setCorrect(true)
  }
  else{
    console.log("wrong answer")
    setCorrect(false)
  }
}

function handleNextQuestion(){
  // setQuizData({})
  // setOptions([])
  setSelectedOption(null)
  setSumbitted(false)
  setCorrect(null)

  fetchData()
  
}


function getOptionsClass(option){
  if(!submit) return "options" 
  if(options[option] ===quizData.correct_answer){
    
    return "options correct-option"
  }
  
  if(selectedOption===option && options[option] !==quizData.correct_answer){
    return "options incorrect-option"
  }

  return "options"
}

  return (
    <div className="App">
     <h1>Quizzikle</h1>

     <form className='main-container' onSubmit = {formSubmit} >
      <p className='question'  >{decodeHtml(quizData.question)}</p>
                <div className='options-container'>
                <div   className={getOptionsClass(0)} onClick={()=>selectOption(0)}  >   
                    <img src={selectedOption===0 ? '/icons/fillcircle.png' : '/icons/circle.png'} className='tick-untick' alt = "option" />
                  <ul className='option'>{decodeHtml(options[0])}</ul>
                  </div>
                <div className={getOptionsClass(1)} onClick={()=>selectOption(1)}  >   
                    <img src={selectedOption===1? '/icons/fillcircle.png' : '/icons/circle.png'} className='tick-untick' alt = "option"  />
                  <ul className='option' >{decodeHtml(options[1])}</ul> 
                </div>
                <div className={getOptionsClass(2)} onClick={()=>selectOption(2)}  > 
                    <img src={selectedOption===2 ? '/icons/fillcircle.png' : '/icons/circle.png'}className='tick-untick' alt = "option" />
                  <ul className='option' >{decodeHtml(options[2])}</ul> 
                </div>
                <div className={getOptionsClass(3)} onClick={()=>selectOption(3)}  >   
                    <img src={selectedOption===3 ? '/icons/fillcircle.png' : '/icons/circle.png'} className='tick-untick' alt = "option" />
                  <ul className='option' >{decodeHtml(options[3])}</ul> 
                </div>
                </div>

         {correct && <p className='pop-message' >😎 You are Absolutely Correct</p>}       
         {!correct && submit &&<p className='pop-message' >  😞 Oooops , You got it wrong</p>}       
        {!submit &&<button type='submit' className='submit-btn'><span className='submit-btn-text' > Submit Your Answer</span></button>}
        {submit && <button  onClick={handleNextQuestion} className='submit-btn'> <span className='submit-btn-text'> Next Question </span></button>}

      </form>
     </div>
  );
}

export default App;

