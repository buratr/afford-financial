import { useEffect, useState } from "react";
import Buttonviolet from "./Buttonviolet"
import Input from "./Input"
import Tabs from "./Tabs"



function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const Providerportal = ()=>{

  const [inputValue, setInputValue] = useState('');
  const [applicantId, setApplicantId] = useState('')
  const [createdApplicant, setCreatedApplicant] = useState<boolean>(false)
  const [currentUrl, setCurrentUrl] = useState('');
  const [inputNumberError, setInputNumberError] = useState<boolean>(false)

  useEffect(() => {
    // Определяем текущий URL
    const url = new URL(window.location.href);
    // Формируем базовый URL без параметров
    const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
    setCurrentUrl(baseUrl);
  }, []);


  const handleInputChange = (value: string) => {
    if (/^[+\d\s()-]*$/.test(value)) {
      setInputValue(value);
      setInputNumberError(false)
    }
  };




  const handleAddApplicant = async () => {
    if(inputValue !==""){
      const newApplicantId = generateId();
      const currentDate = new Date();
      const applicantDate = currentDate.toISOString().split('T')[0];
      const response = await fetch('/api/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantPhone: inputValue,
          applicantId:newApplicantId,
          status:"Awaiting signature",
          applicantDate:applicantDate,
        }),
      });
      await handleSendSms(newApplicantId)
      setCreatedApplicant(true)
      setInputValue("")
      setApplicantId(newApplicantId);
    }else{
      setInputNumberError(true)
    }

  }


  useEffect(()=>{
    if (createdApplicant) {
      
    }
  },[createdApplicant])

  function backToDashboard(){
    setCreatedApplicant(false)
  }



  async function handleSendSms(id:string){
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        currentUrl
      }),
    });
      if (response.ok) {
        const data = await response.json();
        console.log(data.body);
      } else {
        console.error('Failed to fetch message');
      }
    
  }
    return(
        <section className="w-full bg-white flex flex-col justify-start items-center min-h-screen py-32">
        <div className="container px-4">
          <div className="w-full">
           
          {!createdApplicant && 
          <div>
            <form className="flex mb-5 flex-wrap max-md:gap-6" onSubmit={(e) => e.preventDefault()}>
                <Input 
                error={inputNumberError}
                type="text" 
                placeholder="Enter Applicant Mobile #"
                value={inputValue}
                changeInput={handleInputChange}
                />
                
                <Buttonviolet text="Initiate Application" clickBtn={handleAddApplicant} />
                {/* <Buttonviolet text="Send SMS" clickBtn={handleSendSms} /> */}
              </form>
            
              <Tabs/>
            </div>}

            {createdApplicant &&  
            <div className="my-auto h-full"> 
              <div className="w-full text-center text-xl font-semibold mb-16">
                Thank you! Applicant Created!
                <div className="text-base text-stone-600 font-normal mt-8">
                A message with further instructions has been sent to your phone
                </div>
              </div>
              <div className="italic text-sm text-slate-600 mb-10">
                StudyPoint Boston invites you to apply for educational financing through Afford Financial.
                <br />
                Use this secure link to apply: <a className="text-blue-700 font-semibold hover:text-blue-300" href={`${currentUrl}add?id=${applicantId}`}>{currentUrl}add?id={applicantId} </a> 
              </div>
              <div className="w-full flex justify-center">
                <Buttonviolet text="Back to Dachboard" clickBtn={backToDashboard} />
              </div>
            
            </div>}

          </div>
        </div>
      </section>
    )
}